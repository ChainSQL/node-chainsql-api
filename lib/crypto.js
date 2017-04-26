"use strict";
// requires
const keypairs = require('ripple-keypairs');

const hashjs = require('hash.js');
const elliptic = require('elliptic');
const Secp256k1 = elliptic.ec('secp256k1');
const addressCodec = require('ripple-address-codec');

//var debug = require('debug')('crypto');
var crypto = require('crypto');
var sjcl = require('sjcl');

var AESKeyLength = 32;
var AESBlockLength = 16;
var HMACKeyLength = 32;

var ECIESKDFOutput = 512; // bits
var IVLength = 16; // bytes

var ACCOUNT_PUBLIC = 35;
var PUBLICKEY_LENGTH = 33;

function eciesEncrypt(message, publicKey) {
    var plainMsgBuf = new Buffer(message, 'utf8');
    var decodedPublic = decodePublic(publicKey);
    var ecdsaRecipientPublicKey = Secp256k1.keyFromPublic(Bytes2HexString(decodedPublic), 'hex');

    // Generate ephemeral key-pair
    const seed = keypairs.generateSeed();
    const ephKeyPair = keypairs.deriveKeypair(seed);
    var ephPrivKey = Secp256k1.keyFromPrivate(ephKeyPair.privateKey, 'hex');
    var Rb = ephKeyPair.publicKey;
    //console.log("ephKeyPair.publicKey:",Rb);

    //const alice = crypto.createECDH('secp256k1');
    //alice.setPrivateKey(ephPrivKey.getPrivate('hex'), 'hex');
    //var Z = alice.computeSecret(ecdsaRecipientPublicKey.getPublic('hex'), 'hex');

    var Z = ephPrivKey.derive(ecdsaRecipientPublicKey.pub);
    //console.log('[Z]: %j', Z);
    //console.log('Z computed', Z.length);
    //console.log('secret:  ', new Buffer(Z.toArray(), 'hex'));
    var kdfOutput = hashjs.sha512().update(Z.toArray()).digest();
    //var kdfOutput = hkdf(Z.toArray(), ECIESKDFOutput, null, null);
    //console.log('[kdfOutput]: ', new Buffer(kdfOutput).toString('hex') +" len="+kdfOutput.length);
    var aesKey = kdfOutput.slice(0, AESKeyLength);
    var hmacKey = kdfOutput.slice(AESKeyLength, AESKeyLength + HMACKeyLength);
    //console.log('[aesKey] ', new Buffer(aesKey).toString('hex'));
    //console.log('[hmacKey] ', new Buffer(hmacKey, 'hex'));
    var iv = crypto.randomBytes(IVLength);
    var D = hmac(hmacKey, plainMsgBuf);
    var cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(aesKey), iv);
    var plainBuf = Buffer.concat([new Buffer(D), plainMsgBuf]);
    //console.log('[decryptedBytes] ', plainBuf.toString('hex')+" len="+plainBuf.length);
    var encryptedBytes = cipher.update(plainBuf);
    encryptedBytes = Buffer.concat([encryptedBytes, cipher.final()]);
    //console.log('[iv] ', iv.toString('hex')+" len="+iv.length);
    //console.log('[D] ', new Buffer(D).toString('hex')+" len="+D.length);
    //console.log('[encryptedBytes] ', encryptedBytes.toString('hex')+" len="+encryptedBytes.length);
    return Buffer.concat([new Buffer(Rb, 'hex'), iv, encryptedBytes]).toString('hex');
}

function eciesDecrypt(messageHex, privateKey) {
    var level = 256;
    var Rb_len = 33;
    var D_len = level >> 3;
    var cipherText = new Buffer(messageHex, 'hex');
    var ct_len = cipherText.length;

    if (ct_len < Rb_len + IVLength + D_len + AESBlockLength)
        throw new Error("Illegal cipherText length: " + ct_len + " must be >= " + (Rb_len + IVLength + D_len + AESBlockLength));

    var Rb = cipherText.slice(0, Rb_len); // ephemeral public key bytes
    var iv = cipherText.slice(Rb_len, Rb_len + IVLength);
    //console.log('[iv] ', iv.toString('hex')+" len="+iv.length);
    var EM = cipherText.slice(Rb_len + IVLength); // encrypted content bytes
    //console.log('[encryptedBytes] ', EM.toString('hex')+" len="+EM.length);
    var ecdsa = Secp256k1;
    //convert bytes to usable key object
    //var ephPubKey = ecdsa.keyFromPublic(ephKeyPair.publicKey, 'hex');
    var ephPubKey = ecdsa.keyFromPublic(Rb.toString('hex'), 'hex');
    //var encPrivKey = ecdsa.keyFromPrivate(ecKeypair2.prvKeyObj.prvKeyHex, 'hex');
    var privKey = ecdsa.keyFromPrivate(privateKey, 'hex');
    // debug('computing Z...', privKey, ephPubKey);
    var Z = privKey.derive(ephPubKey.pub);
    //console.log('Z computed', Z);
    //console.log('secret:  ', new Buffer(Z.toArray(), 'hex'));
    var kdfOutput = hashjs.sha512().update(Z.toArray()).digest();
    //var kdfOutput = hkdf(Z.toArray(), ECIESKDFOutput, null, null);
    var aesKey = kdfOutput.slice(0, AESKeyLength);
    var hmacKey = kdfOutput.slice(AESKeyLength, AESKeyLength + HMACKeyLength);
    //console.log('[aesKey] ', new Buffer(aesKey, 'hex'));
    //console.log('[hmacKey] ', new Buffer(hmacKey, 'hex'));

    var cipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(aesKey), iv);
    var decryptedBytes = cipher.update(EM);
    decryptedBytes = Buffer.concat([decryptedBytes, cipher.final()]);
    //console.log('[decryptedBytes] ', decryptedBytes.toString('hex')+" len="+decryptedBytes.length);
    var D = decryptedBytes.slice(0, D_len);
    var plainMsgBuf = new Buffer(decryptedBytes.slice(D_len));

    var recoveredD = hmac(hmacKey, plainMsgBuf);
    //debug('recoveredD:  ', new Buffer(recoveredD).toString('hex'));
    if (D.compare(new Buffer(recoveredD)) != 0) {
        // debug("D="+D.toString('hex')+" vs "+new Buffer(recoveredD).toString('hex'));
        throw new Error("HMAC verify failed");
    }
    //console.log("plainMsg: ",plainMsgBuf.toString());
    return plainMsgBuf.toString();
}

function hmac(key, bytes) {
    //debug('key: ', JSON.stringify(key));
    //debug('bytes: ', JSON.stringify(bytes));
    var hmac = new sjcl.misc.hmac(bytesToBits(key), sjcl.hash.sha256);
    hmac.update(bytesToBits(bytes));
    var result = hmac.digest();
    //debug("result: ", bitsToBytes(result));
    return bitsToBytes(result);
}

function decodePublic(publicKey){
    var decoded = addressCodec.decode(publicKey, ACCOUNT_PUBLIC);
    return decoded.slice(1,1+PUBLICKEY_LENGTH);
}
/**
 * byte型转换十六进制
 * @param b
 * @returns {string}
 * @constructor
 */
const Bytes2HexString = (b)=> {
    let hexs = "";
    for (let i = 0; i < b.length; i++) {
        let hex = (b[i]).toString(16);
        if (hex.length === 1) {
            hexs += '0' + hex.toUpperCase();
        }else {
            hexs += hex.toUpperCase();
        }
    }
    return hexs;
}

function bitsToBytes(arr) {
    var out = [],
        bl = sjcl.bitArray.bitLength(arr),
        i, tmp;
    for (i = 0; i < bl / 8; i++) {
        if ((i & 3) === 0) {
            tmp = arr[i / 4];
        }
        out.push(tmp >>> 24);
        tmp <<= 8;
    }
    return out;
}
/** Convert from an array of bytes to a bitArray. */
function bytesToBits(bytes) {
    var out = [],
        i, tmp = 0;
    for (i = 0; i < bytes.length; i++) {
        tmp = tmp << 8 | bytes[i];
        if ((i & 3) === 3) {
            out.push(tmp);
            tmp = 0;
        }
    }
    if (i & 3) {
        out.push(sjcl.bitArray.partial(8 * (i & 3), tmp));
    }
    return out;
}
/**
 * 加密方法
 * @param secret 加密key
 * @param plaintext     需要加密的明文
 * @returns string 加密后的十六进制格式
 */
var aesEncrypt = function(secret, plaintext) {
    var aesKey = new Buffer(secret, 'utf8');
    var iv = aesKey.slice(0, IVLength);
    var cipher = crypto.createCipheriv('aes-128-cbc', aesKey, iv);
    var plainBuf = new Buffer(plaintext, 'utf8');
    var encryptedBytes = cipher.update(plainBuf);
    encryptedBytes = Buffer.concat([encryptedBytes, cipher.final()]);
    return encryptedBytes.toString('hex');;
};

/**
 * 解密方法
 * @param secret      解密的key
 * @param encryptedHex  密文十六进制格式
 * @returns string 解密后的明文
 */
var aesDecrypt = function(secret, encryptedHex) {
    var aesKey = new Buffer(secret, 'utf8');
    var iv = aesKey.slice(0, IVLength);
    var encryptedBuf = new Buffer(encryptedHex, 'hex');
    var cipher = crypto.createDecipheriv('aes-128-cbc', aesKey, iv);
    var decryptedBytes = cipher.update(encryptedBuf);
    decryptedBytes = Buffer.concat([decryptedBytes, cipher.final()]);
    
    return decryptedBytes.toString();
};

module.exports = {
    eciesEncrypt,
    eciesDecrypt,
    aesEncrypt,
    aesDecrypt
};
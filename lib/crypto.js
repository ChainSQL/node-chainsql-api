"use strict";
// requires
const keypairs = require('chainsql-keypairs');

//var debug = require('debug')('crypto');
var crypto = require('crypto');
var sjcl = require('sjcl');

var zlib = require('zlib');  

const _ = require('lodash');

var AESKeyLength = 32;
var AESBlockLength = 16;
var HMACKeyLength = 32;

var ECIESKDFOutput = 512; // bits
var IVLength = 16; // bytes

var ACCOUNT_PUBLIC = 35;
var PUBLICKEY_LENGTH = 33;

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

function paddingPass(password,keyLen){
    if(password.length < keyLen){
        var pass =Buffer.from(password);
        var retByte = Buffer.alloc(keyLen);
        var byteToPad = keyLen - password.length;
        for(var i=0; i<keyLen; i++){
            if(i<pass.length)
                retByte[i] = pass[i];
            else
                retByte[i] = byteToPad;
        }
        return retByte;
    }else{
        return password;
    }
}

/**
 * 加密方法
 * @param secret 加密key
 * @param plaintext     需要加密的明文
 * @returns string 加密后的十六进制格式
 */
var symEncrypt = function(symKey, plaintext, algType = 'aes') {
	if(algType === "gmAlg") {
		return keypairs.gmAlgSymEnc(symKey, plaintext);
    } else if(algType === "softGMAlg"){
	    return keypairs.softGMAlgSymEnc(symKey, plaintext);
	}
     else {
		return aesEncrypt(symKey, plaintext);
	}
};

var aesEncrypt = function(secret, plaintext) {
    var secretPadded = paddingPass(secret,AESKeyLength);
    var aesKey =Buffer.from(secretPadded, 'utf8');
    var iv = aesKey.slice(0, IVLength);
    var cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    var plainBuf = Buffer.from(plaintext, 'utf8');
    var encryptedBytes = cipher.update(plainBuf);
    encryptedBytes = Buffer.concat([encryptedBytes, cipher.final()]);
    return encryptedBytes.toString('hex');
};

/**
 * 解密方法
 * @param secret      解密的key
 * @param encryptedHex  密文十六进制格式
 * @returns string 解密后的明文
 */
var symDecrypt = function(symKey, encryptedHex, algType = 'aes') {
	if(algType === "gmAlg") {
		return keypairs.gmAlgSymDec(symKey, encryptedHex);
    } else if(algType === "softGMAlg"){
	    return keypairs.softGMAlgSymDec(symKey, encryptedHex);
	}else {
		return aesDecrypt(symKey, encryptedHex);
	}
};

var aesDecrypt = function(secret, encryptedHex) {
    var secretPadded = paddingPass(secret,AESKeyLength);
    var aesKey =Buffer.from(secretPadded, 'utf8');
    var iv = aesKey.slice(0, IVLength);
    var encryptedBuf = Buffer.from(encryptedHex, 'hex');
    var cipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
    var decryptedBytes = cipher.update(encryptedBuf);
    decryptedBytes = Buffer.concat([decryptedBytes, cipher.final()]);
    
    return decryptedBytes.toString();
};

module.exports = {
    symEncrypt,
    symDecrypt
};
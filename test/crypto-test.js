'use strict' // eslint-disable-line strict

const assert = require('assert')
const ChainsqlAPI = require('../src/index');

const c = new ChainsqlAPI();

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}


describe('crypto', () => {

    it('eciesEncrypt', async function(){

        var wallet = c.generateAddress()
        var msg    = "hello world"
        var cipher = c.eciesEncrypt(msg,wallet.publicKey)
        var plainTxt = c.eciesDecrypt(cipher,wallet.secret);
        assert.equal(msg,plainTxt.toString())
    })



    it('eciesEncrypt', async function(){

        var wallet = c.generateAddress()
        var msg    = "hello world"
        var cipher = c.eciesEncrypt(msg,wallet.publicKey)
        var plainTxt = c.eciesDecrypt(cipher,wallet.secret)
        assert.equal(msg,plainTxt.toString())
    })


    it('symEncrypt && symDecrypt', async function(){

        var msg       = "hello world"
        var symKey    = "1111111111111111";
        var cipher    = c.symEncrypt(symKey,msg)
        var plainText = c.symDecrypt(symKey,cipher)
        assert.equal(msg,plainText)
        var cipherGM = c.symEncrypt(symKey,msg,"softGMAlg")

        var plainTextGM = c.symDecrypt(symKey,cipherGM,"softGMAlg")
        assert.equal(msg,hex2a(plainTextGM))
    })

    it('asymEncrypt && asymDecrypt', async function(){

        var accountInfo = c.generateAddress({algorithm:"softGMAlg"})   
        var msg       = "hello world"

        var cipher    = c.asymEncrypt(msg,accountInfo.publicKey)
        var plainText = c.asymDecrypt(cipher,accountInfo.secret)
        assert.equal(msg,hex2a(plainText))
    })

})

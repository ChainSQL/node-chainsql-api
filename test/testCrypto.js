'use strict'
const ChainsqlAPI = require('../src/index');
// ChainsqlAPI.prototype.callback2Promise = require('./callback2Promise');
const c = new ChainsqlAPI();


main();

async function main(){
	try {
        var wallet = c.generateAddress();
        var cipher = c.eciesEncrypt("hello",wallet.publicKey);
        console.log("cipher:",cipher);
        var origin = c.eciesDecrypt(cipher,wallet.secret);
        console.log("plaintext:",origin.toString());        

		//await c.disconnect();
		console.log('运行结束');
	}catch(e){
		console.error(e);
	}
}

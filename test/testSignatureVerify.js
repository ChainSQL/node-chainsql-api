"use strict";

const ChainsqlAPI = require('../src/index');

const assert = require('assert');
const c = new ChainsqlAPI();

var user = {
	secret: "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
	address: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
	publickKey: "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw"
};

main();

 function testSign(){

    var secret = "xnoz9Le8yENN7U3fWxoeMymnT31XD";
    var hexMsg = Buffer.from("hello world").toString('hex');
    var signature = c.signFromString(hexMsg,secret);


    assert.equal(signature,"3045022100BDC5E1154B68B6A9FFD7F7CA36CF3B79D0BF0EDF186D09D460E537EAB9BEB31002204F54BCE76918B4F7415319E62B19A2B1F7200234F049FBD524C61EB5DD4965AA");
 }

 function testVerify(){

    var secret = "xnoz9Le8yENN7U3fWxoeMymnT31XD";
    var wallet =  c.generateAddress(secret);

    console.log(wallet);
    var hexStr = Buffer.from("hello world").toString('hex');

    var signature = "3045022100BDC5E1154B68B6A9FFD7F7CA36CF3B79D0BF0EDF186D09D460E537EAB9BEB31002204F54BCE76918B4F7415319E62B19A2B1F7200234F049FBD524C61EB5DD4965AA";

    var bVerifyOK  = c.verify(hexStr,signature,wallet.publicKey);
    
    assert.equal(bVerifyOK,true);

}


async function main(){

    try {

        testSign();
        testVerify();

        return ;
   
	}catch(e){
		console.error(e);
	}

}


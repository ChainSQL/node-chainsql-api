'use strict'

const ChainsqlAPI = require('../src/index');
// ChainsqlAPI.prototype.callback2Promise = require('./callback2Promise');
const c = new ChainsqlAPI();

var owner = {
    secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
    address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"	
}


main();

async function main(){
	try {
        await c.connect('wss://192.168.29.69:6006');
        c.as(owner);
        let rs = await c.pay(account,2000).submit({expect:'validate_success'});
        console.log(rs);
    }catch(e){
		console.error(e);
	}
}
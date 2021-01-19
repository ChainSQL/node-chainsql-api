'use strict' // eslint-disable-line strict

const assert = require('assert')
const ChainsqlAPI = require('../src/index');
const { exit } = require('process');

const c = new ChainsqlAPI();

var user = {
	secret: "xxeJcpbcFyGTFCxiGjeDEw1RCimFQ",
	address: "z44fybVuUn8jZxZRHpc3pJ62KQJgSEjzjk",
	publicKey: "cB4MLVsyn5MnoYHhApEyGtPCuEf9PAGDopmpB7yFwTbhUtzrjRRT"
}

var ed25519Root = {
	secret: "xEdTsZdgjNGe1bJ2VLn22Yyz2wJSzny",
	address: "z9UgyKDdJWzzu37U7zKuwTEdWDjXhcNMWo"	
}

var owner = {
 	secret:  "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
 	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"	
 }

var sm2Root = {
	secret: "p97evg5Rht7ZB7DbEpVqmV3yiSBMxR3pRBKJyLcRWt7SL5gEeBb",
	address: "zN7TwUjJ899xcvNXZkNJ8eFFv2VLKdESsj"	
}


var wsAddress = 'ws://192.168.29.69:5003';


describe('ripple', () => {

    it('init', async function(){
        await c.connect(wsAddress);
        c.as(sm2Root);
    })

    it('active', async function(){
        var amount = 20000
        let rs = await c.pay(owner.address, amount).submit({expect:'validate_success'});
        assert.equal(rs.status,'validate_success')     
    })

    // it('switch active', async function(){
    //     var amount = 20000
    //     let rs = await c.pay(owner.address, amount).submit({expect:'validate_success'})
    //     assert.equal(rs.status,'validate_success')     

    //     amount = 10000
    //     c.as(owner)
    //     rs = await c.pay(sm2Root.address, amount).submit({expect:'validate_success'})
    //     assert.equal(rs.status,'validate_success')  
    // })

    // it('create confidential', async function(){
    //     var raw = [
    //         {'field':'id','type':'int','length':11,'PK':1,'NN':1,'default':''},
    //         {'field':'name','type':'varchar','length':50,'default':null},
    //         {'field':'age','type':'int'}
    //     ];
    //     var option = {
    //         confidential: true
    //     };

    //     let rs = await c.createTable(sConfidentialTableName, raw, option).submit({expect:'db_success'});
    //     assert.equal(rs.status,'db_success')     
    // })  


})

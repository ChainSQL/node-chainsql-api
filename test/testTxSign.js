'use strict'


const ChainsqlAPI = require('../src/index');

const c = new ChainsqlAPI();


var user = {
	secret: "xxeJcpbcFyGTFCxiGjeDEw1RCimFQ",
	address: "z44fybVuUn8jZxZRHpc3pJ62KQJgSEjzjk",
	publicKey: "cB4MLVsyn5MnoYHhApEyGtPCuEf9PAGDopmpB7yFwTbhUtzrjRRT"
}

var owner = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
}

var sTableName = "tTable1";

main();

async function main() {
	try {

		await c.connect('ws://127.0.0.1:6006');
		console.log('连接成功');
		c.as(owner);
		await testTxSign();

		console.log('测试结束');
	} catch (e) {
		console.error(e);
	}
}

async function testTxSign() {

	var rawCreate = [
		{ 'field': 'id', 'type': 'int', 'length': 11, 'PK': 1, 'NN': 1 },
		{ 'field': 'name', 'type': 'varchar', 'length': 50, 'default': "" },
		{ 'field': 'age', 'type': 'int' }
	]
	var option = {
		confidential: false
	}

	var rawInsert = [
		{ 'id': 1, 'age': 333, 'name': 'hello' },
		{ 'id': 2, 'age': 444, 'name': 'sss' },
		{ 'id': 3, 'age': 555, 'name': 'rrr' }
	];

	var rawGrant = { select: true, insert: false, update: false, delete: true };

	try {

		// payment
		let paymentSign = await  c.pay(user.address, 2000).txSign();
		console.log("payment Tx sign : " + JSON.stringify (paymentSign));

		//  create table
		// let createTableSign = await c.createTable(sTableName, rawCreate, option).txSign();
		// console.log("create table Tx sign : " + JSON.stringify(createTableSign));

		//  insert/grant 等 签名交易的生成需要保证表已存在
		// let insertTableSign = await  c.table(sTableName).insert(rawInsert).txSign();
		// console.log("insert table Tx sign : " + JSON.stringify(insertTableSign));

		// grant 
		var grantSign = await c.grant(sTableName, user.address, rawGrant, user.publicKey).txSign();
		console.log("insert table Tx sign : " + JSON.stringify(grantSign));

	} catch (error) {
		console.error(error);
	}


}




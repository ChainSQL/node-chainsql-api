'use strict'
const ChainsqlAPI = require('../src/index').ChainsqlAPI;
const r = new ChainsqlAPI();
var user = {
	secret: "ssnqAfDUjc6Bkevd1Xmz5dJS5yHdz",
	address: "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q",
	publickKey: "02F039E54B3A0D209D348F1B2C93BE3689F2A7595DDBFB1530499D03264B87A61F"
}

//创建一个加密的表,table为要创建的表,confidential为是否要加密
var createTable = async function(table, confidential) {
	try {
		await connect();
		r.setRestrict(true);
		// 创建表
		let rs = await r.create(table, [{
			"field": "id",
			"type": "int",
			"length": 11,
			"PK": 1,
			"NN": 1,
			"UQ": 1,
			"AI": 1
		}, {
			"field": "name",
			"type": "varchar",
			"length": 46,
			"default": "null"
		}], {
			confidential: confidential
		});
		console.log(rs)
		await r.disconnect();
	} catch (e) {
		console.log(e)
	}
};

var insertData = async function(tb) {
	try {
		await connect();
		var rs = await r.table(tb).insert({
			name: 'feipeng'
		}).submit();
		console.log(rs);
		// await r.disconnect();
	} catch (e) {
		console.log(e)
	}
}
var getData = async function(tb) {
	await connect();
	var rs = await r.table(tb).get({
		$or: [{
			id: 2
		}, {
			name: 'feipeng'
		}],
		$limit: {
			index: 0,
			total: 2
		}
	}).submit();
	console.log(rs);
	// r.disconnect();
}
var connect = async function() {
	await r.connect('ws://192.168.0.197:6007');
	console.log('连接成功')
	r.as({
		"secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
		"address": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
	});
	// r.as({
	// 	secret: "ssnqAfDUjc6Bkevd1Xmz5dJS5yHdz",
	// 	address: "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q",
	// })
}
var assgin = async function(tb, user) {
	try {
		await connect();
		var rs = await r.assign(tb, user.address, [r.perm.update], user.publickKey);
		console.log(rs)
	} catch (e) {
		console.log(e)
	}
	// await r.disconnect();
}

var del = async function(tb) {
	await connect();
	var rs = await r.table(tb).get({
		id: 1
	}).delete().submit();
	console.log(rs)
	await r.disconnect();
}

var transaction = async function() {
		try {
			await connect();
			r.beginTran();

			r.table('aac').insert({
				name: 'feipeng'
			});
			r.table('aac').get({
				name: 'feipeng'
			}).update({
				name: 'xiaopeng'
			})
			var rs = await r.commit();
			console.log(rs);
			await r.disconnect();
		} catch (e) {
			console.log(e)
		}
	}
	//监听一张表
var testTableEvent = async function() {
	await connect();
	r.event.subTable('aad', 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh', function(data) {
		console.log(data)
	});
}

// createTable('aab', true); //aab,加密的表

insertData('aad'); //往表aab插入一条数据
// getData('aad');//从aab查询数据

// assgin('aad', user); //授权操作
// del('aad');//删除操作
// testTableEvent();//监听一张表

// transaction();//事务
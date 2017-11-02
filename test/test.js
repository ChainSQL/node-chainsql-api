'use strict'
const co = require('co')
const ChainsqlAPI = require('../src/index').ChainsqlAPI;
// ChainsqlAPI.prototype.callback2Promise = require('./callback2Promise');
const c = new ChainsqlAPI();

const RippleAPI = new require('chainsql-lib').RippleAPI;

var user = {
	secret: "ssnqAfDUjc6Bkevd1Xmz5dJS5yHdz",
	address: "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q",
	publickKey: "02F039E54B3A0D209D348F1B2C93BE3689F2A7595DDBFB1530499D03264B87A61F"
}

var owner = {
	"secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
	"address": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"	
}

// var owner = {
// 	"address":"r93pPN539JdTNqFsmeSJBYafd7ZzzpVCC"
// }


var sTableName = "Jerry";
var sTableName2 = "boy22";
var sReName = "boy11";
var sTableName3 = "hijack1";

main();

async function main(){
	try {
		await c.connect('ws://192.168.0.110:6007');
		//await c.connect('ws://192.168.0.14:6006');

		console.log('连接成功')

		c.as(owner);

		// //激活user账户
		// await activateAccount(user.address);

		// testSubscribe();
		// await testRippleAPI();
		// await testAccount();
		await testChainsql();

		//await c.disconnect();
		console.log('运行结束')
	}catch(e){
		console.error(e);
	}
}

function testSubscribe(){
	subTable(sTableName,owner.address);
}

async function testRippleAPI(){
	// await testGetLedgerVersion();
	// await testGetLedger();

	// await testGetTransactions();
	await testGetTransaction();
	await testGetServerInfo();
}

async function testAccount(){
	var acc = c.generateAddress("snoPBrXtMeMyMHUVTgbuqAfg1SUTb");
	console.log(acc);
	var account = generateAccount();
	console.log("new account:",account);
	await activateAccount(account.address);
}

async function testChainsql(){
	// await testCreateTable();

	// //创建另一张表，用来测试rename,drop
	// await testCreateTable1();
	// await testInsert();
	// await testUpdate();
	// await testDelete();
	// await testRename();
	await testGet();
	// await testDrop();
	// await testGrant();
	// await testTxs();
	// await insertAfterGrant();
	// await testOperationRule();	

	//现在底层不允许直接删除所有记录这种操作了
	// await testDeleteAll();

}

function subTable(tb, owner) {
	var event = c.event;
	event.subscriptTable(tb, owner, function(err, data) {
		if(err)
			console.log(err);
		else
			console.log(data)
	}).then(function(data) {
		console.log('subTable success.');
	}).catch(function(error) {
		console.log('subTable error:' + error);
	});
}

//创建一个加密的表,table为要创建的表,confidential为是否要加密
var testCreateTable = async function() {
	var raw = [
		{'field':'id','type':'int','length':11,'PK':1,'NN':1,'UQ':1,'AI':1},
		{'field':'name','type':'varchar','length':50,'default':null},
		{'field':'age','type':'int'}
	]
	var option = {
		confidential: false
	}
	// 创建表
	let rs = await c.createTable(sTableName, raw, option).submit({expect:'db_success'});
	console.log("testCreateTable" , rs)
};

var testCreateTable1 = async function() {
	var raw = [
		{'field':'id','type':'int','length':11,'PK':1,'NN':1,'UQ':1,'AI':1},
		{'field':'name','type':'varchar','length':50,'default':null},
		{'field':'age','type':'int'}
	]
	var option = {
		confidential: false
	}
	// 创建表
	let rs = await c.createTable(sTableName2, raw, option).submit({expect:'db_success'});
	console.log("testCreateTable1" , rs)
};

//重复插入的情况下报异常
var testInsert = async function() {
	var raw = [
		{'age': 333,'name':'hello'},
		{'age': 444,'name':'sss'},
		{'age': 555,'name':'rrr'}
	]
	var rs = await c.table(sTableName).insert(raw).submit({expect:'db_success'});
	console.log("testInsert",rs);
}

var testUpdate = async function(){
	var rs = await c.table(sTableName).get({'id': 2}).update({'age':200}).submit({expect:'db_success'});
	console.log("testUpdate",rs);
}

var testDelete = async function(){
	var rs = await c.table(sTableName).get({'id': 3}).delete().submit({expect:'db_success'});
	console.log("testDelete" ,rs)
}

var testRename= async function(){
	var rs = await c.renameTable(sTableName2,sReName).submit({expect:'db_success'});
	console.log("testRename",rs);
}
var testGet = async function(){

	var raw = []
	//求和
	// var rs = await c.table(sTableName).get(raw).withFields(["SUM(id)"]).submit();
	// var rs = await c.table(sTableName).get(raw).withFields([]).submit();

	// var raw = {id:1}
	var rs = await c.table(sTableName).get().withFields(["COUNT(*)"]).submit();

	console.log("testGet",rs.lines);
}
var testDrop = async function(){
	var rs = await c.dropTable(sReName).submit({expect:'db_success'});
	console.log("testDrop",rs);
}

//重复授权可能出异常，测一下
var testGrant = async function(){
	var raw = {insert:true,update:true,delete:true};
	var rs = await c.grant(sTableName, user.address, raw, user.publickKey).submit({expect:'db_success'})
	console.log("testGrant",rs);
}
var insertAfterGrant = async function(){
	c.as(user);
	c.use(owner.address);
	var raw = [
		{'age': 333,'name':'hello'},
		{'age': 444,'name':'sss'},
		{'age': 555,'name':'rrr'}
	]
	var rs = await c.table(sTableName).insert(raw).submit({expect:'db_success'});
	console.log("insertAfterGrant",rs);
	// 切换回原来的账户
	c.as(owner);
}

var testTxs = async function(){
	c.beginTran();
	c.table(sTableName).insert({'age': 333,'name':'hello'});
	c.table(sTableName).get({'age':333}).update({'name':'world'});
	var rs = await c.commit({expect: 'db_success'});
	c.endTran();
	console.log("testTxs",rs);
}

var testOperationRule = async function(){
	var raw = [
		{'field':'id','type':'int','length':11,'PK':1,'NN':1,'UQ':1,'AI':1},
		{'field':'name','type':'varchar','length':50,'default':null},
		{'field':'age','type':'int'},
		{'field':'account','type':'varchar','length':64}
	]
	var rule = {
		'Insert':{
			'Condition':{'account':'$account'},
			'Count':{'AccountField':'account','CountLimit':5},
		},
		'Update':{
			'Condition':{'$or':[{'age':{'$le':28}},{'id':2}]},
			'Fields':['age']
		},
		'Delete':{
			'Condition':{'$and':[{'age':'$lt18'},{'account':'$account'}]}
		},
		'Get':{
			'Condition':{'id':{'$ge':3}}
		}
	};
	var option = {
		confidential: false,
		operationRule: 	rule
	}
	// 创建表
	let rs = await c.createTable(sTableName3, raw, option).submit({expect:'db_success'});
	console.log("testOperationRule",rs)
}

var generateAccount = async function(){
	return c.generateAddress();
}
var activateAccount = async function(account){
	let rs = await c.pay(account);
	console.log(rs);
}

async function testGetLedgerVersion(){
	c.getLedgerVersion(callback);
	// var index = await c.callback2Promise(c.getLedgerVersion);
	// console.log(index);
}
async function testGetLedger(){
	var opt = {
		ledgerVersion :666,	// || 'validated',
		includeAllData : false,
		includeTransactions : true,
		includeState : false
	}
	c.getLedger(opt,callback);
	// var rs = await callback2Promise(c.getLedger,opt);
	// console.log(rs);
}

async function testGetTransactions(){
	var opt = {
		minLedgerVersion : 	1,// || -1,
		// -1 is equivalent to most recent available validated ledger
		maxLedgerVersion : 500,
		earliestFirst : false	
	}
	c.getTransactions(opt,callback);
	// var rs = await callback2Promise(c.getTransactions,opt);
	// console.log(rs);
}
async function testGetTransaction(){
	let rs = await c.api.getTransaction('C4DAFE4673C4C84F48FC1C3513045138A8B083DA255E050B4928E29870E8979F');
	console.log(rs);
	// var rs = await callback2Promise(c.api.getTransaction,opt);
	// console.log(rs);
}
async function testGetServerInfo(){
	let rs = await c.api.getServerInfo(callback);
	console.log(rs);
	// var rs = await callback2Promise(c.api.getServerInfo);
	// console.log(rs);
}

function callback(err,data){
	if(err){
		console.error(err);
	}else{
		console.log(data);
	}
}
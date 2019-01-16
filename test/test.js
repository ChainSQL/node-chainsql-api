'use strict'
const co = require('co')
const ChainsqlAPI = require('../src/index').ChainsqlAPI;
// ChainsqlAPI.prototype.callback2Promise = require('./callback2Promise');
const c = new ChainsqlAPI();

const RippleAPI = new require('chainsql-lib').RippleAPI;

var user = {
	secret: "xhW53JaGnb6QePRHz1ysehGNodu4p",
	address: "zMbBhnQAPu7KHgtRXWFxp4YGX4LjtMpgo1",
	publicKey: "cBRmXRujuiBPuK46AGpMM5EcJuDtxpxJ8J2mCmgkZnPC1u8wqkUn"
}

 var owner = {
 	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
 	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"	
 }

var issuer = {
	secret: "xxEiFWFxpUARr9tq1XfvkykyR97iK",
	address: "znbWk4iuz2HL1e1Ux91TzYfFzJHGeYxBA4"	
}
// var owner = {
// 	"address":"r93pPN539JdTNqFsmeSJBYafd7ZzzpVCC"
// }


var sTableName = "a5";
var sTableName2 = "b1";
var sReName = "boy1234";
var sTableName3 = "hijack12";

main();

async function main(){
	try {
		await c.connect('ws://101.201.40.124:5006');

		console.log('连接成功')

		c.as(owner);

		// c.setRestrict(true);
		//激活user账户
<<<<<<< Updated upstream
		//  await activateAccount(user.address);
=======
		// await activateAccount(user.address);
>>>>>>> Stashed changes

		//await testSubscribe();

		// await testRippleAPI();
		// await testAccount();
		 await testChainsql();

		//await c.disconnect();
		console.log('运行结束')
	}catch(e){
		console.error(e);
	}
}

var testSubscribe = async function(){
	subTable(sTableName,owner.address);
	setTimeout(function(){
		unsubTable(sTableName,owner.address);
	},5000);
	await subTx();
}

function testUnSubscribe(){	
	unsubTable(sTableName,owner.address);	
}

async function subTx() {
	//获取账户信息
	let info = await c.api.getAccountInfo("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh");
	console.log(info);
	//获取当前区块号
	c.getLedgerVersion(function(err,data){
		var payment = {
			"Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
			"Amount":"1000000000",
			"Destination": "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q",
			"TransactionType": "Payment",
			"Sequence": info.sequence,
			"LastLedgerSequence":data + 5,
			"Fee":"50"
		}
		let signedRet = c.sign(payment,owner.secret);
		c.api.submit(signedRet.signedTransaction).then(function(data){
            console.log(data);
        });
		//订阅
		testSubscribeTx(signedRet.id);
		setTimeout(function(){
			testUnSubscribeTx(signedRet.id);
		},5000);
	});
}
function testSubscribeTx(hash){
	var event = c.event;
	event.subscribeTx(hash,function(err, data) {
		if(err)
			console.log(err);
		else
			console.log("subtx return:", data)
	}).then(function(data) {
		console.log('subTx success.');
	}).catch(function(error) {
		console.log('subTx error:' + error);
	});
}

function testUnSubscribeTx(hash){	
	var event = c.event;
	event.unsubscribeTx(hash).then(function(data) {
		console.log('unsubTx success.');
	}).catch(function(error) {
		console.log('unsubTx error:' + error);
	});	
}

async function testRippleAPI(){
	// await testGetLedgerVersion();
	// await testGetLedger();

	// await testGetTransactions();
	await testGetTransaction();
	// await testGetServerInfo();
	// await testUnlList();
	// await testEscrow();
}

async function testAccount(){
	var account = await generateAccount();
	console.log("new account:",account);
	await activateAccount(account.address);
}

async function testChainsql(){
	 await testCreateTable();

	// // //创建另一张表，用来测试rename,drop
	// await testCreateTable1();
	// await testInsert();
	// await testUpdate();m
	// await testDelete();
	// await testRename();
	// await testGet();
	// await testDrop();
	//await testGrant();
	// await testTxs();
	// await insertAfterGrant();
	// await testOperationRule();
<<<<<<< Updated upstream
	await testAccountTables();
	await testTableAuth();
=======
	//await testAccountTables();
>>>>>>> Stashed changes

	//现在底层不允许直接删除所有记录这种操作了
	// await testDeleteAll();

}

function subTable(tb, owner) {
	var event = c.event;
	event.subscribeTable(owner,tb,function(err, data) {
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

function unsubTable(tb, owner) {
	var event = c.event;
	event.unsubscribeTable(owner, tb).then(function(data) {
		console.log('unsubTable success.');
	}).catch(function(error) {
		console.log('unsubTable error:' + error);
	});
}

//创建一个加密的表,table为要创建的表,confidential为是否要加密
var testCreateTable = async function() {
	var raw = [
		{'field':'id','type':'int','length':11,'PK':1,'NN':1},
		{'field':'name','type':'varchar','length':50,'default':""},
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
		{'field':'id','type':'int','length':11,'PK':1,'NN':1,'default':''},
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
	var rs = await c.table(sTableName).get({name:'sss'}).order({id:-1}).limit({index:0,total:1}).withFields([]).submit();
	// var rs = await c.table(sTableName).get().withFields(["COUNT(*)"]).submit();
	console.log("testGet",rs.lines);
}
var testDrop = async function(){
	var rs = await c.dropTable(sReName).submit({expect:'db_success'});
	console.log("testDrop",rs);
}

//重复授权可能出异常，测一下
var testGrant = async function(){
	var raw = {insert:false,update:false,delete:true};
	var rs = await c.grant(sTableName, user.address, raw, user.publicKey).submit({expect:'db_success'})
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
	var raw = [
		{'field':'id','type':'int','length':11,'PK':1,'NN':1,'UQ':1,'AI':1},
		{'field':'name','type':'varchar','length':50,'default':null},
		{'field':'age','type':'int'},
		{'field':'account','type':'varchar','length':64}
	]

	var option = {
		confidential: true
	}
	c.createTable(sTableName,raw,option);
	c.grant(sTableName,user.address,{insert:true,update:true},user.publicKey)
	c.table(sTableName).insert({'age': 333,'name':'hello'});
	c.table(sTableName).get({'age':333}).update({'name':'world'});
	var rs = await c.commit({expect: 'db_success'});
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
	// let rs = await c.table(sTableName3).get().order({id:-1}).submit();
	// console.log(rs);
}

var generateAccount = async function(){
	return c.generateAddress();
}
var activateAccount = async function(account){
	let rs = await c.pay(account,2000).submit({expect:'validate_success'});
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
	// var opt = {
	// 	minLedgerVersion : 	1,// || -1,
	// 	// -1 is equivalent to most recent available validated ledger
	// 	limit:20,
	// 	maxLedgerVersion : 500
	// }
	var opt = {limit:12}
	c.getTransactions(owner.address,opt,callback);
	// var rs = await callback2Promise(c.getTransactions,opt);
	// console.log(rs);
}
async function testGetTransaction(){
	// let rs = await c.getTransaction('3E02AA296A348F10C1F54D2EF0CBBDA9A6D389F66EFFBA936F1842506FACD4EA');
	// console.log(rs);

	c.getTransaction('B4FB648883D73D4EB2D3A9E6059F1D0CF97105445F06B763A9DAB9FA66AA2EFC',callback);
	// var rs = await callback2Promise(c.api.getTransaction,opt);
	// console.log(rs);
}
async function testGetServerInfo(){
	// let rs = await c.getServerInfo();
	// console.log(rs);
	c.getServerInfo(callback);
	// var rs = await callback2Promise(c.api.getServerInfo);
	// console.log(rs);
}

async function testEscrow(){
	const address = user.address;
	var hash= "";
	const escrowCreation = {
		destination: "zHYfrrZyyfAMrNgm3akQot6CuSmMM6MLda",
		amount: {
			// counterparty:issuer.address,
			value:"1000",
			currency:"ZXC"
		},
		allowExecuteAfter: "2018-08-15T11:06:50.000Z",
		allowCancelAfter:  "2018-08-15T11:08:50.000Z"
	};
	return c.api.prepareEscrowCreation(address, escrowCreation)
	.then(data =>{
		// console.log('preparePayment: ', data);
		try {
			let signedRet = c.api.sign(data.txJSON, user.secret);
			hash = signedRet.id;
			return c.api.submit(signedRet.signedTransaction);
		} catch (error) {
			console.log('sign escrow failure.', JSON.stringify(error));
		}
	}).then(function(data) {
		if (data.resultCode === 'tesSUCCESS') {
			//paymentSetting(ChainSQL, account, resolve, reject);
			data.tx_hash = hash;
			// resolve(data);
			console.log(data);
		} else {
			console.log('submit escrow: ', JSON.stringify(data));
			// reject(data);
		}
	}).catch(function(error) {
		console.log(error);
	});
}

async function testUnlList(){
	// c.getUnlList(callback);
	let rs = await c.getUnlList();
	console.log(rs);
}

function callback(err,data){
	if(err){
		console.error(err);
	}else{
		console.log(JSON.stringify(data));
	}
}

async function testAccountTables()
{
	let retRequest = await c.getAccountTables(owner.address,true)
	console.log(retRequest)
}

async function testTableAuth(){
	let retRequest = await c.getTableAuth(owner.address,"D13");
	console.log(retRequest)
}

async function testDateTime()
{
	//var account = await generateAccount();
	//console.log("new account:",account);
	
	var accountMain = {
		secret: "xhuw4WDjwy85rpoJVd8kcj5SRBXmn",
		address: "zPrcbkv779Hb94TJL35gF87owkQpHzJc4d"	
	}
	/*
	var accountMain = {
		secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
		address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"	
	}*/
/*
	c.as({
		secret: "xxCosoAJMADiy6kQFVgq1Nz8QewkU",
		address: "zPcimjPjkhQk7a7uFHLKEv6fyGHwFGQjHa"	
	})

	let retPay = await c.pay("zPrcbkv779Hb94TJL35gF87owkQpHzJc4d",200).submit()
	console.log(retPay);

	let info = await c.api.getAccountInfo("zPrcbkv779Hb94TJL35gF87owkQpHzJc4d");
	console.log(info);
*/

	c.as(accountMain)
	/*
	var raw = [		
		{'field':'name','type':'varchar','length':50,'default':null},
		{'field':'creatTM','type':'datetime'}
	]
	var option = {
		confidential: false
	}
	// 创建表
	let rs = await c.createTable("testDateTime", raw, option).submit({expect:'db_success'});
	console.log("testCreateTable" , rs)
	*/

	/*
	
	var dateNew = new Date();
	var sDate = dateNew.toString();
	var sData2 = dateNew.toLocaleString()
	//console.log(sData2)
	var raw = [
		{'name':'hello2','creatTM':dateNew }
	]
	console.log(dateNew)
	
	
	var rs = await c.table("testDateTime").insert(raw).submit({expect:'db_success'});
	console.log("testInsert",rs);
	*/

	/*
	var dateNew = new Date();
	var sDate = dateNew.toString();
	var sDateLocale1 = dateNew.toLocaleString()
	console.log(sDate)
	console.log(sDateLocale1)
	

	var data2 = new Date(sDateLocale1)
	var sDataLoca2 = data2.toLocaleString()
	var hour2 = data2.getHours()
	console.log(sDataLoca2)
	console.log(hour2)
	*/


	

	var rs = await c.table("testDateTime").get().limit({index:0,total:20}).withFields([]).submit();
	// var rs = await c.table(sTableName).get().withFields(["COUNT(*)"]).submit();
	console.log("testGet",rs.lines);
	
}
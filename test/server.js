'use strict'


const co = require('co')
const ChainsqlAPI = require('../src/index');
const r = new ChainsqlAPI();
var path = require('path');
var basePath = path.join(require.resolve('chainsql-lib'), '../common');
var common = require(basePath);
var crypto = require('../lib/crypto');
const keypairs = require('chainsql-keypairs');

co(function*() {
	try {
		//  yield r.connect('ws://127.0.0.1:6007');
		//yield r.connect('ws://139.198.11.189:6006');
		yield r.connect('ws://192.168.0.14:6006');
        // console.log('连接成功')
		// var tb = 'test13323333';

		// r.as({
		// 	"secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
		// 	"address": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
		// });
		// r.setRestrict(true);

		// // var data = yield r.api.getLedger();
		// // console.log(data);
		// r.api.getLedger({ledgerVersion:1732000}).then(function(data){
		// 	console.log(data);
		// }).catch(function(err){
		// 	console.log(err);
		// });
		

		var cipher = crypto.eciesEncrypt("hello","03B7FBF1AC149B0D297B7407CAB9636792333B8D8B8A4036B2D4DE2E6D69D435B5");
		var keypair = keypairs.deriveKeypair("xxHgHoRAHdGZxy5gWUdMeUK7hWrgr");
		var plain = crypto.eciesDecrypt(cipher,keypair.privateKey);
		console.log(plain);
		
		//字段级加密
		console.log("multi encrypt test:");
		var listPublic = ["cBP7JPfSVPgqGfGXVJVw168sJU5HhQfPbvDRZyriyKNeYjYLVL8M", "cBPaLRSCwtsJbz4Rq4K2NvoiDZWJyL2RnfdGv5CQ2UFWqyJ7ekHM"];
		var cip = yield crypto.encryptText("test",listPublic);
		console.log("cipher:" + cip);
		var text = yield crypto.decryptText(cip,"xpvPjSRCtmQ3G99Pfu1VMDMd9ET3W");
		console.log("plain text:" + text);
		var text2 = yield crypto.decryptText(cip,"xnHAcvtn1eVLDskhxPKNrhTsYKqde");
		console.log("plain text2:" + text2);
		

		console.log("AesPadding Test");
		var aesCipher = crypto.aesEncrypt("abcdefg","hello,world");
		console.log(aesCipher);
		var aesDecrypted = crypto.aesDecrypt("abcdefg",aesCipher);
		console.log(aesDecrypted);
		

		// 创建表
		let rs = yield r.createTable("abc", [{
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
		 }],{confidential:false})
		 .submit();
		// console.log(rs)
		
		// 删除表
		// let rs = yield r.drop(tb);
		
		// 重命名
		// let rs = yield r.rename(tb,'users');
		// 授权权限
		// let rs = yield r.assign(tb, 'rETMNdu2UgPhLZzbnDUVRHhB6NEDahj53c', [r.perm.insert],'0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02');
		// console.log(rs)
		//取消授权
		// let rs = yield r.assignCancle('users', 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh', ['lsfUpdate']);
		// 插入数据
		//let rs = yield r.table(tb).insert({name:'xiaopeng'}).submit();
		// let rs = yield r.table(tb).insert({name:'feipeng1'}).submit();
		//删除数据
		// let rs = yield r.table(tb).get({id:1}).delete().submit();
		// 获取数据
		//let rs = yield r.table(tb).get(['id','name']).submit();
        
        // 测试一个条件的情况
        //let rs = yield r.table(tb).get({id:{$ge:1}}).withFields(['id','name']).submit();
        
        // // 测试 or 条件
        //let rs = yield r.table(tb).get({id:{$eq:1}},{name:'feipeng1'}).withFields(['id','name']).submit();
        //let rs = yield r.table(tb).get({id:{$eq:1}},{name:{$eq:'feipeng1'}}).withFields(['id','name']).submit();
        //let rs = yield r.table(tb).get({$or:[{id:{$ge:1}},{name:'feipeng1'}]}).withFields(['id','name']).submit();
        
        // 测试 and 条件
        //let rs = yield r.table(tb).get({$and:[{id:{$ge:1}},{name:'feipeng1'}]}).withFields(['id','name']).submit();
        //let rs = yield r.table(tb).get([{id:{$ge:1},name:'feipeng1'}]).withFields(['id','name']).submit();
        //let rs = yield r.table(tb).get([{id:{$ge:1},name:{$eq:'feipeng1'}}]).withFields(['id','name']).submit();
        
        // 测试 limit
        //let rs = yield r.table(tb).get({id:{$eq:1}},{name:'feipeng1'},{$limit:{index:0,total:1}}).withFields(['id','name']).submit();
        // order by asc
        //let rs = yield r.table(tb).get({id:{$eq:1}},{name:'feipeng1'},{$limit:{index:0,total:2},$order:[{id:1}]}).withFields(['id','name']).submit();
        // order by desc
        // let rs = yield r.table(tb).get({id:{$eq:1}},{name:'feipeng1'},{$limit:{index:0,total:2},$order:[{id:-1}]}).withFields(['id','name']).submit();

		//更新数据
		// let rs = yield r.table(tb).update({name:'xiaopeng'},{id:2}).submit();
		// 获取所有交易
		// let rs = yield r.getTransactions({limit:10,types:['sqlStatement']});
		// 
		// console.log(rs)
		// 事务操作
		/*var raw ='[{"OpType":1,"TableName":"ExampleName","Raw":[{"field":"id","type":"int","length":11,"PK":1,"NN":1,"UQ":1,"AI":1},{"field":"age","type":"int"}],"$IsExisted":1},{"OpType":2,"TableName":"ExampleName","$IsExisted":0},{"OpType":6,"TableName":"ExampleName","Raw":[{"id":1,"age":1},{"id":2,"age":2}],"$RowCount":1,"Cond":{"id":1,"name":"test"}},{"OpType":8,"TableName":"ExampleName","Raw":[{"id":3,"age":2},{"id":2,"age":2}],"$RowCount":1,"Cond":{"id":3,"age":2}},{"OpType":9,"TableName":"ExampleName","Raw":[{"id":1,"age":1}],"$RowCount":0,"Cond":{"id":1,"age":1}}]';*/
		/*var raw ='[{"OpType":1,"TableName":"ExampleName","Raw":[{"field":"id","type":"int","length":11,"PK":1,"NN":1,"UQ":1,"AI":1},{"field":"age","type":"int"}],"$IsExisted":1},{"OpType":6,"TableName":"ExampleName","Raw":[{"id":1,"age":1},{"id":2,"age":2}],"$RowCount":1,"Cond":{"id":1,"name":"test"}},{"OpType":8,"TableName":"ExampleName","Raw":[{"id":3,"age":2},{"id":2,"age":2}],"$RowCount":1,"Cond":{"id":3,"age":2}},{"OpType":9,"TableName":"ExampleName","Raw":[{"id":1,"age":1}],"$RowCount":0,"Cond":{"id":1,"age":1}}]';*/

		// var raw = '[{"OpType":1,"Account":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh","Secret":"snoPBrXtMeMyMHUVTgbuqAfg1SUTb","TableName":"ExampleName","Raw":[{"field":"id","type":"int","length":11,"PK":1,"NN":1,"UQ":1,"AI":1},{"field":"age","type":"int"}],"$IsExisted":1},{"OpType":6,"Account":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh","Secret":"snoPBrXtMeMyMHUVTgbuqAfg1SUTb","Owner":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh","TableName":"ExampleName","Raw":[{"id":1,"age":1},{"id":2,"age":2}],"$RowCount":1,"Cond":{"id":1,"name":"test"}},{"OpType":8,"Account":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh","Secret":"snoPBrXtMeMyMHUVTgbuqAfg1SUTb","Owner":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh","TableName":"ExampleName","Raw":[{"id":3,"age":2},{"id":2,"age":2}],"$RowCount":1,"Cond":{"id":3,"age":2}},{"OpType":9,"TableName":"ExampleName","Account":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh","Secret":"snoPBrXtMeMyMHUVTgbuqAfg1SUTb","Owner":"rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh","Raw":[{"id":1,"age":1}],"$RowCount":0,"Cond":{"id":1,"age":1}}]';
		// console.log(rs)
		
		// r.beginTran();
		
		// r.create('user0144s4000', [{
		// 	"field": "id",
		// 	"type": "int",
		// 	"length": 11,
		// 	"PK": 1,
		// 	"NN": 1,
		// 	"UQ": 1,
		// 	"AI": 1
		// }, {
		// 	"field": "name",
		// 	"type": "varchar",
		// 	"length": 46,
		// 	"default": "null"
		// }],{confidential:true});
		// r.table(tb).insert({id:33,name:'xiaopeng454'});
		// r.table(tb).insert({id:34,name:'feipeng14544'});
		// var data = yield r.commit();
		// console.log('data',data)
	} catch (e) {
		console.log(e)
	}
})

console.log("llls")
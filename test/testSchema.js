'use strict'

const fs   = require("fs");
const co = require('co')
const ChainsqlAPI = require('../src/index');

const c = new ChainsqlAPI();

 var owner = {
 	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
 	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"	
 }

main();

async function main(){
	try {
		 await c.connect('ws://127.0.0.1:6006');
		//await c.connect('ws://101.201.40.124:5006');
		console.log('连接成功');
		c.as(owner);
		await testChainsql();
		console.log('运行结束');
	}catch(e){
		console.error(e);
	}
}

async function testChainsql(){
	await testSchema();
}

//创建一个加密的表,table为要创建的表,confidential为是否要加密
var testSchema = async function() {

	try{
	
		// // 获取主，子链的信息
		// {
		// 	let ret = await c.getServerInfo()
		// 	console.log("主链:" + JSON.stringify(ret))
		// 	c.setSchema("AB34D23A49AD8A07D1F906135B71E8FEC8F94EE1CF41D36C1860C2CA79FB71BF")
		// 	ret = await c.getServerInfo();
		// 	console.log("子链:" + JSON.stringify(ret))
		// }

		// // 获取所有子链的信息
		// {
		// 	c.setSchema("")
		// 	let ret = await c.getSchemaList()
		// 	console.log("getSchemaList:" + JSON.stringify(ret))
		// }


		// 创建子链
		{


			// {
			// 	"method": "submit",
			// 	"params": [{
			// 		"secret": "xnqz3WMyyeaizQjPSaX6MjAUoa5vD",
			// 		"tx_json": {
			// 			"TransactionType": "SchemaCreate",
			// 			"Account": "zKQhss2DSrPT3H5p7Ej55gx6F3snWH4KtT",
			// 			"SchemaName":"716c69",
			// 			"SchemaStrategy":2,
			// 			"SchemaAdmin":"zKQhss2DSrPT3H5p7Ej55gx6F3snWH4KtT",
			// 			"AnchorLedgerHash":"A8262DD30EA3268E379E5C4B9D9C27AE71F6CEF55C2B78CA9DAC180FC40E2263",
			// 			"Validators":[
			// 				{
			// 					"Validator":{
			// 						"PublicKey":"0249DF94DCE166BC5097FA6A447C55DD378996A091CE0450B58BACDE258EB785B3"
			// 					}
			// 				},
			// 				{
			// 					"Validator":{
			// 						"PublicKey":"033E10D1FF3DC55889DCC811B537E199DE09876A6B194989D5A1926AD8FBC0FBDB"
			// 					}
			// 				},
			// 				{
			// 					 "Validator":{
			// 						"PublicKey":"02AF9D493C879C114BE1084EB675983F3FC457874B299B45BFA34C597E28187647"
			// 					}
			// 				}
			// 			],
			// 			"PeerList":[
			// 				{
			// 					"Peer":{ "Endpoint":"3132372e302e302e313a3135313235" }  127.0.0.1:15125
			// 				},
			// 				{
			// 					"Peer":{ "Endpoint":"3132372e302e302e313a3235313235" }    127.0.0.1:25125
			// 				},                
			// 				{
			// 					"Peer":{ "Endpoint":"3132372e302e302e313a3335313235" }     127.0.0.1:35125
			// 				}
			// 			]
			// 		}
			// 	}]
			// }

			// 1、 不继承主链状态
			let schemaInfo = {
				SchemaName:"hello",
				WithState:false,
				SchemaAdmin:owner.address,
				Validators:[
					{
						Validator:{PublicKey:"0249DF94DCE166BC5097FA6A447C55DD378996A091CE0450B58BACDE258EB785B3"}
					},
					{
						Validator:{PublicKey:"033E10D1FF3DC55889DCC811B537E199DE09876A6B194989D5A1926AD8FBC0FBDB"}
					},
					{
						Validator:{PublicKey:"02AF9D493C879C114BE1084EB675983F3FC457874B299B45BFA34C597E28187647"}
					}
				],
				PeerList:[
					{
						Peer:{ Endpoint:"127.0.0.1:15125"}
					},
					{
						Peer:{ Endpoint:"127.0.0.1:25125"}
					},
					{
						Peer:{ Endpoint:"127.0.0.1:35125"}
					}
				]
			}
		
			let ret = await c.createSchema(schemaInfo).submit({expect:'validate_success'})

			console.log("创建子链 不继承状态:" + JSON.stringify(ret))


			// 2、 继承主链状态
			// let schemaInfo = {
			// 	SchemaName:"jc",
			// 	WithState:true,
			// 	AnchorLedgerHash:"A8262DD30EA3268E379E5C4B9D9C27AE71F6CEF55C2B78CA9DAC180FC40E2263",
			// 	SchemaAdmin:owner.address,
			// 	Validators:[
			// 		{
			// 			Validator:{PublicKey:"0249DF94DCE166BC5097FA6A447C55DD378996A091CE0450B58BACDE258EB785B3"}
			// 		},
			// 		{
			// 			Validator:{PublicKey:"033E10D1FF3DC55889DCC811B537E199DE09876A6B194989D5A1926AD8FBC0FBDB"}
			// 		},
			// 		{
			// 			Validator:{PublicKey:"02AF9D493C879C114BE1084EB675983F3FC457874B299B45BFA34C597E28187647"}
			// 		}
			// 	],
			// 	PeerList:[
			// 		{
			// 			Peer:{ Endpoint:"127.0.0.1:15125"}
			// 		},
			// 		{
			// 			Peer:{ Endpoint:"127.0.0.1:25125"}
			// 		},
			// 		{
			// 			Peer:{ Endpoint:"127.0.0.1:35125"}
			// 		}
			// 	]
			// }
		
			// let ret = await c.createSchema(schemaInfo).submit({expect:'validate_success'})

			// console.log("创建子链 不继承状态:" + JSON.stringify(ret))



		}
	
		//    // 不继承状态
		//    let schemaInfo = {
		// 	SchemaName:"hello",
		// 	WithState:false,
		// 	SchemaAdmin:user.address,
		// 	Validators:[
		// 		{
		// 			Validator:{PublicKey:"02BD87A95F549ECF607D6AE3AEC4C95D0BFF0F49309B4E7A9F15B842EB62A8ED1B"}
		// 		}
		// 	],
		// 	PeerList:[
		// 		{
		// 			Peer:{ Endpoint:"192.168.29.108:5125"}
		// 		}
		// 	]
		// }
	
		// let ret = await c.createSchema(schemaInfo).submit({expect:'validate_success'})
		// //assert.strictEqual(ret.status,'validate_success')  
		// // 继承状态
	
		// console.log("test CreateSchema" , ret)


	}catch(e){
		console.error(e)
	}
}
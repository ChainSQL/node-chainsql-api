"use strict";

const ChainsqlAPI = require("../src/index").ChainsqlAPI;
const chainsql = new ChainsqlAPI();

const RootUser = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
};
const abi = '[{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendToUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"transferToContract","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferToUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"userTransferUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]';
const deployBytecode = "0x60806040526101c3806100136000396000f30060806040526004361061006c5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166312cccb34811461006e57806338c182ee146100765780635f7807a41461008d578063e8b3891e146100a4578063f8b2cb4f146100b8575b005b61006c6100eb565b61006c600160a060020a03600435166024356100ed565b61006c600160a060020a0360043516602435610116565b61006c600160a060020a0360043516610151565b3480156100c457600080fd5b506100d9600160a060020a036004351661018a565b60408051918252519081900360200190f35b565b604051600160a060020a0383169082156108fc029083906000818181858888f150505050505050565b604051600160a060020a0383169082156108fc029083906000818181858888f1935050505015801561014c573d6000803e3d6000fd5b505050565b604051600160a060020a038216903480156108fc02916000818181858888f19350505050158015610186573d6000803e3d6000fd5b5050565b600160a060020a031631905600a165627a7a72305820b4a088913af4175418d403984fe429f224fa0fc388522e5a3f33e2fd579f25ea0029";
const contractAddr = "zLFo2CP5GNtvqRkiJEaRQL6G5aNG9cUxCs";

main();

async function main(){
	try {
		await chainsql.connect("ws://127.0.0.1:5215");
		console.log("connected successfully");

		chainsql.as(RootUser);
	
		//deployContractAwait();
		//deployContract();

		callContract();
		
	} catch (error) {
		console.log(error);
	}
}

function callContract(){
	const myContract = chainsql.contract(JSON.parse(abi), contractAddr);

	// // myContract.events.memChangelog({
	// // 	filter: {member:15}
	// // }, (err, res) => {
	// // 	console.log(err);
	// // 	console.log(res);
	// // });

	/*methods.function.submit*/
	// myContract.methods.userTransferUser("814D712456570A7DD0254B574A93E3CD58BF3608").submit({
	// 	Gas: 500000,
	// 	ContractValue: "1111111"
	// }, (err, result) => {
	// 	console.log(err);
	// 	console.log(result);
	// });

	/*methods.function.call*/
	myContract.methods.getBalance("814D712456570A7DD0254B574A93E3CD58BF3608").call(function (err, res) {
		console.log(err);
		console.log(res);
	});
	
	/*methods.function.encodeABI*/
	// let funInputData = myContract.methods.setMem(16).encodeABI();
	// console.log(funInputData);

	/*methods.function.auto*/
	// myContract.methods.setMem(16).auto({
	// 	Gas: 500000
	// }, (err, result) => {
	// 	console.log(err);
	// 	console.log(result);
	// });
	// myContract.methods.getMem().auto(function (err, res) {
	// 	console.log(err);
	// 	console.log(res);
	// });
}

function deployContract(){
	const myContract = chainsql.contract(JSON.parse(abi));
	myContract.deploy({
		ContractValue : "10000000",
		Gas : 400000,
		ContractData : deployBytecode
	}, function (err, result) {
		console.log(err);
		console.log(result);

		// myContract.methods.setMem(16).send({
		// 	Gas: 500000
		// }, (err, result) => {
		// 	console.log(err);
		// 	console.log(result);
		// });
	});
}

async function deployContractAwait(){
	const myContract = chainsql.contract(JSON.parse(abi));
	try {
		let deployRes = await myContract.deploy({
			ContractValue : "10000000",
			Gas : 400000,
			ContractData : deployBytecode
		});
		console.log(deployRes);
		myContract.methods.setMem(16).send({
			Gas:500000
		}, (err, result) => {
			console.log(err);
			console.log(result);
		});
	} catch (error) {
		console.log(error);
	}
}
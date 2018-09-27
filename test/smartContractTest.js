"use strict";

const ChainsqlAPI = require("../src/index").ChainsqlAPI;
const chainsql = new ChainsqlAPI();

const RootUser = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
};
const abi = '[{"constant":false,"inputs":[],"name":"getMsgSender","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendToUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"transferToContract","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferToUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"userTransferUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]';
const deployBytecode = "0x608060405261020d806100136000396000f3006080604052600436106100775763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166312cccb34811461007957806338c182ee146100815780635f7807a4146100985780637a6ce2e1146100af578063e8b3891e146100e7578063f8b2cb4f146100fb575b005b61007761012e565b610077600160a060020a0360043516602435610130565b610077600160a060020a0360043516602435610159565b3480156100bb57600080fd5b506100c4610194565b60408051600160a060020a03909316835260208301919091528051918290030190f35b610077600160a060020a036004351661019b565b34801561010757600080fd5b5061011c600160a060020a03600435166101d4565b60408051918252519081900360200190f35b565b604051600160a060020a0383169082156108fc029083906000818181858888f150505050505050565b604051600160a060020a0383169082156108fc029083906000818181858888f1935050505015801561018f573d6000803e3d6000fd5b505050565b3360069091565b604051600160a060020a038216903480156108fc02916000818181858888f193505050501580156101d0573d6000803e3d6000fd5b5050565b600160a060020a031631905600a165627a7a7230582098632f348441cf6c39b52534db0544177a0ebc4ac0841e20714463cf573092db0029";
const contractAddr = "zGJU58xX4fTLyqqnNiNWhAMDdmXVvk68qi";

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
	// myContract.methods.userTransferUser("zU8gAWTXZgLmaF1XVR8briCdnWXJsT8njM").submit({
	// 	Gas: 500000,
	// 	ContractValue: "1111111"
	// }, (err, result) => {
	// 	console.log(err);
	// 	console.log(result);
	// });

	/*methods.function.call*/
	myContract.methods.getMsgSender().call(function (err, res) {
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
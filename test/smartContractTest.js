"use strict";

//const fs = require ('fs');
//const solc = require('solc');
const ChainsqlAPI = require("../src/index").ChainsqlAPI;
const chainsql = new ChainsqlAPI();

const RootUser = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
};
const abi = '[{"constant":false,"inputs":[],"name":"getTxOrigin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"returnMixType","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newMem","type":"uint256"}],"name":"setMem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferToUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"userTransferUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"result","type":"uint256"}],"name":"multiplyRes","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"number","type":"string"},{"indexed":false,"name":"result","type":"uint256"}],"name":"multiplylog","type":"event"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMsgSender","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"multiply","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"returnString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"}]';
const deployBytecode = "0x608060405261059e806100136000396000f3006080604052600436106100ae5763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663165c4a1681146100b35780635f7807a4146100e0578063645c9ac8146100f95780636606873b1461018d5780636cf43347146101a55780637a6ce2e11461022f578063b8077e2814610267578063c6888fa114610298578063e8b3891e146102b0578063f0591308146102c4578063f8b2cb4f146102d9575b600080fd5b3480156100bf57600080fd5b506100ce6004356024356102fa565b60408051918252519081900360200190f35b6100f7600160a060020a03600435166024356102fe565b005b34801561010557600080fd5b5061010e610339565b6040518083815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610151578181015183820152602001610139565b50505050905090810190601f16801561017e5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34801561019957600080fd5b506100f7600435610373565b3480156101b157600080fd5b506101ba610378565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101f45781810151838201526020016101dc565b50505050905090810190601f1680156102215780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561023b57600080fd5b506102446103d7565b60408051600160a060020a03909316835260208301919091528051918290030190f35b34801561027357600080fd5b5061027c6103de565b60408051600160a060020a039092168252519081900360200190f35b3480156102a457600080fd5b506100ce6004356103e2565b6100f7600160a060020a0360043516610526565b3480156102d057600080fd5b506100ce61055f565b3480156102e557600080fd5b506100ce600160a060020a0360043516610565565b0290565b604051600160a060020a0383169082156108fc029083906000818181858888f19350505050158015610334573d6000803e3d6000fd5b505050565b60408051808201909152601b81527f737472696e675465737432666f724d69785479706552657475726e0000000000602082015261029a91565b600055565b60408051606081018252602981527f737472696e675465737431666f72616c6f6e67537472696e674d6f726574686160208201527f6e333242797465343100000000000000000000000000000000000000000000009181019190915290565b3360069091565b3290565b6000806001831161047a57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f6d75737420696e7075742061206269676765722076616c7565207468616e206f60448201527f6e65000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b506040805133815260078402818301819052606060208301819052600c908301527f48656c6c6f2c7465737465720000000000000000000000000000000000000000608083015291517feb39c5b4befb33e60857fbb33988a6455c10a52a2cf814fb3da1120c731440f39181900360a00190a16040805182815290517f08772fbab8abc67e72c30c4f15c461920cd7692db0a2498a7225bac55e4fc7da9181900360200190a192915050565b604051600160a060020a038216903480156108fc02916000818181858888f1935050505015801561055b573d6000803e3d6000fd5b5050565b60005490565b600160a060020a031631905600a165627a7a7230582090911bed65a0110b38b1adcebc939dd95df465135e6a3a35f0d0626b802b931c0029";
const contractAddr = "zffPph792Rp3z1QgvYkz9ptdkHAoLxUAQH";

main();

async function main(){
	try {
		await chainsql.connect("ws://127.0.0.1:5215");
		console.log("connected successfully");

		chainsql.as(RootUser);
		// let contractCode = fs.readFileSync("./solidity-example/solidity-example.sol");
		// let compileResult = solc.compile(contractCode.toString(), 1);
		// for (var contractName in compileResult.contracts) {
		// 	// code and ABI that are needed by web3
		// 	console.log(contractName + ': ' + compileResult.contracts[contractName].bytecode);
		// 	deployBytecode = "0x" + compileResult.contracts[contractName].bytecode;
		// 	console.log(contractName + ': ' + compileResult.contracts[contractName].interface);
		// 	abi = compileResult.contracts[contractName].interface;
		// }

	
		//deployContractAwait();
		//deployContract();

		callContract();
	} catch (error) {
		console.log(error);
	}
}

function callContract(){
	const myContract = chainsql.contract(JSON.parse(abi), contractAddr);

	//callContractWithMsgValue(myContract);

	/*get function encodeABI*/
	//getFuncEncodeABI(myContract);

	/*get contract value*/
	//getContractValue(myContract);

	/*methods.events.eventlog*/
	myContract.events.multiplylog((err, res) => {
		err ? console.log(err) : console.log(res);
	});

	/*methods.function.submit*/
	myContract.methods.multiply(6).submit({
		Gas: 500000,
		expect: "validate_success"
	}, (err, res) => {
		err ? console.log(err) : console.log(res);
	});
	
	/*methods.function.auto*/
	// myContract.methods.setMem(16).auto({
	// 	Gas: 500000
	// }, (err, res) => {
	// 	err ? console.log(err) : console.log(res);
	// });
	// myContract.methods.getMem().auto(function (err, res) {
	// 	err ? console.log(err) : console.log(res);
	// });
}
function callContractWithMsgValue(contractObj){
	contractObj.methods.userTransferUser("zU8gAWTXZgLmaF1XVR8briCdnWXJsT8njM").submit({
		Gas: 500000,
		ContractValue: "111111",
		expect: "validate_success"
	}, (err, res) => {
		err ? console.log(err) : console.log(res);
	});
}

function getFuncEncodeABI(contractObj){
	/*methods.function.encodeABI*/
	let funInputData = contractObj.methods.setMem(16).encodeABI();
	console.log(funInputData);
}

function getContractValue(contractObj){
	/*methods.function.call*/
	contractObj.methods.getMsgSender().call(function (err, res) {
		err ? console.log(err) : console.log(res);
	});
}

function deployContract(){
	const myContract = chainsql.contract(JSON.parse(abi));
	myContract.deploy({
		ContractValue : "10000000",
		Gas : 400000,
		ContractData : deployBytecode
	}, function (err, res) {
		err ? console.log(err) : console.log(res);

		// myContract.methods.setMem(16).send({
		// 	Gas: 500000
		// }, (err, res) => {
		// 	err ? console.log(err) : console.log(res);
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
		}, (err, res) => {
			err ? console.log(err) : console.log(res);
		});
	} catch (error) {
		console.log(error);
	}
}
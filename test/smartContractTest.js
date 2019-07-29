"use strict";

//const fs = require ('fs');
//const solc = require('solc');
const ChainsqlAPI = require("../src/index");
const chainsql = new ChainsqlAPI();

const RootUser = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
};
const abi = '[{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferToUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"returnMixType","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"newMem","type":"uint256"}],"name":"setMem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"returnString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"getMsgSender","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTxOrigin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"userTransferUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getMem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":true,"name":"number","type":"uint256"},{"indexed":false,"name":"result","type":"uint256"}],"name":"multiplylog","type":"event"}]';
const deployBytecode = "0x6080604052610707806100136000396000f3006080604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635f7807a4146100a6578063645c9ac8146100f45780636606873b1461018b5780636cf43347146101c65780637a6ce2e114610256578063b8077e28146102b4578063c6888fa11461030b578063e8b3891e1461035a578063f05913081461039e578063f8b2cb4f146103c9575b005b6100f2600480360360408110156100bc57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061042e565b005b34801561010057600080fd5b50610109610479565b6040518083815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561014f578082015181840152602081019050610134565b50505050905090810190601f16801561017c5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34801561019757600080fd5b506101c4600480360360208110156101ae57600080fd5b81019080803590602001909291905050506104c4565b005b3480156101d257600080fd5b506101db6104ce565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561021b578082015181840152602081019050610200565b50505050905090810190601f1680156102485780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561026257600080fd5b5061026b610531565b604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b3480156102c057600080fd5b506102c9610542565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561031757600080fd5b506103446004803603602081101561032e57600080fd5b810190808035906020019092919050505061054a565b6040518082815260200191505060405180910390f35b61039c6004803603602081101561037057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610667565b005b3480156103aa57600080fd5b506103b36106b1565b6040518082815260200191505060405180910390f35b3480156103d557600080fd5b50610418600480360360208110156103ec57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506106ba565b6040518082815260200191505060405180910390f35b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610474573d6000803e3d6000fd5b505050565b60006060600061029a9050806040805190810160405280601b81526020017f737472696e675465737432666f724d69785479706552657475726e000000000081525092509250509091565b8060008190555050565b60608060405190810160405280602981526020017f737472696e675465737431666f72616c6f6e67537472696e674d6f726574686181526020017f6e33324279746534310000000000000000000000000000000000000000000000815250905090565b600080336006809050915091509091565b600032905090565b60006001821115156105ea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001807f6d75737420696e7075742061206269676765722076616c7565207468616e206f81526020017f6e6500000000000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b6000600783029050827f414b7ab3d46ecc8ab359636c133f9a1b88ffc8c08e9560da2b3ef7949edf8ca33383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a280915050919050565b8073ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f193505050501580156106ad573d6000803e3d6000fd5b5050565b60008054905090565b60008173ffffffffffffffffffffffffffffffffffffffff163190509190505600a165627a7a723058206503ab514bf3f130f914693d97643dc702c6a46fa16526d2b59a62642b85e82d0029";
const contractAddr = "zcdFPChLUNYXQTV6zr2osrWG8pV7Zyh8FL";


main();

async function main(){
	try {
		await chainsql.connect("ws://127.0.0.1:6006");
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

		// deployContractAwait();
		deployContract();

		// callContract();
	} catch (error) {
		console.log(error);
	}
}

function callContract(){
	const myContract = chainsql.contract(JSON.parse(abi), contractAddr);
	/*use contract call way*/
	// contractCall(myContract);

	/*methods.events.eventlog*/
	// contractEvent(myContract);
	
	/*use contract submit way*/
	contractSubmit(myContract);
	
	// callContractWithMsgValue(myContract);

	/*get function encodeABI*/
	// getFuncEncodeABI(myContract);
	
	/*methods.function.auto*/
	// contractAuto(myContract);
}

function contractSubmit(myContract){
	/*methods.function.submit*/
	chainsql.payToContract(contractAddr, 2000, 30000000).submit({
		expect: "validate_success"
	}).then(data => {
		console.log(data);
	}).catch(err => {
		console.log(err);
	});
	// Promise
	// myContract.methods.transferToUser("zLtH4NFSqDFioq5zifriKKLf8xcyyw7VCf", 12000000).submit({
	// 	Gas: 30000000,
	// 	ContractValue : "20000000",
	// 	expect: "validate_success"
	// }).then(data => {
	// 	console.log(data);
	// }).catch(err => {
	// 	console.log(err);
	// });	

	//callback
	// myContract.methods.userTransferUser("zPif8u9YqL8NhHxXGHKxopAaFMZ3rwHF6s").submit({
	// 	Gas: 30000000,
	// 	ContractValue: "12000000",
	// 	expect: "validate_success"
	// }, function (err, res) {
	// 	err ? console.log(err) : console.log(res);
	// });
}

function contractEvent(myContract){
	myContract.events.multiplylog((err, res) => {
		err ? console.log(err) : console.log(res);
	});
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

function contractCall(contractObj){
	/*methods.function.call*/
	contractObj.methods.getMsgSender().call(function (err, res) {
		err ? console.log(err) : console.log(res);
	});
}

function getFuncEncodeABI(contractObj){
	/*methods.function.encodeABI*/
	let funInputData = contractObj.methods.setMem(16).encodeABI();
	console.log(funInputData);
}

function deployContract(){
	const myContract = chainsql.contract(JSON.parse(abi));
	// Promise
	// myContract.deploy({
	// 	ContractData : deployBytecode,
	// 	arguments : [666]
	// }).submit({
	// 	ContractValue : "10000000",
	// 	Gas : 400000
	// }).then(data => {
	// 	console.log(data);
	// }).catch(err => {
	// 	console.log(err);
	// });

	// callback
	myContract.deploy({
		ContractData : deployBytecode,
		arguments : [666]
	}).submit({
		ContractValue : "10000000",
		Gas : 400000
	}, function (err, res) {
		err ? console.log(err) : console.log(res);

		/* you can call contract function directly here!*/
		// myContract.methods.setMem(16).submit({
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
			ContractData : deployBytecode,
			arguments : [666]
		}).submit({
			ContractValue : "10000000",
			Gas : 400000
		});

		console.log(deployRes);
		myContract.methods.setMem(16).submit({
			Gas:500000
		}, (err, res) => {
			err ? console.log(err) : console.log(res);
		});
	} catch (error) {
		console.log(error);
	}
}
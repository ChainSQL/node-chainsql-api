"use strict";

//const fs = require ('fs');
//const solc = require('solc');
const ChainsqlAPI = require("../src/index").ChainsqlAPI;
const chainsql = new ChainsqlAPI();

const RootUser = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
};
const abi = '[{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferToUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"returnMixType","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"newMem","type":"uint256"}],"name":"setMem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"returnString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"getMsgSender","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTxOrigin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"userTransferUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getMem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"memIn","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":true,"name":"number","type":"uint256"},{"indexed":false,"name":"result","type":"uint256"}],"name":"multiplylog","type":"event"}]';
const deployBytecode = "0x60806040526040516020806107558339810180604052602081101561002357600080fd5b8101908080519060200190929190505050806000819055505061070a8061004b6000396000f3006080604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635f7807a4146100a9578063645c9ac8146100f75780636606873b1461018e5780636cf43347146101c95780637a6ce2e114610259578063b8077e28146102b7578063c6888fa11461030e578063e8b3891e1461035d578063f0591308146103a1578063f8b2cb4f146103cc575b600080fd5b6100f5600480360360408110156100bf57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610431565b005b34801561010357600080fd5b5061010c61047c565b6040518083815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610152578082015181840152602081019050610137565b50505050905090810190601f16801561017f5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34801561019a57600080fd5b506101c7600480360360208110156101b157600080fd5b81019080803590602001909291905050506104c7565b005b3480156101d557600080fd5b506101de6104d1565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561021e578082015181840152602081019050610203565b50505050905090810190601f16801561024b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561026557600080fd5b5061026e610534565b604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b3480156102c357600080fd5b506102cc610545565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561031a57600080fd5b506103476004803603602081101561033157600080fd5b810190808035906020019092919050505061054d565b6040518082815260200191505060405180910390f35b61039f6004803603602081101561037357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061066a565b005b3480156103ad57600080fd5b506103b66106b4565b6040518082815260200191505060405180910390f35b3480156103d857600080fd5b5061041b600480360360208110156103ef57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506106bd565b6040518082815260200191505060405180910390f35b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610477573d6000803e3d6000fd5b505050565b60006060600061029a9050806040805190810160405280601b81526020017f737472696e675465737432666f724d69785479706552657475726e000000000081525092509250509091565b8060008190555050565b60608060405190810160405280602981526020017f737472696e675465737431666f72616c6f6e67537472696e674d6f726574686181526020017f6e33324279746534310000000000000000000000000000000000000000000000815250905090565b600080336006809050915091509091565b600032905090565b60006001821115156105ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001807f6d75737420696e7075742061206269676765722076616c7565207468616e206f81526020017f6e6500000000000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b6000600783029050827f414b7ab3d46ecc8ab359636c133f9a1b88ffc8c08e9560da2b3ef7949edf8ca33383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a280915050919050565b8073ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f193505050501580156106b0573d6000803e3d6000fd5b5050565b60008054905090565b60008173ffffffffffffffffffffffffffffffffffffffff163190509190505600a165627a7a72305820288a980bb8d7b5f466283b4a83659b2b9349076686e0f1a62cc002b092cc426e0029";
const contractAddr = "zLRYNQd9Jy8K32qWRsuRzyLcfXvTfmpFVm";


main();

async function main(){
	try {
		await chainsql.connect("ws://127.0.0.1:6007");
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
		deployContract();

		// callContract();
	} catch (error) {
		console.log(error);
	}
}

function callContract(){
	const myContract = chainsql.contract(JSON.parse(abi), contractAddr);

	//callContractWithMsgValue(myContract);

	/*get function encodeABI*/
	// getFuncEncodeABI(myContract);

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
		ContractData : deployBytecode,
		arguments : [666]
	}).submit({
		ContractValue : "10000000",
		Gas : 400000
	}, function (err, res) {
		err ? console.log(err) : console.log(res);

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
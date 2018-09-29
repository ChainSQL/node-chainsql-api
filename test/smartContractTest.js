"use strict";

const ChainsqlAPI = require("../src/index").ChainsqlAPI;
const chainsql = new ChainsqlAPI();

const RootUser = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
};
const abi = '[{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferToUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"returnMixType","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newMem","type":"uint256"}],"name":"setMem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"returnString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMsgSender","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getTxOrigin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"userTransferUser","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getMem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":true,"name":"number","type":"uint256"},{"indexed":false,"name":"result","type":"uint256"}],"name":"multiplylog","type":"event"}]';
const deployBytecode = "0x608060405261047a806100136000396000f3006080604052600436106100a35763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416635f7807a481146100a8578063645c9ac8146100c15780636606873b146101555780636cf433471461016d5780637a6ce2e1146101f7578063b8077e281461022f578063c6888fa114610260578063e8b3891e1461028a578063f05913081461029e578063f8b2cb4f146102b3575b600080fd5b6100bf600160a060020a03600435166024356102d4565b005b3480156100cd57600080fd5b506100d661030f565b6040518083815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610119578181015183820152602001610101565b50505050905090810190601f1680156101465780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34801561016157600080fd5b506100bf600435610349565b34801561017957600080fd5b5061018261034e565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101bc5781810151838201526020016101a4565b50505050905090810190601f1680156101e95780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561020357600080fd5b5061020c6103ad565b60408051600160a060020a03909316835260208301919091528051918290030190f35b34801561023b57600080fd5b506102446103b4565b60408051600160a060020a039092168252519081900360200190f35b34801561026c57600080fd5b506102786004356103b8565b60408051918252519081900360200190f35b6100bf600160a060020a0360043516610402565b3480156102aa57600080fd5b5061027861043b565b3480156102bf57600080fd5b50610278600160a060020a0360043516610441565b604051600160a060020a0383169082156108fc029083906000818181858888f1935050505015801561030a573d6000803e3d6000fd5b505050565b60408051808201909152601b81527f737472696e675465737432666f724d69785479706552657475726e0000000000602082015261029a91565b600055565b60408051606081018252602981527f737472696e675465737431666f72616c6f6e67537472696e674d6f726574686160208201527f6e333242797465343100000000000000000000000000000000000000000000009181019190915290565b3360069091565b3290565b6040805133815260078302602082018190528251600093919285927f414b7ab3d46ecc8ab359636c133f9a1b88ffc8c08e9560da2b3ef7949edf8ca392918290030190a292915050565b604051600160a060020a038216903480156108fc02916000818181858888f19350505050158015610437573d6000803e3d6000fd5b5050565b60005490565b600160a060020a031631905600a165627a7a72305820292c8e19759d12d784b429499256b484148f2225e99672fac48daef181c9fa250029";
const contractAddr = "zffPph792Rp3z1QgvYkz9ptdkHAoLxUAQH";

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

	myContract.events.multiplylog({
		filter: {member:15}
	}, (err, res) => {
		console.log(err);
		console.log(res);
	});

	/*methods.function.submit*/
	myContract.methods.multiply(6).submit({
		Gas: 500000,
		expect: "validate_success"
	}, (err, result) => {
		console.log(err);
		console.log(result);
	});

	/*methods.function.call*/
	// myContract.methods.getMsgSender().call(function (err, res) {
	// 	console.log(err);
	// 	console.log(res);
	// });
	
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
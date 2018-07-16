"use strict";

const ChainsqlAPI = require("../src/index").ChainsqlAPI;
const chainsql = new ChainsqlAPI();

const RootUser = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
};
const abi = '[{"constant":false,"inputs":[],"name":"return2int","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"returnMixType","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newMem","type":"uint256"}],"name":"setMem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"returnString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getTxOrigin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getMem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"number","type":"uint256"},{"indexed":false,"name":"result","type":"uint256"}],"name":"multiplylog","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"member","type":"uint256"},{"indexed":false,"name":"res","type":"uint256"}],"name":"memChangelog","type":"event"}]';
const deployBytecode = "0x60806040526103a5806100136000396000f3006080604052600436106100825763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166326e021cc8114610087578063645c9ac8146100b45780636606873b146101485780636cf4334714610162578063b8077e28146101ec578063c6888fa114610243578063f05913081461026e575b600080fd5b34801561009357600080fd5b5061009c610283565b60408051928352602092830191825251910181900390f35b3480156100c057600080fd5b506100c961028c565b6040518083815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561010c5781810151838201526020016100f4565b50505050905090810190601f1680156101395780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34801561015457600080fd5b506101606004356102c6565b005b34801561016e57600080fd5b5061017761030a565b6040516020808201828103835283518152835183929182019185019080838360005b838110156101b1578181015183820152602001610199565b50505050905090810190601f1680156101de5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156101f857600080fd5b50610201610369565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561024f57600080fd5b5061025b60043561036d565b6040805191825251602090910181900390f35b34801561027a57600080fd5b5061025b610373565b61010060389091565b60408051808201909152601b81527f737472696e675465737432666f724d69785479706552657475726e0000000000602082015261029a91565b60008190556040805160068302808252915183917f02cb7b283370c69d61be9056414d801096aab9b1a02748363b416eb5603384c791602090910181900390a25050565b6040805160608101909152602981527f737472696e675465737431666f72616c6f6e67537472696e674d6f726574686160208083019182527f6e3332427974653431000000000000000000000000000000000000000000000091015290565b3290565b60070290565b600054905600a165627a7a72305820b908defd1a70c58048ae6d9b2e021e31ef612df534c6088fc83d68b5e9c1b5d20029";
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

	myContract.events.memChangelog({
		filter: {member:15}
	}, (err, res) => {
		console.log(err);
		console.log(res);
	});
	myContract.methods.setMem(16).send({
		Gas: 500000
	}, (err, result) => {
		console.log(err);
		console.log(result);
	});

	// myContract.methods.getMem().call(function (err, res) {
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
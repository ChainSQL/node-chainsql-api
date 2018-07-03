"use strict";

const ChainsqlAPI = require('../src/index').ChainsqlAPI;
const chainsql = new ChainsqlAPI();

const RootUser = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
};
const abi = '[{"constant":false,"inputs":[],"name":"return2int","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"returnMixType","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newMem","type":"uint256"}],"name":"setMem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"returnString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getTxOrigin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getMem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"number","type":"uint256"},{"indexed":false,"name":"result","type":"uint256"}],"name":"multiplylog","type":"event"}]';
const deployBytecode = "0x6080604052610432806100136000396000f300608060405260043610610083576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806326e021cc14610088578063645c9ac8146100ba5780636606873b146101515780636cf433471461017e578063b8077e281461020e578063c6888fa114610265578063f0591308146102a6575b600080fd5b34801561009457600080fd5b5061009d6102d1565b604051808381526020018281526020019250505060405180910390f35b3480156100c657600080fd5b506100cf6102ec565b6040518083815260200180602001828103825283818151815260200191508051906020019080838360005b838110156101155780820151818401526020810190506100fa565b50505050905090810190601f1680156101425780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34801561015d57600080fd5b5061017c60048036038101908080359060200190929190505050610337565b005b34801561018a57600080fd5b50610193610341565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101d35780820151818401526020810190506101b8565b50505050905090810190601f1680156102005780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561021a57600080fd5b506102236103a4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561027157600080fd5b50610290600480360381019080803590602001909291905050506103ac565b6040518082815260200191505060405180910390f35b3480156102b257600080fd5b506102bb6103fd565b6040518082815260200191505060405180910390f35b60008060008061010091506038905081819350935050509091565b60006060600061029a9050806040805190810160405280601b81526020017f737472696e675465737432666f724d69785479706552657475726e000000000081525092509250509091565b8060008190555050565b60608060405190810160405280602981526020017f737472696e675465737431666f72616c6f6e67537472696e674d6f726574686181526020017f6e33324279746534310000000000000000000000000000000000000000000000815250905090565b600032905090565b6000806007830290507f7bc837b5ad588332bd0517b1abdaaa570c4d046a87167c903ed7aef78f97a1cd8382604051808381526020018281526020019250505060405180910390a180915050919050565b600080549050905600a165627a7a7230582085aaa9b3c0293b85a18b39508fad397e69e218b02e0279ec27bc3e280f9502380029";
const contractAddr = "z9ZP47QaAGsUG9xfyoSQyJEgmJLhb98NoR";

main();

async function main(){
    try {
        await chainsql.connect("ws://127.0.0.1:5215");
        console.log("connected successfully");

        chainsql.as(RootUser);
    
        //deployContract();

        const myContract = chainsql.contract(JSON.parse(abi), contractAddr);
        const inputData = "0x6606873b000000000000000000000000000000000000000000000000000000000000000f";
        // myContract.methods.setMem(15).send({
        //     gas:500000
        // }, (err, result) => {
        //     console.log(err);
        //     console.log(result);
        //     myContract.methods.getMem().call(function(err, res){
        //         console.log(err);
        //         console.log(res);
        //     })
        // })
        myContract.methods.getMem().call(function(err, res){
            console.log(err);
            console.log(res);
        })
    
        //testGetDeployTxhash();    
    } catch (error) {
        console.log(error);   
    }
}

function deployContract(){
    const myContract = chainsql.contract(JSON.parse(abi));
    myContract.deploy({
        ContractValue : "10000000",
        Gas : "400000",
        ContractData : deployBytecode
    },function(err,result){
        console.log(err);
        console.log(result);
    });
}

async function testGetDeployTxhash(){
    const payment = {
        "source": {
            "address": RootUser.address,
            "tag":10002,
            "maxAmount": {
                "value":"10000000",
                "currency":"ZXC"
            }
          },
          "destination": {
            "address": "zcXxcFgXdTNFTzqvxvD7uMYiJKWFLJkBRu",
            "amount": {
                "value" : "10000000",
                "currency":"ZXC"
            }
          }
    }
    let txDetail = chainsql.api.getTransaction("272DCECE1F9F4C2D5E4C1AE98806A67FA605D8B6C56DEA694B7CEB07DB383711");
    console.log(txDetail);
    let preparedPayment = await chainsql.api.preparePayment(RootUser.address,payment);
    let signedVal = await chainsql.api.sign(preparedPayment.txJSON, RootUser.secret);
    chainsql.event.subscribeTx(signedVal.id,(err,data) =>{
        console.log(err);
        console.log(data);
        let txDetail = chainsql.api.getTransaction(data.transaction.hash);
        console.log(txDetail);
    })
    let submitResult = chainsql.api.submit(signedVal.signedTransaction);
    console.log(submitResult);
}
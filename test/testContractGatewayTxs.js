'use strict'
const ChainsqlAPI = require('../src/index');
const c = new ChainsqlAPI();

var root = {
    secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
    address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
}

const userGateway = {
	secret: "xx9viuN9bsUxJxUGuJ8ehmzuT7BfB",
	address: "zL296sU2wCdBCCEQirwKDgrp7EnjcTBzVq"
};

const userA = {
	secret: "xcfUcfbzpjtSUCcTCeXJFjrTkhpXj",
	address: "zhp1ebWV3sZmntMgpPDdSdM6xATb1Mgyzc"
};
const userB = {
	secret: "xxbUtZQWXmJgLwqqgnEFY9cJvVyfr",
	address: "zGSyDNzNbQeuKS3L8gf2MBLAVsSShfm9Wi"
};


var   myContract;

const contractAddr = "zwvgh6WAr3GbjsopgpQmhciHjcPwC7LU8h";

const abi = '[{"constant":true,"inputs":[{"name":"contractAddr","type":"address"},{"name":"sCurrency","type":"string"},{"name":"power","type":"uint64"},{"name":"gateWay","type":"address"}],"name":"trustLimit","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"string"},{"name":"sCurrency","type":"string"},{"name":"gateWay","type":"address"}],"name":"trustSet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"accountTo","type":"address"},{"name":"value","type":"string"},{"name":"sendMax","type":"string"},{"name":"sCurrency","type":"string"},{"name":"gateWay","type":"address"}],"name":"pay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"contractAddr","type":"address"},{"name":"sCurrency","type":"string"},{"name":"power","type":"uint64"},{"name":"gateWay","type":"address"}],"name":"gatewayBalance","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"contractAddr","type":"address"},{"name":"accountTo","type":"address"},{"name":"value","type":"string"},{"name":"sendMax","type":"string"},{"name":"sCurrency","type":"string"},{"name":"gateWay","type":"address"}],"name":"gatewayPay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"uFlag","type":"uint32"},{"name":"bSet","type":"bool"}],"name":"accountSet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sRate","type":"string"},{"name":"minFee","type":"string"},{"name":"maxFee","type":"string"}],"name":"setTransferFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"sCurrency","type":"string"},{"name":"power","type":"uint64"},{"name":"gateWay","type":"address"}],"name":"trustLimit","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"contractAddr","type":"address"},{"name":"value","type":"string"},{"name":"sCurrency","type":"string"},{"name":"gateWay","type":"address"}],"name":"trustSet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"sCurrency","type":"string"},{"name":"power","type":"uint64"},{"name":"gateWay","type":"address"}],"name":"gatewayBalance","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]';
const deployBytecode = '0x608060405234801561001057600080fd5b50611239806100206000396000f3006080604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806334bcb956146100a6578063399d32c0146101d65780634262b061146103555780636e7146be1461058b578063bd1e7722146106bb578063e66256b014610911578063e7092c191461095e578063f5b960ab14610b54578063f812ecd314610c64578063f824e6f814610e03575b005b3480156100b257600080fd5b506101c0600480360360808110156100c957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561010657600080fd5b82018360208201111561011857600080fd5b8035906020019184600183028401116401000000008311171561013a57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803567ffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610f13565b6040518082815260200191505060405180910390f35b3480156101e257600080fd5b50610353600480360360608110156101f957600080fd5b810190808035906020019064010000000081111561021657600080fd5b82018360208201111561022857600080fd5b8035906020019184600183028401116401000000008311171561024a57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156102ad57600080fd5b8201836020820111156102bf57600080fd5b803590602001918460018302840111640100000000831117156102e157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610f5a565b005b34801561036157600080fd5b50610589600480360360a081101561037857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156103b557600080fd5b8201836020820111156103c757600080fd5b803590602001918460018302840111640100000000831117156103e957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561044c57600080fd5b82018360208201111561045e57600080fd5b8035906020019184600183028401116401000000008311171561048057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156104e357600080fd5b8201836020820111156104f557600080fd5b8035906020019184600183028401116401000000008311171561051757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610fa5565b005b34801561059757600080fd5b506106a5600480360360808110156105ae57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156105eb57600080fd5b8201836020820111156105fd57600080fd5b8035906020019184600183028401116401000000008311171561061f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803567ffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611000565b6040518082815260200191505060405180910390f35b3480156106c757600080fd5b5061090f600480360360c08110156106de57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561073b57600080fd5b82018360208201111561074d57600080fd5b8035906020019184600183028401116401000000008311171561076f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156107d257600080fd5b8201836020820111156107e457600080fd5b8035906020019184600183028401116401000000008311171561080657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561086957600080fd5b82018360208201111561087b57600080fd5b8035906020019184600183028401116401000000008311171561089d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611047565b005b34801561091d57600080fd5b5061095c6004803603604081101561093457600080fd5b81019080803563ffffffff1690602001909291908035151590602001909291905050506110a3565b005b34801561096a57600080fd5b50610b526004803603606081101561098157600080fd5b810190808035906020019064010000000081111561099e57600080fd5b8201836020820111156109b057600080fd5b803590602001918460018302840111640100000000831117156109d257600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610a3557600080fd5b820183602082011115610a4757600080fd5b80359060200191846001830284011164010000000083111715610a6957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610acc57600080fd5b820183602082011115610ade57600080fd5b80359060200191846001830284011164010000000083111715610b0057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506110e2565b005b348015610b6057600080fd5b50610c4e60048036036060811015610b7757600080fd5b8101908080359060200190640100000000811115610b9457600080fd5b820183602082011115610ba657600080fd5b80359060200191846001830284011164010000000083111715610bc857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803567ffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611135565b6040518082815260200191505060405180910390f35b348015610c7057600080fd5b50610e0160048036036080811015610c8757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610cc457600080fd5b820183602082011115610cd657600080fd5b80359060200191846001830284011164010000000083111715610cf857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610d5b57600080fd5b820183602082011115610d6d57600080fd5b80359060200191846001830284011164010000000083111715610d8f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061117b565b005b348015610e0f57600080fd5b50610efd60048036036060811015610e2657600080fd5b8101908080359060200190640100000000811115610e4357600080fd5b820183602082011115610e5557600080fd5b80359060200191846001830284011164010000000083111715610e7757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803567ffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506111c7565b6040518082815260200191505060405180910390f35b6000808573ffffffffffffffffffffffffffffffffffffffff16858051906020018667ffffffffffffffff16868082858588d5945050505050905080915050949350505050565b3373ffffffffffffffffffffffffffffffffffffffff1683805190602001848051906020018580838387878ad495505050505050158015610f9f573d6000803e3d6000d15b50505050565b3373ffffffffffffffffffffffffffffffffffffffff168585805190602001868051906020018780519060200188888888888888888888d798505050505050505050158015610ff8573d6000803e3d6000d15b505050505050565b6000808573ffffffffffffffffffffffffffffffffffffffff16858051906020018667ffffffffffffffff16868082858588d6945050505050905080915050949350505050565b8573ffffffffffffffffffffffffffffffffffffffff168585805190602001868051906020018780519060200188888888888888888888d79850505050505050505015801561109a573d6000803e3d6000d15b50505050505050565b3373ffffffffffffffffffffffffffffffffffffffff168263ffffffff16821515808284d2925050501580156110dd573d6000803e3d6000d15b505050565b3373ffffffffffffffffffffffffffffffffffffffff168380519060200184805190602001858051906020018181858589898cd3965050505050505015801561112f573d6000803e3d6000d15b50505050565b6000803373ffffffffffffffffffffffffffffffffffffffff16858051906020018667ffffffffffffffff16868082858588d59450505050509050809150509392505050565b8373ffffffffffffffffffffffffffffffffffffffff1683805190602001848051906020018580838387878ad4955050505050501580156111c0573d6000803e3d6000d15b5050505050565b6000803373ffffffffffffffffffffffffffffffffffffffff16858051906020018667ffffffffffffffff16868082858588d694505050505090508091505093925050505600a165627a7a723058200ef04cabf78c5e8e07ec161162783cdbc3ccdacdc6f9e10828e961030b69a8a00029';
//solidity code: solidity-example/solidity-GatewayTxs.sol

var tagStep = {
    active: 1, deployContract: 2, callContract: 3
}

main();
async function main() {

    let res = await c.connect('ws://192.168.29.115:6005');
    console.log("    connect successfully.")
    c.setRestrict(true);

    let nStep = tagStep.callContract;
  
    if(nStep == tagStep.active ){

        active();
    }else if(nStep == tagStep.deployContract){

        deployContract();
    }else{

        c.as(root);
        myContract = c.contract(JSON.parse(abi), contractAddr);


        try{
               
    //    await accountSet();
    //    await setTransferFee();
    //    await trustSet();
    //    await trustSetContract();
    //    await trustLimit();
    //    await trustLimitContract();
    //    await payCurrency();

          await payCurrencyContract();
          await gatewayBalanceContract();

        }catch(error){

            console.log(error);
            
        }
  
 
        console.log(" end ")
    }



    /**************************************/
}

async function deployContract() {
    c.as(root)
    myContract = c.contract(JSON.parse(abi));
    try {
        let deployRes = await myContract.deploy(
            {
                ContractData: deployBytecode,
            }).submit({
                Gas: '5000000',

            });
        console.log("    deployContract Res:", deployRes);
        if (deployRes.contractAddress != "undefined") {
            console.log("    contractAddress:", deployRes.contractAddress);
        }
    } catch (error) {
        console.log(error);
    }
}

var active = async function () {
    c.as(root);
    var amount = 20000
    console.log("----------- active >>>>>>>>>>>>>");
    let res = await c.pay(userGateway.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   userGateway", userGateway.address, ":", res)
    res = await c.pay(userA.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   userA", userA.address, ":", res)
    res = await c.pay(userB.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   userB", userB.address, ":", res)
    console.log("\n----------- active <<<<<<<<<<<<<");
}

async function accountSet() {
    c.as(userGateway);
  
    try {
        let res = await myContract.methods.accountSet(8, true).submit({
            Gas: 500000,
            expect: "validate_success"
        });

        console.log(" account_set res:", res)

    } catch (error) {
        console.log(error);
    }


}

async function setTransferFee() {
    c.as(userGateway)
    //发交易调用合约
    try {
        let res = await myContract.methods.setTransferFee("1.002", "10","20").submit({
            Gas: 500000,
            expect: "validate_success"
        });
        
        console.log("    setTransferFee res:", res);
    } catch (error) {
        console.log(error);
    }
}

//用户 设置信任网关代币以及代币的额度
async function trustSet() {

	c.as(userA);
	let res = await myContract.methods.trustSet("10000","AAA",userGateway.address).submit({
		Gas: 50000000,
		expect:"validate_success"
    });
        
    console.log(" userA trustSet result:", res);

    c.as(userB);
    res = await myContract.methods.trustSet("10000","AAA",userGateway.address).submit({
		Gas: 50000000,
		expect:"validate_success"
    });
        
    console.log(" userB trustSet result:", res);
}


// 合约 设置信任网关代币以及代币的额度
async function trustSetContract() {

	c.as(userA);
	let res = await myContract.methods.trustSet(contractAddr,"10000","AAA",userGateway.address).submit({
		Gas: 50000000,
		expect:"validate_success"
    });
        
    console.log("  trustSetContract result:", res);
}

//查询网关的信任代币信息，传入代币名称、网关地址、精度，传入0时，nodejs返回小数点前数值，传入1时，返回值乘以10的一次方的结果，传入2时返回乘以10的二次方的结果...
//以此类推，因为solidity的返回值为int类型，不支持浮点
async function trustLimit() {
	c.as(userA);
	//参数：代币名称、额度、网关地址
	let res = await myContract.methods.trustLimit("AAA",0,userGateway.address).call({
		Gas: 50000000
    });
        
    console.log(" userA trustLimit result:", res);



    c.as(userB);
	//参数：代币名称、额度、网关地址
	res = await myContract.methods.trustLimit("AAA",0,userGateway.address).call({
		Gas: 50000000
    });
        
    console.log(" userB trustLimit result:", res);
}

async function trustLimitContract() {
	c.as(userA);
	//参数：合约地址，代币名称，额度，网关地址
	let res = await myContract.methods.trustLimit(contractAddr,"AAA",0,userGateway.address).call({
		Gas: 50000000
    });
        
    console.log("  trustLimitContract result:", res);
}


async function gatewayBalance() {

	c.as(userA);
	let result = await myContract.methods.gatewayBalance("AAA",0,userGateway.address).call({
        Gas: 50000000
    });
        
    console.log("  userA gatewayBalance:", result);

    c.as(userB);
	result = await myContract.methods.gatewayBalance("AAA",0,userGateway.address).call({
        Gas: 50000000
    });
        
    console.log("  userB gatewayBalance:", result);

    result = await myContract.methods.gatewayBalance(contractAddr,"AAA",0,userGateway.address).call({
        Gas: 50000000
    });
        
    console.log("  contractAddr gatewayBalance:", result);
}


async function gatewayBalanceContract() {
	c.as(userA);
	let res = await myContract.methods.gatewayBalance(contractAddr,"AAA",0,userGateway.address).call({
		Gas: 50000000,
		expect:"validate_success"
    });
        
    console.log("  gatewayBalance result:", res);
}


// 普通用户 转账代币
async function payCurrency() {

    c.as(userGateway);
    //转入账户,代币数量,消耗代币的最大值,代币名称,网关地址 
	var  res  = await myContract.methods.pay(userA.address,"500","800","AAA",userGateway.address).submit({
        Gas: 50000000,
        expect:"validate_success"
    });
        
    console.log("  userGateway to userA ", res);

    res  = await myContract.methods.pay(userB.address,"500","800","AAA",userGateway.address).submit({
        Gas: 50000000,
        expect:"validate_success"
    });
        
    console.log("  userGateway to userB ", res);

    c.as(userA);
    res  = await myContract.methods.pay(userB.address,"500","800","AAA",userGateway.address).submit({
        Gas: 50000000,
        expect:"validate_success"
    });
        
    console.log("  userA to userB ", res);

    await gatewayBalance();

}

// 合约 转账代币
async function payCurrencyContract() {
    
    c.as(userGateway);
    let res  = await myContract.methods.pay(contractAddr,"500","800","AAA",userGateway.address).submit({
        Gas: 50000000,
        expect:"validate_success"
    });
    console.log("  userGateway to contractAddr ", res);

    //合约地址,转入账户,代币数量,消耗代币的最大值,代币名称,网关地址 
	res  = await myContract.methods.gatewayPay(contractAddr,userB.address,"50","80","AAA",userGateway.address).submit({
		Gas: 50000000
    });
        
    console.log(" contractAddr to userB ", res);
    res  = await myContract.methods.gatewayPay(contractAddr,userA.address,"50","80","AAA",userGateway.address).submit({
		Gas: 50000000
    });
        
    console.log(" contractAddr to userA ", res);

    await gatewayBalance();
}
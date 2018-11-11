'use strict'
const ChainsqlAPI = require('../src/index').ChainsqlAPI;
const c = new ChainsqlAPI();

var root = {
    secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
    address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
}

var owner = {
    address: "zpMZ2H58HFPB5QTycMGWSXUeF47eA8jyd4",
    secret: "xnnUqirFepEKzVdsoBKkMf577upwT"
}

var user = {
    address: "zKQwdkkzpUQC9haHFEe2EwUsKHvvwwPHsv",
    secret: "xnJn5J5uYz3qnYX72jXkAPVB3ZsER"
}
var userOperation = owner;

var user1 = {
    address: "zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt",
    secret: "xnoHuFw7CcgXD29fv2yi8uGkiqSqm"
}

var grantAddr = "zzzzzzzzzzzzzzzzzzzzBZbvji";
var flag = "{\"insert\":true,\"update\":true,\"delete\":true,\"select\":true}";

var sTableName = "table";
var sTableNameNew = "table_new"
var rawTable = "[ \
    { \"field\": \"id\", \"type\": \"int\" }, \
    { \"field\": \"time\", \"type\": \"datetime\" }, \
    { \"field\": \"txHash\", \"type\": \"varchar\", \"length\": 100 }, \
    { \"field\": \"name\", \"type\": \"varchar\", \"length\": 100 }, \
    { \"field\": \"email\", \"type\": \"varchar\", \"length\": 100 }, \
    { \"field\": \"account\", \"type\": \"varchar\", \"length\": 40 } \
]";

var rawInsert = "[ \
    { \"id\": 1, \"name\": \"zhangsan\", \"email\": \"123\", \"account\": \"zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt\", \"time\": \"2018-10-18 14:31:00\" }, \
    { \"id\": 2, \"name\": \"lisi\", \"email\": \"124\", \"account\": \"zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt\", \"time\": \"2018-10-18 14:31:00\" }, \
    { \"id\": 3, \"name\": \"wangwu\", \"email\": \"125\", \"account\": \"zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt\", \"time\": \"2018-10-18 14:31:00\" }, \
    { \"id\": 4, \"name\": \"zhaoliu\", \"email\": \"126\", \"account\": \"zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt\", \"time\": \"2018-10-18 14:31:00\" } \
]";

var rawDelete = "{\"id\":1}"
var rawUpdate = "{ \"account\": \"134\" }"
var rawGet = "{\"id\": 2}"

var myContract;
const abi = '[{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"insert","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"create","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"rawUpdate","type":"string"},{"name":"rawGet","type":"string"}],"name":"update","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"rawUpdate","type":"string"},{"name":"rawGet","type":"string"}],"name":"update","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"handle","type":"uint256"},{"name":"row","type":"uint256"},{"name":"key","type":"string"}],"name":"getValueByKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"}],"name":"drop","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"insert","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"deletex","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toWho","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"grant","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"}],"name":"sqlTransaction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"tableNameNew","type":"string"}],"name":"rename","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"handle","type":"uint256"}],"name":"getRowSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"handle","type":"uint256"},{"name":"row","type":"uint256"},{"name":"col","type":"uint256"}],"name":"getValueByIndex","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"handle","type":"uint256"}],"name":"getColSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"deletex","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
const deployBytecode = "0x608060405234801561001057600080fd5b50611888806100206000396000f3006080604052600436106100f05763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306e63ff881146100f5578063198e2b8a1461024357806331445f171461037d57806331c3e4561461054e5780633326f2081461070f5780633e10510b146108435780635310b5511461098f5780636c02d69214610a42578063746ecd6914610b8c5780638b0a4ee114610cd657806391025cb114610e2057806399489c2114610ed35780639c7c722b1461101d578063a6d7b59f14611157578063af5bce6e14611181578063e9626e98146111b7578063ea0f5b7a146111e1575b600080fd5b34801561010157600080fd5b5061022f6004803603604081101561011857600080fd5b81019060208101813564010000000081111561013357600080fd5b82018360208201111561014557600080fd5b8035906020019184600183028401116401000000008311171561016757600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092959493602081019350359150506401000000008111156101ba57600080fd5b8201836020820111156101cc57600080fd5b803590602001918460018302840111640100000000831117156101ee57600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955061131b945050505050565b604080519115158252519081900360200190f35b34801561024f57600080fd5b5061022f6004803603604081101561026657600080fd5b81019060208101813564010000000081111561028157600080fd5b82018360208201111561029357600080fd5b803590602001918460018302840111640100000000831117156102b557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561030857600080fd5b82018360208201111561031a57600080fd5b8035906020019184600183028401116401000000008311171561033c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611349945050505050565b34801561038957600080fd5b5061022f600480360360808110156103a057600080fd5b600160a060020a0382351691908101906040810160208201356401000000008111156103cb57600080fd5b8201836020820111156103dd57600080fd5b803590602001918460018302840111640100000000831117156103ff57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561045257600080fd5b82018360208201111561046457600080fd5b8035906020019184600183028401116401000000008311171561048657600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092959493602081019350359150506401000000008111156104d957600080fd5b8201836020820111156104eb57600080fd5b8035906020019184600183028401116401000000008311171561050d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611377945050505050565b34801561055a57600080fd5b5061022f6004803603606081101561057157600080fd5b81019060208101813564010000000081111561058c57600080fd5b82018360208201111561059e57600080fd5b803590602001918460018302840111640100000000831117156105c057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561061357600080fd5b82018360208201111561062557600080fd5b8035906020019184600183028401116401000000008311171561064757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561069a57600080fd5b8201836020820111156106ac57600080fd5b803590602001918460018302840111640100000000831117156106ce57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506113b2945050505050565b34801561071b57600080fd5b506107ce6004803603606081101561073257600080fd5b81359160208101359181019060608101604082013564010000000081111561075957600080fd5b82018360208201111561076b57600080fd5b8035906020019184600183028401116401000000008311171561078d57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506113ec945050505050565b6040805160208082528351818301528351919283929083019185019080838360005b838110156108085781810151838201526020016107f0565b50505050905090810190601f1680156108355780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561084f57600080fd5b5061097d6004803603604081101561086657600080fd5b81019060208101813564010000000081111561088157600080fd5b82018360208201111561089357600080fd5b803590602001918460018302840111640100000000831117156108b557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561090857600080fd5b82018360208201111561091a57600080fd5b8035906020019184600183028401116401000000008311171561093c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611420945050505050565b60408051918252519081900360200190f35b34801561099b57600080fd5b5061022f600480360360208110156109b257600080fd5b8101906020810181356401000000008111156109cd57600080fd5b8201836020820111156109df57600080fd5b80359060200191846001830284011164010000000083111715610a0157600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955061144e945050505050565b348015610a4e57600080fd5b5061022f60048036036060811015610a6557600080fd5b600160a060020a038235169190810190604081016020820135640100000000811115610a9057600080fd5b820183602082011115610aa257600080fd5b80359060200191846001830284011164010000000083111715610ac457600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295949360208101935035915050640100000000811115610b1757600080fd5b820183602082011115610b2957600080fd5b80359060200191846001830284011164010000000083111715610b4b57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611468945050505050565b348015610b9857600080fd5b5061022f60048036036060811015610baf57600080fd5b600160a060020a038235169190810190604081016020820135640100000000811115610bda57600080fd5b820183602082011115610bec57600080fd5b80359060200191846001830284011164010000000083111715610c0e57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295949360208101935035915050640100000000811115610c6157600080fd5b820183602082011115610c7357600080fd5b80359060200191846001830284011164010000000083111715610c9557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611497945050505050565b348015610ce257600080fd5b5061022f60048036036060811015610cf957600080fd5b600160a060020a038235169190810190604081016020820135640100000000811115610d2457600080fd5b820183602082011115610d3657600080fd5b80359060200191846001830284011164010000000083111715610d5857600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295949360208101935035915050640100000000811115610dab57600080fd5b820183602082011115610dbd57600080fd5b80359060200191846001830284011164010000000083111715610ddf57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506114c6945050505050565b348015610e2c57600080fd5b5061022f60048036036020811015610e4357600080fd5b810190602081018135640100000000811115610e5e57600080fd5b820183602082011115610e7057600080fd5b80359060200191846001830284011164010000000083111715610e9257600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506114f8945050505050565b348015610edf57600080fd5b5061097d60048036036060811015610ef657600080fd5b600160a060020a038235169190810190604081016020820135640100000000811115610f2157600080fd5b820183602082011115610f3357600080fd5b80359060200191846001830284011164010000000083111715610f5557600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295949360208101935035915050640100000000811115610fa857600080fd5b820183602082011115610fba57600080fd5b80359060200191846001830284011164010000000083111715610fdc57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506116f3945050505050565b34801561102957600080fd5b5061022f6004803603604081101561104057600080fd5b81019060208101813564010000000081111561105b57600080fd5b82018360208201111561106d57600080fd5b8035906020019184600183028401116401000000008311171561108f57600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092959493602081019350359150506401000000008111156110e257600080fd5b8201836020820111156110f457600080fd5b8035906020019184600183028401116401000000008311171561111657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611722945050505050565b34801561116357600080fd5b5061097d6004803603602081101561117a57600080fd5b5035611750565b34801561118d57600080fd5b506107ce600480360360608110156111a457600080fd5b508035906020810135906040013561175c565b3480156111c357600080fd5b5061097d600480360360208110156111da57600080fd5b5035611787565b3480156111ed57600080fd5b5061022f6004803603604081101561120457600080fd5b81019060208101813564010000000081111561121f57600080fd5b82018360208201111561123157600080fd5b8035906020019184600183028401116401000000008311171561125357600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092959493602081019350359150506401000000008111156112a657600080fd5b8201836020820111156112b857600080fd5b803590602001918460018302840111640100000000831117156112da57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611793945050505050565b600033600160a060020a031683805190602001848051906020018181858588c395505050505050ce92915050565b600033600160a060020a031683805190602001848051906020018181858588c095505050505050ce92915050565b600084600160a060020a03168480519060200185805190602001868051906020018181858589898cc5975050505050505050ce949350505050565b600033600160a060020a03168480519060200185805190602001868051906020018181858589898cc5975050505050505050ce9392505050565b606083838380519060200181818486cf6020018060405190810160405281818585888acc9650505050505050ce9392505050565b600033600160a060020a031683805190602001848051906020018181858588c695505050505050ce92915050565b8051600090339060208401818184c19350505050ce919050565b600083600160a060020a031683805190602001848051906020018181858588c395505050505050ce9392505050565b600083600160a060020a031683805190602001848051906020018181858588c495505050505050ce9392505050565b600033600160a060020a031684848051906020018580519060200181818585888ac79650505050505050ce9392505050565b6000c88151604051339190602085019080609b6117c28239609b019050604051809103908181016040528181858588c09450505050505033600160a060020a03168280519060200160405180807f5b7b226163636f756e74223a227a55343279445733667a466a47576f7364655681526020017f6a566173795073463459486a323234222c20226964223a317d2c207b2261636381526020017f6f756e74223a227a55343279445733667a466a47576f736465566a566173795081526020017f73463459486a323234222c202020226964223a327d5d000000000000000000008152506076019050604051809103908181016040528181858588c39450505050505033600160a060020a03168280519060200160405180807f7b226964223a317d0000000000000000000000000000000000000000000000008152506008019050604051809103908181016040528181858588c49450505050505033600160a060020a03168280519060200160405180807f7b226163636f756e74223a2269643d3d32227d0000000000000000000000000081525060130190506040518091039081810160405260405180807f7b226964223a20327d00000000000000000000000000000000000000000000008152506009019050604051809103908181016040528181858589898cc55050505050505050c99050ce919050565b600083600160a060020a031683805190602001848051906020018181858588c695505050505050ce9392505050565b600033600160a060020a031683805190602001848051906020018181858588c295505050505050ce92915050565b600081ca9050ce919050565b6060838383808284d0602001806040519081016040528181848688cd95505050505050ce9392505050565b600081cb9050ce919050565b600033600160a060020a031683805190602001848051906020018181858588c495505050505050ce9291505056005b7b226669656c64223a226964222c20227479706522203a2022696e74222c20226c656e67746822203a2031312c2022504b22203a20312c20224e4e22203a20312c2022555122203a20317d2c207b20226669656c64223a226163636f756e74222c20227479706522203a20227661726368617222207d2c207b20226669656c64223a22616765222c20227479706522203a2022696e7422207d5da165627a7a72305820b0f3f13a5f8fd9e30e2cd1a517d22871e7cd8de668d15ba9d3cce9d10fcad2780029"
//solidity code: solidity-example/solidity-TableTxs.sol

var tagStep = {
    active: 1, table_create: 2, table_create_operationRule: 3,
    table_rename: 4, table_grant: 5, table_drop: 6,
    table_insert: 7, table_insert_operationRule: 8, table_delete: 9,
    table_update: 10, table_get: 11, table_transaction: 12, deployContract: 13
}

main();
async function main() {
    let res = await c.connect('ws://127.0.0.1:6006');
    console.log("    connect successfully.")
    c.setRestrict(true);


    /**************************************/
    // userOperation = user;
    const contractAddr = "zpFHBA22AU5Nr51VTGnR16PEZDUUcAGXAa";
    let nStep = tagStep.table_transaction;
    // sTableName = sTableNameNew;
    //
    if (nStep != tagStep.active && nStep != tagStep.deployContract) {
        myContract = c.contract(JSON.parse(abi), contractAddr);
    }
    switch (nStep) {
        case tagStep.active: active(); break;
        case tagStep.deployContract: deployContract(); break;
        case tagStep.table_create: table_create(); break;
        case tagStep.table_create_operationRule: table_create_operationRule(); break;
        case tagStep.table_rename: table_rename(); break;
        case tagStep.table_grant: table_grant(); break;
        case tagStep.table_drop: table_drop(); break;
        case tagStep.table_insert: table_insert(); break;
        case tagStep.table_insert_operationRule: table_insert_operationRule(); break;
        case tagStep.table_delete: table_delete(); break;
        case tagStep.table_update: table_update(); break;
        case tagStep.table_get: table_get(); break;
        case tagStep.table_transaction: table_transaction(); break;
        default: break;
    }
    /**************************************/
}

async function deployContract() {
    c.as(owner)
    myContract = c.contract(JSON.parse(abi));
    try {
        let deployRes = await myContract.deploy(
            {
                // ContractValue: "10000000",
                ContractData: deployBytecode,
                Gas: '5000000'
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
    let res = await c.pay(owner.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   owner", owner.address, ":", res)
    res = await c.pay(user.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   user", user.address, ":", res)
    res = await c.pay(user1.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   user1", user1.address, ":", res)
    console.log("\n----------- active <<<<<<<<<<<<<");
}

var table_create = async function () {
    c.as(owner)
    //发交易调用合约
    try {
        myContract.methods.create(sTableName, rawTable).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    CreateTable res:", err) : console.log("    CreateTable res:", res);
        });
        /*
        //不发交易调用合约
        myContract.methods.create(sTableName, rawTable).call({
            Gas: 500000
        }, (err, res) => {
            err ? console.log("    CreateTable res:", err) : console.log("    CreateTable res:", res);
        });
        // */
    } catch (error) {
        console.log(error);
    }
}
var table_create_operationRule = async function () {
    console.log("    no support in this version")
    /*
    c.as(owner)
    var rule = {
        'Insert': {
            'Condition': { 'txHash': '$tx_hash' } //Condition:指定插入操作可设置的默认值
        }
    };
    var option = {
        confidential: false,
        operationRule: rule
    };
    try {
        myContract.methods.create(sTableName, rawTable, option).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    CreateTable operationRule res:", err) : console.log("    CreateTable operationRule res:", res);
        });
    } catch (error) {
        console.log(error);
    }
    // */
}
var table_rename = async function () {
    c.as(owner)
    try {
        myContract.methods.rename(sTableName, sTableNameNew).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    renameTable res:", err) : console.log("    renameTable res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}
var table_grant = async function () {
    c.as(owner)
    try {
        myContract.methods.grant(grantAddr, sTableName, flag).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    grant res:", err) : console.log("    grant res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}
var table_drop = async function () {
    c.as(owner)
    try {
        myContract.methods.drop(sTableName).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    dropTable res:", err) : console.log("    dropTable res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}
var table_insert = async function () {
    c.as(userOperation)
    try {
        if(userOperation.address != owner.address)
        {
            myContract.methods.insert(owner.address, sTableName, rawInsert/*, "txHash"*/).submit({ //no support autoFillField
                Gas: 500000,
                expect: "validate_success"
            }, (err, res) => {
                err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
            });
        }
        else{
            myContract.methods.insert(sTableName, rawInsert/*, "txHash"*/).submit({ //no support autoFillField
                Gas: 500000,
                expect: "validate_success"
            }, (err, res) => {
                err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
            });
        }
    } catch (error) {
        console.log(error);
    }
}
var table_insert_operationRule = async function () {
    console.log("    no support in this version")
    // c.as(userOperation)
    // try {
    //     if(userOperation.address != owner.address)
    //     {
    //         myContract.methods.insert(owner.address, sTableName, rawInsert).submit({ //no support autoFillField
    //             Gas: 500000,
    //             expect: "validate_success"
    //         }, (err, res) => {
    //             err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
    //         });
    //     }
    //     else{
    //         myContract.methods.insert(sTableName, rawInsert).submit({ //no support autoFillField
    //             Gas: 500000,
    //             expect: "validate_success"
    //         }, (err, res) => {
    //             err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
    //         });
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
}
var table_delete = async function () {
    c.as(userOperation)
    try {
        if(userOperation.address != owner.address)
        {
            myContract.methods.deletex(owner.address, sTableName, rawDelete).submit({
                Gas: 500000,
                expect: "validate_success"
            }, (err, res) => {
                err ? console.log("    deletex res:", err) : console.log("    deletex res:", res);
            });
        }
        else{
            myContract.methods.deletex(sTableName, rawDelete).submit({
                Gas: 500000,
                expect: "validate_success"
            }, (err, res) => {
                err ? console.log("    deletex res:", err) : console.log("    deletex res:", res);
            });
        }
    } catch (error) {
        console.log(error);
    }
}
function tableUpdate(i) {
    try {
        var arrayRawUpdate = [
            "{ \"account\": \"update id==2\" }",
            "{ \"account\": \"update email==123\" }",
            "{ \"account\": \"update email == 126 || name == wangwu\" }",
            "{ \"account\": \"update email == 124 && name == lisi\" }",
            // "{ \"account\": \"update all\" }",
        ]
        var arrayRawGet = [
            "{\"id\": 2}",
            "{\"email\": \"123\"}",
            "{ \"email\": \"126\" }, { \"name\": \"wangwu\" }", //{ $or: [{ \"email\": \"126\" }, { \"name\": \"wangwu\" }] }
            "{ \"email\": \"124\" , \"name\": \"lisi\" }", //{ $and: [{ \"email\": \"124\" }, { \"name\": \"lisi\" }] }
            // "",      //C++ dispose 2 avoid update all, so no support update a table without a WHERE that uses a KEY column
        ]
        let length = arrayRawGet.length;
        if (i < length) {
            rawUpdate = arrayRawUpdate[i];
            rawGet = arrayRawGet[i];
            if(userOperation.address != owner.address)
            {
                myContract.methods.update(owner.address, sTableName, rawUpdate, rawGet).submit({
                    Gas: 500000,
                    expect: "validate_success"
                }, (err, res) => {
                    if (err) {
                        console.log("    update", i, err);
                    }
                    else {
                        console.log("    update", i, res);
                        tableUpdate(i + 1);
                    }
                });
            }
            else{
                myContract.methods.update(sTableName, rawUpdate, rawGet).submit({
                    Gas: 500000,
                    expect: "validate_success"
                }, (err, res) => {
                    if (err) {
                        console.log("    update", i, err);
                    }
                    else {
                        console.log("    update", i, res);
                        tableUpdate(i + 1);
                    }
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}
var table_update = async function () {
    c.as(userOperation)
    tableUpdate(0);
}
var table_get = async function () {
    c.as(userOperation)
    try {
        var handle = 0;
        if(userOperation.address != owner.address)
        {
            myContract.methods.get(owner.address, sTableName, "").call((err, handle) => {
                err ? console.log("    get handle err:", err) : console.log("    get handle:", handle);
            });
            handle = await myContract.methods.get(owner.address, sTableName, "").call();
        }
        else
        {
            myContract.methods.get(sTableName, "").call((err, handle) => {
                err ? console.log("    get handle err:", err) : console.log("    get handle:", handle);
            });
            handle = await myContract.methods.get(sTableName, "").call();
        }
        if (handle != 0) {
            var rowSize = await myContract.methods.getRowSize(handle).call();
            var colSize = await myContract.methods.getColSize(handle).call();
            var value = await myContract.methods.getValueByKey(handle, rowSize - 2, "email").call();
            var value1 = await myContract.methods.getValueByIndex(handle, rowSize - 1, colSize - 1).call();
            console.log("    handle:", handle, "rowSize:", rowSize, ";colSize:", colSize, ";id value", value, ";last value", value1);
        }
    } catch (error) {
        console.log(error)
    }
    // myContract.methods.table(sTableName).get().submit();
    // console.log("    all record:", lll);
    // myContract.methods.table(sTableName).get({ $or: [{ email: "123" }, { name: "zhangsan" }] }).submit();
    // console.log("    record (or)", lll);
    // myContract.methods.table(sTableName).get({ name: { $regex: '/s/' } }).submit();
    // console.log("    regex record:", lll);
    // myContract.methods.table(sTableName).get({ name: { $regex: '/s/' } }).withFields(["COUNT(*) as count"]).submit();
    // console.log("    record count:", lll);
    // myContract.methods.table(sTableName).get({ name: { $regex: '/s/' } }).withFields([]).submit();
    // console.log("    record count:", lll);
    // myContract.methods.table(sTableName).get({ name: { $regex: '/s/' } }).limit({ index: 0, total: 1 }).withFields([]).submit();
    // console.log("    record count(limit):", lll);
    // myContract.methods.table(sTableName).get({ name: { $regex: '/s/' } }).withFields(["account"]).submit();
    // console.log("    record with fields:", lll);
}
var table_transaction = async function () {
    c.as(userOperation)
    try {
        myContract.methods.sqlTransaction(sTableName).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    transaction res:", err) : console.log("    transaction res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}


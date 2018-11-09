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
var flag = "{ insert: true, update: true }"

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
const abi = '[{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"insert","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"create","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"rawUpdate","type":"string"},{"name":"rawGet","type":"string"}],"name":"update","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"handle","type":"uint256"},{"name":"row","type":"uint256"},{"name":"key","type":"string"}],"name":"getValueByKey","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"}],"name":"drop","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toWho","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"grant","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"}],"name":"sqlTransaction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"tableNameNew","type":"string"}],"name":"rename","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"handle","type":"uint256"}],"name":"getRowSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"handle","type":"uint256"},{"name":"row","type":"uint256"},{"name":"col","type":"uint256"}],"name":"getValueByIndex","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"handle","type":"uint256"}],"name":"getColSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"deletex","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
const deployBytecode = "0x608060405234801561001057600080fd5b506111e5806100206000396000f3006080604052600436106100c45763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306e63ff881146100c9578063198e2b8a1461021757806331c3e456146103515780633326f208146105125780633e10510b146106465780635310b551146107925780638b0a4ee11461084557806391025cb11461098f5780639c7c722b14610a42578063a6d7b59f14610b7c578063af5bce6e14610ba6578063e9626e9814610bdc578063ea0f5b7a14610c06575b600080fd5b3480156100d557600080fd5b50610203600480360360408110156100ec57600080fd5b81019060208101813564010000000081111561010757600080fd5b82018360208201111561011957600080fd5b8035906020019184600183028401116401000000008311171561013b57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561018e57600080fd5b8201836020820111156101a057600080fd5b803590602001918460018302840111640100000000831117156101c257600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610d40945050505050565b604080519115158252519081900360200190f35b34801561022357600080fd5b506102036004803603604081101561023a57600080fd5b81019060208101813564010000000081111561025557600080fd5b82018360208201111561026757600080fd5b8035906020019184600183028401116401000000008311171561028957600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092959493602081019350359150506401000000008111156102dc57600080fd5b8201836020820111156102ee57600080fd5b8035906020019184600183028401116401000000008311171561031057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610d6e945050505050565b34801561035d57600080fd5b506102036004803603606081101561037457600080fd5b81019060208101813564010000000081111561038f57600080fd5b8201836020820111156103a157600080fd5b803590602001918460018302840111640100000000831117156103c357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561041657600080fd5b82018360208201111561042857600080fd5b8035906020019184600183028401116401000000008311171561044a57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561049d57600080fd5b8201836020820111156104af57600080fd5b803590602001918460018302840111640100000000831117156104d157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610d9c945050505050565b34801561051e57600080fd5b506105d16004803603606081101561053557600080fd5b81359160208101359181019060608101604082013564010000000081111561055c57600080fd5b82018360208201111561056e57600080fd5b8035906020019184600183028401116401000000008311171561059057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610dd6945050505050565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561060b5781810151838201526020016105f3565b50505050905090810190601f1680156106385780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561065257600080fd5b506107806004803603604081101561066957600080fd5b81019060208101813564010000000081111561068457600080fd5b82018360208201111561069657600080fd5b803590602001918460018302840111640100000000831117156106b857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561070b57600080fd5b82018360208201111561071d57600080fd5b8035906020019184600183028401116401000000008311171561073f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610e0a945050505050565b60408051918252519081900360200190f35b34801561079e57600080fd5b50610203600480360360208110156107b557600080fd5b8101906020810181356401000000008111156107d057600080fd5b8201836020820111156107e257600080fd5b8035906020019184600183028401116401000000008311171561080457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610e38945050505050565b34801561085157600080fd5b506102036004803603606081101561086857600080fd5b600160a060020a03823516919081019060408101602082013564010000000081111561089357600080fd5b8201836020820111156108a557600080fd5b803590602001918460018302840111640100000000831117156108c757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929594936020810193503591505064010000000081111561091a57600080fd5b82018360208201111561092c57600080fd5b8035906020019184600183028401116401000000008311171561094e57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610e52945050505050565b34801561099b57600080fd5b50610203600480360360208110156109b257600080fd5b8101906020810181356401000000008111156109cd57600080fd5b8201836020820111156109df57600080fd5b80359060200191846001830284011164010000000083111715610a0157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610e84945050505050565b348015610a4e57600080fd5b5061020360048036036040811015610a6557600080fd5b810190602081018135640100000000811115610a8057600080fd5b820183602082011115610a9257600080fd5b80359060200191846001830284011164010000000083111715610ab457600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295949360208101935035915050640100000000811115610b0757600080fd5b820183602082011115610b1957600080fd5b80359060200191846001830284011164010000000083111715610b3b57600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955061107f945050505050565b348015610b8857600080fd5b5061078060048036036020811015610b9f57600080fd5b50356110ad565b348015610bb257600080fd5b506105d160048036036060811015610bc957600080fd5b50803590602081013590604001356110b9565b348015610be857600080fd5b5061078060048036036020811015610bff57600080fd5b50356110e4565b348015610c1257600080fd5b5061020360048036036040811015610c2957600080fd5b810190602081018135640100000000811115610c4457600080fd5b820183602082011115610c5657600080fd5b80359060200191846001830284011164010000000083111715610c7857600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295949360208101935035915050640100000000811115610ccb57600080fd5b820183602082011115610cdd57600080fd5b80359060200191846001830284011164010000000083111715610cff57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506110f0945050505050565b600033600160a060020a031683805190602001848051906020018181858588c395505050505050ce92915050565b600033600160a060020a031683805190602001848051906020018181858588c095505050505050ce92915050565b600033600160a060020a03168480519060200185805190602001868051906020018181858589898cc5975050505050505050ce9392505050565b606083838380519060200181818486cf6020018060405190810160405281818585888acc9650505050505050ce9392505050565b600033600160a060020a031683805190602001848051906020018181858588c695505050505050ce92915050565b8051600090339060208401818184c19350505050ce919050565b600033600160a060020a031684848051906020018580519060200181818585888ac79650505050505050ce9392505050565b6000c88151604051339190602085019080609b61111f8239609b019050604051809103908181016040528181858588c09450505050505033600160a060020a03168280519060200160405180807f5b7b226163636f756e74223a227a55343279445733667a466a47576f7364655681526020017f6a566173795073463459486a323234222c20226964223a317d2c207b2261636381526020017f6f756e74223a227a55343279445733667a466a47576f736465566a566173795081526020017f73463459486a323234222c202020226964223a327d5d000000000000000000008152506076019050604051809103908181016040528181858588c39450505050505033600160a060020a03168280519060200160405180807f7b226964223a317d0000000000000000000000000000000000000000000000008152506008019050604051809103908181016040528181858588c49450505050505033600160a060020a03168280519060200160405180807f7b226163636f756e74223a2269643d3d32227d0000000000000000000000000081525060130190506040518091039081810160405260405180807f7b226964223a20327d00000000000000000000000000000000000000000000008152506009019050604051809103908181016040528181858589898cc55050505050505050c99050ce919050565b600033600160a060020a031683805190602001848051906020018181858588c295505050505050ce92915050565b600081ca9050ce919050565b6060838383808284d0602001806040519081016040528181848688cd95505050505050ce9392505050565b600081cb9050ce919050565b600033600160a060020a031683805190602001848051906020018181858588c495505050505050ce9291505056005b7b226669656c64223a226964222c20227479706522203a2022696e74222c20226c656e67746822203a2031312c2022504b22203a20312c20224e4e22203a20312c2022555122203a20317d2c207b20226669656c64223a226163636f756e74222c20227479706522203a20227661726368617222207d2c207b20226669656c64223a22616765222c20227479706522203a2022696e7422207d5da165627a7a7230582022f3aeea3dfe6d5bd2bef69cc747cdb342222a8f71f2c6e72907b8652e7f24480029"
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
    const contractAddr = "z4qog3f5LTbnyaTbf8miNBVPr4ryvNhHvj";
    let nStep = tagStep.active;
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
    c.use(owner.address)
    try {
        myContract.methods.insert(sTableName, rawInsert/*, "txHash"*/).submit({ //no support autoFillField
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}
var table_insert_operationRule = async function () {
    console.log("    no support in this version")
    // c.as(userOperation)
    // c.use(owner.address)
    // try {
    //     myContract.methods.insert(sTableName, rawInsert).submit({
    //         Gas: 500000,
    //         expect: "validate_success"
    //     }, (err, res) => {
    //         err ? console.log("    insert operationRule res:", err) : console.log("    insert operationRule res:", res);
    //     });
    // } catch (error) {
    //     console.log(error);
    // }
}
var table_delete = async function () {
    c.as(userOperation)
    c.use(owner.address)
    try {
        myContract.methods.deletex(sTableName, rawDelete).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    deletex res:", err) : console.log("    deletex res:", res);
        });
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
            "{ \"account\": \"update all\" }",
        ]
        var arrayRawGet = [
            "{\"id\": 2}",
            "{\"email\": \"123\"}",
            "{ \"email\": \"126\" }, { \"name\": \"wangwu\" }", //{ $or: [{ \"email\": \"126\" }, { \"name\": \"wangwu\" }] }
            "{ \"email\": \"124\" , \"name\": \"lisi\" }", //{ $and: [{ \"email\": \"124\" }, { \"name\": \"lisi\" }] }
            "",      //C++ dispose 2 avoid update all, so no support update a table without a WHERE that uses a KEY column
        ]
        let length = arrayRawGet.length;
        if (i < length) {
            rawUpdate = arrayRawUpdate[i];
            rawGet = arrayRawGet[i];
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
    } catch (error) {
        console.log(error);
    }
}
var table_update = async function () {
    c.as(userOperation)
    c.use(owner.address)
    tableUpdate(0);
}
var table_get = async function () {
    c.as(userOperation)
    c.use(owner.address)
    try {
        myContract.methods.get(sTableName, "").call((err, handle) => {
            err ? console.log("    get handle err:", err) : console.log("    get handle:", handle);
        });
        var handle = await myContract.methods.get(sTableName, "").call();
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


'use strict'
const ChainsqlAPI = require('../src/index');
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
var userOperation = user;

var user1 = {
    address: "zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt",
    secret: "xnoHuFw7CcgXD29fv2yi8uGkiqSqm"
}

var grantAddr = "zzzzzzzzzzzzzzzzzzzzBZbvji";
var flag = "{\"insert\":true,\"update\":true,\"delete\":true,\"select\":false}";

var sTableName = "table1234";
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
const abi = '[{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"insert","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"create","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"rawUpdate","type":"string"},{"name":"rawGet","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"rawUpdate","type":"string"},{"name":"rawGet","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"}],"name":"drop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"insert","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"deletex","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toWho","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"}],"name":"sqlTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"tableNameNew","type":"string"}],"name":"rename","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"},{"name":"field","type":"string"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"deletex","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
const deployBytecode = '0x608060405234801561001057600080fd5b50611fa1806100206000396000f3006080604052600436106100c5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306e63ff8146100ca578063198e2b8a1461022957806331445f171461038857806331c3e4561461059e5780635310b551146107945780636c02d6921461085c578063746ecd69146109db5780638b0a4ee114610b5a57806391025cb114610cd957806399489c2114610da15780639c7c722b14610f99578063cf22eb59146110f8578063ea0f5b7a14611387575b600080fd5b3480156100d657600080fd5b50610227600480360360408110156100ed57600080fd5b810190808035906020019064010000000081111561010a57600080fd5b82018360208201111561011c57600080fd5b8035906020019184600183028401116401000000008311171561013e57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156101a157600080fd5b8201836020820111156101b357600080fd5b803590602001918460018302840111640100000000831117156101d557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506114e6565b005b34801561023557600080fd5b506103866004803603604081101561024c57600080fd5b810190808035906020019064010000000081111561026957600080fd5b82018360208201111561027b57600080fd5b8035906020019184600183028401116401000000008311171561029d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561030057600080fd5b82018360208201111561031257600080fd5b8035906020019184600183028401116401000000008311171561033457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061152d565b005b34801561039457600080fd5b5061059c600480360360808110156103ab57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156103e857600080fd5b8201836020820111156103fa57600080fd5b8035906020019184600183028401116401000000008311171561041c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561047f57600080fd5b82018360208201111561049157600080fd5b803590602001918460018302840111640100000000831117156104b357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561051657600080fd5b82018360208201111561052857600080fd5b8035906020019184600183028401116401000000008311171561054a57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611574565b005b3480156105aa57600080fd5b50610792600480360360608110156105c157600080fd5b81019080803590602001906401000000008111156105de57600080fd5b8201836020820111156105f057600080fd5b8035906020019184600183028401116401000000008311171561061257600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561067557600080fd5b82018360208201111561068757600080fd5b803590602001918460018302840111640100000000831117156106a957600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561070c57600080fd5b82018360208201111561071e57600080fd5b8035906020019184600183028401116401000000008311171561074057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506115c8565b005b3480156107a057600080fd5b5061085a600480360360208110156107b757600080fd5b81019080803590602001906401000000008111156107d457600080fd5b8201836020820111156107e657600080fd5b8035906020019184600183028401116401000000008311171561080857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061161b565b005b34801561086857600080fd5b506109d96004803603606081101561087f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156108bc57600080fd5b8201836020820111156108ce57600080fd5b803590602001918460018302840111640100000000831117156108f057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561095357600080fd5b82018360208201111561096557600080fd5b8035906020019184600183028401116401000000008311171561098757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611656565b005b3480156109e757600080fd5b50610b58600480360360608110156109fe57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610a3b57600080fd5b820183602082011115610a4d57600080fd5b80359060200191846001830284011164010000000083111715610a6f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610ad257600080fd5b820183602082011115610ae457600080fd5b80359060200191846001830284011164010000000083111715610b0657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061169e565b005b348015610b6657600080fd5b50610cd760048036036060811015610b7d57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610bba57600080fd5b820183602082011115610bcc57600080fd5b80359060200191846001830284011164010000000083111715610bee57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610c5157600080fd5b820183602082011115610c6357600080fd5b80359060200191846001830284011164010000000083111715610c8557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506116e6565b005b348015610ce557600080fd5b50610d9f60048036036020811015610cfc57600080fd5b8101908080359060200190640100000000811115610d1957600080fd5b820183602082011115610d2b57600080fd5b80359060200191846001830284011164010000000083111715610d4d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611731565b005b348015610dad57600080fd5b50610f1e60048036036060811015610dc457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610e0157600080fd5b820183602082011115610e1357600080fd5b80359060200191846001830284011164010000000083111715610e3557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610e9857600080fd5b820183602082011115610eaa57600080fd5b80359060200191846001830284011164010000000083111715610ecc57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506119b8565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610f5e578082015181840152602081019050610f43565b50505050905090810190601f168015610f8b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b348015610fa557600080fd5b506110f660048036036040811015610fbc57600080fd5b8101908080359060200190640100000000811115610fd957600080fd5b820183602082011115610feb57600080fd5b8035906020019184600183028401116401000000008311171561100d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561107057600080fd5b82018360208201111561108257600080fd5b803590602001918460018302840111640100000000831117156110a457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611b95565b005b34801561110457600080fd5b5061130c6004803603608081101561111b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561115857600080fd5b82018360208201111561116a57600080fd5b8035906020019184600183028401116401000000008311171561118c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156111ef57600080fd5b82018360208201111561120157600080fd5b8035906020019184600183028401116401000000008311171561122357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561128657600080fd5b82018360208201111561129857600080fd5b803590602001918460018302840111640100000000831117156112ba57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611bdc565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561134c578082015181840152602081019050611331565b50505050905090810190601f1680156113795780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561139357600080fd5b506114e4600480360360408110156113aa57600080fd5b81019080803590602001906401000000008111156113c757600080fd5b8201836020820111156113d957600080fd5b803590602001918460018302840111640100000000831117156113fb57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561145e57600080fd5b82018360208201111561147057600080fd5b8035906020019184600183028401116401000000008311171561149257600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611cc0565b005b3373ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c3945050505050158015611528573d6000803e3d6000d15b505050565b3373ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c094505050505015801561156f573d6000803e3d6000d15b505050565b8373ffffffffffffffffffffffffffffffffffffffff168380519060200184805190602001858051906020018181858589898cc596505050505050501580156115c1573d6000803e3d6000d15b5050505050565b3373ffffffffffffffffffffffffffffffffffffffff168380519060200184805190602001858051906020018181858589898cc59650505050505050158015611615573d6000803e3d6000d15b50505050565b3373ffffffffffffffffffffffffffffffffffffffff1681805190602001818184c192505050158015611652573d6000803e3d6000d15b5050565b8273ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c3945050505050158015611698573d6000803e3d6000d15b50505050565b8273ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c49450505050501580156116e0573d6000803e3d6000d15b50505050565b3373ffffffffffffffffffffffffffffffffffffffff1683838051906020018480519060200181818585888ac79550505050505015801561172b573d6000803e3d6000d15b50505050565bc83373ffffffffffffffffffffffffffffffffffffffff16818051906020016040518080611edb609b9139609b019050604051809103908181016040528181858588c094505050505015801561178b573d6000803e3d6000d15b503373ffffffffffffffffffffffffffffffffffffffff168180519060200160405180807f5b7b226163636f756e74223a227a55343279445733667a466a47576f7364655681526020017f6a566173795073463459486a323234222c20226964223a317d2c207b2261636381526020017f6f756e74223a227a55343279445733667a466a47576f736465566a566173795081526020017f73463459486a323234222c202020226964223a327d5d000000000000000000008152506076019050604051809103908181016040528181858588c3945050505050158015611874573d6000803e3d6000d15b503373ffffffffffffffffffffffffffffffffffffffff168180519060200160405180807f7b226964223a317d0000000000000000000000000000000000000000000000008152506008019050604051809103908181016040528181858588c49450505050501580156118eb573d6000803e3d6000d15b503373ffffffffffffffffffffffffffffffffffffffff168180519060200160405180807f7b226163636f756e74223a2269643d3d32227d0000000000000000000000000081525060130190506040518091039081810160405260405180807f7b226964223a20327d00000000000000000000000000000000000000000000008152506009019050604051809103908181016040528181858589898cc596505050505050501580156119a1573d6000803e3d6000d15b50c91580156119b4573d6000803e3d6000d15b5050565b606060008473ffffffffffffffffffffffffffffffffffffffff1684805190602001858051906020018181858588c6945050505050905060008114151515611a8e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260308152602001807f476574207461626c652064617461206661696c65642c6d61796265207573657281526020017f206e6f7420617574686f72697a6564210000000000000000000000000000000081525060400191505060405180910390fd5b600081ca9050600082cb9050606060008090505b83811015611b865760008090505b83811015611b37576060868383808284d0602001806040519081016040528181848688cd9450505050509050611ae68482611d07565b9350611b27846040805190810160405280600281526020017f2c20000000000000000000000000000000000000000000000000000000000000815250611d07565b9350508080600101915050611ab0565b50611b77826040805190810160405280600281526020017f3b0a000000000000000000000000000000000000000000000000000000000000815250611d07565b91508080600101915050611aa2565b50809450505050509392505050565b3373ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c2945050505050158015611bd7573d6000803e3d6000d15b505050565b606060008573ffffffffffffffffffffffffffffffffffffffff1685805190602001868051906020018181858588c69450505050509050600081ca9050606060008090505b82811015611cb157606084828880519060200181818486cf6020018060405190810160405281818585888acc955050505050509050611c608382611d07565b9250611ca1836040805190810160405280600181526020017f3b00000000000000000000000000000000000000000000000000000000000000815250611d07565b9250508080600101915050611c21565b50809350505050949350505050565b3373ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c4945050505050158015611d02573d6000803e3d6000d15b505050565b6060808390506060839050606081518351016040519080825280601f01601f191660200182016040528015611d4b5781602001600182028038833980820191505090505b5090506060819050600080905060008090505b8551811015611e11578581815181101515611d7557fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000028383806001019450815181101515611dd457fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611d5e565b5060008090505b8451811015611ecb578481815181101515611e2f57fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000028383806001019450815181101515611e8e57fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611e18565b5081955050505050509291505056005b7b226669656c64223a226964222c20227479706522203a2022696e74222c20226c656e67746822203a2031312c2022504b22203a20312c20224e4e22203a20312c2022555122203a20317d2c207b20226669656c64223a226163636f756e74222c20227479706522203a20227661726368617222207d2c207b20226669656c64223a22616765222c20227479706522203a2022696e7422207d5da165627a7a72305820b7a2d4049e97715b091af0ae9ce63d10aaaf805e9ce2989fa9c3dd705a4f7b950029';
//solidity code: solidity-example/solidity-TableTxs.sol

var tagStep = {
    active: 1, table_create: 2, table_create_operationRule: 3,
    table_rename: 4, table_grant: 5, table_drop: 6,
    table_insert: 7, table_insert_operationRule: 8, table_delete: 9,
    table_update: 10, table_get: 11, table_transaction: 12, deployContract: 13
}

main();
async function main() {
    let res = await c.connect('ws://127.0.0.1:6008');
    console.log("    connect successfully.")
    c.setRestrict(true);


    /**************************************/
    // userOperation = user;
    const contractAddr = "z4ante6noGeYWWNbV6GUBdj78SvY6PTTcC";
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
                ContractData: deployBytecode,
            }).submit({
                Gas: '5000000',
                // ContractValue: "10000000",
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
            expect: "db_success"
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
        if (userOperation.address != owner.address) {
            myContract.methods.insert(owner.address, sTableName, rawInsert/*, "txHash"*/).submit({ //no support autoFillField
                Gas: 500000,
                expect: "db_success"
            }, (err, res) => {
                err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
            });
        }
        else {
            myContract.methods.insert(sTableName, rawInsert/*, "txHash"*/).submit({ //no support autoFillField
                Gas: 500000,
                expect: "db_success"
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
        if (userOperation.address != owner.address) {
            myContract.methods.deletex(owner.address, sTableName, rawDelete).submit({
                Gas: 500000,
                expect: "validate_success"
            }, (err, res) => {
                err ? console.log("    deletex res:", err) : console.log("    deletex res:", res);
            });
        }
        else {
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
            if (userOperation.address != owner.address) {
                myContract.methods.update(owner.address, sTableName, rawUpdate, rawGet).submit({
                    Gas: 500000,
                    expect: "db_success"
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
            else {
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
        myContract.methods.get(owner.address, sTableName, "").call((err, str) => {
            err ? console.log("    get handle err:", err) : console.log("    get:", str);
        });
        var str = await myContract.methods.get(owner.address, sTableName, "", "name").call();
        console.log("    get with field:", str);
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


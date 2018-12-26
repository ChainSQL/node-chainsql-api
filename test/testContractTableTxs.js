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
var userOperation = user;

var user1 = {
    address: "zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt",
    secret: "xnoHuFw7CcgXD29fv2yi8uGkiqSqm"
}

var grantAddr = "zzzzzzzzzzzzzzzzzzzzBZbvji";
var flag = "{\"insert\":true,\"update\":true,\"delete\":true,\"select\":true}";

var sTableName = "table12345";
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
const abi = '[{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"insert","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"create","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"rawUpdate","type":"string"},{"name":"rawGet","type":"string"}],"name":"update","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"rawUpdate","type":"string"},{"name":"rawGet","type":"string"}],"name":"update","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"}],"name":"drop","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"insert","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"deletex","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toWho","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"grant","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"}],"name":"sqlTransaction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"tableNameNew","type":"string"}],"name":"rename","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"},{"name":"field","type":"string"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"deletex","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]';
const deployBytecode = '0x608060405234801561001057600080fd5b50611f42806100206000396000f3006080604052600436106100c5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306e63ff8146100ca578063198e2b8a1461024157806331445f17146103b857806331c3e456146105e65780635310b551146107f45780636c02d692146108d4578063746ecd6914610a6b5780638b0a4ee114610c0257806391025cb114610d9957806399489c2114610e795780639c7c722b14611071578063cf22eb59146111e8578063ea0f5b7a14611477575b600080fd5b3480156100d657600080fd5b50610227600480360360408110156100ed57600080fd5b810190808035906020019064010000000081111561010a57600080fd5b82018360208201111561011c57600080fd5b8035906020019184600183028401116401000000008311171561013e57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156101a157600080fd5b8201836020820111156101b357600080fd5b803590602001918460018302840111640100000000831117156101d557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506115ee565b604051808215151515815260200191505060405180910390f35b34801561024d57600080fd5b5061039e6004803603604081101561026457600080fd5b810190808035906020019064010000000081111561028157600080fd5b82018360208201111561029357600080fd5b803590602001918460018302840111640100000000831117156102b557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561031857600080fd5b82018360208201111561032a57600080fd5b8035906020019184600183028401116401000000008311171561034c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611629565b604051808215151515815260200191505060405180910390f35b3480156103c457600080fd5b506105cc600480360360808110156103db57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561041857600080fd5b82018360208201111561042a57600080fd5b8035906020019184600183028401116401000000008311171561044c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156104af57600080fd5b8201836020820111156104c157600080fd5b803590602001918460018302840111640100000000831117156104e357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561054657600080fd5b82018360208201111561055857600080fd5b8035906020019184600183028401116401000000008311171561057a57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611664565b604051808215151515815260200191505060405180910390f35b3480156105f257600080fd5b506107da6004803603606081101561060957600080fd5b810190808035906020019064010000000081111561062657600080fd5b82018360208201111561063857600080fd5b8035906020019184600183028401116401000000008311171561065a57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156106bd57600080fd5b8201836020820111156106cf57600080fd5b803590602001918460018302840111640100000000831117156106f157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561075457600080fd5b82018360208201111561076657600080fd5b8035906020019184600183028401116401000000008311171561078857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506116ac565b604051808215151515815260200191505060405180910390f35b34801561080057600080fd5b506108ba6004803603602081101561081757600080fd5b810190808035906020019064010000000081111561083457600080fd5b82018360208201111561084657600080fd5b8035906020019184600183028401116401000000008311171561086857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506116f3565b604051808215151515815260200191505060405180910390f35b3480156108e057600080fd5b50610a51600480360360608110156108f757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561093457600080fd5b82018360208201111561094657600080fd5b8035906020019184600183028401116401000000008311171561096857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156109cb57600080fd5b8201836020820111156109dd57600080fd5b803590602001918460018302840111640100000000831117156109ff57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611722565b604051808215151515815260200191505060405180910390f35b348015610a7757600080fd5b50610be860048036036060811015610a8e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610acb57600080fd5b820183602082011115610add57600080fd5b80359060200191846001830284011164010000000083111715610aff57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610b6257600080fd5b820183602082011115610b7457600080fd5b80359060200191846001830284011164010000000083111715610b9657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061175e565b604051808215151515815260200191505060405180910390f35b348015610c0e57600080fd5b50610d7f60048036036060811015610c2557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610c6257600080fd5b820183602082011115610c7457600080fd5b80359060200191846001830284011164010000000083111715610c9657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610cf957600080fd5b820183602082011115610d0b57600080fd5b80359060200191846001830284011164010000000083111715610d2d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061179a565b604051808215151515815260200191505060405180910390f35b348015610da557600080fd5b50610e5f60048036036020811015610dbc57600080fd5b8101908080359060200190640100000000811115610dd957600080fd5b820183602082011115610deb57600080fd5b80359060200191846001830284011164010000000083111715610e0d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506117d9565b604051808215151515815260200191505060405180910390f35b348015610e8557600080fd5b50610ff660048036036060811015610e9c57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610ed957600080fd5b820183602082011115610eeb57600080fd5b80359060200191846001830284011164010000000083111715610f0d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610f7057600080fd5b820183602082011115610f8257600080fd5b80359060200191846001830284011164010000000083111715610fa457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611a10565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561103657808201518184015260208101905061101b565b50505050905090810190601f1680156110635780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561107d57600080fd5b506111ce6004803603604081101561109457600080fd5b81019080803590602001906401000000008111156110b157600080fd5b8201836020820111156110c357600080fd5b803590602001918460018302840111640100000000831117156110e557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561114857600080fd5b82018360208201111561115a57600080fd5b8035906020019184600183028401116401000000008311171561117c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611b4e565b604051808215151515815260200191505060405180910390f35b3480156111f457600080fd5b506113fc6004803603608081101561120b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561124857600080fd5b82018360208201111561125a57600080fd5b8035906020019184600183028401116401000000008311171561127c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156112df57600080fd5b8201836020820111156112f157600080fd5b8035906020019184600183028401116401000000008311171561131357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561137657600080fd5b82018360208201111561138857600080fd5b803590602001918460018302840111640100000000831117156113aa57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611b89565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561143c578082015181840152602081019050611421565b50505050905090810190601f1680156114695780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561148357600080fd5b506115d46004803603604081101561149a57600080fd5b81019080803590602001906401000000008111156114b757600080fd5b8201836020820111156114c957600080fd5b803590602001918460018302840111640100000000831117156114eb57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561154e57600080fd5b82018360208201111561156057600080fd5b8035906020019184600183028401116401000000008311171561158257600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611c6d565b604051808215151515815260200191505060405180910390f35b60003373ffffffffffffffffffffffffffffffffffffffff1683805190602001848051906020018181858588c3945050505050905092915050565b60003373ffffffffffffffffffffffffffffffffffffffff1683805190602001848051906020018181858588c0945050505050905092915050565b60008473ffffffffffffffffffffffffffffffffffffffff168480519060200185805190602001868051906020018181858589898cc596505050505050509050949350505050565b60003373ffffffffffffffffffffffffffffffffffffffff168480519060200185805190602001868051906020018181858589898cc5965050505050505090509392505050565b60003373ffffffffffffffffffffffffffffffffffffffff1682805190602001818184c1925050509050919050565b60008373ffffffffffffffffffffffffffffffffffffffff1683805190602001848051906020018181858588c394505050505090509392505050565b60008373ffffffffffffffffffffffffffffffffffffffff1683805190602001848051906020018181858588c494505050505090509392505050565b60003373ffffffffffffffffffffffffffffffffffffffff1684848051906020018580519060200181818585888ac79550505050505090509392505050565b6000c83373ffffffffffffffffffffffffffffffffffffffff16828051906020016040518080611e7c609b9139609b019050604051809103908181016040528181858588c0945050505050503373ffffffffffffffffffffffffffffffffffffffff168280519060200160405180807f5b7b226163636f756e74223a227a55343279445733667a466a47576f7364655681526020017f6a566173795073463459486a323234222c20226964223a317d2c207b2261636381526020017f6f756e74223a227a55343279445733667a466a47576f736465566a566173795081526020017f73463459486a323234222c202020226964223a327d5d000000000000000000008152506076019050604051809103908181016040528181858588c3945050505050503373ffffffffffffffffffffffffffffffffffffffff168280519060200160405180807f7b226964223a317d0000000000000000000000000000000000000000000000008152506008019050604051809103908181016040528181858588c4945050505050503373ffffffffffffffffffffffffffffffffffffffff168280519060200160405180807f7b226163636f756e74223a2269643d3d32227d0000000000000000000000000081525060130190506040518091039081810160405260405180807f7b226964223a20327d00000000000000000000000000000000000000000000008152506009019050604051809103908181016040528181858589898cc5965050505050505050c99050919050565b606060008473ffffffffffffffffffffffffffffffffffffffff1684805190602001858051906020018181858588c69450505050509050600081ca9050600082cb9050606060008090505b83811015611b3f5760008090505b83811015611af0576060868383808284d0602001806040519081016040528181848688cd9450505050509050611a9f8482611ca8565b9350611ae0846040805190810160405280600281526020017f2c20000000000000000000000000000000000000000000000000000000000000815250611ca8565b9350508080600101915050611a69565b50611b30826040805190810160405280600281526020017f3b0a000000000000000000000000000000000000000000000000000000000000815250611ca8565b91508080600101915050611a5b565b50809450505050509392505050565b60003373ffffffffffffffffffffffffffffffffffffffff1683805190602001848051906020018181858588c2945050505050905092915050565b606060008573ffffffffffffffffffffffffffffffffffffffff1685805190602001868051906020018181858588c69450505050509050600081ca9050606060008090505b82811015611c5e57606084828880519060200181818486cf6020018060405190810160405281818585888acc955050505050509050611c0d8382611ca8565b9250611c4e836040805190810160405280600181526020017f3b00000000000000000000000000000000000000000000000000000000000000815250611ca8565b9250508080600101915050611bce565b50809350505050949350505050565b60003373ffffffffffffffffffffffffffffffffffffffff1683805190602001848051906020018181858588c4945050505050905092915050565b6060808390506060839050606081518351016040519080825280601f01601f191660200182016040528015611cec5781602001600182028038833980820191505090505b5090506060819050600080905060008090505b8551811015611db2578581815181101515611d1657fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000028383806001019450815181101515611d7557fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611cff565b5060008090505b8451811015611e6c578481815181101515611dd057fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000028383806001019450815181101515611e2f57fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611db9565b5081955050505050509291505056005b7b226669656c64223a226964222c20227479706522203a2022696e74222c20226c656e67746822203a2031312c2022504b22203a20312c20224e4e22203a20312c2022555122203a20317d2c207b20226669656c64223a226163636f756e74222c20227479706522203a20227661726368617222207d2c207b20226669656c64223a22616765222c20227479706522203a2022696e7422207d5da165627a7a723058201f44091a75cb3feb15bda0f5ce888419354f43178885035041d87d0c18cdc1dd0029';
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
    const contractAddr = "z97GFzn3pLPPq9iFFda2mMmB94LZrZmZfp";
    let nStep = tagStep.table_update;
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


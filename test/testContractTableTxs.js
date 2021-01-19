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

var smRoot = {
	secret: "p97evg5Rht7ZB7DbEpVqmV3yiSBMxR3pRBKJyLcRWt7SL5gEeBb",
	address: "zN7TwUjJ899xcvNXZkNJ8eFFv2VLKdESsj"	
}

const smUser = {
    secret: "pw5MLePoMLs1DA8y7CgRZWw6NfHik7ZARg8Wp2pr44vVKrpSeUV",
    address: "zKzpkRTZPtsaQ733G8aRRG5x5Z2bTqhGbt",
    publicKey: "pYvKjFb71Qrx26jpfMPAkpN1zfr5WTQoHCpsEtE98ZrBCv2EoxEs4rmWR7DcqTwSwEY81opTgL7pzZ2rZ3948vHi4H23vnY3"
};


var userOperation = user;

var user1 = {
    address: "zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt",
    secret: "xnoHuFw7CcgXD29fv2yi8uGkiqSqm"
}

var grantAddr = "zzzzzzzzzzzzzzzzzzzzBZbvji";
var flag = "{\"insert\":true,\"update\":true,\"delete\":true,\"select\":false}";

var sTableName = "n3";
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

const abi = '[{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"insert","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"}],"name":"sqlTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"create","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"rawUpdate","type":"string"},{"name":"rawGet","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"rawUpdate","type":"string"},{"name":"rawGet","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"}],"name":"drop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"insert","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"deletex","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"toWho","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"tableNameNew","type":"string"}],"name":"rename","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"tableName","type":"string"},{"name":"raw","type":"string"},{"name":"field","type":"string"}],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableName","type":"string"},{"name":"raw","type":"string"}],"name":"deletex","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
const deployBytecode = '0x608060405234801561001057600080fd5b50611f79806100206000396000f3006080604052600436106100c5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306e63ff8146100ca5780630a3cb6e414610229578063198e2b8a1461031157806331445f171461047057806331c3e456146106865780635310b5511461087c5780636c02d69214610944578063746ecd6914610ac35780638b0a4ee114610c4257806399489c2114610dc15780639c7c722b14610fb9578063cf22eb5914611118578063ea0f5b7a146113a7575b600080fd5b3480156100d657600080fd5b50610227600480360360408110156100ed57600080fd5b810190808035906020019064010000000081111561010a57600080fd5b82018360208201111561011c57600080fd5b8035906020019184600183028401116401000000008311171561013e57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156101a157600080fd5b8201836020820111156101b357600080fd5b803590602001918460018302840111640100000000831117156101d557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611506565b005b34801561023557600080fd5b5061030f6004803603604081101561024c57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561028957600080fd5b82018360208201111561029b57600080fd5b803590602001918460018302840111640100000000831117156102bd57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061154d565b005b34801561031d57600080fd5b5061046e6004803603604081101561033457600080fd5b810190808035906020019064010000000081111561035157600080fd5b82018360208201111561036357600080fd5b8035906020019184600183028401116401000000008311171561038557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156103e857600080fd5b8201836020820111156103fa57600080fd5b8035906020019184600183028401116401000000008311171561041c57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061177b565b005b34801561047c57600080fd5b506106846004803603608081101561049357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156104d057600080fd5b8201836020820111156104e257600080fd5b8035906020019184600183028401116401000000008311171561050457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561056757600080fd5b82018360208201111561057957600080fd5b8035906020019184600183028401116401000000008311171561059b57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156105fe57600080fd5b82018360208201111561061057600080fd5b8035906020019184600183028401116401000000008311171561063257600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506117c2565b005b34801561069257600080fd5b5061087a600480360360608110156106a957600080fd5b81019080803590602001906401000000008111156106c657600080fd5b8201836020820111156106d857600080fd5b803590602001918460018302840111640100000000831117156106fa57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561075d57600080fd5b82018360208201111561076f57600080fd5b8035906020019184600183028401116401000000008311171561079157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156107f457600080fd5b82018360208201111561080657600080fd5b8035906020019184600183028401116401000000008311171561082857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611816565b005b34801561088857600080fd5b506109426004803603602081101561089f57600080fd5b81019080803590602001906401000000008111156108bc57600080fd5b8201836020820111156108ce57600080fd5b803590602001918460018302840111640100000000831117156108f057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611869565b005b34801561095057600080fd5b50610ac16004803603606081101561096757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001906401000000008111156109a457600080fd5b8201836020820111156109b657600080fd5b803590602001918460018302840111640100000000831117156109d857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610a3b57600080fd5b820183602082011115610a4d57600080fd5b80359060200191846001830284011164010000000083111715610a6f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506118a4565b005b348015610acf57600080fd5b50610c4060048036036060811015610ae657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610b2357600080fd5b820183602082011115610b3557600080fd5b80359060200191846001830284011164010000000083111715610b5757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610bba57600080fd5b820183602082011115610bcc57600080fd5b80359060200191846001830284011164010000000083111715610bee57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506118ec565b005b348015610c4e57600080fd5b50610dbf60048036036060811015610c6557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610ca257600080fd5b820183602082011115610cb457600080fd5b80359060200191846001830284011164010000000083111715610cd657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610d3957600080fd5b820183602082011115610d4b57600080fd5b80359060200191846001830284011164010000000083111715610d6d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611934565b005b348015610dcd57600080fd5b50610f3e60048036036060811015610de457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190640100000000811115610e2157600080fd5b820183602082011115610e3357600080fd5b80359060200191846001830284011164010000000083111715610e5557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190640100000000811115610eb857600080fd5b820183602082011115610eca57600080fd5b80359060200191846001830284011164010000000083111715610eec57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929050505061197f565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610f7e578082015181840152602081019050610f63565b50505050905090810190601f168015610fab5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b348015610fc557600080fd5b5061111660048036036040811015610fdc57600080fd5b8101908080359060200190640100000000811115610ff957600080fd5b82018360208201111561100b57600080fd5b8035906020019184600183028401116401000000008311171561102d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561109057600080fd5b8201836020820111156110a257600080fd5b803590602001918460018302840111640100000000831117156110c457600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611b69565b005b34801561112457600080fd5b5061132c6004803603608081101561113b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561117857600080fd5b82018360208201111561118a57600080fd5b803590602001918460018302840111640100000000831117156111ac57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561120f57600080fd5b82018360208201111561122157600080fd5b8035906020019184600183028401116401000000008311171561124357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156112a657600080fd5b8201836020820111156112b857600080fd5b803590602001918460018302840111640100000000831117156112da57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611bb0565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561136c578082015181840152602081019050611351565b50505050905090810190601f1680156113995780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156113b357600080fd5b50611504600480360360408110156113ca57600080fd5b81019080803590602001906401000000008111156113e757600080fd5b8201836020820111156113f957600080fd5b8035906020019184600183028401116401000000008311171561141b57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561147e57600080fd5b82018360208201111561149057600080fd5b803590602001918460018302840111640100000000831117156114b257600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050611d33565b005b3373ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c3945050505050158015611548573d6000803e3d6000d15b505050565bc88173ffffffffffffffffffffffffffffffffffffffff168180519060200160405180807f5b7b226163636f756e74223a227a55343279445733667a466a47576f7364655681526020017f6a566173795073463459486a323234222c20226964223a317d2c207b2261636381526020017f6f756e74223a227a55343279445733667a466a47576f736465566a566173795081526020017f73463459486a323234222c202020226964223a327d5d000000000000000000008152506076019050604051809103908181016040528181858588c3945050505050158015611636573d6000803e3d6000d15b508173ffffffffffffffffffffffffffffffffffffffff168180519060200160405180807f7b226964223a317d0000000000000000000000000000000000000000000000008152506008019050604051809103908181016040528181858588c49450505050501580156116ad573d6000803e3d6000d15b508173ffffffffffffffffffffffffffffffffffffffff168180519060200160405180807f7b226163636f756e74223a2269643d3d32227d0000000000000000000000000081525060130190506040518091039081810160405260405180807f7b226964223a20327d00000000000000000000000000000000000000000000008152506009019050604051809103908181016040528181858589898cc59650505050505050158015611763573d6000803e3d6000d15b50c9158015611776573d6000803e3d6000d15b505050565b3373ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c09450505050501580156117bd573d6000803e3d6000d15b505050565b8373ffffffffffffffffffffffffffffffffffffffff168380519060200184805190602001858051906020018181858589898cc5965050505050505015801561180f573d6000803e3d6000d15b5050505050565b3373ffffffffffffffffffffffffffffffffffffffff168380519060200184805190602001858051906020018181858589898cc59650505050505050158015611863573d6000803e3d6000d15b50505050565b3373ffffffffffffffffffffffffffffffffffffffff1681805190602001818184c1925050501580156118a0573d6000803e3d6000d15b5050565b8273ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c39450505050501580156118e6573d6000803e3d6000d15b50505050565b8273ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c494505050505015801561192e573d6000803e3d6000d15b50505050565b3373ffffffffffffffffffffffffffffffffffffffff1683838051906020018480519060200181818585888ac795505050505050158015611979573d6000803e3d6000d15b50505050565b606060008473ffffffffffffffffffffffffffffffffffffffff1684805190602001858051906020018181858588c6945050505050905060008114151515611a55576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260308152602001807f476574207461626c652064617461206661696c65642c6d61796265207573657281526020017f206e6f7420617574686f72697a6564210000000000000000000000000000000081525060400191505060405180910390fd5b600081ca9050600082cb9050606060008090505b83811015611b5a5760008090505b83811015611b0b576060868383808284d0602001806040519081016040528181848688cd9450505050509050611aad8482611d7a565b93506001850382141515611afd57611afa846040805190810160405280600281526020017f2c20000000000000000000000000000000000000000000000000000000000000815250611d7a565b93505b508080600101915050611a77565b50611b4b826040805190810160405280600281526020017f3b0a000000000000000000000000000000000000000000000000000000000000815250611d7a565b91508080600101915050611a69565b50809450505050509392505050565b3373ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c2945050505050158015611bab573d6000803e3d6000d15b505050565b606060008573ffffffffffffffffffffffffffffffffffffffff1685805190602001868051906020018181858588c6945050505050905060008114151515611c86576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260308152602001807f476574207461626c652064617461206661696c65642c6d61796265207573657281526020017f206e6f7420617574686f72697a6564210000000000000000000000000000000081525060400191505060405180910390fd5b600081ca9050606060008090505b82811015611d2457606084828880519060200181818486cf6020018060405190810160405281818585888acc955050505050509050611cd38382611d7a565b9250611d14836040805190810160405280600181526020017f3b00000000000000000000000000000000000000000000000000000000000000815250611d7a565b9250508080600101915050611c94565b50809350505050949350505050565b3373ffffffffffffffffffffffffffffffffffffffff1682805190602001838051906020018181858588c4945050505050158015611d75573d6000803e3d6000d15b505050565b6060808390506060839050606081518351016040519080825280601f01601f191660200182016040528015611dbe5781602001600182028038833980820191505090505b5090506060819050600080905060008090505b8551811015611e84578581815181101515611de857fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000028383806001019450815181101515611e4757fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611dd1565b5060008090505b8451811015611f3e578481815181101515611ea257fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000028383806001019450815181101515611f0157fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053508080600101915050611e8b565b508195505050505050929150505600a165627a7a723058208b20fb88ba248a768795bdfa5965f60013dcd97a4301932345ddd45829cee2100029'

//solidity code: solidity-example/solidity-TableTxs.sol

var tagStep = {
    active: 1, table_create: 2, table_create_operationRule: 3,
    table_rename: 4, table_grant: 5, table_drop: 6,
    table_insert: 7, table_insert_operationRule: 8, table_delete: 9,
    table_update: 10, table_get: 11, table_transaction: 12, deployContract: 13
}

var smRoot = {
	secret: "p97evg5Rht7ZB7DbEpVqmV3yiSBMxR3pRBKJyLcRWt7SL5gEeBb",
	address: "zN7TwUjJ899xcvNXZkNJ8eFFv2VLKdESsj",
	publicKey: 'pYvWhW4azFwanovo5MhL71j5PyTWSJi2NVurPYUrE9UYaSVLp29RhtxxQB7xeGvFmdjbtKRzBQ4g9bCW5hjBQSeb7LePMwFM'
}


main();
async function main() {

    var wsAddress = 'ws://192.168.29.118:6006';
    let res = await c.connect(wsAddress);
    console.log("    connect successfully.")
    c.setRestrict(true);


    let res2 = await c.getTableAuth(smRoot.address,sTableName);
    console.log( JSON.stringify(res2));

    /**************************************/
    // userOperation = user;
    const contractAddr = "zGAcwQoo5xqHKy42waq9d2Tb6Myn2MyvJf";
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
    c.as(smRoot)
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
    c.as(smRoot);
    var amount = 20000
    console.log("----------- active >>>>>>>>>>>>>");
    let res = await c.pay(smUser.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   owner", smUser.address, ":", res)
    // res = await c.pay(user.address, amount).submit({ expect: 'validate_success' })
    // console.log("\n   user", user.address, ":", res)
    // res = await c.pay(user1.address, amount).submit({ expect: 'validate_success' })
    // console.log("\n   user1", user1.address, ":", res)
    // console.log("\n----------- active <<<<<<<<<<<<<");
}

var table_create = async function () {
    c.as(smRoot)
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
    c.as(smRoot)
    try {
        myContract.methods.grant(smUser.address, sTableName, flag).submit({
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
    c.as(smUser)
    try {
      //  if (userOperation.address != owner.address) {
            myContract.methods.insert(smRoot.address, sTableName, rawInsert/*, "txHash"*/).submit({ //no support autoFillField
                Gas: 5000000,
                expect: "db_success"
            }, (err, res) => {
                err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
            });
        // }
        // else {
        //     myContract.methods.insert(sTableName, rawInsert/*, "txHash"*/).submit({ //no support autoFillField
        //         Gas: 500000,
        //         expect: "db_success"
        //     }, (err, res) => {
        //         err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
        //     });
        // }
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
    c.as(owner)
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
    c.as(smUser)
    c.use(smRoot.address)
    try {
        myContract.methods.sqlTransaction(smRoot.address,sTableName).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    transaction res:", err) : console.log("    transaction res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}


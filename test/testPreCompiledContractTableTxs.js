'use strict'
const ChainsqlAPI = require('../src/index');
const c = new ChainsqlAPI();

var root = {
    secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
    address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
}

var issuer = {
    secret: "xncmqYJG4P9iyaYUf6T81GHs9W1kn",
    address: "zU42yDW3fzFjGWosdeVjVasyPsF4YHj224"
}

var user = {
    address: "zpMZ2H58HFPB5QTycMGWSXUeF47eA8jyd4",
    secret: "xnnUqirFepEKzVdsoBKkMf577upwT"
}

var flag = "{\"insert\":true,\"update\":true,\"delete\":true,\"select\":false}";

var sTableName = "n9";
var sTableNameNew = "n4"
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
var autoFillField = "dddd";

var myContract;

const abi = '[{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"stateMutability":"payable","type":"constructor"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"create","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"createByContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"deletex","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"deletexByContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"}],"name":"drop","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"}],"name":"dropByContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"get","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"},{"internalType":"string","name":"field","type":"string"}],"name":"get","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"},{"internalType":"string","name":"field","type":"string"}],"name":"getByContract","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"getByContract","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"toWho","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"grant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"toWho","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"grantByContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"insert","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"insertByContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"},{"internalType":"string","name":"autoFillField","type":"string"}],"name":"insertHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"},{"internalType":"string","name":"autoFillField","type":"string"}],"name":"insertHashByContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"tableNameNew","type":"string"}],"name":"rename","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"tableNameNew","type":"string"}],"name":"renameByContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"}],"name":"sqlTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"rawUpdate","type":"string"},{"internalType":"string","name":"rawGet","type":"string"}],"name":"update","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"rawUpdate","type":"string"},{"internalType":"string","name":"rawGet","type":"string"}],"name":"updateByContract","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
// Bytecode 一定要加0x 
const deployBytecode = '0x6080604052604051620016f3380380620016f383398101604081905262000026916200012f565b600080546001600160a01b031916611001908117909155604051636236be8d60e01b8152636236be8d90620000629085908590600401620001c7565b600060405180830381600087803b1580156200007d57600080fd5b505af115801562000092573d6000803e3d6000fd5b50505050505062000242565b600082601f830112620000b057600080fd5b81516001600160401b0380821115620000cd57620000cd6200022c565b604051601f8301601f19908116603f01168101908282118183101715620000f857620000f86200022c565b816040528381528660208588010111156200011257600080fd5b62000125846020830160208901620001f9565b9695505050505050565b600080604083850312156200014357600080fd5b82516001600160401b03808211156200015b57600080fd5b62000169868387016200009e565b935060208501519150808211156200018057600080fd5b506200018f858286016200009e565b9150509250929050565b60008151808452620001b3816020860160208601620001f9565b601f01601f19169290920160200192915050565b604081526000620001dc604083018562000199565b8281036020840152620001f0818562000199565b95945050505050565b60005b8381101562000216578181015183820152602001620001fc565b8381111562000226576000848401525b50505050565b634e487b7160e01b600052604160045260246000fd5b6114a180620002526000396000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c80636c02d692116100b857806391025cb11161007c57806391025cb11461027157806399489c21146102845780639c7c722b14610297578063b24ab465146102aa578063cf22eb59146102bd578063f5ad5c85146102d057600080fd5b80636c02d69214610212578063746ecd69146102255780638b0a4ee1146102385780638d5df8021461024b5780638f44bd6a1461025e57600080fd5b80633a396228116100ff5780633a396228146101b3578063411304cb146101c65780635310b551146101d95780636236be8d146101ec5780636687a78d146101ff57600080fd5b8063023e38c41461013c57806313157a5514610151578063198e2b8a146101645780631ad5321a1461017757806331445f17146101a0575b600080fd5b61014f61014a366004611190565b6102e3565b005b61014f61015f3660046110ba565b61034b565b61014f610172366004611190565b6103b9565b61018a6101853660046110ba565b6103eb565b604051610197919061136e565b60405180910390f35b61014f6101ae3660046110ba565b61054e565b61014f6101c1366004611046565b610584565b61018a6101d4366004611046565b6105ef565b61014f6101e7366004611153565b61078d565b61014f6101fa366004611190565b6107f2565b61014f61020d366004611046565b610824565b61014f610220366004611046565b610858565b61014f610233366004611046565b61088c565b61014f610246366004611046565b6108bf565b61014f6102593660046110ba565b6108f3565b61014f61026c3660046110ba565b610929565b61014f61027f366004611153565b61095f565b61018a610292366004611046565b610c1b565b61014f6102a5366004611190565b610db9565b61014f6102b8366004611046565b610deb565b61018a6102cb3660046110ba565b610e1f565b61014f6102de366004611153565b610f6d565b60005460405163247f351560e01b81526001600160a01b039091169063247f3515906103159085908590600401611388565b600060405180830381600087803b15801561032f57600080fd5b505af1158015610343573d6000803e3d6000fd5b505050505050565b6000546040516313157a5560e01b81526001600160a01b03909116906313157a5590610381908790879087908790600401611319565b600060405180830381600087803b15801561039b57600080fd5b505af11580156103af573d6000803e3d6000fd5b5050505050505050565b60005460405163fc8b4adf60e01b81526001600160a01b039091169063fc8b4adf906103159085908590600401611388565b60008054604051632f4c2ce760e01b8152606092916001600160a01b031690632f4c2ce790610422908990899089906004016112d9565b60206040518083038186803b15801561043a57600080fd5b505afa15801561044e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061047291906111f4565b90508061049a5760405162461bcd60e51b8152600401610491906113b6565b60405180910390fd5b600081ca60408051602081019091526000808252919250905b8281101561054257600084828880519060200181818486cf6020018060405190810160405281818585888acc95505050505050905082816040516020016104fb929190611239565b60405160208183030381529060405292508260405160200161051d9190611268565b604051602081830303815290604052925050808061053a9061144d565b9150506104b3565b50979650505050505050565b6000546040516331445f1760e01b81526001600160a01b03909116906331445f1790610381908790879087908790600401611319565b6000546040516307472c4560e31b81526001600160a01b0390911690633a396228906105b8908690869086906004016112d9565b600060405180830381600087803b1580156105d257600080fd5b505af11580156105e6573d6000803e3d6000fd5b50505050505050565b60008054604051632f4c2ce760e01b8152606092916001600160a01b031690632f4c2ce790610626908890889088906004016112d9565b60206040518083038186803b15801561063e57600080fd5b505afa158015610652573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061067691906111f4565b9050806106955760405162461bcd60e51b8152600401610491906113b6565b600081ca9050600082cb60408051602081019091526000808252919250905b838110156105425760005b83811015610757576000868383808284d0602001806040519081016040528181848688cd945050505050905083816040516020016106fe929190611239565b60408051601f19818403018152919052935061071b600186611406565b82146107445783604051602001610732919061128d565b60405160208183030381529060405293505b508061074f8161144d565b9150506106bf565b508160405160200161076991906112b3565b604051602081830303815290604052915080806107859061144d565b9150506106b4565b6000546040516318454c0760e11b81526001600160a01b039091169063308a980e906107bd90849060040161136e565b600060405180830381600087803b1580156107d757600080fd5b505af11580156107eb573d6000803e3d6000fd5b5050505050565b600054604051636236be8d60e01b81526001600160a01b0390911690636236be8d906103159085908590600401611388565b600054604051630351a46360e61b81526001600160a01b039091169063d46918c0906105b8908690869086906004016112d9565b6000546040516336016b4960e11b81526001600160a01b0390911690636c02d692906105b8908690869086906004016112d9565b600054604051626c6cf160e31b81526001600160a01b03909116906303636788906105b8908690869086906004016112d9565b600054604051638b0a4ee160e01b81526001600160a01b0390911690638b0a4ee1906105b8908690869086906004016112d9565b600054604051631bf4faa160e01b81526001600160a01b0390911690631bf4faa190610381908790879087908790600401611319565b6000546040516312641bad60e31b81526001600160a01b0390911690639320dd6890610381908790879087908790600401611319565bc8336001600160a01b031681805190602001604051610a39907f5b7b226669656c64223a226964222c20227479706522203a2022696e74222c2081527f226c656e67746822203a2031312c2022504b22203a20312c20224e4e22203a2060208201527f312c2022555122203a20317d2c207b20226669656c64223a226163636f756e7460408201527f222c20227479706522203a20227661726368617222207d2c207b20226669656c60608201527f64223a22616765222c20227479706522203a2022696e7422207d5d00000000006080820152609b0190565b604051809103908181016040528181858588c0945050505050158015610a63573d6000803e3d6000d15b50336001600160a01b031681805190602001604051610b10907f5b7b226163636f756e74223a227a55343279445733667a466a47576f7364655681527f6a566173795073463459486a323234222c20226964223a317d2c207b2261636360208201527f6f756e74223a227a55343279445733667a466a47576f736465566a566173795060408201527573463459486a323234222c202020226964223a327d5d60501b606082015260760190565b604051809103908181016040528181858588c3945050505050158015610b3a573d6000803e3d6000d15b508051604051677b226964223a317d60c01b81523391906020840190600801604051809103908181016040528181858588c4945050505050158015610b83573d6000803e3d6000d15b508051604051727b226163636f756e74223a2269643d3d32227d60681b8152339190602084019060130160405180910390818101604052604051610bd690687b226964223a20327d60b81b815260090190565b604051809103908181016040528181858589898cc59650505050505050158015610c04573d6000803e3d6000d15b50c9158015610c17573d6000803e3d6000d15b5050565b600080546040516355b54bf560e11b8152606092916001600160a01b03169063ab6a97ea90610c52908890889088906004016112d9565b60206040518083038186803b158015610c6a57600080fd5b505afa158015610c7e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca291906111f4565b905080610cc15760405162461bcd60e51b8152600401610491906113b6565b600081ca9050600082cb60408051602081019091526000808252919250905b838110156105425760005b83811015610d83576000868383808284d0602001806040519081016040528181848688cd94505050505090508381604051602001610d2a929190611239565b60408051601f198184030181529190529350610d47600186611406565b8214610d705783604051602001610d5e919061128d565b60405160208183030381529060405293505b5080610d7b8161144d565b915050610ceb565b5081604051602001610d9591906112b3565b60405160208183030381529060405291508080610db19061144d565b915050610ce0565b600054604051634e8f306d60e11b81526001600160a01b0390911690639d1e60da906103159085908590600401611388565b60005460405163b24ab46560e01b81526001600160a01b039091169063b24ab465906105b8908690869086906004016112d9565b600080546040516355b54bf560e11b8152606092916001600160a01b03169063ab6a97ea90610e56908990899089906004016112d9565b60206040518083038186803b158015610e6e57600080fd5b505afa158015610e82573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ea691906111f4565b905080610ec55760405162461bcd60e51b8152600401610491906113b6565b600081ca60408051602081019091526000808252919250905b8281101561054257600084828880519060200181818486cf6020018060405190810160405281818585888acc9550505050505090508281604051602001610f26929190611239565b604051602081830303815290604052925082604051602001610f489190611268565b6040516020818303038152906040529250508080610f659061144d565b915050610ede565b6000546040516357a78d9f60e11b81526001600160a01b039091169063af4f1b3e906107bd90849060040161136e565b80356001600160a01b0381168114610fb457600080fd5b919050565b600082601f830112610fca57600080fd5b813567ffffffffffffffff80821115610fe557610fe561147e565b604051601f8301601f19908116603f0116810190828211818310171561100d5761100d61147e565b8160405283815286602085880101111561102657600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060006060848603121561105b57600080fd5b61106484610f9d565b9250602084013567ffffffffffffffff8082111561108157600080fd5b61108d87838801610fb9565b935060408601359150808211156110a357600080fd5b506110b086828701610fb9565b9150509250925092565b600080600080608085870312156110d057600080fd5b6110d985610f9d565b9350602085013567ffffffffffffffff808211156110f657600080fd5b61110288838901610fb9565b9450604087013591508082111561111857600080fd5b61112488838901610fb9565b9350606087013591508082111561113a57600080fd5b5061114787828801610fb9565b91505092959194509250565b60006020828403121561116557600080fd5b813567ffffffffffffffff81111561117c57600080fd5b61118884828501610fb9565b949350505050565b600080604083850312156111a357600080fd5b823567ffffffffffffffff808211156111bb57600080fd5b6111c786838701610fb9565b935060208501359150808211156111dd57600080fd5b506111ea85828601610fb9565b9150509250929050565b60006020828403121561120657600080fd5b5051919050565b6000815180845261122581602086016020860161141d565b601f01601f19169290920160200192915050565b6000835161124b81846020880161141d565b83519083019061125f81836020880161141d565b01949350505050565b6000825161127a81846020870161141d565b603b60f81b920191825250600101919050565b6000825161129f81846020870161141d565b61016160f51b920191825250600201919050565b600082516112c581846020870161141d565b611d8560f11b920191825250600201919050565b6001600160a01b03841681526060602082018190526000906112fd9083018561120d565b828103604084015261130f818561120d565b9695505050505050565b6001600160a01b038516815260806020820181905260009061133d9083018661120d565b828103604084015261134f818661120d565b90508281036060840152611363818561120d565b979650505050505050565b602081526000611381602083018461120d565b9392505050565b60408152600061139b604083018561120d565b82810360208401526113ad818561120d565b95945050505050565b60208082526030908201527f476574207461626c652064617461206661696c65642c6d61796265207573657260408201526f206e6f7420617574686f72697a65642160801b606082015260800190565b60008282101561141857611418611468565b500390565b60005b83811015611438578181015183820152602001611420565b83811115611447576000848401525b50505050565b600060001982141561146157611461611468565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea164736f6c6343000805000a';
const contractAddr = "zJ6s4T2zLtFBTjZqnLZfN1cuoCWPqfdEsa";
//solidity code:

var tagStep = {
    active: 1, table_create: 2, table_create_operationRule: 3,
    table_rename: 4, table_grant: 5, table_drop: 6,
    table_insert: 7, table_insert_operationRule: 8, table_delete: 9,
    table_update: 10, table_get: 11, table_transaction: 12, deployContract: 13,
    table_insert_hash: 14
}


main();
async function main() {

   // var wsAddress = 'ws://localhost:5510';
   var wsAddress = 'ws://10.100.0.78:25510';
    let res = await c.connect(wsAddress);
    console.log("    connect successfully.")
    c.setRestrict(true);

    let isContract = true;
    let nStep = tagStep.table_insert;

    if (nStep != tagStep.deployContract) {
        myContract = c.contract(JSON.parse(abi), contractAddr);
    }
    if(isContract){
        switch (nStep) {
            case tagStep.deployContract: deployContract(); break;
            case tagStep.table_create: table_create_by_contract(); break;
            case tagStep.table_rename: table_rename_by_contract(); break;
            case tagStep.table_grant: table_grant_by_contract(); break;
            case tagStep.table_drop: drop_by_contract(); break;
            case tagStep.table_insert: table_insert_by_contract(); break;
            case tagStep.table_insert_hash: table_insert_hash_by_contract(); break;
            case tagStep.table_delete: table_delete_by_contract(); break;
            case tagStep.table_update: table_update_by_contract(); break;
            case tagStep.table_get: table_get_by_contract(); break;
            default: break;
        }
    }else{
        switch (nStep) {
            case tagStep.table_create: table_create(); break;
            case tagStep.table_rename: table_rename(); break;
            case tagStep.table_grant: table_grant(); break;
            case tagStep.table_drop: drop(); break;
            case tagStep.table_insert: table_insert(); break;
            case tagStep.table_insert_hash: table_insert_hash(); break;
            case tagStep.table_delete: table_delete(); break;
            case tagStep.table_update: table_update(); break;
            case tagStep.table_get: table_get(); break;
            default: break;
        }
    }
   
    /**************************************/
}

 //合约部署并创建表,同时给合约地址转足够的ZXC，否则部署失败
async function deployContract() {
    c.as(user)
    myContract = c.contract(JSON.parse(abi));
    try {
        let deployRes = await myContract.deploy(
            {
                ContractData: deployBytecode,
                arguments:[sTableName,rawTable],
            }).submit({
                Gas: '3000000',
                ContractValue: "90000000",
            });
        console.log("deployContract Res:", deployRes);
        if (deployRes.contractAddress != "undefined") {
            console.log("contractAddress:", deployRes.contractAddress);
        }
    } catch (error) {
        console.log(error);
    }
}

// 给合约地址创建表
var table_create_by_contract = async function () {
    c.as(user)
    //发交易调用合约
    try {
        myContract.methods.createByContract(sTableNameNew, rawTable).submit({
            Gas: 500000,
            expect: "db_success"
        }, (err, res) => {
            err ? console.log("    CreateTable res:", err) : console.log("    CreateTable res:", res);
        });
    
    } catch (error) {
        console.log(error);
    }
}

// 删除合约地址的表
var drop_by_contract = async function () {
    c.as(user)
    //发交易调用合约
    try {
        myContract.methods.dropByContract(sTableName).submit({
            Gas: 500000,
            expect: "db_success"
        }, (err, res) => {
            err ? console.log("    CreateTable res:", err) : console.log("    CreateTable res:", res);
        });
    
    } catch (error) {
        console.log(error);
    }
}

var table_rename_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.renameByContract(sTableName, sTableNameNew).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    renameTable res:", err) : console.log("    renameTable res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var table_insert_by_contract = async function () {
    c.as(user)
    try {
            myContract.methods.insertByContract(contractAddr, sTableName, rawInsert).submit({ 
                Gas: 5000000,
                expect: "db_success"
            }, (err, res) => {
                err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
            });
    } catch (error) {
        console.log(error);
    }
}

var table_grant_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.grantByContract(user.address, sTableName, flag).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("grant res:", err) : console.log("grant res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var table_insert_hash_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.insertHashByContract(contractAddr, sTableName, rawInsert,autoFillField).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("grant res:", err) : console.log("grant res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var table_delete_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.deletexByContract(contractAddr, sTableName, rawDelete).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    deletex res:", err) : console.log("    deletex res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var table_update_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.updateByContract(contractAddr, sTableName, rawUpdate, rawGet).submit({
            Gas: 500000,
            expect: "db_success"
        }, (err, res) => {
            if (err) {
                console.log("    update", err);
            }
            else {
                console.log("    update", res);
            }
        });
    } catch (error) {
    console.log(error);
    }
}
var table_get_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.getByContract(contractAddr, sTableName, "").call((err, str) => {
            err ? console.log("    get handle err:", err) : console.log("    get:", str);
        });
        var str = await myContract.methods.getByContract(contractAddr, sTableName, "", "name").call();
        console.log("    get with field:", str);
        //var raw = "[[],{\"id\":\"2\"}]";
        //var raw = "[[],{\"$or\":[{\"email\":\"126\"}, {\"name\": \"zhangsan\"}]}]";
        var raw = "[[],{\"name\": { \"$regex\": \"/wangwu/\" }}]";
        var str = await myContract.methods.getByContract(contractAddr, sTableName, raw).call((err, str) => {
            err ? console.log("    get handle err:", err) : console.log("    get:", str);
        });
        var str = await myContract.methods.getByContract(contractAddr, sTableName, raw, "time").call();
        console.log("get with field:", str);

    } catch (error) {
        console.log(error)
    }
    }

var table_create = async function () {
    c.as(user)
    //发交易调用合约
    try {
        myContract.methods.create(sTableName, rawTable).submit({
            Gas: 300000,
            expect: "db_success"
        }, (err, res) => {
            err ? console.log("    CreateTable res:", err) : console.log("    CreateTable res:", res);
        });
    
    } catch (error) {
        console.log(error);
    }
}


var drop = async function () {
    c.as(user)
    //发交易调用合约
    try {
        myContract.methods.drop(sTableName).submit({
            Gas: 500000,
            expect: "db_success"
        }, (err, res) => {
            err ? console.log("    CreateTable res:", err) : console.log("    CreateTable res:", res);
        });
    
    } catch (error) {
        console.log(error);
    }
}

var table_rename = async function () {
    c.as(user)
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

var table_insert = async function () {
    c.as(user)
    try {
            myContract.methods.insert(user.address, sTableName, rawInsert).submit({ 
                Gas: 5000000,
                expect: "db_success"
            }, (err, res) => {
                err ? console.log("    insert res:", err) : console.log("    dropTable res:", res);
            });
    } catch (error) {
        console.log(error);
    }
}

var table_grant = async function () {
    c.as(user)
    try {
        myContract.methods.grant(user.address, sTableName, flag).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("grant res:", err) : console.log("grant res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var table_insert_hash = async function () {
    c.as(user)
    try {
        myContract.methods.insertHash(user.address, sTableName, rawInsert,autoFillField).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("grant res:", err) : console.log("grant res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var table_delete = async function () {
    c.as(user)
    try {
        myContract.methods.deletex(user.address, sTableName, rawDelete).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("    deletex res:", err) : console.log("    deletex res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var table_update = async function () {
    c.as(user)
    try {
        myContract.methods.update(user.address, sTableName, rawUpdate, rawGet).submit({
            Gas: 500000,
            expect: "db_success"
        }, (err, res) => {
            if (err) {
                console.log("    update", err);
            }
            else {
                console.log("    update", res);
            }
        });
    } catch (error) {
    console.log(error);
    }
}
var table_get = async function () {
    c.as(user)
    try {
        myContract.methods.get(user.address, sTableName, "").call((err, str) => {
            err ? console.log("    get handle err:", err) : console.log("    get:", str);
        });
        var str = await myContract.methods.get(user.address, sTableName, "", "name").call();
        console.log("    get with field:", str);
        //var raw = "[[],{\"id\":\"2\"}]";
        //var raw = "[[],{\"$or\":[{\"email\":\"126\"}, {\"name\": \"zhangsan\"}]}]";
        var raw = "[[],{\"name\": { \"$regex\": \"/wangwu/\" }}]";
        var str = await myContract.methods.get(user.address, sTableName, raw).call((err, str) => {
            err ? console.log("    get handle err:", err) : console.log("    get:", str);
        });
        var str = await myContract.methods.get(user.address, sTableName, raw, "time").call();
        console.log("get with field:", str);

    } catch (error) {
        console.log(error)
    }
    }




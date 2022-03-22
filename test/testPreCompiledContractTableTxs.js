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

var flag = "[{\"insert\":true,\"update\":true,\"delete\":true,\"select\":false}]";

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

var rawDelete = "[{\"id\":1}]"
var rawUpdate = "[{ \"account\": \"134\" },{\"id\": 2}]"
var autoFillField = "txHash";
var rawAddFeild = "[{\"field\":\"age\",\"type\":\"int\"}]";
var rawDeleteFeild = "[{\"field\":\"age\"}]";
var rawModifyFeild = "[{\"field\":\"age\",\"type\":\"varchar\",\"length\":10}]";
var rawCreateIndex = "[{\"index\":\"AcctLgrIndex\"},{\"field\":\"email\"},{\"field\":\"Account\"}]";
var rawDeleteIndex = "[{\"index\":\"AcctLgrIndex\"}]";



var myContract;

const abi = '[{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"addFields","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x76d878ee"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"addFieldsByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xde5c3865"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"create","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x198e2b8a"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"createByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x6236be8d"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"createIndex","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xff1cc4c6"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"createIndexByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x04e850a7"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"deleteFields","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xe6920507"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"deleteFieldsByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x8d0f1a80"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"deleteIndex","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xc52a8734"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"deleteIndexByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x6219f697"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"deletex","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x746ecd69"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"deletexByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x6687a78d"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"}],"name":"drop","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x5310b551"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"}],"name":"dropByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xf5ad5c85"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"get","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","signature":"0x99489c21"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"},{"internalType":"string","name":"field","type":"string"}],"name":"get","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","signature":"0xcf22eb59"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"},{"internalType":"string","name":"field","type":"string"}],"name":"getByContract","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","signature":"0x1ad5321a"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"getByContract","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","signature":"0x411304cb"},{"inputs":[{"internalType":"address","name":"toWho","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"grant","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x8b0a4ee1"},{"inputs":[{"internalType":"address","name":"toWho","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"grantByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x3a396228"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"insert","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x6c02d692"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"insertByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xb24ab465"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"},{"internalType":"string","name":"autoFillField","type":"string"}],"name":"insertHash","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x8d5df802"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"},{"internalType":"string","name":"autoFillField","type":"string"}],"name":"insertHashByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x8f44bd6a"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"modifyFields","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0xd618613a"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"modifyFieldsByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x6d63892c"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"tableNameNew","type":"string"}],"name":"rename","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x9c7c722b"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"tableNameNew","type":"string"}],"name":"renameByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x023e38c4"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"}],"name":"sqlTransaction","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x91025cb1"},{"inputs":[{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"stateMutability":"payable","type":"constructor","signature":"constructor"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"update","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x30945443"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"rawUpdate","type":"string"},{"internalType":"string","name":"rawGet","type":"string"}],"name":"update","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x31445f17"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"rawUpdate","type":"string"},{"internalType":"string","name":"rawGet","type":"string"}],"name":"updateByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x13157a55"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"tableName","type":"string"},{"internalType":"string","name":"raw","type":"string"}],"name":"updateByContract","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x2a0aaaac"},{"stateMutability":"payable","type":"receive"}]';
// Bytecode 一定要加0x 
const deployBytecode = '0x608060405260405162001c8838038062001c8883398101604081905262000026916200012f565b600080546001600160a01b031916611001908117909155604051636236be8d60e01b8152636236be8d90620000629085908590600401620001c7565b600060405180830381600087803b1580156200007d57600080fd5b505af115801562000092573d6000803e3d6000fd5b50505050505062000242565b600082601f830112620000b057600080fd5b81516001600160401b0380821115620000cd57620000cd6200022c565b604051601f8301601f19908116603f01168101908282118183101715620000f857620000f86200022c565b816040528381528660208588010111156200011257600080fd5b62000125846020830160208901620001f9565b9695505050505050565b600080604083850312156200014357600080fd5b82516001600160401b03808211156200015b57600080fd5b62000169868387016200009e565b935060208501519150808211156200018057600080fd5b506200018f858286016200009e565b9150509250929050565b60008151808452620001b3816020860160208601620001f9565b601f01601f19169290920160200192915050565b604081526000620001dc604083018562000199565b8281036020840152620001f0818562000199565b95945050505050565b60005b8381101562000216578181015183820152602001620001fc565b8381111562000226576000848401525b50505050565b634e487b7160e01b600052604160045260246000fd5b611a3680620002526000396000f3fe6080604052600436106101da5760003560e01c8063746ecd69116101015780639c7c722b1161009a578063d618613a1161006c578063d618613a14610579578063de5c386514610599578063e6920507146105b9578063f5ad5c85146105d9578063ff1cc4c6146105f957005b80639c7c722b146104f9578063b24ab46514610519578063c52a873414610539578063cf22eb591461055957005b80638d5df802116100d35780638d5df802146104795780638f44bd6a1461049957806391025cb1146104b957806399489c21146104d957005b8063746ecd69146103f957806376d878ee146104195780638b0a4ee1146104395780638d0f1a801461045957005b80633a396228116101735780636236be8d116101455780636236be8d146103795780636687a78d146103995780636c02d692146103b95780636d63892c146103d957005b80633a396228146102f9578063411304cb146103195780635310b551146103395780636219f6971461035957005b80631ad5321a116101ac5780631ad5321a146102635780632a0aaaac1461029957806330945443146102b957806331445f17146102d957005b8063023e38c4146101e357806304e850a71461020357806313157a5514610223578063198e2b8a1461024357005b366101e157005b005b3480156101ef57600080fd5b506101e16101fe366004611725565b610619565b34801561020f57600080fd5b506101e161021e366004611725565b610681565b34801561022f57600080fd5b506101e161023e36600461164f565b6106b3565b34801561024f57600080fd5b506101e161025e366004611725565b610721565b34801561026f57600080fd5b5061028361027e36600461164f565b610753565b6040516102909190611903565b60405180910390f35b3480156102a557600080fd5b506101e16102b43660046115db565b6108b6565b3480156102c557600080fd5b506101e16102d43660046115db565b610921565b3480156102e557600080fd5b506101e16102f436600461164f565b610955565b34801561030557600080fd5b506101e16103143660046115db565b61098b565b34801561032557600080fd5b506102836103343660046115db565b6109bf565b34801561034557600080fd5b506101e16103543660046116e8565b610b5d565b34801561036557600080fd5b506101e1610374366004611725565b610bc2565b34801561038557600080fd5b506101e1610394366004611725565b610bf4565b3480156103a557600080fd5b506101e16103b43660046115db565b610c26565b3480156103c557600080fd5b506101e16103d43660046115db565b610c5a565b3480156103e557600080fd5b506101e16103f4366004611725565b610c8e565b34801561040557600080fd5b506101e16104143660046115db565b610cc0565b34801561042557600080fd5b506101e1610434366004611725565b610cf3565b34801561044557600080fd5b506101e16104543660046115db565b610d25565b34801561046557600080fd5b506101e1610474366004611725565b610d59565b34801561048557600080fd5b506101e161049436600461164f565b610d8b565b3480156104a557600080fd5b506101e16104b436600461164f565b610dc1565b3480156104c557600080fd5b506101e16104d43660046116e8565b610df7565b3480156104e557600080fd5b506102836104f43660046115db565b6110b3565b34801561050557600080fd5b506101e1610514366004611725565b611251565b34801561052557600080fd5b506101e16105343660046115db565b611283565b34801561054557600080fd5b506101e1610554366004611725565b6112b7565b34801561056557600080fd5b5061028361057436600461164f565b6112e9565b34801561058557600080fd5b506101e1610594366004611725565b611437565b3480156105a557600080fd5b506101e16105b4366004611725565b611469565b3480156105c557600080fd5b506101e16105d4366004611725565b61149b565b3480156105e557600080fd5b506101e16105f43660046116e8565b6114cd565b34801561060557600080fd5b506101e1610614366004611725565b6114fd565b60005460405163247f351560e01b81526001600160a01b039091169063247f35159061064b908590859060040161191d565b600060405180830381600087803b15801561066557600080fd5b505af1158015610679573d6000803e3d6000fd5b505050505050565b6000546040516304e850a760e01b81526001600160a01b03909116906304e850a79061064b908590859060040161191d565b6000546040516313157a5560e01b81526001600160a01b03909116906313157a55906106e99087908790879087906004016118ae565b600060405180830381600087803b15801561070357600080fd5b505af1158015610717573d6000803e3d6000fd5b5050505050505050565b60005460405163fc8b4adf60e01b81526001600160a01b039091169063fc8b4adf9061064b908590859060040161191d565b60008054604051632f4c2ce760e01b8152606092916001600160a01b031690632f4c2ce79061078a9089908990899060040161186e565b60206040518083038186803b1580156107a257600080fd5b505afa1580156107b6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107da9190611789565b9050806108025760405162461bcd60e51b81526004016107f99061194b565b60405180910390fd5b600081ca60408051602081019091526000808252919250905b828110156108aa57600084828880519060200181818486cf6020018060405190810160405281818585888acc95505050505050905082816040516020016108639291906117ce565b60405160208183030381529060405292508260405160200161088591906117fd565b60405160208183030381529060405292505080806108a2906119e2565b91505061081b565b50979650505050505050565b600054604051630a82aaab60e21b81526001600160a01b0390911690632a0aaaac906108ea9086908690869060040161186e565b600060405180830381600087803b15801561090457600080fd5b505af1158015610918573d6000803e3d6000fd5b50505050505050565b600054604051633094544360e01b81526001600160a01b03909116906330945443906108ea9086908690869060040161186e565b6000546040516331445f1760e01b81526001600160a01b03909116906331445f17906106e99087908790879087906004016118ae565b6000546040516307472c4560e31b81526001600160a01b0390911690633a396228906108ea9086908690869060040161186e565b60008054604051632f4c2ce760e01b8152606092916001600160a01b031690632f4c2ce7906109f69088908890889060040161186e565b60206040518083038186803b158015610a0e57600080fd5b505afa158015610a22573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a469190611789565b905080610a655760405162461bcd60e51b81526004016107f99061194b565b600081ca9050600082cb60408051602081019091526000808252919250905b838110156108aa5760005b83811015610b27576000868383808284d0602001806040519081016040528181848688cd94505050505090508381604051602001610ace9291906117ce565b60408051601f198184030181529190529350610aeb60018661199b565b8214610b145783604051602001610b029190611822565b60405160208183030381529060405293505b5080610b1f816119e2565b915050610a8f565b5081604051602001610b399190611848565b60405160208183030381529060405291508080610b55906119e2565b915050610a84565b6000546040516318454c0760e11b81526001600160a01b039091169063308a980e90610b8d908490600401611903565b600060405180830381600087803b158015610ba757600080fd5b505af1158015610bbb573d6000803e3d6000fd5b5050505050565b600054604051636219f69760e01b81526001600160a01b0390911690636219f6979061064b908590859060040161191d565b600054604051636236be8d60e01b81526001600160a01b0390911690636236be8d9061064b908590859060040161191d565b600054604051630351a46360e61b81526001600160a01b039091169063d46918c0906108ea9086908690869060040161186e565b6000546040516336016b4960e11b81526001600160a01b0390911690636c02d692906108ea9086908690869060040161186e565b600054604051631b58e24b60e21b81526001600160a01b0390911690636d63892c9061064b908590859060040161191d565b600054604051626c6cf160e31b81526001600160a01b03909116906303636788906108ea9086908690869060040161186e565b600054604051633b6c3c7760e11b81526001600160a01b03909116906376d878ee9061064b908590859060040161191d565b600054604051638b0a4ee160e01b81526001600160a01b0390911690638b0a4ee1906108ea9086908690869060040161186e565b60005460405163011a1e3560e71b81526001600160a01b0390911690638d0f1a809061064b908590859060040161191d565b600054604051631bf4faa160e01b81526001600160a01b0390911690631bf4faa1906106e99087908790879087906004016118ae565b6000546040516312641bad60e31b81526001600160a01b0390911690639320dd68906106e99087908790879087906004016118ae565bc8336001600160a01b031681805190602001604051610ed1907f5b7b226669656c64223a226964222c20227479706522203a2022696e74222c2081527f226c656e67746822203a2031312c2022504b22203a20312c20224e4e22203a2060208201527f312c2022555122203a20317d2c207b20226669656c64223a226163636f756e7460408201527f222c20227479706522203a20227661726368617222207d2c207b20226669656c60608201527f64223a22616765222c20227479706522203a2022696e7422207d5d00000000006080820152609b0190565b604051809103908181016040528181858588c0945050505050158015610efb573d6000803e3d6000d15b50336001600160a01b031681805190602001604051610fa8907f5b7b226163636f756e74223a227a55343279445733667a466a47576f7364655681527f6a566173795073463459486a323234222c20226964223a317d2c207b2261636360208201527f6f756e74223a227a55343279445733667a466a47576f736465566a566173795060408201527573463459486a323234222c202020226964223a327d5d60501b606082015260760190565b604051809103908181016040528181858588c3945050505050158015610fd2573d6000803e3d6000d15b508051604051677b226964223a317d60c01b81523391906020840190600801604051809103908181016040528181858588c494505050505015801561101b573d6000803e3d6000d15b508051604051727b226163636f756e74223a2269643d3d32227d60681b815233919060208401906013016040518091039081810160405260405161106e90687b226964223a20327d60b81b815260090190565b604051809103908181016040528181858589898cc5965050505050505015801561109c573d6000803e3d6000d15b50c91580156110af573d6000803e3d6000d15b5050565b600080546040516355b54bf560e11b8152606092916001600160a01b03169063ab6a97ea906110ea9088908890889060040161186e565b60206040518083038186803b15801561110257600080fd5b505afa158015611116573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061113a9190611789565b9050806111595760405162461bcd60e51b81526004016107f99061194b565b600081ca9050600082cb60408051602081019091526000808252919250905b838110156108aa5760005b8381101561121b576000868383808284d0602001806040519081016040528181848688cd945050505050905083816040516020016111c29291906117ce565b60408051601f1981840301815291905293506111df60018661199b565b821461120857836040516020016111f69190611822565b60405160208183030381529060405293505b5080611213816119e2565b915050611183565b508160405160200161122d9190611848565b60405160208183030381529060405291508080611249906119e2565b915050611178565b600054604051634e8f306d60e11b81526001600160a01b0390911690639d1e60da9061064b908590859060040161191d565b60005460405163b24ab46560e01b81526001600160a01b039091169063b24ab465906108ea9086908690869060040161186e565b60005460405163314aa1cd60e21b81526001600160a01b039091169063c52a87349061064b908590859060040161191d565b600080546040516355b54bf560e11b8152606092916001600160a01b03169063ab6a97ea906113209089908990899060040161186e565b60206040518083038186803b15801561133857600080fd5b505afa15801561134c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113709190611789565b90508061138f5760405162461bcd60e51b81526004016107f99061194b565b600081ca60408051602081019091526000808252919250905b828110156108aa57600084828880519060200181818486cf6020018060405190810160405281818585888acc95505050505050905082816040516020016113f09291906117ce565b60405160208183030381529060405292508260405160200161141291906117fd565b604051602081830303815290604052925050808061142f906119e2565b9150506113a8565b600054604051636b0c309d60e11b81526001600160a01b039091169063d618613a9061064b908590859060040161191d565b60005460405163de5c386560e01b81526001600160a01b039091169063de5c38659061064b908590859060040161191d565b60005460405163e692050760e01b81526001600160a01b039091169063e69205079061064b908590859060040161191d565b6000546040516357a78d9f60e11b81526001600160a01b039091169063af4f1b3e90610b8d908490600401611903565b600054604051600162719d9d60e11b031981526001600160a01b039091169063ff1cc4c69061064b908590859060040161191d565b80356001600160a01b038116811461154957600080fd5b919050565b600082601f83011261155f57600080fd5b813567ffffffffffffffff8082111561157a5761157a611a13565b604051601f8301601f19908116603f011681019082821181831017156115a2576115a2611a13565b816040528381528660208588010111156115bb57600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806000606084860312156115f057600080fd5b6115f984611532565b9250602084013567ffffffffffffffff8082111561161657600080fd5b6116228783880161154e565b9350604086013591508082111561163857600080fd5b506116458682870161154e565b9150509250925092565b6000806000806080858703121561166557600080fd5b61166e85611532565b9350602085013567ffffffffffffffff8082111561168b57600080fd5b6116978883890161154e565b945060408701359150808211156116ad57600080fd5b6116b98883890161154e565b935060608701359150808211156116cf57600080fd5b506116dc8782880161154e565b91505092959194509250565b6000602082840312156116fa57600080fd5b813567ffffffffffffffff81111561171157600080fd5b61171d8482850161154e565b949350505050565b6000806040838503121561173857600080fd5b823567ffffffffffffffff8082111561175057600080fd5b61175c8683870161154e565b9350602085013591508082111561177257600080fd5b5061177f8582860161154e565b9150509250929050565b60006020828403121561179b57600080fd5b5051919050565b600081518084526117ba8160208601602086016119b2565b601f01601f19169290920160200192915050565b600083516117e08184602088016119b2565b8351908301906117f48183602088016119b2565b01949350505050565b6000825161180f8184602087016119b2565b603b60f81b920191825250600101919050565b600082516118348184602087016119b2565b61016160f51b920191825250600201919050565b6000825161185a8184602087016119b2565b611d8560f11b920191825250600201919050565b6001600160a01b0384168152606060208201819052600090611892908301856117a2565b82810360408401526118a481856117a2565b9695505050505050565b6001600160a01b03851681526080602082018190526000906118d2908301866117a2565b82810360408401526118e481866117a2565b905082810360608401526118f881856117a2565b979650505050505050565b60208152600061191660208301846117a2565b9392505050565b60408152600061193060408301856117a2565b828103602084015261194281856117a2565b95945050505050565b60208082526030908201527f476574207461626c652064617461206661696c65642c6d61796265207573657260408201526f206e6f7420617574686f72697a65642160801b606082015260800190565b6000828210156119ad576119ad6119fd565b500390565b60005b838110156119cd5781810151838201526020016119b5565b838111156119dc576000848401525b50505050565b60006000198214156119f6576119f66119fd565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea164736f6c6343000805000a';
const contractAddr = "zJ6s4T2zLtFBTjZqnLZfN1cuoCWPqfdEsa";
//solidity code:

var tagStep = {
    active: 1, table_create: 2, table_create_operationRule: 3,
    table_rename: 4, table_grant: 5, table_drop: 6,
    table_insert: 7, table_insert_operationRule: 8, table_delete: 9,
    table_update: 10, table_get: 11, table_transaction: 12, deployContract: 13,
    table_insert_hash: 14, add_fields: 15, delete_fields: 16, modify_fields: 17,
    create_index: 18, delete_index:19
}


main();
async function main() {

   var wsAddress = 'ws://localhost:6006';
//    var wsAddress = 'ws://10.100.0.78:6006';
    let res = await c.connect(wsAddress);
    console.log("    connect successfully.")
    c.setRestrict(true);

    let isContract = true;
    let nStep = tagStep.create_index;

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
            case tagStep.add_fields: add_fields_by_contract(); break;
			case tagStep.delete_fields: delete_fields_by_contract(); break;
			case tagStep.modify_fields: modify_fields_by_contract(); break;
			case tagStep.create_index: create_index_by_contract(); break;
			case tagStep.delete_index: delete_index_by_contract(); break;
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
            case tagStep.add_fields: add_fields(); break;
			case tagStep.delete_fields: delete_fields(); break;
			case tagStep.modify_fields: modify_fields(); break;
			case tagStep.create_index: create_index(); break;
			case tagStep.delete_index: delete_index(); break;
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
            err ? console.log("    dropTable res:", err) : console.log("    dropTable res:", res);
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
                err ? console.log("    insert res:", err) : console.log("    insertTable res:", res);
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
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
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
        myContract.methods.updateByContract(contractAddr, sTableName, rawUpdate).submit({
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

var add_fields_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.addFieldsByContract(sTableName, rawAddFeild).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var delete_fields_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.deleteFieldsByContract(sTableName, rawDeleteFeild).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var modify_fields_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.modifyFieldsByContract(sTableName, rawModifyFeild).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var create_index_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.createIndexByContract(sTableName, rawCreateIndex).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var delete_index_by_contract = async function () {
    c.as(user)
    try {
        myContract.methods.deleteIndexByContract(sTableName, rawDeleteIndex).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
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
            err ? console.log("    dropTable res:", err) : console.log("    dropTable res:", res);
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
                err ? console.log("    insert res:", err) : console.log("    insertTable res:", res);
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
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
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
        myContract.methods.update(user.address, sTableName, rawUpdate).submit({
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

    
var add_fields = async function () {
    c.as(user)
    try {
        myContract.methods.addFields(sTableName, rawAddFeild).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var delete_fields = async function () {
    c.as(user)
    try {
        myContract.methods.deleteFields(sTableName, rawDeleteFeild).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var modify_fields = async function () {
    c.as(user)
    try {
        myContract.methods.modifyFields(sTableName, rawModifyFeild).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var create_index = async function () {
    c.as(user)
    try {
        myContract.methods.createIndex(sTableName, rawCreateIndex).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}

var delete_index = async function () {
    c.as(user)
    try {
        myContract.methods.deleteIndex(sTableName, rawDeleteIndex).submit({
            Gas: 500000,
            expect: "validate_success"
        }, (err, res) => {
            err ? console.log("insert_hash res:", err) : console.log("insert_hash res:", res);
        });
    } catch (error) {
        console.log(error);
    }
}




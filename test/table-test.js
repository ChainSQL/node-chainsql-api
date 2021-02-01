'use strict' // eslint-disable-line strict

const assert = require('assert')
const ChainsqlAPI = require('../src/index');
const { exit } = require('process');

const c = new ChainsqlAPI();

var user = {
	secret: "xxeJcpbcFyGTFCxiGjeDEw1RCimFQ",
	address: "z44fybVuUn8jZxZRHpc3pJ62KQJgSEjzjk",
	publicKey: "cB4MLVsyn5MnoYHhApEyGtPCuEf9PAGDopmpB7yFwTbhUtzrjRRT"
}

var ed25519Root = {
	secret: "xEdTsZdgjNGe1bJ2VLn22Yyz2wJSzny",
	address: "z9UgyKDdJWzzu37U7zKuwTEdWDjXhcNMWo"	
}

var owner = {
 	secret:  "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
 	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"	
 }

var sm2Root = {
	secret: "p97evg5Rht7ZB7DbEpVqmV3yiSBMxR3pRBKJyLcRWt7SL5gEeBb",
	address: "zN7TwUjJ899xcvNXZkNJ8eFFv2VLKdESsj"	
}

const smUser = {
    secret: "pw5MLePoMLs1DA8y7CgRZWw6NfHik7ZARg8Wp2pr44vVKrpSeUV",
    address: "zKzpkRTZPtsaQ733G8aRRG5x5Z2bTqhGbt",
    publicKey: "pYvKjFb71Qrx26jpfMPAkpN1zfr5WTQoHCpsEtE98ZrBCv2EoxEs4rmWR7DcqTwSwEY81opTgL7pzZ2rZ3948vHi4H23vnY3"
};


var grantAddr = "zzzzzzzzzzzzzzzzzzzzBZbvji";

var sTableName             = "n1";
var sConfidentialTableName = "table_jm2";
var sOperRuleTableName     = "table_hjkz";

var wsAddress = 'ws://192.168.29.69:5003';


var raw = [
    {'field':'id','type':'int','length':11,'PK':1,'NN':1,'default':''},
    {'field':'name','type':'varchar','length':50,'default':null},
    {'field':'age','type':'int'}
];


describe('table', () => {

    it('init', async function(){
        await c.connect(wsAddress);
        c.as(sm2Root);
    })

    it('create table', async function(){

        var option = {
            confidential: false
        };
        let rs = await c.createTable(sTableName, raw, option).submit({expect:'db_success'});
        assert.equal(rs.status,'db_success')     
    })


    it('insert', async function(){
        var insertRaw = [
            {'id':11,'age': 333,'name':'hello'},
            {'id':22,'age': 444,'name':'sss'},
            {'id':33,'age': 555,'name':'rrr'}
        ];
        var rs = await c.table(sTableName).insert(insertRaw).submit({expect:'db_success'});
        assert.equal(rs.status,'db_success')  	
    })  

    it('update', async function(){
        var rs = await c.table(sTableName).get({'id': 2}).update({'age':200}).submit({expect:'db_success'});	
        assert.equal(rs.status,'db_success')
    })  


    it('test grant', async function(){

        var flag = { insert: true, update: true }    
        let rs = await c.grant(sTableName, smUser.address, flag,smUser.publicKey).submit({ expect: 'db_success' });
        assert.equal(rs.status,'db_success')   
    }) 

    it('test insert after grant', async function(){

        c.as(smUser);
        c.use(sm2Root.address);
        var raw = [
            {'id':34,'age': 333,'name':'hello'},
            {'id':35,'age': 444,'name':'sss'},
            {'id':36,'age': 555,'name':'rrr'}
        ]
        var rs = await c.table(sTableName).insert(raw).submit({expect:'db_success'});
        assert.equal(rs.status,'db_success')   
    }) 

    it('delete', async function(){
        // 切换回原来的账户
        c.as(sm2Root);
        var rs = await c.table(sTableName).get({'id': 3}).delete().submit({expect:'db_success'});
        assert.equal(rs.status,'db_success')
    })

    it('drop', async function(){

        // 切换回原来的账户
        c.as(sm2Root);
        var rs =await c.dropTable(sTableName).submit({ expect: 'db_success' });
        assert.equal(rs.status,'db_success')
    })


    // it('create confidential', async function(){
    //     var raw = [
    //         {'field':'id','type':'int','length':11,'PK':1,'NN':1,'default':''},
    //         {'field':'name','type':'varchar','length':50,'default':null},
    //         {'field':'age','type':'int'}
    //     ];
    //     var option = {
    //         confidential: true
    //     };

    //     let rs = await c.createTable(sConfidentialTableName, raw, option).submit({expect:'db_success'});
    //     assert.equal(rs.status,'db_success')     
    // })  

    // it('create operationRule', async function(){

    //     var raw = [
    //         {'field':'id','type':'int','length':11,'PK':1,'NN':1,'UQ':1},
    //         {'field':'name','type':'varchar','length':50,'default':null},
    //         {'field':'age','type':'int'},
    //         {'field':'account','type':'varchar','length':64}
    //     ]
    //     var rule = {
    //         'Insert':{
    //             'Condition':{'account':'$account'},
    //             'Count':{'AccountField':'account','CountLimit':5},
    //         },
    //         'Update':{
    //             'Condition':{'$or':[{'age':{'$le':28}},{'id':2}]},
    //             'Fields':['age']
    //         },
    //         'Delete':{
    //             'Condition':{'$and':[{'age':'$lt18'},{'account':'$account'}]}
    //         },
    //         'Get':{
    //             'Condition':{'id':{'$ge':3}}
    //         }
    //     };
    //     var option = {
    //         confidential: false,
    //         operationRule: rule
    //     }
    //     // 创建 行级控制表
    //     let rs = await c.createTable(sOperRuleTableName, raw, option).submit({expect:'db_success'});
    //     assert.equal(rs.status,'db_success')

    // })  


//     it('test operationRule', async function(){

//         var insertRaw = [
//             {'id':1,'age': 333,'name':'hello'},
//             {'id':2,'age': 444,'name':'sss'},
//             {'id':3,'age': 555,'name':'rrr'}, 
//             {'id':4,'age': 333,'name':'hello'},
//             {'id':5,'age': 444,'name':'sss'},
//             {'id':6,'age': 555,'name':'rrr'},    
//         ];

//         // 如果我想这一条必须失败的处理写法?
//         var rs = await c.table(sOperRuleTableName).insert(insertRaw).submit({expect:'db_success'});
//         assert.equal(rs.status,'db_success')  	
        
//     }) 




  
})

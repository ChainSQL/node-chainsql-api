'use strict'
const ChainsqlAPI = require('../src/index');
const c = new ChainsqlAPI();

var root = {
	secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
	address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
};

var owner = {
    address: "zpMZ2H58HFPB5QTycMGWSXUeF47eA8jyd4",
    secret: "xnnUqirFepEKzVdsoBKkMf577upwT"
}

var user = {
    address: "zKQwdkkzpUQC9haHFEe2EwUsKHvvwwPHsv",
    secret: "xnJn5J5uYz3qnYX72jXkAPVB3ZsER"
}
var userOperation = owner;

var user2 = {
    address: "zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt",
    secret: "xnoHuFw7CcgXD29fv2yi8uGkiqSqm"
}

var grantAddr = "0xzzzzzzzzzzzzzzzzzzzzBZbvji";

var sTableName = "chainsqlTest";
var sTableNameNew = "table_new"
var tableRaw = [
    { 'field': 'id', 'type': 'int' },
    { 'field': 'time', 'type': 'datetime' },
    { 'field': 'txHash', 'type': 'varchar', 'length': 100 },
    { 'field': 'name', 'type': 'varchar', 'length': 100 },
    { 'field': 'email', 'type': 'varchar', 'length': 100 },
    { 'field': 'account', 'type': 'varchar', 'length': 40 }
];

// var insertRaw = [
//     { 'id': 1, 'name': 'zhangsan', 'email': '123', 'account': root.address, 'time': '2018-10-18 14:31:00', 'txHash': "txHash" },
//     { 'id': 2, 'name': 'lisi', 'email': '124', 'account': root.address, 'time': '2018-10-18 14:31:00', 'txHash': "txHash" },
//     { 'id': 3, 'name': 'wangwu', 'email': '125', 'account': root.address, 'time': '2018-10-18 14:31:00', 'txHash': "txHash" },
//     { 'id': 4, 'name': 'zhaoliu', 'email': '126', 'account': root.address, 'time': '2018-10-18 14:31:00', 'txHash': "txHash" }
// ];

var insertRaw = [
    { 'id': 1, 'name': 'zhangsan', 'email': '123', 'account': root.address, 'time': '2018-10-18 14:31:00' },
    { 'id': 2, 'name': 'lisi', 'email': '124', 'account': root.address, 'time': '2018-10-18 14:31:00' },
    { 'id': 3, 'name': 'wangwu', 'email': '125', 'account': root.address, 'time': '2018-10-18 14:31:00' },
    { 'id': 4, 'name': 'zhaoliu', 'email': '126', 'account': root.address, 'time': '2018-10-18 14:31:00' }
];

var tagStep = {
    active: 1, table_create: 2, table_create_operationRule: 3,
    table_rename: 4, table_grant: 5, table_drop: 6,
    table_insert: 7, table_insert_operationRule: 8, table_delete: 9,
    table_update: 10, table_get: 11, table_transaction: 12
}

main();
async function main() {
    let res = await c.connect('ws://127.0.0.1:6006');
    console.log("connect successfully.")
    c.setRestrict(true);


    /**************************************/
    let nStep = tagStep.table_insert;
    // userOperation = user;
    switch (nStep) {
        case tagStep.active: active(); break;
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

var active = async function () {
    c.as(root);
    var amount = 20000
    console.log("----------- active >>>>>>>>>>>>>");
    let res = await c.pay(owner.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   owner", owner.address, ":", res)
    res = await c.pay(user.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   user", user.address, ":", res)
    res = await c.pay(user2.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   user2", user2.address, ":", res)
    console.log("\n----------- active <<<<<<<<<<<<<");
}

var table_create = async function () {
    c.as(owner)
	try {
		let lll = await c.createTable(sTableName, tableRaw).submit({expect:"db_success"});	
		console.log("    createTable", sTableName, lll);
	} catch (error) {
		console.log("    createTable ", sTableName, error);
	}
};
var table_create_operationRule = async function () {
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
    let lll = await c.createTable(sTableName, tableRaw, option).submit({ expect: 'db_success' });
    console.log("    createTable_operationRule", lll);
}
var table_rename = async function () {
    c.as(owner)
    let lll = await c.renameTable(sTableName, sTableNameNew).submit({ expect: 'db_success' });
    console.log("    table_rename :", lll);
}
var table_grant = async function () {
    c.as(owner)
    var flag = { insert: true, update: true }
    let lll = await c.grant(sTableName, grantAddr, flag).submit({ expect: 'db_success' });
    console.log("    table_grant :", lll);
}
var table_drop = async function () {
    c.as(owner)
    let lll = await c.dropTable(sTableName).submit({ expect: 'db_success' });
    console.log("    dropTable", sTableName, lll);
}
var table_insert = async function () {
    c.as(userOperation)
    c.use(owner.address)
	try {
		let lll = await c.table(sTableName).insert(insertRaw, "txHash").submit({ expect: 'db_success' });	
		console.log("    insert", lll);
	} catch (error) {
		console.log("    insert error: ", error);	
	}
};
var table_insert_operationRule = async function () {
    c.as(userOperation)
    c.use(owner.address)
    let lll = await c.table(sTableName).insert(insertRaw).submit({ expect: 'db_success' });
    console.log("    insert", lll);
}
var table_delete = async function () {
    c.as(userOperation)
    c.use(owner.address)
    var rs = await c.table(sTableName).get({ 'id': 3 }).delete().submit({ expect: 'db_success' });
    console.log("testDelete", rs)
}
var table_update = async function () {
    c.as(userOperation)
    c.use(owner.address)
    let lll = await c.table(sTableName).get({ name: { $regex: '/s/' } }).update({ account: "update regex 's'" }).submit({ expect: 'db_success' });
    console.log("    update (regix)1:", lll);
    //
    lll = await c.table(sTableName).get({ email: 125 }).update({ account: "email==125" }).submit({ expect: 'db_success' });
    console.log("    update (==)2:", lll);
    //
    lll = await c.table(sTableName).get({ $or: [{ email: "126" }, { name: "zhangsan" }] }).update({ account: "update email == 123 || name == zhangsan" }).submit({ expect: 'db_success' });
    console.log("    update (or)3", lll);
}
var table_get = async function () {
    c.as(userOperation)
    c.use(owner.address)
    let lll = await c.table(sTableName).get().submit();
    console.log("    all record:", lll);
    lll = await c.table(sTableName).get().withFields(["SUM(id) as sum"]).submit();
    console.log("    all record sum(id):", lll);
    if (lll.lines.length > 0) {
        console.log("    sum:", lll.lines[0].sum)
    }
    lll = await c.table(sTableName).get({ $or: [{ email: "123" }, { name: "zhangsan" }] }).submit();
    console.log("    record (or)", lll);
    lll = await c.table(sTableName).get({ name: { $regex: '/s/' } }).submit();
    console.log("    regex record:", lll);
    lll = await c.table(sTableName).get({ name: { $regex: '/s/' } }).withFields(["COUNT(*) as count"]).submit();
    console.log("    record count:", lll);
    lll = await c.table(sTableName).get({ name: { $regex: '/s/' } }).withFields([]).submit();
    console.log("    record count:", lll);
    lll = await c.table(sTableName).get({ name: { $regex: '/s/' } }).limit({ index: 0, total: 1 }).withFields([]).submit();
    console.log("    record count(limit):", lll);
    lll = await c.table(sTableName).get({ name: { $regex: '/s/' } }).withFields(["account"]).submit();
    console.log("    record with fields:", lll);
}
var table_transaction = async function () {
    c.as(userOperation)
    c.beginTran();
    c.createTable(sTableName, tableRaw);
    c.grant(sTableName, user.address, { insert: true, update: true }, user.publicKey)
    c.table(sTableName).insert(insertRaw);
    c.table(sTableName).get().update({ account: "updateTxs" });
    c.table(sTableName).get({ 'id': 3 }).delete()
    var rs = await c.commit({ expect: 'db_success' });
    console.log("    table_transaction", rs);
}


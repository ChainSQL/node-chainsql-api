'use strict'
const ChainsqlAPI = require('../src/index');
const c = new ChainsqlAPI();

var root = {
    secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
    address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
}

var issuer = {
    secret: "xxXvas5HTwVwjpmGNLQDdRyYe2H6t",
    address: "z4ypskpHPpMDtHsZvFHg8eDEdTjQrYYYV6"
}

var user = {
    address: "zpMZ2H58HFPB5QTycMGWSXUeF47eA8jyd4",
    secret: "xnnUqirFepEKzVdsoBKkMf577upwT"
}

var user1 = {
    address: "zKQwdkkzpUQC9haHFEe2EwUsKHvvwwPHsv",
    secret: "xnJn5J5uYz3qnYX72jXkAPVB3ZsER"
}
var user2 = {
    address: "zhd8rfb9dyoq7b8vMBqSm3dbzJpUNFNtRt",
    secret: "xnoHuFw7CcgXD29fv2yi8uGkiqSqm"
}
var user3 = {
    address: "zU42yDW3fzFjGWosdeVjVasyPsF4YHj224",
    secret: "xncmqYJG4P9iyaYUf6T81GHs9W1kn"
}

var publicAcount = {
    address: "zPcimjPjkhQk7a7uFHLKEv6fyGHwFGQjHa",
    secret: "xxCosoAJMADiy6kQFVgq1Nz8QewkU"
}

var sCurrency = "aaa"

main();
async function main() {
    // let res = await c.connect('ws://101.201.40.124:5006');
    let res = await c.connect('ws://127.0.0.1:6006');

    c.as(root);
    c.setRestrict(true);
    /**************************************/
    let bActive = false; // 激活若干账户
    let bGateWay = false;//部署网管，信任，发行币转账
    let bEscrow = false;
    let bBalances = false;//账户余额
    let bGetTxs = false;
    let bTable = false;
    /**************************************/
    if (bActive) {
        testActive();
    }
    if (bGateWay) {
        testGateWay();
    }
    if (bEscrow) {
        testEscrow();
    }
    if (bBalances) {
        testBalances();
    }
    if (bGetTxs) {
        testTransactions();
    }
    if (bTable) {
        testTable();
    }
}

var testActive = async function () {
    console.log("----------- active >>>>>>>>>>>>>");
    let res = await c.pay(issuer.address, 20000).submit({ expect: 'validate_success' })
    console.log("   active issuer", issuer.address, ":", res)
    res = await c.pay(user.address, 20000).submit({ expect: 'validate_success' })
    console.log("\n   active user", user.address, ":", res)
    res = await c.pay(user1.address, 20000).submit({ expect: 'validate_success' })
    console.log("\n   active user1", user1.address, ":", res)
    res = await c.pay(user2.address, 20000).submit({ expect: 'validate_success' })
    console.log("\n   active user2", user2.address, ":", res)
    res = await c.pay(user3.address, 20000).submit({ expect: 'validate_success' })
    console.log("\n   active user3", user3.address, ":", res)
    console.log("\n----------- active <<<<<<<<<<<<<");
}

var testGateWay = async function () {
    let res;
    console.log("----------- GateWay >>>>>>>>>>>>>");
    var opt = {
        setFlag: "defaultChainsql",
        //clearFlag: "defaultChainsql",
        rate: 1.002,
        min: 1,
        max: 1.5
    }
    c.as(issuer);
    res = await c.accountSet(opt).submit({ expect: 'validate_success' });
    console.log("\n   accountSet issuer", issuer.address, ":", res)
    //
    c.as(user);
    res = await c.trustSet("10000", sCurrency, issuer.address).submit({ expect: 'validate_success' });
    console.log("\n   trustSet user", user.address, ":", res)
    c.as(user1);
    res = await c.trustSet("10000", sCurrency, issuer.address).submit({ expect: 'validate_success' });
    console.log("\n   trustSet user1", user1.address, ":", res)
    //
    res = await c.api.getTrustlines(issuer.address);
    console.log("\n   getTrustlines issuer", issuer.address, ":", res)

    //
    c.as(issuer);
    res = await c.pay(user.address, "10000", sCurrency, issuer.address).submit({ expect: 'validate_success' })
    console.log("\n   transfer currency(issuer 2 user)", issuer.address, user.address, ":", res)
    c.as(user)
    res = await c.pay(user1.address, "1000", sCurrency, issuer.address).submit({ expect: 'validate_success' })
    console.log("\n   transfer currency(user 2 user1)", user.address, user1.address, ":", res)
    console.log("\n----------- GateWay <<<<<<<<<<<<<");
}

var testEscrow = async function () {
    console.log("----------- Escrow >>>>>>>>>>>>>");
    let res;
    //
    let bCreate = false;
    let bFinish = false;
    let bCancel = true;
    //
    let nSeq = 5;
    if (bCreate) {
        c.as(user);
        res = await c.escrowCreate(user1.address, "1000", "2018-10-09 14:30:00", "2018-10-09 14:31:00", sCurrency, issuer.address).submit({ expect: 'validate_success' });
        console.log("\n   escrowCreate :", res)
        let res1 = await c.getTransaction(res.tx_hash);
        console.log("\n   txDetail", res.tx_hash, ":", res1)
    }
    if (bFinish) {
        c.as(user1)
        res = await c.escrowExecute(user.address, nSeq).submit({ expect: 'validate_success' });
        console.log("\n   escrowExecute :", res)
    }
    if (bCancel) {
        c.as(user)
        res = await c.escrowCancel(user.address, nSeq).submit({ expect: 'validate_success' });
        console.log("\n   escrowCancel :", res)
    }
    console.log("\n----------- Escrow <<<<<<<<<<<<<");
}

var testBalances = async function () {
    let res = await c.api.getBalances(user.address);
    console.log("   ", user.address, "balances:", res);
    //issue coin
    var options = {
        currency: sCurrency
    };
    res = await c.api.getBalances(user1.address, options);
    if (res.length > 0) {
        console.log("   issue", sCurrency, "coin balance:", res[0]);
        // console.log("   balance:", res[0].value);
    }
    //sys coin
    var options = {
        currency: "ZXC"
    };
    res = await c.api.getBalances(user1.address, options);
    if (res.length > 0) {
        console.log("   system coin balances:", res[0]);
        // console.log("   balance:", res[0].value);
    }
}

var testTable = async function () {
    c.as(publicAcount)
    let bGet = false;
    let bUpdate = false;
    if(bGet){
        let lll = await c.table("user").get().submit();
        console.log("    all record:", lll);
        lll = await c.table("user").get({$or:[{email:"123"},{name:"zengxing1"}]}).submit();
        console.log("    record (or)", lll);
        lll = await c.table("user").get({ name: { $regex: '/s/' } }).submit();
        console.log("    regex record:", lll);
        lll = await c.table("user").get({ name: { $regex: '/s/' } }).withFields(["COUNT(*) as count"]).submit();
        console.log("    record count:", lll);
        lll = await c.table("user").get({ name: { $regex: '/s/' } }).withFields([]).submit();
        console.log("    record count:", lll);
        lll = await c.table("user").get({ name: { $regex: '/s/' } }).limit({index:0,total:1}).withFields([]).submit();
        console.log("    record count(limit):", lll);
        lll = await c.table("user").get({ name: { $regex: '/s/' } }).withFields(["address"]).submit();
        console.log("    record with fields:", lll);
    }
    if(bUpdate){
        let lll = await c.table("user").get().update({email:"134"}).submit();
        console.log("    regex record:", lll);
        //
        lll = await c.table("user").get({ email: 123 }).submit();
        console.log("    regex record:", lll);
        lll = await c.table("user").get({ email: 123 }).update({email:"134"}).submit();
        console.log("    regex record:", lll);
        //
        lll = await c.table("user").get({$or:[{email:"123"},{name:"zengxing1"}]}).submit();
        console.log("    record (or)", lll);
        lll = await c.table("user").get({$or:[{email:"123"},{name:"zengxing1"}]}).update({email:"134"}).submit();
        console.log("    record (or)", lll);
    }
}

var testTransactions = async function () {
    let res;
    //
    let bAll_one = true;
    let bMore = true;
    //
    if (bAll_one) {
        res = await c.api.getTransactions(root.address);
        console.log("   Txs:", res);
        //
        if (res.length > 0) {
            let id = res[0].id;
            res = await c.api.getTransaction(id);
            console.log("   Tx", id, ":", res);
        }
    }
    //
    if (bMore) {
        let nLimit = 10;
        var options = {
            limit: nLimit
        };
        while (true) {
            res = await c.api.getTransactions(root.address, options);
            if (res.length < 1 || res.length != nLimit) {
                break;
            }
            console.log("   Txs:", res);
            options.start = res[nLimit - 1].id;
        }
    }
}

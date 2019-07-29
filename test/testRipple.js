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

var tagStep = {
    active: 1, gateWay: 2, escrow: 3,
    balances: 4, getLedger: 5, getTxs: 6
}
var sCurrency = "aaa"

main();
async function main() {
    // let res = await c.connect('ws://101.201.40.124:5006');
    let res = await c.connect('ws://127.0.0.1:6006');

    c.as(root);
    c.setRestrict(true);
    /**************************************/
    let nStep = tagStep.escrow;
    switch (nStep) {
        case tagStep.active: testActive(); break;// 激活若干账户
        case tagStep.gateWay: testGateWay(); break;//部署网管，信任，发行币转账
        case tagStep.escrow: testEscrow(); break;
        case tagStep.balances: testBalances(); break;//账户余额
        case tagStep.getTxs: testTransactions(); break;
        case tagStep.getLedger: testGetLedger(); break;
        default: break;
    }
    /**************************************/
}

var testActive = async function () {
    var amount = 20000
    console.log("----------- active >>>>>>>>>>>>>");
    let res = await c.pay(issuer.address, amount).submit({ expect: 'validate_success' })
    console.log("   active issuer", issuer.address, ":", res)
    res = await c.pay(user.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   active user", user.address, ":", res)
    res = await c.pay(user1.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   active user1", user1.address, ":", res)
    res = await c.pay(user2.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   active user2", user2.address, ":", res)
    res = await c.pay(user3.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   active user3", user3.address, ":", res)
    console.log("\n----------- active <<<<<<<<<<<<<");
}

var testGateWay = async function () {
    let res;
    console.log("----------- GateWay >>>>>>>>>>>>>");
    var opt = {
        enableRippling: true,
        rate: 1.002,
        min: 1,
        max: 1.5
    }
    c.as(issuer);
    res = await c.accountSet(opt).submit({ expect: 'validate_success' });
    console.log("\n   accountSet issuer", issuer.address, ":", res)
    //
    var amount = {
        value: 20000,
        currency: sCurrency,
        issuer: issuer.address
    }
    //
    c.as(user);
    res = await c.trustSet(amount).submit({ expect: 'validate_success' });
    console.log("\n   trustSet user", user.address, ":", res)
    c.as(user1);
    res = await c.trustSet(amount).submit({ expect: 'validate_success' });
    console.log("\n   trustSet user1", user1.address, ":", res)
    //
    res = await c.api.getTrustlines(issuer.address);
    console.log("\n   getTrustlines issuer", issuer.address, ":", res)

    //
    c.as(issuer);
    res = await c.pay(user.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   transfer currency(issuer 2 user)", issuer.address, user.address, ":", res)
    c.as(user);
    amount.value = 10000;
    res = await c.pay(user1.address, amount).submit({ expect: 'validate_success' })
    console.log("\n   transfer currency(user 2 user1)", user.address, user1.address, ":", res)
    console.log("\n----------- GateWay <<<<<<<<<<<<<");
}

var testEscrow = async function () {
    console.log("----------- Escrow >>>>>>>>>>>>>");
    let res;
    // var amount = "1000";
    var amount = 1000;
    var amount = {
        value: 1000,
        currency: sCurrency,
        issuer: issuer.address
    }
    //
    let bCreate = false;
    let bFinish = false;
    let bCancel = true;
    //
    let nSeq = 11;
    if (bCreate) {
        c.as(user);
        var opt = {
            dateFormatTMFinish:"2018-10-26 15:49:00",
            dateFormatTMCancel:"2018-10-26 15:50:00"
        }
        res = await c.escrowCreate(user1.address, amount, opt).submit({ expect: 'validate_success' });
        console.log("\n   escrowCreate :", res)
        let res1 = await c.getTransaction(res.tx_hash);
        console.log("\n   txDetail", res.tx_hash, ":", res1,"\nseq:",res1.sequence)
        nSeq = res1.sequence;
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
            if (res.length > 0) {
                console.log("   Txs:", res);
            }
            if (res.length < 1 || res.length != nLimit) {
                break;
            }
            options.start = res[nLimit - 1].id;
        }
    }
}

var testGetLedger = async function () {
    let llll = await c.api.getLedgerVersion();
    llll = await c.api.getLedger();
    c.api.getLedgerVersion().then(function (data) {
        console.log("ledger version:", data);
    }).catch(function (err) {
        console.log("err:", err);
    });
    var opt = {
        // ledgerVersion: 2005,
        // includeAllData: false,
        // includeTransactions: true,
        // includeState: false
    }
    c.api.getLedger(opt).then(function (data) {
        console.log("ledger:", data);
    })
        .catch(function (err) {
            console.log("err:", err);
        });
}

'use strict'
const ChainsqlAPI = require('../src/index');
const c = new ChainsqlAPI();

var root = {
    secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
    address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
}

var dest = {
    address:"zNwzhavZ8RKwVQXrgWEHA7D1ECMxSbhkqh",
    secret:"xhPSwyuj8CXxsWAVWhCkQ7goYwrfS"
}

var delegate1 = {
    secret: "xxtRnGpMidGqnPHScAyqi8HPaVjP6",
    address: "z9ngquq2N3cM3d2QgkpJyxyDTeKTEEQjJu"
}

var delegate2 = {
    secret: "xxVyTszchsQSd8NHwqsQw5seaLm2D",
    address: "zKF62SGrX8VDvDBH1s4XryUpaXVEBNCb24"
}

var delegate3 = {
    secret: "xnC8sDgEWWFX4aQ1593G9KN5U69so",
    address: "zKvTeQfUa6NqxrfomQi4vKv8Q4aiS7dR2z"
}

main();
async function main() {
    await c.connect('ws://127.0.0.1:6006');
    console.log("connect successfully.");

    var signRet,res;
    // 1. 设置多方签名列表
    var signerListSet = getSignerListSetJson(root.address,[delegate1.address,delegate2.address,delegate3.address])
    await c.api.prepareTx(signerListSet);
    signRet = c.sign(signerListSet,root.secret);
    res = await c.submitSigned(signRet)
    console.log("submit signerListSet result:"+ JSON.stringify(res));

    // 2. 通过多方签名转账
    var payment = getPaymentJson(root.address,dest.address,"100000000");
    await c.api.prepareTx(payment,null,{signersCount:3});
    signRet = c.sign(payment,delegate1.secret,{signAs:delegate1.address});
    console.log(signRet);
    signRet = c.sign(signRet.tx_json,delegate2.secret,{signAs:delegate2.address});
    console.log(signRet);
    signRet = c.sign(signRet.tx_json,delegate3.secret,{signAs:delegate3.address});
    console.log(signRet);
    res = await c.submitSigned(signRet,{expect:'validate_success'})
    console.log("submit signerListSet result:"+ JSON.stringify(res));

}

function getSignerListSetJson(source,list){
    var signerList = {
        Flags: 0,
        TransactionType: "SignerListSet",
        Account: source,
        Fee: "12",
        SignerQuorum: list.length,
        SignerEntries: []
    }
    for(var i in list){
        signerList.SignerEntries.push({
            "SignerEntry": {
                "Account": list[i],
                "SignerWeight": 1
            }
        });
    }

    return signerList
}

function getPaymentJson(from,dest,amount){
    return {
        "TransactionType": "Payment",
        "Account": from,
        "Destination": dest,
        "Amount": amount
    }
}
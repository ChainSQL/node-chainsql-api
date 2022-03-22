"use strict";

const binary = require('chainsql-binary-codec')
const ChainsqlAPI = require('../src/index');
const c = new ChainsqlAPI();

var user = {
	secret: "pwWxLSLpWDHBa66Lweexg82vQNKWbTpMjgqgca2tsqLvJTLKCBz",
	address: "zPoCNMA7jqWcuaVXJcXX9zsrCP5TAd3V48",
	publickKey: "pYvDQNUrSAAEbTrR4aVp1b7k1e8oa9omuDYJN1wwsyobZQhSTPjzQ3k7szPjkfzj6hx3LktycvJTPCbwQDTsJoFAQkHwqiBH"
};
var root = {
    secret: "xnoPBzXtMeMyMHUVTgbuqAfg1SUTb",
    address: "zHb9CJAWyB4zj91VRWn96DkukG4bwdtyTh"
}

var issuer = {
    secret: "xxXvas5HTwVwjpmGNLQDdRyYe2H6t",
    address: "z4ypskpHPpMDtHsZvFHg8eDEdTjQrYYYV6"
}
main();
async function main(){

    // await c.connect('ws://139.198.11.189:6006');
    await c.connect('ws://localhost:5510');
    c.as(root)
    console.log('连接成功')

    let info = await c.api.getAccountInfo(root.address);
    console.log(info);
    c.getLedgerVersion(function(err,data){
        var payment = {
            "Account": root.address,
            "Amount":"1000000000",
            "Destination": issuer.address,
            "TransactionType": "Payment",
            "Sequence": info.sequence,
            "LastLedgerSequence":data + 5,
            "Fee":"50"
        }

        var opt = {
            maxLedgerVersion:data + 1,
            minLedgerVersion:data
        }

        let signedRet = c.sign(payment,root.secret);
        c.api.submit(signedRet.signedTransaction).then(function(data){
            console.log(data);
                });
       
    })
        // setTimeout(function(){
        //     c.api.getTransaction(signedRet.id).then(function(data){
        //         console.log(data);
        //     }).catch(function(err){
        //         console.log(err);
        //     })
        // },5000);
  //  });
    

    var signed = "1200002400000006201B0000001061400000003B9ACA0068400000000000003273210330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD02074473045022100E684319763A47F8E4AA590ECBB4F16D4392E4DAB312A19ACC7E69F273DCD5FE702204DBBF8CB14FA8B723E35FB2659936DF6635BA4C80616B2563885AF5D91610B848114B5F762798A53D543A014CAF8B297CFF8F2F937E8831493CAB3CA5AA1B46E5A2A55BB8AA934A720ECD7A5";
    var decoded = binary.decode(signed);
    console.log(decoded);

//     return;
//     info = await c.api.getAccountInfo("rsM2GxUgR6jhEDijLTymqrwKZqtGSKj7RQ");
//     var signerListSet = {
//         "TransactionType": "SignerListSet",
//         "Account": "rsM2GxUgR6jhEDijLTymqrwKZqtGSKj7RQ",
//         "SignerQuorum": 3,
//         "SignerEntries": [
//             {
//                 "SignerEntry": {
//                 "Account": "rDsFXt1KRDNNckSh3exyTqkQeBKQCXawb2",
//                 "SignerWeight": 2
//                 }
//             },
//             {
//                 "SignerEntry": {
//                 "Account": "rPeRx9WUAivWPpqJnT1ZkDV5r845Rui1Mp",
//                 "SignerWeight": 1
//                 }
//             },
//             {
//                 "SignerEntry": {
//                 "Account": "rL9UctLXeQmvdX6T7JR4yNz2dmgtN8awzq",
//                 "SignerWeight": 1
//                 }
//             }
//         ],
//         "Sequence": info.sequence,
//         "Fee":"100"
//    };

//    signedRet = c.sign(signerListSet,"snfAitAq37xgeBMBv8YHNsWiczoBP");
//    console.log("SignerListSet:");
//    console.log(signedRet);
//    subRet = await c.api.submit(signedRet.signedTransaction);
//    console.log("submit SignerListSet:");
//    console.log(subRet);
    
//    info = await c.api.getAccountInfo("rB8A3mG8ZarktJte6vnHuDPv9bp3N6Jh42");
//    var trustSet = {
//         "TransactionType": "TrustSet",
//         "Account": "rB8A3mG8ZarktJte6vnHuDPv9bp3N6Jh42",
//         "Flags": 262144,
//         "LimitAmount": {
//             "currency": "GRD",
//             "issuer": "rnbVkKgxyGa6jfYyzyNPwWCLeoc7DEsgLi",
//             "value": "100"
//         },
//         "Sequence": info.sequence,
//         "SigningPubKey": "",
//         "Fee": "30000"
//     };
//     var option = {signAs:"rDsFXt1KRDNNckSh3exyTqkQeBKQCXawb2"};
//     let signForRet = c.signFor(trustSet,"saNWbrQwrZa9F24zeYZnnK4dPqWkw",option);
//     subRet = await c.api.submit(signedRet.signedTransaction);
//     console.log("submit multisign:");
//     console.log(subRet);
}

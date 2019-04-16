"use strict";

// const RippleAPI = new require('ripple-lib').RippleAPI;
// const api = new RippleAPI({server: ""});
const ChainsqlAPI = require('../src/index');
const c = new ChainsqlAPI();
const co = require('co')

var user = {
	secret: "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
	address: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
	publickKey: "aBQG8RQAzjs1eTKFEAQXr2gS4utcDiEC9wmi7pfUPTi27VCahwgw"
};

co(function*(){

    // yield c.connect('ws://139.198.11.189:6006');
    yield c.connect('ws://127.0.0.1:6007');
    console.log('连接成功')

    let info = yield c.api.getAccountInfo("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh");
    console.log(info);
    c.getLedgerVersion(function(err,data){
        var payment = {
            "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
            "Amount":"1000000000",
            "Destination": "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q",
            "TransactionType": "Payment",
            "Sequence": info.sequence,
            "LastLedgerSequence":data + 5,
            "Fee":"50"
        }
        let signedRet = c.sign(payment,user.secret);
        console.log(signedRet);
        c.api.submit(signedRet.signedTransaction).then(function(data){
            console.log(data);
        });

        // var opt = {
        //     maxLedgerVersion:data + 1,
        //     minLedgerVersion:data
        // }
        // c.api.getTransaction(signedRet.id,opt).then(function(data){
        //     console.log(data);
        // }).catch(function(err){
        //     console.log(err);
        // })
        
        // setTimeout(function(){
        //     c.api.getTransaction(signedRet.id).then(function(data){
        //         console.log(data);
        //     }).catch(function(err){
        //         console.log(err);
        //     })
        // },5000);
    });
    



//     return;
//     info = yield c.api.getAccountInfo("rsM2GxUgR6jhEDijLTymqrwKZqtGSKj7RQ");
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
//    subRet = yield c.api.submit(signedRet.signedTransaction);
//    console.log("submit SignerListSet:");
//    console.log(subRet);
    
//    info = yield c.api.getAccountInfo("rB8A3mG8ZarktJte6vnHuDPv9bp3N6Jh42");
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
//     subRet = yield c.api.submit(signedRet.signedTransaction);
//     console.log("submit multisign:");
//     console.log(subRet);
})

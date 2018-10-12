'use strict'
var util = require('util');
var Submit = require('./submit');
const FloatOperation = require('./floatOperation');

class Ripple extends Submit {
    constructor(ChainsqlAPI) {
        super().ChainsqlAPI = ChainsqlAPI;
    }
}

Ripple.prototype.prepareSign = function () {
    return this.ChainsqlAPI.api.sign(this.txJSON, this.ChainsqlAPI.connect.secret);
};

Ripple.prototype.prepareJSon = function () {
    let txJson = this.txJSON;
    let instructions = this.instructions;
    let transactionType = this.txType;
    if (transactionType == "Payment") {
        let issuer = txJson.source.maxAmount.counterparty;
        let bIssuer = false;
        if (issuer != "" && issuer != undefined && issuer != null) {
            bIssuer = true;
        }
        let self = this;
        return new Promise(function (resolve, reject) {
            self.ChainsqlAPI.getTransferFee(issuer)
                .then(function (data) {
                    if (bIssuer && data) {
                        let value = txJson.source.maxAmount.value;
                        let fee = 0;
                        if (data.min &&
                            data.max &&
                            data.min == data.max) {
                            //Fixed fee
                            fee = parseFloat(data.min);
                        } else if (data.rate) {
                            //Only TransferRate or with TranferFeeMin < TransferFeeMax
                            fee = FloatOperation.accMul(parseFloat(value), data.rate - 1);
                            if (data.min) {
                                fee = Math.max(fee, parseFloat(data.min));
                            }
                            if (data.max) {
                                fee = Math.min(fee, parseFloat(data.max));
                            }
                        } else if (data.min || data.max) {
                            //Not valid if set alone or not equal
                            throw new Error('Exception:transfer fee not valid');
                        }
                        if (fee > 0) {
                            txJson.source.maxAmount.value = (FloatOperation.accAdd(parseFloat(value), fee)).toString();
                        }
                    }
                    self.ChainsqlAPI.api.preparePayment(self.ChainsqlAPI.connect.address, txJson, instructions)
                        .then(function (data) {
                            resolve(data);
                        })
                        .catch(function (data) {
                            reject(data);
                        });
                })
                .catch(function (data) {
                    reject(data);
                })
        });
    }
    else if (transactionType == "AccountSet") {
        return this.ChainsqlAPI.api.prepareSettings(this.ChainsqlAPI.connect.address, txJson, instructions);
    }
    else if (transactionType == "TrustSet") {
        return this.ChainsqlAPI.api.prepareTrustline(this.ChainsqlAPI.connect.address, txJson, instructions);
    }
    else if (transactionType == "EscrowCreate") {
        return this.ChainsqlAPI.api.prepareEscrowCreation(this.ChainsqlAPI.connect.address, txJson, instructions);
    }
    else if (transactionType == "EscrowFinish") {
        return this.ChainsqlAPI.api.prepareEscrowExecution(this.ChainsqlAPI.connect.address, txJson, instructions);
    }
    else if (transactionType == "EscrowCancel") {
        return this.ChainsqlAPI.api.prepareEscrowCancellation(this.ChainsqlAPI.connect.address, txJson, instructions);
    }
}

Ripple.prototype.preparePayment = function (account, value, sCurrency, issuer, memos) {
    let payment = {
        source: {
            address: this.ChainsqlAPI.connect.address,
            maxAmount: {
                value: value.toString()
            }
        },
        destination: {
            address: account,
            amount: {
                value: value.toString()
            }
        },
        memos: memos
    };
    if (sCurrency == "" || sCurrency == undefined || sCurrency == null) {
        sCurrency = 'ZXC';
    }
    payment.source.maxAmount.currency = sCurrency;
    payment.destination.amount.currency = sCurrency;
    if (issuer != "" && issuer != undefined && issuer != null) {
        payment.source.maxAmount.counterparty = issuer;
        payment.destination.amount.counterparty = issuer;
    }

    //
    this.txType = "Payment";
    this.txJSON = payment;
    return this;
}

Ripple.prototype.accountSet = function (opt) {
    var self = this;
    var setting = {};
    //judge validity
    if (!opt || JSON.stringify(opt) == '{}') {
        throw new Error('opt cannot be empty');
    }
    //SetFlag or ClearFlag
    if (opt.hasOwnProperty('setFlag')) {
        let json = "{\"" + opt.setFlag + "\": true}";
        setting = JSON.parse(json);
    }
    else if (opt.hasOwnProperty("clearFlag")) {
        let json = "{\"" + opt.clearFlag + "\": false}";
        setting = JSON.parse(json);
    }
    //TransferFee
    if (opt.hasOwnProperty('min') && opt.hasOwnProperty('max')) {
        if (opt.min > opt.max && opt.max > 0) {
            throw new Error('min cannot be greater than max');
        }
        if (opt.min < 0 || opt.max < 0) {
            throw new Error('opt.min or opt.max cannot be less than 0')
        }
        if (opt.min == opt.max) {
            if (opt.rate && opt.rate != 1.0) {
                throw new Error('Cannot set transferRate if set fixed fee');
            } else {
                setting.transferRate = 1.0
            }
        } else if (!opt.rate) {
            throw new Error('Must set transferRate if min < max');
        }
        setting.transferFeeMin = opt.min.toString();
        setting.transferFeeMax = opt.max.toString();
    } else if (opt.hasOwnProperty('min')) {
        setting.transferFeeMin = opt.min.toString();
        setting.transferFeeMax = '0';
        if (!opt.rate) {
            throw new Error('Must set transferRate if set min or max alone');
        }
    } else if (opt.hasOwnProperty('max')) {
        setting.transferFeeMax = opt.max.toString();
        setting.transferFeeMin = '0';
        if (!opt.rate) {
            throw new Error('Must set transferRate if set min or max alone');
        }
    }
    if (opt.hasOwnProperty('rate')) {
        // console.log(typeof(opt.rate))
        if (typeof (opt.rate) != 'number' || opt.rate < 1.0 || opt.rate > 2.0) {
            throw new Error('opt.rate must be a number >= 1.0 && <= 2.0')
        }
        setting.transferRate = opt.rate;
        if (!setting.hasOwnProperty("transferFeeMin")) {
            setting.transferFeeMin = '0';
        }
        if (!setting.hasOwnProperty("transferFeeMax")) {
            setting.transferFeeMax = '0';
        }
    }
    //
    this.txType = "AccountSet";
    this.txJSON = setting;
    return this;
}

Ripple.prototype.getTransferFee = function (issuerAddr) {
    var self = this;
    //
    return new Promise(function (resolve, reject) {
        if (issuerAddr == "" || issuerAddr == undefined || issuerAddr == null) {
            resolve({});
        }
        else {
            self.ChainsqlAPI.api.getAccountInfo(issuerAddr)
                .then(function (data) {
                    if (data.transferFeeMin || data.transferFeeMax || data.transferRate) {
                        var opt = {};
                        if (data.transferFeeMin) {
                            opt.min = parseFloat(data.transferFeeMin);
                        }
                        if (data.transferFeeMax) {
                            opt.max = parseFloat(data.transferFeeMax);
                        }
                        if (data.transferRate) {
                            opt.rate = data.transferRate;
                        }
                        resolve(opt);
                    } else {
                        resolve({});
                    }
                })
                .catch(function (err) {
                    reject(err);
                })
        }
    });
}


Ripple.prototype.trustSet = function (value, sCurrency, sIssuer) {
    let trustline = {
        currency: sCurrency,
        counterparty: sIssuer,
        limit: value,
        qualityIn: 1,
        qualityOut: 1,
        ripplingDisabled: true,
        frozen: false,
        memos: [{
            type: 'TRUSTLINE',
            format: '',
            data: ''
        }]
    };
    //
    this.txType = "TrustSet";
    this.txJSON = trustline;
    return this;
}

Ripple.prototype.escrowCreate = function (sDestAddr, sValue, dateFormatTMFinish, dateFormatTMCancel, sCurrency, sIssuer) {
    let dateFinish = new Date(dateFormatTMFinish);
    let tmExec = dateFinish.toISOString();
    let dateCancel = new Date(dateFormatTMCancel);
    let tmCancel = dateCancel.toISOString();
    var hash = "";
    const escrowCreation = {
        destination: sDestAddr,
        amount: {
            value: sValue
        },
        allowExecuteAfter: tmExec,
        allowCancelAfter: tmCancel
    };
    if (sCurrency == "" || sCurrency == undefined || sCurrency == null) {
        sCurrency = 'ZXC';
    }
    escrowCreation.amount.currency = sCurrency;
    if (sIssuer != "" && sIssuer != undefined && sIssuer != null) {
        escrowCreation.amount.counterparty = sIssuer;
    }
    //
    this.txType = "EscrowCreate";
    this.txJSON = escrowCreation;
    return this;
}

Ripple.prototype.escrowExecute = function (sOwnerAddr, nCreateEscrowSeq) {
    const escrowExecution = {
        owner: sOwnerAddr,
        escrowSequence: nCreateEscrowSeq
    };
    //
    this.txType = "EscrowFinish";
    this.txJSON = escrowExecution;
    return this;
}

Ripple.prototype.escrowCancel = function (sOwnerAddr, nCreateEscrowSeq) {
    const escrowCancellation = {
        owner: sOwnerAddr,
        escrowSequence: nCreateEscrowSeq
    };
    //
    this.txType = "EscrowCancel";
    this.txJSON = escrowCancellation;
    return this;
}

module.exports = Ripple;
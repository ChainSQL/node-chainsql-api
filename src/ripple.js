'use strict'
var util = require('../lib/util');
var Submit = require('./submit');
const FloatOperation = require('../lib/floatOperation');
var chainsqlLibUtils = require('chainsql-lib').ChainsqlLibUtil;

class Ripple extends Submit {
	constructor(ChainsqlAPI) {
		super().ChainsqlAPI = ChainsqlAPI;
	}

	submit(cb) {
		let cbResult = util.parseCb(cb);

		if (cbResult.isFunction) {
			super.submit(cbResult.expectOpt).then(result => {
				cb(null, result);
			}).catch(error => {
				cb(error, null);
			});
		} else {
			return new Promise((resolve, reject) => {
				super.submit(cbResult.expectOpt).then(result => {
					resolve(result);
				}).catch(error => {
					reject(error);
				});
			});
		}
	}
}

Ripple.prototype.signTx = function () {
	return this.ChainsqlAPI.api.sign(this.txJSON, this.ChainsqlAPI.connect.secret);
};

Ripple.prototype.prepareJson = function () {
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
	else if (transactionType === "PayToContract") {
		return chainsqlLibUtils.prepareTransaction(txJson, this.ChainsqlAPI.api, {});
	}
}

Ripple.prototype.preparePayment = function (account, amount, memos) {
	var _amount = { value: 0 }
	var type = typeof(amount);
	if (type == "number" || type == "string") { _amount.value = amount; }
	else if (type == "object") { _amount = amount; }
	else {
		throw new Error('error amount, amount must be object type or number type')
	}
	//
	let payment = {
		source: {
			address: this.ChainsqlAPI.connect.address,
			maxAmount: {
				value: _amount.value.toString(),
				currency: 'ZXC'
			}
		},
		destination: {
			address: account,
			amount: {
				value: _amount.value.toString(),
				currency: 'ZXC'
			}
		},
		memos: memos
	};
	if (util.isMeaningful(_amount.currency)) {
		payment.source.maxAmount.currency = _amount.currency;
		payment.destination.amount.currency = _amount.currency;
	}
	if (util.isMeaningful(_amount.issuer)) {
		payment.source.maxAmount.counterparty = _amount.issuer;
		payment.destination.amount.counterparty = _amount.issuer;
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
	if (opt.hasOwnProperty("enableRippling")) {
		opt.enableRippling ? setting.defaultChainsql = true : setting.defaultChainsql = false;
	}
	// //SetFlag or ClearFlag
	// if (opt.hasOwnProperty('setFlag')) {
	// 	let json = "{\"" + opt.setFlag + "\": true}";
	// 	setting = JSON.parse(json);
	// }
	// else if (opt.hasOwnProperty("clearFlag")) {
	// 	let json = "{\"" + opt.clearFlag + "\": false}";
	// 	setting = JSON.parse(json);
	// }
	//TransferFee
	if (opt.hasOwnProperty('min') && opt.hasOwnProperty('max')) {
		if (opt.min > opt.max && opt.max > 0) {
			throw new Error('min cannot be greater than max');
		}
		if (opt.min < 0 || opt.max < 0) {
			throw new Error('opt.min or opt.max cannot be less than 0')
		}
		if (opt.min == opt.max) {
			if (opt.min > 0) {
				if(opt.rate && opt.rate != 1.0 && opt.rate != 0){
					throw new Error('Cannot set transferRate if set fixed fee');
				}                
			} else if(!opt.rate) {
				setting.transferRate = 1.0;
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
		if (util.isMeaningless(issuerAddr)) {
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


Ripple.prototype.trustSet = function (amount) {
	let trustline = {
		currency: amount.currency,
		counterparty: amount.issuer,
		limit: amount.value.toString()
	};
	//
	this.txType = "TrustSet";
	this.txJSON = trustline;
	return this;
}

Ripple.prototype.escrowCreate = function (sDestAddr, amount, opt) {
	var _amount = { value: 0 }
	var type = typeof(amount);
	if (type == "number" || type == "string") { _amount.value = amount; }
	else if (type == "object") { _amount = amount; }
	else {
		throw new Error('error amount, amount must be object type or number type')
	}

	if(util.isMeaningless(opt.dateFormatTMFinish) && util.isMeaningless(opt.dateFormatTMCancel)) {
		throw new Error('temBAD_EXPIRATION, Malformed: Bad expiration');
	}
	//
	const escrowCreation = {
		destination: sDestAddr,
		amount: {
			value: _amount.value.toString(),
			currency: 'ZXC'
		}
	};
	if(util.isMeaningful(opt.dateFormatTMFinish)){
		let dateFinish = new Date(opt.dateFormatTMFinish);
		let tmExec = dateFinish.toISOString();
		escrowCreation.allowExecuteAfter = tmExec;
	}
	if(util.isMeaningful(opt.dateFormatTMCancel)){
		let dateCancel = new Date(opt.dateFormatTMCancel);
		let tmCancel = dateCancel.toISOString();
		escrowCreation.allowCancelAfter = tmCancel;
	}
	if (util.isMeaningful(_amount.currency)) {
		escrowCreation.amount.currency = _amount.currency;
	}
	if (util.isMeaningful(_amount.issuer)) {
		escrowCreation.amount.counterparty = _amount.issuer;
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

Ripple.prototype.payToContract = function (contractAddr, value, gas) {
	let contractValue = (value*1000000).toString();
	var contractTx = {
		TransactionType : "Contract",
		ContractOpType  : 2,
		Account : this.ChainsqlAPI.connect.address,
		ContractAddress : contractAddr,
		ContractData : "",
		ContractValue : contractValue,
		Gas : gas
	};
	
	this.txType = "PayToContract";
	this.txJSON = contractTx;
	return this;
}

module.exports = Ripple;
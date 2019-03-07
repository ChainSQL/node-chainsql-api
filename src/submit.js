'use strict'
var util = require('./util');
const RippleAPI = require('chainsql-lib').ChainsqlLibAPI;
const Connection = require('./connect');


class Submit {
	constructor() {
		this.ChainsqlAPI = null;
		this.txJSON = null;
		this.txType = "";
		this.instructions = { maxLedgerVersionOffset: 8 };
	}
	prepareSign() { };
	prepareJSon() { };
}

Submit.prototype.submit = function (cb) {
	let self = this;
	return new Promise(function (resolve, reject) {
		try {
			self.prepareJSon()
				.then(function (prepared) {
					self.txJSON = prepared.txJSON;
					let signedRet = self.prepareSign();
					self.ChainsqlAPI.handleSignedTx(self.ChainsqlAPI, signedRet, cb, resolve, reject);
				})
				.catch(function (error) {
					reject(error);
				});
		} catch (error) {
			reject(error);
		}
	});
}

Submit.prototype.setMaxLedgerVersionOffset = function (maxLedgerVersionOffset) {
	this.instructions.maxLedgerVersionOffset = maxLedgerVersionOffset;
}

Submit.prototype.handleSignedTx = function (ChainSQL, signed, object, resolve, reject) {
	var isFunction = false;
	let expectOpt = {expect:"send_success"};
	let cbCheckRet = util.checkCbOpt(object);
	if(cbCheckRet.status === "success") {
		if(cbCheckRet.type === "function") {
			isFunction = cbCheckRet.isFunction;
		} else {
			expectOpt.expect = cbCheckRet.expect;
		}
	} else {
		return reject(cbCheckRet.errMsg);
	}

	var errFunc = function (error) {
		if (isFunction) {
			object(error, null);
		} else {
			reject(error);
		}
	};
	// var exceptFunc = function(exception){
	// 	if (isFunction) {
	// 		object(exception, null);
	// 	} else {
	// 		reject(exception);
	// 	}
	// }
	var sucFunc = function (data) {
		if (isFunction) {
			object(null, data);
		} else {
			resolve(data);
		}
	};

	if (expectOpt.expect !== "send_success") {
		// subscribe event
		ChainSQL.event.subscribeTx(signed.id, isFunction ? object : function (err, data) {
			if (err) {
				errFunc(err);
			} else {
				// success
				if (object != undefined
					&& object.expect == data.status
					&& data.type === 'singleTransaction') {
					sucFunc({
						status: object.expect,
						tx_hash: signed.id
					});
				}

				// failure
				if (util.checkSubError(data)) {
					var error = {
						status: data.status,
						tx_hash: signed.id
					};
					if (data.hasOwnProperty("error_message")) {
						error.error_message = data.error_message;
					}
					errFunc(error);
				}
			}
		}).then(function (data) {
			// subscribeTx success
		}).catch(function (error) {
			// subscribeTx failure
			errFunc('subscribeTx exception.' + error);
		});
	}

	// submit transaction
	ChainSQL.api.submit(signed.signedTransaction).then(function (result) {
		//console.log('submit ', JSON.stringify(result));
		if (result.resultCode !== 'tesSUCCESS') {
			if(expectOpt.expect !== "send_success") {
				ChainSQL.event.unsubscribeTx(signed.id);
			}
			//return error message
			errFunc(result);
		} else {
			// submit successfully
			if (object.expect === 'send_success') {
				sucFunc({
					status: 'send_success',
					tx_hash: signed.id
				});
			}
		}
	}).catch(function (error) {
		errFunc(error);
	});
}

module.exports = Submit;
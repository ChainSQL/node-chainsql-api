'use strict'
var util = require('util');
const RippleAPI = require('chainsql-lib').ChainsqlLibAPI;
const Connection = require('./connect');


class Submit {
	constructor() {
		this.ChainsqlAPI = null;
		this.txJSON = null;
		this.txType = "";
		this.instructions = { maxLedgerVersionOffset: 8 };
	}
	prepareSign(reject) { };
	prepareJSon() { };
}

Submit.prototype.submit = function (cb) {
	let self = this;
	return new Promise(function (resolve, reject) {
		try {
			self.prepareJSon()
				.then(function (prepared) {
					self.txJSON = prepared.txJSON;
					let signedRet = self.prepareSign(reject);
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
	if ((typeof object) == 'function')
		isFunction = true;

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
	}
	// subscribe event
	ChainSQL.event.subscribeTx(signed.id, isFunction ? object : function (err, data) {
		if (err) {
			errFunc(err);
		} else {
			// success
			if (object === undefined) {
				// if 'submit()' called without param, default is validate_success
				if ((data.status == 'validate_success' || data.status == 'db_success')
					&& data.type === 'singleTransaction') {
					sucFunc({
						status: data.status,
						tx_hash: signed.id
					});
				}
			} else if (object != undefined
				&& object.expect == data.status
				&& data.type === 'singleTransaction') {
				sucFunc({
					status: object.expect,
					tx_hash: signed.id
				});
			}

			// failure
			if (data.status == 'db_error'
				|| data.status == 'db_timeout'
				|| data.status == 'validate_timeout') {

				errFunc({
					status: data.status,
					tx_hash: signed.id,
					error_message: data.error_message
				});
			}
		}
	}).then(function (data) {
		// subscribeTx success
	}).catch(function (error) {
		// subscribeTx failure
		errFunc('subscribeTx exception.' + error);
	});

	// submit transaction
	ChainSQL.api.submit(signed.signedTransaction).then(function (result) {
		//console.log('submit ', JSON.stringify(result));
		if (result.resultCode != 'tesSUCCESS') {
			ChainSQL.event.unsubscribeTx(signed.id).then(function (data) {
				// unsubscribeTx success
			}).catch(function (error) {
				// unsubscribeTx failure
				errFunc('unsubscribeTx failure.' + error);
			});

			//return error message
			errFunc(result);
		} else {
			// submit successfully
			if (isFunction == false && object != undefined && object.expect == 'send_success') {
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
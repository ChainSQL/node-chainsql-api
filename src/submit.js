'use strict'
var util = require('../lib/util');
const RippleAPI = require('chainsql-lib').ChainsqlLibAPI;
const Connection = require('./connect');

class Submit {
	constructor() {
		this.ChainsqlAPI = null;
		this.txJSON = null;
		this.txType = "";
		this.instructions = { maxLedgerVersionOffset: 8 };
	}
  
	prepareJson() {}
}

Submit.prototype.submit = function (expectOpt) {
	let self = this;
	return new Promise(function (resolve, reject) {
		try {
			self.prepareJson().then(function (prepared) {
				self.txJSON = prepared.txJSON;
				let signedRet = self.signTx();
				self.handleSignedTx(self.ChainsqlAPI, signedRet, expectOpt, resolve, reject);
			}).catch(function (error) {
				reject(error);
			});
		} catch (error) {
			reject(error);
		}
	});
};

Submit.prototype.setMaxLedgerVersionOffset = function (maxLedgerVersionOffset) {
	this.instructions.maxLedgerVersionOffset = maxLedgerVersionOffset;
};

Submit.prototype.signTx = function () {
	return this.ChainsqlAPI.api.sign(JSON.stringify(this.txJSON), this.ChainsqlAPI.connect.secret);
};

Submit.prototype.handleSignedTx = function (ChainSQL, signed, expectOpt, resolve, reject) {
	// var isFunction = false;
	// let expectOpt = {expect:"send_success"};

	if (expectOpt.expect !== "send_success") {
		// subscribe event
		ChainSQL.event.subscribeTx(signed.id, function (err, data) {
			if (err) {
				reject(err);
			} else {
				// success
				if (expectOpt.expect === data.status
					&& data.type === 'singleTransaction') {
					resolve({
						status: expectOpt.expect,
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
					reject(error);
				}
			}
		}).then(function (data) {
			// subscribeTx success
		}).catch(function (error) {
			// subscribeTx failure
			reject(error);
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
			reject(result);
		} else {
			// submit successfully
			if (expectOpt.expect === 'send_success') {
				resolve({
					status: 'send_success',
					tx_hash: signed.id
				});
			}
		}
	}).catch(function (error) {
		reject(error);
	});
};

module.exports = Submit;
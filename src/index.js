'use strict'
const path = require('path');
const crypto = require('../lib/crypto');
const keypairs = require('chainsql-keypairs');
const EventManager = require('./eventManager')
const _ = require('lodash');

const RippleAPI = require('chainsql-lib').ChainsqlLibAPI;
const Submit = require('./submit');
const Ripple = require('./ripple');

_.assign(RippleAPI.prototype, {
	prepareTable: require('./tablePayment'),
	prepareTx: require('./txPayment')
})
const addressCodec = require('chainsql-address-codec');
const validate = require('./validate')
const Connection = require('./connect');
const Table = require('./table');
const Contract = require('./smartContract');
const util = require('./util');
const opType = require('./config').opType;
const getFee = util.getFee;
const getSequence = util.getSequence;
const convertStringToHex = util.convertStringToHex;
const getTableSequence = util.getTableSequence;
const getUserToken = util.getUserToken;
const getTableName = util.getTableName;
const getTxJson = util.getTxJson;
const generateToken = util.generateToken;
const decodeToken = util.decodeToken;


class ChainsqlAPI extends Submit {
	constructor() {
		super();
		this.tab = null;
		this.query = {};
		this.exec = '';
		this.token = '';
		this.perm = {
			insert: 'lsfInsert',
			delete: 'lsfDelete',
			update: 'lsfUpdate',
			select: 'lsfSelect',
			execute: 'lsfExecute'
		};
		this.transaction = false;
		this.cache = [];
		this.strictMode = false;
		this.needVerify = 1;
		this.payment_json = '';
		this.confidential = false;
	}
}

ChainsqlAPI.prototype.connect = function (url, cb) {
	let ra = new RippleAPI({
		server: url
	});
	let con = new Connection();
	con.api = ra;
	this.api = ra;
	this.ChainsqlAPI = this;
	this.connect = con;
	this.event = new EventManager(this);
	if ((typeof cb) != 'function') {
		return con.connect();
	} else {
		con.connect().then(function (data) {
			cb(null, data)
		}).catch(function (err) {
			cb(err);
		});
	}
}
ChainsqlAPI.prototype.disconnect = function (cb) {
	if ((typeof cb) != 'function') {
		return this.api.disconnect();
	} else {
		this.api.disconnect().then(function (data) {
			cb(null, data)
		}).catch(function (err) {
			cb(err);
		});
	}
}
ChainsqlAPI.prototype.as = function (account) {
	if (!account.secret || !account.address) {
		throw Error("c.as parameter invalid,must contain 'secret' and 'address'");
	}
	this.connect.as(account);
}
ChainsqlAPI.prototype.use = function (address) {
	this.connect.use(address);
}
ChainsqlAPI.prototype.setRestrict = function (mode) {
	this.strictMode = mode;
}
ChainsqlAPI.prototype.table = function (name) {
	this.tab = new Table(name, this.connect);
	if (this.transaction) {
		this.tab.transaction = this.transaction;
		this.tab.cache = this.cache;
	}
	this.tab.strictMode = this.strictMode;
	this.tab.event = this.event;
	return this.tab;
}

ChainsqlAPI.prototype.contract = function (jsonInterface, address, options) {
	this.contractObj = new Contract(this, jsonInterface, address, options);
	// if (this.transaction) {
	//   this.tab.transaction = this.transaction;
	//   this.tab.cache = this.cache;
	// }
	// this.tab.strictMode = this.strictMode;
	// this.tab.event = this.event;
	return this.contractObj;
}

ChainsqlAPI.prototype.generateAddress = function () {
	var account;
	var keypair;
	let ripple = new RippleAPI();
	if (arguments.length == 0) {
		account = ripple.generateAddress();
		keypair = keypairs.deriveKeypair(account.secret);
	} else {
		keypair = keypairs.deriveKeypair(arguments[0]);
		account = {
			secret: arguments[0],
			address: keypairs.deriveAddress(keypair.publicKey)
		}
	}
	var opt = {
		version: 35
	}
	var buf = new Buffer(keypair.publicKey, 'hex');
	account.publicKey = addressCodec.encode(buf, opt);
	// account.publickKey = keypair.publicKey;

	return account;
}

// active account
function paymentSetting(ChainSQL, account, resolve, reject) {
	try {
		let userInfo = {
			"domain": "www.peersafe.com",
			"memos": [{
				"type": "USERINFO",
				"format": "plain/text",
				"data": ""
			}]
		};
		//设置用户信息
		userInfo.memos[0].data = JSON.stringify(_.omit(data, ['pwd']));
		ChainSQL.api.prepareSettings(account.address, userInfo)
			.then(function (data) {
				//console.log('prepareSettings: ', JSON.stringify(data));
				try {
					let signedRet = ChainSQL.api.sign(data.txJSON, account.secret);
					return ChainSQL.api.submit(signedRet.signedTransaction);
				}
				catch (error) {
					//console.log('sign prepareSettings failure.', JSON.stringify(error));
					reject(error);
				}
			})
			.then(function (data) {
				//console.log('sign prepareSetting: ', JSON.stringify(data));
				if (data.resultCode === 'tesSUCCESS') {
					resolve({
						status: 0,
						message: ''
					});
				} else {
					reject({
						status: -1,
						message: data.resultMessage
					});
				}
			})
			.catch(function (error) {
				reject(error);
			});
	}
	catch (error) {
		reject(error);
	}

}

ChainsqlAPI.prototype.setPaymentJson = function (json) {
	this.payment_json = json
}

ChainsqlAPI.prototype.handleGetTxJson = function () {
	return this.tx_json
}

ChainsqlAPI.prototype.handleSetTxJson = function (json) {
	this.tx_json = json
}

ChainsqlAPI.prototype.pay = function (account, amount, memos) {
	let ripple = new Ripple(this);
	return ripple.preparePayment(account, amount, memos);
}

ChainsqlAPI.prototype.accountSet = function (opt) {
	let ripple = new Ripple(this);
	return ripple.accountSet(opt);
}

ChainsqlAPI.prototype.getTransferFee = function (issuerAddr) {
	let ripple = new Ripple(this);
	return ripple.getTransferFee(issuerAddr);
}

ChainsqlAPI.prototype.trustSet = function (amount) {
	let ripple = new Ripple(this);
	return ripple.trustSet(amount);
}

ChainsqlAPI.prototype.escrowCreate = function (sDestAddr, amount, opt) {
	let ripple = new Ripple(this);
	return ripple.escrowCreate(sDestAddr, amount, opt);
}

ChainsqlAPI.prototype.escrowExecute = function (sOwnerAddr, nCreateEscrowSeq) {
	let ripple = new Ripple(this);
	return ripple.escrowExecute(sOwnerAddr, nCreateEscrowSeq);
}

ChainsqlAPI.prototype.escrowCancel = function (sOwnerAddr, nCreateEscrowSeq) {
	let ripple = new Ripple(this);
	return ripple.escrowCancel(sOwnerAddr, nCreateEscrowSeq);
}

ChainsqlAPI.prototype.createTable = function (name, raw, opt, cb) {
	validate.create(name, raw);
	var opt = opt ? opt : {};
	let that = this;
	var confidential = false;
	if (opt.confidential) {
		confidential = opt.confidential;
	}
	// console.log(JSON.stringify(opt.operationRule));
	if (that.transaction) {
		var json = {
			OpType: opType['t_create'],
			TableName: name,
			Raw: raw,
			confidential: confidential,
			OperationRule: opt.operationRule ? convertStringToHex(JSON.stringify(opt.operationRule)) : undefined
		};

		this.cache.push(json);
		return;
	} else {
		let payment = {
			address: that.connect.address,
			opType: opType['t_create'],
			tables: [{
				Table: {
					TableName: name
				}
			}],
			raw: JSON.stringify(raw),
			tsType: 'TableListSet',
			operationRule: opt.operationRule ? JSON.stringify(opt.operationRule) : undefined
		};

		this.payment = payment;
		this.confidential = opt.confidential

		if ((typeof cb) != 'function') {
			return new Promise(function (resolve, reject) {
				prepareTable(that, that.payment, cb, resolve, reject);
			});
		} else {
			prepareTable(that, that.payment, cb, null, null);
		}

		return;
	}
}

ChainsqlAPI.prototype.recreateTable = function (name, cb) {
	let that = this;
	if (that.transaction) {
		var json = {
			OpType: opType['t_recreate'],
			TableName: name,
			confidential: confidential
		};
		this.cache.push(json);
		return;
	} else {
		let payment = {
			address: that.connect.address,
			opType: opType['t_recreate'],
			tables: [{
				Table: {
					TableName: name
				}
			}],
			tsType: 'TableListSet'
		};
		this.payment = payment;

		if ((typeof cb) != 'function') {
			return new Promise(function (resolve, reject) {
				prepareTable(that, that.payment, cb, resolve, reject);
			});
		} else {
			prepareTable(that, that.payment, cb, null, null);
		}

		return;
	}
}

ChainsqlAPI.prototype.dropTable = function (name, cb) {
	let that = this;
	if (that.transaction) {
		this.cache.push({
			OpType: opType['t_drop'],
			TableName: name
		});
		return;
	} else {
		let payment = {
			address: that.connect.address,
			opType: opType['t_drop'],
			tables: [{
				Table: {
					TableName: name
				}
			}],
			tsType: 'TableListSet'
		};
		this.payment = payment;

		if ((typeof cb) != 'function') {
			return new Promise(function (resolve, reject) {
				prepareTable(that, that.payment, cb, resolve, reject);
			});
		} else {
			prepareTable(that, that.payment, cb, null, null);
		}
		return;
	}
}
ChainsqlAPI.prototype.renameTable = function (oldName, newName, cb) {
	if (newName == '' || !newName) {
		throw Error("Table new name can not be empty")
	}
	let that = this;
	if (that.transaction) {
		this.cache.push({
			OpType: opType['t_rename'],
			TableName: name,
			Raw: raw
		});
		return;
	} else {
		let payment = {
			address: that.connect.address,
			opType: opType['t_rename'],
			tables: [{
				Table: {
					TableName: oldName,
					TableNewName: newName
				}
			}],
			tsType: 'TableListSet'
		}

		this.payment = payment;

		if ((typeof cb) != 'function') {
			return new Promise(function (resolve, reject) {
				prepareTable(that, that.payment, cb, resolve, reject);
			});
		} else {
			prepareTable(that, that.payment, cb, null, null);
		}

		return;
	}
}
ChainsqlAPI.prototype.grant = function (name, user, flags, publicKey, cb) {
	if (!(name && user && flags)) throw new Error('args is not enough')
	if (!util.checkUserMatchPublicKey(user, publicKey)) {
		throw new Error('Publickey does not match User')
	}

	let that = this;
	if (that.transaction) {
		this.cache.push({
			OpType: opType['t_grant'],
			TableName: name,
			Raw: [flags],
			publicKey: publicKey,
			User: user
		});
		return;
	} else {
		let payment = {
			address: that.connect.address,
			opType: opType['t_grant'],
			tables: [{
				Table: {
					TableName: name
				}
			}],
			raw: JSON.stringify([flags]),
			user: user,
			tsType: 'TableListSet',
			name: name,
			publicKey: publicKey
		};
		this.payment = payment;

		if ((typeof cb) != 'function') {
			return new Promise(function (resolve, reject) {
				handleGrantPayment(that, cb, resolve, reject)
			});
		} else {
			handleGrantPayment(that, cb, null, null)
		}

		return;
	}
}

ChainsqlAPI.prototype.getTransactions = function (address, opts, cb) {
	if (!opts) {
		opts = {}
	};
	if ((typeof cb) != 'function') {
		return this.api.getTransactions(address, opts)
	} else {
		this.api.getTransactions(address, opts).then(function (data) {
			cb(null, data);
		}).catch(function (err) {
			cb(err);
		});
	}
}

ChainsqlAPI.prototype.getTransaction = function (hash, cb) {
	if ((typeof cb) != 'function') {
		return this.api.getTransaction(hash)
	} else {
		this.api.getTransaction(hash).then(function (data) {
			cb(null, data);
		}).catch(function (err) {
			cb(err);
		});
	}
}

ChainsqlAPI.prototype.getServerInfo = function (cb) {
	if ((typeof cb) != 'function') {
		return this.api.getServerInfo();
	} else {
		this.api.getServerInfo().then(function (data) {
			cb(null, data);
		}).catch(function (err) {
			cb(err);
		});
	}
}

ChainsqlAPI.prototype.getUnlList = function (cb) {
	return this.api.connection.request({
		command: 'unl_list'
	}).then(function (data) {
		if ((typeof cb) != 'function') {
			return data;
		} else {
			cb(null, data);
		}
	}).catch(function (err) {
		cb(err);
	})
}

ChainsqlAPI.prototype.beginTran = function () {
	if (this.connect && this.connect.address) {
		this.cache = [];
		this.transaction = true;
		return;
	}
}

function handleCommit(ChainSQL, object, resolve, reject) {
	var isFunction = false;

	if ((typeof object) == 'function')
		isFunction = true;

	var cb = function (error, data) {
		if (isFunction) {
			if (object == null)
				object = callback;
			object(error, data)
		} else {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		}
	}

	var ary = [];
	var secretMap = {};
	var cache = JSON.parse(ChainSQL.payment_json).Statements;
	for (var i = 0; i < cache.length; i++) {
		var noRaw = [2, 3, 5, 7];
		if (noRaw.indexOf(cache[i].OpType) != -1) {
			continue;
		}

		if (cache[i].OpType == 1) {
			var key = ChainSQL.connect.address + cache[i].TableName;
			if (cache[i].confidential) {
				secretMap[key] = generateToken(ChainSQL.connect.secret);
			} else {
				secretMap[key] = " ";
			}
			//secretMap[cache[i].TableName] = generateToken(ChainSQL.connect.secret);
		}

		if (cache[i].OpType != 1) {
			var address = cache[i].Owner ? cache[i].Owner : ChainSQL.connect.address;
			var key = address + cache[i].TableName;
			if (!secretMap[key]) {
				ary.push(getUserToken(ChainSQL.api.connection, address, ChainSQL.connect.address, ChainSQL.cache[i].TableName));
			}
		}
	};

	Promise.all(ary).then(function (data) {
		for (var i = 0; i < data.length; i++) {
			for (var key in data[i]) {
				secretMap[key] = data[i][key];
			}
		};

		var payment = {
			"TransactionType": "SQLTransaction",
			"Account": ChainSQL.connect.address,
			"Statements": [],
			"StrictMode": ChainSQL.strictMode,
			"NeedVerify": ChainSQL.needVerify
		};

		for (var i = 0; i < cache.length; i++) {
			var address = cache[i].Owner ? cache[i].Owner : ChainSQL.connect.address;
			var key = address + cache[i].TableName;
			if (secretMap[key] && secretMap[key] != " ") {
				var token = secretMap[key];

				var secret = decodeToken(ChainSQL, token);
				if (cache[i].Raw) {
					if (cache[i].OpType != opType.t_grant) {
						cache[i].Raw = crypto.aesEncrypt(secret, JSON.stringify(cache[i].Raw)).toUpperCase();
					}
				};

				if (cache[i].OpType == opType['t_assign'] || cache[i].OpType == opType['t_grant']) {
					token = crypto.eciesEncrypt(secret, cache[i].publicKey);
				};

				if (cache[i].OpType == opType['t_assign'] || cache[i].OpType == opType['t_grant'] || cache[i].OpType == opType['t_create']) {
					cache[i].Token = token;
					//remove publicKey field
					delete cache[i].publicKey;
				}
			} else {
				cache[i].Raw = convertStringToHex(JSON.stringify(cache[i].Raw));
				delete cache[i].publicKey;
			}

			var tableName = cache[i].TableName;
			cache[i].Tables = [{
				Table: {
					TableName: convertStringToHex(tableName)
				}
			}];
			delete cache[i].TableName;
			delete cache[i].confidential;
			payment.Statements.push(cache[i]);
		};

		//clear transactin status
		ChainSQL.transaction = false;
		ChainSQL.cache = [];

		getTxJson(ChainSQL, payment).then(function (data) {
			if (data.status == 'error') {
				ChainSQL.transaction = false;
				throw new Error('getTxJson error');
			}

			var payment = data.tx_json;
			payment.Statements = convertStringToHex(JSON.stringify(payment.Statements));
			ChainSQL.api.prepareTx(payment).then(function (data) {
				//console.log(JSON.stringify(tx_json))
				var txJson = JSON.parse(data.txJSON);
				txJson.Fee = util.calcFee(txJson);
				data.txJSON = JSON.stringify(txJson);
               
				let signedRet = ChainSQL.api.sign(data.txJSON, ChainSQL.connect.secret);
				handleSignedTx(ChainSQL, signedRet, object, resolve, reject);
			}).catch(function (error) {
				cb(error, null);
			});
		});
	});
}

function handlePrepareCommit(ChainSQL, object, resolve, reject) {
	var isFunction = false;

	if ((typeof object) == 'function')
		isFunction = true;

	var cb = function (error, data) {
		if (isFunction) {
			if (object == null)
				object = callback;
			object(error, data)
		} else {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		}
	}
	var cache = ChainSQL.cache;
	var payment = {
		"TransactionType": "SQLTransaction",
		"Account": ChainSQL.connect.address,
		"Statements": [],
		"StrictMode": ChainSQL.strictMode,
		"NeedVerify": ChainSQL.needVerify
	};

	for (var i = 0; i < cache.length; i++) {
		var tableName = cache[i].TableName;
		cache[i].Tables = [{
			Table: {
				TableName: tableName
			}
		}];
		payment.Statements.push(cache[i]);
	}

	getTxJson(ChainSQL, payment).then(function (data) {
		if (data.status == 'error') {
			ChainSQL.transaction = false;
			throw new Error('getTxJson error');
		}

		var payment = data.tx_json;

		ChainSQL.api.prepareTx(payment).then(function (data) {
			var txJson = JSON.parse(data.txJSON);
			txJson.Fee = util.calcFee(txJson);
			data.txJSON = JSON.stringify(txJson);

			ChainSQL.payment_json = data.txJSON;
			cb(null, data.txJSON)
		}).catch(function (error) {
			cb(error, null);
		});
	});
};

ChainsqlAPI.prototype.commit = function (cb) {
	var that = this;

	if ((typeof cb) != 'function') {
		return new Promise(function (resolve, reject) {
			handleCommit(that, cb, resolve, reject);
		});
	} else {
		handleCommit(that, cb, null, null);
	}
};

ChainsqlAPI.prototype.prepareCommit = function (cb) {
	var that = this

	if ((typeof cb) != 'function') {
		return new Promise(function (resolve, reject) {
			handlePrepareCommit(that, cb, resolve, reject);
		});
	} else {
		handlePrepareCommit(that, cb, null, null);
	}
}

ChainsqlAPI.prototype.prepare = function (cb) {
	var that = this;

	if ((typeof cb) != 'function') {
		return new Promise(function (resolve, reject) {
			handleCommit(that, cb, resolve, reject);
		});
	} else {
		handleCommit(that, cb, null, null);
	}
};

ChainsqlAPI.prototype.getLedger = function (opt, cb) {
	var cb = cb;
	if (!cb) {
		cb = callback;
	}
	this.api.getLedger(opt).then(function (data) {
		cb(null, data);
	}).catch(function (err) {
		cb(err);
	});
}
ChainsqlAPI.prototype.getLedgerVersion = function (cb) {
	var cb = cb;
	if (!cb) {
		cb = callback;
	}
	this.api.getLedgerVersion().then(function (data) {
		cb(null, data);
	}).catch(function (err) {
		cb(err);
	});
}

function handleSignedTx(ChainSQL, signed, object, resolve, reject) {
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

function prepareTable(ChainSQL, payment, object, resolve, reject) {
	var errFunc = function (error) {
		if ((typeof object) == 'function') {
			object(error, null);
		} else {
			reject(error);
		}
	};

	var sucFunc = function (data) {
		if ((typeof object) == 'function') {
			object(null, data);
		} else {
			resolve(data);
		}
	}

	ChainSQL.api.prepareTable(payment).then(function (tx_json) {
		getTxJson(ChainSQL, JSON.parse(tx_json.txJSON)).then(function (data) {
			if (data.status == 'error') {
				if (data.error_message)
					errFunc(new Error(data.error_message));
				else
					errFunc(new Error('getTxJson error'));
			} else {
				ChainSQL.setPaymentJson(data.tx_json)
				sucFunc(data.tx_json)
			}
		});
	}).catch(function (error) {
		errFunc(error);
	});
}

function handleGrantPayment(ChainSQL, object, resolve, reject) {
	if (ChainSQL.payment.opType != opType['t_grant'])
		throw new ('Type of payment must be t_grant');

	var payment = ChainSQL.payment;
	var name = payment.name;
	var publicKey = payment.publicKey;
	getUserToken(ChainSQL.api.connection, ChainSQL.connect.address, ChainSQL.connect.address, name).then(function (data) {
		var token = data[ChainSQL.connect.address + name];
		if (token != '') {
			var secret = decodeToken(ChainSQL, token);
			try {
				token = generateToken(publicKey, secret).toUpperCase();
			} catch (e) {
				//console.log(e)
				throw new Error('your publicKey is not validate')
			}
			payment.token = token;
		}
		delete ChainSQL.payment.name;
		delete ChainSQL.payment.publicKey;

		prepareTable(ChainSQL, ChainSQL.payment, object, resolve, reject);

	});
}

ChainsqlAPI.prototype.sign = function (json, secret) {
	if (!json.Fee) {
		json.Fee = "50";
	}
	let ripple = new RippleAPI();
	return ripple.sign(JSON.stringify(json), secret);
}

ChainsqlAPI.prototype.signFor = function (json, secret, option) {
	if (!json.Fee) {
		json.Fee = "50";
	}
	let ripple = new RippleAPI();
	var signed = ripple.sign(JSON.stringify(json), secret, option);
	return signed;
}

// ChainsqlAPI.prototype.encrypt = function (plainText, listPublic) {

// }

// ChainsqlAPI.prototype.decrypt = function (cipher, secret) {

// }

ChainsqlAPI.prototype.getAccountTables = function (address, bGetDetailInfo = false) {
	var connection = this.api ? this.api.connection : this.connect.api.connection;
	return connection.request({
		command: 'g_accountTables',
		account: address,
		detail: bGetDetailInfo
	});
}

ChainsqlAPI.prototype.getTableAuth = function (owner, tableName, accounts) {
	var connection = this.api ? this.api.connection : this.connect.api.connection;
	return connection.request({
		command: 'table_auth',
		owner: owner,
		tablename: tableName,
		accounts: accounts
	});
}


ChainsqlAPI.prototype.submit = function (cb) {
	var that = this;
	if (that.transaction) {
		throw new Error('you are now in transaction,can not be submit')
	} else {
		var tx_json = that.payment_json;
		switch (tx_json.OpType) {
			case opType['t_create']:

				if (that.confidential) {
					var token = generateToken(that.connect.secret);
					var secret = decodeToken(that, token);
					tx_json.Raw = crypto.aesEncrypt(secret, tx_json.Raw).toUpperCase();
					tx_json.token = token.toUpperCase();
				} else {
					tx_json.Raw = convertStringToHex(tx_json.Raw)
				};

				if (tx_json.OperationRule) {
					tx_json.OperationRule = convertStringToHex(tx_json.OperationRule);
				}

				tx_json.Tables[0].Table.TableName = convertStringToHex(tx_json.Tables[0].Table.TableName)
				break;

			case opType['t_recreate']:

				tx_json.Tables[0].Table.TableName = convertStringToHex(tx_json.Tables[0].Table.TableName)
				break
			case opType['t_drop']:

				tx_json.Tables[0].Table.TableName = convertStringToHex(tx_json.Tables[0].Table.TableName)
				break

			case opType['t_rename']:

				tx_json.Tables[0].Table.TableName = convertStringToHex(tx_json.Tables[0].Table.TableName)
				tx_json.Tables[0].Table.TableNewName = convertStringToHex(tx_json.Tables[0].Table.TableNewName)
				break
			case opType['t_grant']:

				tx_json.Tables[0].Table.TableName = convertStringToHex(tx_json.Tables[0].Table.TableName)
				tx_json.Raw = convertStringToHex(tx_json.Raw)
				break

			default:
				break;
		}

		tx_json.Fee = util.calcFee(tx_json);

		if ((typeof cb) != 'function') {
			return new Promise(function (resolve, reject) {
				let signedRet = that.api.sign(JSON.stringify(tx_json), that.connect.secret);
				handleSignedTx(that, signedRet, cb, resolve, reject);
			})
		} else {
			let signedRet = that.api.sign(JSON.stringify(tx_json), that.connect.secret);
			handleSignedTx(that, signedRet, cb, null, null);
		}
	}
}

function callback(data, callback) {

}

module.exports.ChainsqlAPI = ChainsqlAPI;

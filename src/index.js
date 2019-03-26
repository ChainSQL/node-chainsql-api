'use strict'
const path = require('path');
const crypto = require('../lib/crypto');
const keypairs = require('chainsql-keypairs');
const EventManager = require('./eventManager')
const _ = require('lodash');

const RippleAPI = require('chainsql-lib').ChainsqlLibAPI;
const Submit = require('./submit');
const Ripple = require('./ripple');
const chainsqlError = require('./error');

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
	if(!account.secret || !account.address){
		throw chainsqlError("c.as parameter invalid,must contain 'secret' and 'address'"); 
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

ChainsqlAPI.prototype.contract = function(jsonInterface, address, options) {
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

ChainsqlAPI.prototype.createTable = function (name, raw, inputOpt) {
	validate.create(name,raw);
	var opt = inputOpt ? inputOpt : {};
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
					TableName: convertStringToHex(name)
				}
			}],
			raw: JSON.stringify(raw),
			tsType: 'TableListSet',
			operationRule: opt.operationRule ? JSON.stringify(opt.operationRule) : undefined
		};

		if (confidential) {
			var token = generateToken(that.connect.secret);
			var secret = decodeToken(that, token);
			payment.raw = crypto.aesEncrypt(secret, payment.raw).toUpperCase();
			payment.token = token.toUpperCase();
		} else {
			payment.raw = convertStringToHex(payment.raw);
		}

		if (payment.operationRule) {
			payment.operationRule = convertStringToHex(payment.operationRule);
		}
		this.payment = payment;
		return this;
	}
}

ChainsqlAPI.prototype.recreateTable = function (name) {
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
					TableName: convertStringToHex(name)
				}
			}],
			tsType: 'TableListSet'
		};
		this.payment = payment;
		return this;
	}
}

ChainsqlAPI.prototype.dropTable = function (name) {
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
					TableName: convertStringToHex(name)
				}
			}],
			tsType: 'TableListSet'
		};
		this.payment = payment;
		return this;
	}
}
ChainsqlAPI.prototype.renameTable = function (oldName, newName) {
	if (newName == '' || !newName) {
		throw chainsqlError("Table new name can not be empty")
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
					TableName: convertStringToHex(oldName),
					TableNewName: convertStringToHex(newName)
				}
			}],
			tsType: 'TableListSet'
		}

		this.payment = payment;
		return this;
	}
}
ChainsqlAPI.prototype.grant = function (name, user, flags, publicKey) {
	if (!(name && user && flags)) throw chainsqlError('args is not enough');
	if (!util.checkUserMatchPublicKey(user, publicKey)) {
		throw chainsqlError('Publickey does not match User');
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
					TableName: convertStringToHex(name)
				}
			}],
			raw: convertStringToHex(JSON.stringify([flags])),
			user: user,
			tsType: 'TableListSet',
			name: name,
			publicKey: publicKey
		};
		this.payment = payment;
		return this;
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
	var cache = ChainSQL.cache;
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
		}

		//clear transactin status
		ChainSQL.transaction = false;
		ChainSQL.cache = [];

		getTxJson(ChainSQL, payment).then(function (data) {
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
		}).catch(function (error) {
			ChainSQL.transaction = false;
			cb(error, null);
		});
	}).catch(error => {
		ChainSQL.transaction = false;
		cb(error, null);
	});
}

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
	// subscribe event
	if(expectOpt.expect !== "send_success") {
		ChainSQL.event.subscribeTx(signed.id, isFunction ? object : function (err, data) {
			if (err) {
				errFunc(err);
			} else {
				// success
				if (expectOpt.expect === data.status
					&& data.type === 'singleTransaction') {
					sucFunc({
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
		if (result.resultCode != 'tesSUCCESS') {
			if(expectOpt.expect !== "send_success") {
				ChainSQL.event.unsubscribeTx(signed.id);
			}
			//return error message
			errFunc(result);
		} else {
			// submit successfully
			if (expectOpt.expect === "send_success") {
				// ChainSQL.event.unsubscribeTx(signed.id);
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
	ChainSQL.api.prepareTable(payment).then(function (tx_json) {
		// console.log(tx_json);
		getTxJson(ChainSQL, JSON.parse(tx_json.txJSON)).then(function (data) {
			data.tx_json.Fee = util.calcFee(data.tx_json);
			var payment = data.tx_json;
			let signedRet = ChainSQL.api.sign(JSON.stringify(data.tx_json), ChainSQL.connect.secret);
			handleSignedTx(ChainSQL, signedRet, object, resolve, reject);
		}).catch(function (error) {
			if (error.error_message)
				errFunc(new Error(error.error_message));
			else
				errFunc(new Error('getTxJson error'));
		});
	}).catch(function (error) {
		errFunc(error);
	});
}

function handleGrantPayment(ChainSQL, object, resolve, reject) {
	if (ChainSQL.payment.opType != opType['t_grant'])
		return reject(chainsqlError('Type of payment must be t_grant'));

	// var payment = ChainSQL.payment;
	var name = ChainSQL.payment.name;
	var publicKey = ChainSQL.payment.publicKey;
	getUserToken(ChainSQL.api.connection, ChainSQL.connect.address, ChainSQL.connect.address, name).then(function (data) {
		var token = data[ChainSQL.connect.address + name];
		if (token != '') {
			var secret = decodeToken(ChainSQL, token);
			try {
				token = generateToken(publicKey, secret).toUpperCase();
			} catch (e) {
				return reject(chainsqlError('your publicKey is not validate'));
			}
			ChainSQL.payment.token = token;
		}
		delete ChainSQL.payment.name;
		delete ChainSQL.payment.publicKey;

		prepareTable(ChainSQL, ChainSQL.payment, object, resolve, reject);

	}).catch(error => {
		reject(error);
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

ChainsqlAPI.prototype.getAccountTables = function(address, bGetDetailInfo=false){
	var connection = this.api ? this.api.connection : this.connect.api.connection;
	return new Promise(function(resolve, reject){
		connection.request({
			command: 'g_accountTables',
			account: address,
			detail: bGetDetailInfo
		}).then(function(data){
			resolve(data);
		}).catch(function(err){
			reject(err);
		});
	});
};

ChainsqlAPI.prototype.getTableAuth = function(owner,tableName,accounts){
	var connection = this.api ? this.api.connection : this.connect.api.connection;
	var req = {
		command: 'table_auth',
		owner: owner,
		tablename:tableName
	};
	if(accounts && accounts.length > 0){
		req.accounts = accounts;
	}
	return new Promise(function(resolve, reject){
		connection.request(req).then(function(data){
			resolve(data);
		}).catch(function(err){
			reject(err);
		});
	});
};

ChainsqlAPI.prototype.getTableNameInDB = function(owner,tableName){
	var that = this;
	return new Promise(function(resolve, reject){
		util.getTableName(that,owner,tableName).then(function(data){
			resolve(data.nameInDB);
		}).catch(function(err){
			reject(err);
		});
	});
};

ChainsqlAPI.prototype.getBySqlAdmin = function(sql){
	var connection = this.api ? this.api.connection : this.connect.api.connection;
	return new Promise(function(resolve, reject){
		connection.request({
			command: 'r_get_sql_admin',
			sql:sql
		}).then(function(data){
			resolve(data);
		}).catch(function(err){
			reject(err);
		});
	});
};

ChainsqlAPI.prototype.getBySqlUser = function(sql){
	var connect = this.connect;
	var json = {
		Account:connect.address,
		Sql:sql
	};
	return new Promise(function(resolve, reject){
		util.getValidatedLedgerIndex(connect).then(function(ledgerVersion){
			json.LedgerIndex = ledgerVersion;
			return util.signData(JSON.stringify(json), connect.secret);
		}).then(function(signed){
			return connect.api.connection.request({
					command: 'r_get_sql_user',
					publicKey:signed.publicKey,
					signature:signed.signature,
					signingData:JSON.stringify(json),
					tx_json:json
				})
		}).then(function(data){
			resolve(data);
		}).catch(function(err) {
			reject(err);
		});
	});
};

ChainsqlAPI.prototype.submit = function (cb) {
	var that = this;
	if (that.transaction) {
		throw chainsqlError('you are now in transaction,can not be submit');
	} else {

		//if (cb === undefined || cb === null) {
		//    cb = {expect:'send_success'};
		//}

		if ((typeof cb) != 'function') {
			return new Promise(function (resolve, reject) {
				if (that.payment.opType == opType['t_grant']) {
					handleGrantPayment(that, cb, resolve, reject);
				} else {
					prepareTable(that, that.payment, cb, resolve, reject);
				}
			});
		} else {
			if (that.payment.opType == opType['t_grant']) {
				handleGrantPayment(that, cb, null, null);
			} else {
				prepareTable(that, that.payment, cb, null, null);
			}
		}
	}
}

function callback(data, callback) {

}

module.exports.ChainsqlAPI = ChainsqlAPI;

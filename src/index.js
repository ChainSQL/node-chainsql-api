'use strict'
const crypto = require('./lib/crypto');
const keypairs = require('chainsql-keypairs');
const EventManager = require('./eventManager')
const _ = require('lodash');

const RippleAPI = require('chainsql-lib-applet').ChainsqlLibAPI;
const Submit = require('./submit');
const Ripple = require('./ripple');
const chainsqlError = require('./lib/error');
const rfc1751 = require('rfc1751.js')
const brorand = require('brorand')

_.assign(RippleAPI.prototype, {
	prepareTx: require('./txPayment')
})
const addressCodec = require('chainsql-address-codec');
const Connection = require('./connect');
const Contract = require('./smartContract');
const util = require('./lib/util');
const convertStringToHex = util.convertStringToHex;
const getCryptAlgTypeFromAccout = util.getCryptAlgTypeFromAccout;

class ChainsqlAPI extends Submit {
	constructor(algType = "normal") {
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
		this.transaction    = false;
		this.schemaCreateTx = false;
		this.schemaModifyTx = false;

		this.cache = [];
		this.strictMode = false;
		this.needVerify = 1;
		if(algType === "gmAlg" || algType === "normal" || algType === "softGMAlg" ) {
			keypairs.setCryptAlgType(algType);
		} else {
			throw new Error("Wrong algType for ChainsqlAPI object, must be 'gmAlg','softGMAlg' or 'normal'");
		}
	}

	submit (cb) {
		var that = this;
		if (that.transaction) {
			throw new Error('you are now in transaction,can not be submit');
		} else {
			let cbResult = util.parseCb(cb);

			if(cbResult.isFunction) {
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
};

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

	// 根据账户信息判断底层的算法类型  
	keypairs.setCryptAlgType(getCryptAlgTypeFromAccout(account));
	this.connect.as(account); 
}
ChainsqlAPI.prototype.use = function (address) {
	this.connect.use(address);
	if(typeof(address) != 'string'){
		throw chainsqlError("c.use parameter invalid,must be a string.'"); 
	}
}

ChainsqlAPI.prototype.useCert = function (cert) {
	this.connect.useCert(cert);
}

ChainsqlAPI.prototype.setRestrict = function (mode) {
	this.strictMode = mode;
}
ChainsqlAPI.prototype.setNeedVerify = function (isNeed) {
	isNeed ? this.needVerify = 1 : this.needVerify = 0;
}
ChainsqlAPI.prototype.contract = function(jsonInterface, address, options) {
  this.contractObj = new Contract(this, jsonInterface, address, options);
  return this.contractObj;
}

ChainsqlAPI.prototype.generateAddress = function () {

	let createAccount = function (options) {
		let account = {}
		let keypair
		if (typeof(options) === "object") {
			if (options.mnemonic && options.mnemonic.length >= 16) {
				options.entropy = rfc1751.etob(options.mnemonic)
			}
			let seed = keypairs.generateSeed(options);
			keypair = keypairs.deriveKeypair(seed);

			if (typeof (seed) !== "object") {
				// ed25519
				account.secret = seed;
				account.mnemonic = rfc1751.btoe(options.entropy)
			} else {
				// softGMAlg
				account.secret = util.encodeChainsqlAccountSecret(keypair.privateKey)
			}
		} else {
			keypair = keypairs.deriveKeypair(arguments[0])
			account.secret =arguments[0]
		}
		account.address = keypairs.deriveAddress(keypair.publicKey);

		var opt = {
			version: 35
		}
		var buf = Buffer.from(keypair.publicKey, 'hex');
		account.publicKey = addressCodec.encode(buf, opt);
		account.publicKey_hex = keypair.publicKey
		return account
	}

	let randomValues = function(length) {
		let array = [];
		if (global.wx) {
			for (var i = 0, l = length; i < l; i++) {
				array[i] = Math.floor(Math.random() * 256);
			}
		} else {
			array = brorand(length)
		}
		return array
	}

	let options
	if (arguments.length == 0) {
		options = {
			entropy: randomValues(16)
		}
	} else {
		options = arguments[0]
		if (typeof(options) === "object") {
			if(!options.mnemonic && !options.entropy) {
				options.entropy = randomValues(16)
			}
		}
	}
	return createAccount(options)
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

ChainsqlAPI.prototype.payToContract = function (contractAddr, value, gas) {
	let ripple = new Ripple(this);
	return ripple.payToContract(contractAddr, value, gas);
}

ChainsqlAPI.prototype.getAccountInfo = function (address, cb) {
	if ((typeof cb) === "undefined") {
		return this.api.getAccountInfo(address);
	} else if ((typeof cb) === "function") {
		this.api.getAccountInfo(address).then(function (data) {
			cb(null, data);
		}).catch(function (err) {
			cb(err, null);
		});
	} else {
		throw chainsqlError("wrong params, please check");
	}
};

ChainsqlAPI.prototype.getAccountTransactions = function (address, opts, cb) {
	let callback, newOpt, singleArg;
	let isCallback = false;
	switch (arguments.length) {
	case 1:
		newOpt = {};
		break;
	case 2:
		singleArg = arguments[1];
		if ((typeof singleArg) === "function") {
			callback = singleArg;
			isCallback = true;
		} else if ((typeof singleArg) === "object") {
			newOpt = singleArg;
		} else {
			throw chainsqlError("wrong params, please check");
		}
		break;
	case 3:
		newOpt = opts;
		if ((typeof cb) === "function") {
			callback = cb;
			isCallback = true;
		} else {
			throw chainsqlError("wrong params, please check");
		}
		break;
	default:
		throw chainsqlError("wrong params, please check");
	}

	if (isCallback) {
		this.api.getTransactions(address, newOpt).then(function (data) {
			callback(null, data);
		}).catch(function (err) {
			callback(err, null);
		});
	} else {
		return this.api.getTransactions(address, newOpt);
	}
};

ChainsqlAPI.prototype.getTransaction = function (hash,meta,meta_chain,cb) {
	if ((typeof cb) != 'function') {
		return this.api.getTransaction(hash,meta,meta_chain);
	} else {
		this.api.getTransaction(hash,meta,meta_chain).then(function (data) {
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
};

ChainsqlAPI.prototype.getLedger = function (opts, cb) {
	let callback, newOpt, singleArg;
	let isCallback = false;
	switch(arguments.length) {
	case 0:
		newOpt = {};
		break;
	case 1:
		singleArg = arguments[0];
		if((typeof singleArg) === "function") {
			callback = singleArg;
			isCallback = true;
		} else if((typeof singleArg) === "object") {
			newOpt = singleArg;
		} else {
			throw chainsqlError("wrong params, please check");
		}
		break;
	case 2:
		newOpt = opts;
		if ((typeof cb) === "function") {
			callback = cb;
			isCallback = true;
		} else {
			throw chainsqlError("wrong params, please check");
		}
		break;
	default:
		throw chainsqlError("wrong params, please check");
	}

	if(isCallback) {
		this.api.getLedger(newOpt).then(function (data) {
			callback(null, data);
		}).catch(function (err) {
			callback(err, null);
		});
	} else {
		return this.api.getLedger(newOpt);
	}
};

ChainsqlAPI.prototype.getLedgerVersion = function (cb) {
	if ((typeof cb) === "undefined") {
		return this.api.getLedgerVersion();
	} else if ((typeof cb) === "function") {
		this.api.getLedgerVersion().then(function (data) {
			cb(null, data);
		}).catch(function (err) {
			cb(err, null);
		});
	} else {
		throw chainsqlError("wrong params, please check");
	}
};

ChainsqlAPI.prototype.sign = function (json, secret, option) {
	if (!json.Fee) {
		json.Fee = "50";
	}
	let ripple = new RippleAPI();
	return ripple.sign(JSON.stringify(json), secret, option);
};

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

ChainsqlAPI.prototype.getLedgerTxs = function(ledgerIndex,includeSuccess,includeFailure){

	var connect = this.connect;

	return new Promise(function(resolve, reject){
		connect.api.connection.request({
			command: 'ledger_txs',
			ledger_index:ledgerIndex,
			include_success:includeSuccess,
			include_failure:includeFailure
		}).then(function(data){
			resolve(data);
		}).catch(function(err){
			reject(err);
		});
	});

};


ChainsqlAPI.prototype.signFromString = function (messageHex, secret) {

	var keypair   = keypairs.deriveKeypair(secret);
	var signatue  = keypairs.sign(messageHex,keypair.privateKey);
	return signatue;
};


ChainsqlAPI.prototype.verify = function (messageHex, signature, publicKey) {

	try {
		/// ECDSA secp256k1
		var opt = {version:35};
		var secp256k1Pub    = addressCodec.decode(publicKey,opt);
		var secp256k1PubHex = Buffer.from(secp256k1Pub).toString('hex');
		var bVerify  = keypairs.verify(messageHex, signature,secp256k1PubHex);
		return bVerify;
	}
	catch (error) {
		console.log(error);
		return false;
	}
}



ChainsqlAPI.prototype.prepareJson = function(){
	let that = this;
	return new Promise((resolve, reject) => {

		if(that.schemaCreateTx || that.schemaModifyTx){
			var payment  = that.payment;
			that.api.prepareTx(payment).then(function (data) {

				var txJson = JSON.parse(data.txJSON);
				var dropsPerByte = Math.ceil(1000000.0 / 1024);
				that.api.getServerInfo().then(res => {
								
					if(res.validatedLedger.dropsPerByte != undefined){
						dropsPerByte = parseInt(res.validatedLedger.dropsPerByte);
					}

					txJson.Fee = util.calcFee(txJson,dropsPerByte);
					data.txJSON = txJson;
					that.schemaCreateTx = false;
					that.schemaModifyTx = false;
					resolve(data)				
				}).catch(err => {
					that.schemaCreateTx = false;
					that.schemaModifyTx = false;
					reject(error)
				});
			
			}).catch(function (error) {
				that.schemaCreateTx = false;
				that.schemaModifyTx = false;
				reject(error)
			});

		}
	})
}

/**
 * 设置操作链的ID
 * @param {16进制字符串} schemaID schemaID="" 代表操作的是主链;
 */
ChainsqlAPI.prototype.setSchema = function(schemaID){
	var connection = this.api ? this.api.connection : this.connect.api.connection;
	if(connection._schema_id === undefined ){
		throw new Error("The current version does not support setSchema");
	}
	connection._schema_id = schemaID;
}

ChainsqlAPI.prototype.getSchemaList = function(options){
	var connection = this.api ? this.api.connection : this.connect.api.connection;
	return new Promise(function(resolve, reject){

		var params = {};
		params.command = 'schema_list';
	
		if(options !== undefined && options.account !== undefined){
			params.account =  options.account;
		}

		if(options !== undefined && options.running !== undefined){
			params.running =  options.running;
		}

		connection.request(params).then(function(data){
			resolve(data);
		}).catch(function(err){
			reject(err);
		});
	});
};

ChainsqlAPI.prototype.getSchemaInfo = function(schemaID){
	var connection = this.api ? this.api.connection : this.connect.api.connection;
	return new Promise(function(resolve, reject){
		connection.request({
			command: 'schema_info',
			schema:schemaID
		}).then(function(data){
			resolve(data);
		}).catch(function(err){
			reject(err);
		});
	});
};


ChainsqlAPI.prototype.createSchema = function(schemaInfo){

	let bValid = (schemaInfo !== undefined) &&  (schemaInfo.SchemaName !== undefined) && (schemaInfo.WithState !== undefined) &&
				 (schemaInfo.Validators !== undefined) && (schemaInfo.Validators  instanceof Array) &&
				 (schemaInfo.PeerList   !== undefined) && (schemaInfo.PeerList    instanceof Array);
	
  if(!bValid){
		throw new Error("Invalid schemaInfo parameter");
	}       

	var peerlists = []
	var i   = 0;
	var len = schemaInfo.PeerList.length
	for(; i < len; i++) {
		var hexPeer = convertStringToHex(schemaInfo.PeerList[i].Peer.Endpoint)

		var item = {
			Peer:{
				Endpoint:hexPeer
			}
		}
		peerlists.push(item)  
	}

	this.schemaCreateTx = true;

	var schemaCreateTxJson = {
		Account: this.connect.address,
		SchemaName:convertStringToHex(schemaInfo.SchemaName),
		SchemaStrategy: schemaInfo.WithState? 2:1,
		Validators: schemaInfo.Validators,
		PeerList:peerlists,
		TransactionType: 'SchemaCreate'
	};

	if(schemaInfo.SchemaAdmin !== undefined){
		schemaCreateTxJson.SchemaAdmin = schemaInfo.SchemaAdmin;
	}

	if(schemaCreateTxJson.SchemaStrategy === 2 ){
		
		if(schemaInfo.AnchorLedgerHash === undefined ){
			throw new Error("Missing field AnchorLedgerHash");
		}
		schemaCreateTxJson.AnchorLedgerHash = schemaInfo.AnchorLedgerHash;
	}else{
		if(schemaInfo.AnchorLedgerHash){
			throw new Error("Field 'AnchorLedgerHash' is unnecessary");
		}
	}

	this.payment = schemaCreateTxJson;
	return this;

};


ChainsqlAPI.prototype.modifySchema = function(schemaInfo){

	let bValid = (schemaInfo !== undefined) &&  (schemaInfo.SchemaID !== undefined) && (schemaInfo.ModifyType !== undefined) &&
				 (schemaInfo.Validators !== undefined) && (schemaInfo.Validators  instanceof Array) &&
				 (schemaInfo.PeerList   !== undefined) && (schemaInfo.PeerList    instanceof Array);

	if(!bValid){
		throw new Error("Invalid modifySchema parameter");
	}       

	var peerlists = []
	var i   = 0;
	var len = schemaInfo.PeerList.length
	for(; i < len; i++) {
		var hexPeer = convertStringToHex(schemaInfo.PeerList[i].Peer.Endpoint)

		var item = {
			Peer:{
				Endpoint:hexPeer
			}
		}
		peerlists.push(item)  
	}

	var opType = 1;
	if(schemaInfo.ModifyType === "schema_del"){
		opType = 2
	}else if(schemaInfo.ModifyType === "schema_add"){
		opType = 1
	}else{
		throw new Error("Invalid schemaInfo.ModifyType");
	}

	var schemaModifyTxJson = {
		Account: this.connect.address,
		SchemaID: schemaInfo.SchemaID,
		OpType: opType,
		Validators:schemaInfo.Validators,
		PeerList:peerlists,
		TransactionType: 'SchemaModify'
	};

	// 修改子链
	this.schemaModifyTx = true;
	this.payment = schemaModifyTxJson;
	return this;
};

module.exports = ChainsqlAPI;

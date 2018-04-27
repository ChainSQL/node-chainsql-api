'use strict'
const path = require('path');
const fs = require('fs');
const crypto = require('../lib/crypto');
const keypairs = require('chainsql-keypairs');
const EventManager = require('./eventManager')

// var basePath = path.join(require.resolve('chainsql-binary-codec'), '../enums/definitions.json');
// var data = fs.readFileSync(path.join(__dirname, '../lib/definitions.json'))
// fs.writeFileSync(basePath, data);

const RippleAPI = new require('chainsql-lib').ChainsqlLibAPI;

RippleAPI.prototype.prepareTable = require('./tablePayment');
RippleAPI.prototype.prepareTx = require('./txPayment');
const addressCodec = require('chainsql-address-codec');
const _ = require('lodash');
const validate = require('./validate')
const Connection = require('./connect');
const Table = require('./table');
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


const ChainsqlAPI = function() {
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
};

ChainsqlAPI.prototype.connect = function(url, cb) {
  let ra = new RippleAPI({
    server: url
  });
  let con = new Connection();
  con.api = ra;
  this.api = ra;
  this.connect = con;
  this.event = new EventManager(this);
  if ((typeof cb) != 'function') {
    return con.connect();
  } else {
    con.connect().then(function(data) {
      cb(null, data)
    }).catch(function(err) {
      cb(err);
    });
  }
}
ChainsqlAPI.prototype.disconnect = function(cb) {
  if ((typeof cb) != 'function') {
    return this.api.disconnect();
  } else {
    this.api.disconnect().then(function(data) {
      cb(null, data)
    }).catch(function(err) {
      cb(err);
    });
  }
}
ChainsqlAPI.prototype.as = function(account) {
  this.connect.as(account);
}
ChainsqlAPI.prototype.use = function(address) {
  this.connect.use(address);
}
ChainsqlAPI.prototype.setRestrict = function(mode) {
  this.strictMode = mode;
}
ChainsqlAPI.prototype.table = function(name) {
  this.tab = new Table(name, this.connect);
  if (this.transaction) {
    this.tab.transaction = this.transaction;
    this.tab.cache = this.cache;
  }
  this.tab.strictMode = this.strictMode;
  this.tab.event = this.event;
  return this.tab;
}

ChainsqlAPI.prototype.generateAddress = function() {
	var account;
	var keypair;
	let ripple = new RippleAPI();
	if(arguments.length == 0){
		account = ripple.generateAddress();
		keypair = keypairs.deriveKeypair(account.secret);
	}else{
		keypair = keypairs.deriveKeypair(arguments[0]);
		account = {
			secret : arguments[0],
			address : keypairs.deriveAddress(keypair.publicKey)
		}
	}
	var opt = {
		version:35
	} 
	var buf = new Buffer(keypair.publicKey,'hex');
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
		.then(function(data) {
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
		.then(function(data) {
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
		.catch(function(error) {
			reject(error);
		});
		}
	catch(error) {
		reject(error);
	}

}

function preparePayment(ChainSQL, account, amount, resolve, reject) {
    let address = ChainSQL.connect.address;
    let secret = ChainSQL.connect.secret;
    let payment = {
        source: {
            address: address, // root account
            maxAmount: {
                value: '10000',
                currency: 'ZXC'
            }
        },
        destination: {
            address: account,
            amount: {
                value: amount.toString(),
                currency: 'ZXC'
            }
        }
    };
	
	try {
		var hash;
		ChainSQL.api.preparePayment(payment.source.address, payment)
		.then(function (data) {
			//console.log('preparePayment: ', JSON.stringify(data));
			try {
				let signedRet = ChainSQL.api.sign(data.txJSON, secret);
				hash = signedRet.id;
				return ChainSQL.api.submit(signedRet.signedTransaction);
			} catch (error) {
				//console.log('sign preparePayment failure.', JSON.stringify(error));
				reject(error);
			}
		})
		.then(function(data) {
			if (data.resultCode === 'tesSUCCESS') {
				//paymentSetting(ChainSQL, account, resolve, reject);
				data.tx_hash = hash;
				resolve(data);
			} else {
				//console.log('sign preparePayment: ', JSON.stringify(data));
				reject(data);
			}
		})
		.catch(function(error) {
			reject(error);
		});		
	}
	catch (error) {
		reject(error);
	}
}

ChainsqlAPI.prototype.pay = function(account,amount) {
	var self = this;
	return new Promise(function(resolve, reject) {
		preparePayment(self, account,amount, resolve, reject);
	});
}

ChainsqlAPI.prototype.createTable = function(name, raw, opt) {
  validate.create(raw);
  var opt = opt ? opt :{};
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
      payment.raw = convertStringToHex(payment.raw)
		};
		if(payment.operationRule){
			payment.operationRule = convertStringToHex(payment.operationRule);
		}
    this.payment = payment;
    return this;
  }
}

ChainsqlAPI.prototype.recreateTable = function(name) {
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

ChainsqlAPI.prototype.dropTable = function(name) {
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
ChainsqlAPI.prototype.renameTable = function(oldName, newName) {
	if(newName == '' || !newName){
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
ChainsqlAPI.prototype.grant = function(name, user, flags, publicKey) {
	if (!(name && user && flags)) throw new Error('args is not enough')
	if (!util.checkUserMatchPublicKey(user,publicKey)){
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

ChainsqlAPI.prototype.getTransactions = function(address,opts, cb) {
	if (!opts) {
		opts = {}
	};
	if ((typeof cb) != 'function') {
		return this.api.getTransactions(address, opts)
	} else {
		this.api.getTransactions(address, opts).then(function(data) {
			cb(null, data);
		}).catch(function(err) {
			cb(err);
		});
	}
}

ChainsqlAPI.prototype.getTransaction = function(hash, cb) {
	if ((typeof cb) != 'function') {
		return this.api.getTransaction(hash)
	} else {
		this.api.getTransaction(hash).then(function(data) {
			cb(null, data);
		}).catch(function(err) {
			cb(err);
		});
	}
}

ChainsqlAPI.prototype.getServerInfo = function(cb) {
	if ((typeof cb) != 'function') {
		return this.api.getServerInfo();
	} else {
		this.api.getServerInfo().then(function(data) {
			cb(null, data);
		}).catch(function(err) {
			cb(err);
		});
	}
}

ChainsqlAPI.prototype.getUnlList = function(cb) {
  return this.api.connection.request({
    command: 'unl_list'
  }).then(function(data) {
    if((typeof cb) != 'function'){
			return data;
		}else{
			cb(null,data);
		}
	}).catch(function(err){
		cb(err);
	})
}

ChainsqlAPI.prototype.beginTran = function() {
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
	
	var cb = function(error, data) {
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
		var noRaw = [2,3,5,7];
		if (noRaw.indexOf(cache[i].OpType) != -1) {
			continue;
		}
		
		if (cache[i].OpType == 1) {
			var key = ChainSQL.connect.address + cache[i].TableName;
			if(cache[i].confidential){
				secretMap[key] = generateToken(ChainSQL.connect.secret);
			}else{
				secretMap[key] = " ";
			}
			//secretMap[cache[i].TableName] = generateToken(ChainSQL.connect.secret);
		}
		
		if (cache[i].OpType != 1) {
			var address = cache[i].Owner ? cache[i].Owner : ChainSQL.connect.address;
			var key = address + cache[i].TableName;
			if(!secretMap[key]){
				ary.push(getUserToken(ChainSQL.api.connection, address,ChainSQL.connect.address,ChainSQL.cache[i].TableName));
			}	
		}
	};
	
	Promise.all(ary).then(function(data) {
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
					if(cache[i].OpType != opType.t_grant){
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

		getTxJson(ChainSQL, payment).then(function(data) {
			if (data.status == 'error') {
				ChainSQL.transaction = false;
				throw new Error('getTxJson error');
			}
			
			var payment = data.tx_json;
			payment.Statements = convertStringToHex(JSON.stringify(payment.Statements));
			ChainSQL.api.prepareTx(payment).then(function(data) {
				//console.log(JSON.stringify(tx_json))
				var txJson = JSON.parse(data.txJSON);
				txJson.Fee = util.calcFee(txJson);
				data.txJSON = JSON.stringify(txJson);
				let signedRet = ChainSQL.api.sign(data.txJSON, ChainSQL.connect.secret);
				handleSignedTx(ChainSQL,signedRet,object,resolve,reject);
			}).catch(function(error) {
				cb(error, null);
			});
		});
	});
}

ChainsqlAPI.prototype.commit = function(cb) {
  var that = this;
  
  if ((typeof cb) != 'function') {
    return new Promise(function(resolve, reject) {
			handleCommit(that, cb, resolve, reject);
	});
  } else {
	  handleCommit(that, cb, null, null);
  }
};

ChainsqlAPI.prototype.getLedger = function(opt, cb) {
  var cb = cb;
  if (!cb) {
    cb = callback;
  }
  this.api.getLedger(opt).then(function(data) {
    cb(null, data);
  }).catch(function(err) {
    cb(err);
  });
}
ChainsqlAPI.prototype.getLedgerVersion = function(cb) {
  var cb = cb;
  if (!cb) {
    cb = callback;
  }
  this.api.getLedgerVersion().then(function(data) {
    cb(null, data);
  }).catch(function(err) {
    cb(err);
  });
}

function handleSignedTx(ChainSQL,signed,object,resolve,reject){
	var isFunction = false;
	if ((typeof object) == 'function')
		isFunction = true;
	
	var errFunc = function(error) {
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
	var sucFunc = function(data){
		if(isFunction){
			object(null,data);
		}else{
			resolve(data);
		}
	}
	// subscribe event
	ChainSQL.event.subscribeTx(signed.id, isFunction ? object : function(err, data) {
		if (err) {
			errFunc(err);
		} else {
			// success
			if (object === undefined) {
				// if 'submit()' called without param, default is validate_success
				if((data.status == 'validate_success' || data.status == 'db_success') 
						&& data.type === 'singleTransaction') {
							sucFunc({
										status:data.status,
										tx_hash:signed.id
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
	}).then(function(data) {
		// subscribeTx success
	}).catch(function(error) {
		// subscribeTx failure
		errFunc('subscribeTx exception.' + error);
	});
	
	// submit transaction
	ChainSQL.api.submit(signed.signedTransaction).then(function(result) {
		//console.log('submit ', JSON.stringify(result));
		if (result.resultCode != 'tesSUCCESS') {
			ChainSQL.event.unsubscribeTx(signed.id).then(function(data) {
				// unsubscribeTx success
			}).catch(function(error) {
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
	}).catch(function(error) {
		errFunc(error);
	});
}

function prepareTable(ChainSQL, payment, object, resolve, reject) {	
	var errFunc = function(error) {
		if ((typeof object) == 'function') {
			object(error, null);
		} else {
			reject(error);
		}
	};
	ChainSQL.api.prepareTable(payment).then(function(tx_json) {
		getTxJson(ChainSQL, JSON.parse(tx_json.txJSON)).then(function(data) {
			if (data.status == 'error') {
				if(data.error_message)
					errFunc(new Error(data.error_message));
				else
					errFunc(new Error('getTxJson error'));
			}
			data.tx_json.Fee = util.calcFee(data.tx_json);
			var payment = data.tx_json;
			let signedRet = ChainSQL.api.sign(JSON.stringify(data.tx_json), ChainSQL.connect.secret);
			handleSignedTx(ChainSQL,signedRet,object,resolve,reject);
		});
	}).catch(function(error) {
		errFunc(error);
	});
}

function handleGrantPayment(ChainSQL, object, resolve, reject) {
	if (ChainSQL.payment.opType != opType['t_grant'])
		throw new('Type of payment must be t_grant');
	
	var payment = ChainSQL.payment;
	var name = payment.name;
	var publicKey = payment.publicKey;		
	getUserToken(ChainSQL.api.connection, ChainSQL.connect.address,ChainSQL.connect.address, name).then(function(data) {
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

ChainsqlAPI.prototype.sign = function(json,secret){
	if(!json.Fee){
		json.Fee = "50";
	}
	let ripple = new RippleAPI();
	return ripple.sign(JSON.stringify(json), secret);
}

ChainsqlAPI.prototype.signFor = function(json,secret,option){
	if(!json.Fee){
		json.Fee = "50";
	}
	let ripple = new RippleAPI();
	var signed = ripple.sign(JSON.stringify(json), secret,option);
	return signed;
}

ChainsqlAPI.prototype.encrypt = function(plainText,listPublic){

}

ChainsqlAPI.prototype.decrypt = function(cipher,secret){

}

ChainsqlAPI.prototype.submit = function(cb) {
  var that = this;
  if (that.transaction) {
    throw new Error('you are now in transaction,can not be submit')
  } else {
      
    //if (cb === undefined || cb === null) {
    //    cb = {expect:'send_success'};
    //}
    
    if ((typeof cb) != 'function') {
      return new Promise(function(resolve, reject) {
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
exports.ChainsqlAPI = ChainsqlAPI;

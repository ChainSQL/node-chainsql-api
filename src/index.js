'use strict'
const path = require('path');
const fs = require('fs');
const crypto = require('../lib/crypto');
const EventManager = require('./eventManager')

var basePath = path.join(require.resolve('ripple-binary-codec'), '../enums/definitions.json');
var data = fs.readFileSync(path.join(__dirname, '../lib/definitions.json'))
fs.writeFileSync(basePath, data);
data = fs.readFileSync(path.join(__dirname, '../lib/parse-transaction.js'));
basePath = path.join(require.resolve('ripple-lib'), '../ledger/parse/transaction.js');
fs.writeFileSync(basePath, data)
data = fs.readFileSync(path.join(__dirname, '../lib/tx-type.json'));
basePath = path.join(require.resolve('ripple-lib'), '../common/schemas/objects/tx-type.json');
fs.writeFileSync(basePath, data);
basePath = path.join(require.resolve('ripple-lib'), '../common/connection.js');
data = fs.readFileSync(path.join(__dirname, '../lib/connection.js'));
fs.writeFileSync(basePath, data)
const RippleAPI = new require('ripple-lib').RippleAPI;

RippleAPI.prototype.prepareTable = require('./tablePayment');
RippleAPI.prototype.prepareTx = require('./txPayment');
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
  this.event = new EventManager(this.connect.api.connection);
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
ChainsqlAPI.prototype.createTable = function(name, raw, opt) {
  validate.create(raw);
  var opt = opt;
  let that = this;
  var confidential = false;
  if (opt && opt.confidential) {
    confidential = opt.confidential;
  }
  if (that.transaction) {

    var json = {
      OpType: opType['t_create'],
      TableName: name,
      Raw: raw,
      confidential: confidential
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
      tsType: 'TableListSet'
    };
    if (confidential) {
      var token = generateToken(that.connect.secret);
      var secret = decodeToken(that, token);
      payment.raw = crypto.aesEncrypt(secret, payment.raw).toUpperCase();
      payment.token = token.toUpperCase();
    } else {
      payment.raw = convertStringToHex(payment.raw)
    };
    this.payment = payment;
    return this;
  }
}

ChainsqlAPI.prototype.recreateTable = function(name) {
  let that = this;
  if (that.transaction) {
    var json = {
      OpType: opType['t_create'],
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
      OpType: opType['t_create'],
      TableName: name,
      Raw: raw
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
  let that = this;
  if (that.transaction) {
    this.cache.push({
      OpType: opType['t_create'],
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
  let that = this;
  if (that.transaction) {
    this.cache.push({
      OpType: opType['t_grant'],
      TableName: name,
      Raw: flags,
      publicKey: publicKey
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
ChainsqlAPI.prototype.assignCancelTable = function(name, user, flags) {
  if (!(name && user && flags)) throw new Error('args is not enough')
  flags = validate.assign(flags)
  let that = this;
  if (that.transaction) {
    this.cache.push({
      OpType: opType['t_create'],
      TableName: name,
      Raw: raw
    });
    return;
  } else {
    let payment = {
      address: that.connect.address,
      opType: opType['t_assignCancle'],
      tables: [{
        Table: {
          TableName: convertStringToHex(name),
          NameInDB: nameInDB
        }
      }],
      flags: flags,
      user: user,
      tsType: 'TableListSet'
    }
    this.payment = payment;
    return this;
  }
}
ChainsqlAPI.prototype.getTransactions = function(opts, cb) {
  if (this.connect && this.connect.address) {
    if (!opts) {
      opts = {}
    };
    if ((typeof cb) != 'function') {
      return this.api.getTransactions(this.connect.address, opts)
    } else {
      this.api.getTransactions(this.connect.address, opts).then(function(data) {
        cb(null, data);
      }).catch(function(err) {
        cb(err);
      });
    }
  }
}
ChainsqlAPI.prototype.beginTran = function() {
  if (this.connect && this.connect.address) {
    this.cache = [];
    this.transaction = true;
    return;
  }
}

ChainsqlAPI.prototype.commit = function(cb) {
  var cb = cb;
  if (!cb) {
    cb = callback;
  }
  var that = this;
  var ary = [];
  var secretMap = {};
  var cache = this.cache;
  for (var i = 0; i < this.cache.length; i++) {
    if (cache[i].OpType.toString().indexOf('2,3,5,7') == -1) {
      if (cache[i].OpType == 1 && cache[i].confidential) {
        secretMap[cache[i].TableName] = generateToken(that.connect.secret);
        that.needVerify = 0;
      }
      if (cache[i].OpType.toString().indexOf('6,8,9,10') != -1) {
        that.needVerify = 0;
      }
      if (cache[i].OpType != 1) {
        ary.push(getUserToken(that, that.cache[i].TableName));
      }
    }
  };
  if ((typeof cb) != 'function') {
    return Promise.all(ary).then(function(data) {
      for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
          secretMap[key] = data[i][key];
        }
      };
      var payment = {
        "TransactionType": "SQLTransaction",
        "Account": that.connect.address,
        "Statements": [],
        "StrictMode": that.strictMode,
        "NeedVerify": that.needVerify
      };
      for (var i = 0; i < cache.length; i++) {
        if (secretMap[cache[i].TableName]) {

          var token = secretMap[cache[i].TableName];

          var secret = decodeToken(that, secretMap[cache[i].TableName]);
          if (cache[i].Raw) {
            cache[i].Raw = crypto.aesEncrypt(secret, JSON.stringify(cache[i].Raw)).toUpperCase();
          };
          if (cache[i].OpType == 4) {
            token = crypto.eciesEncrypt(secret, cache[i].publicKey);
          };
          if (cache[i].OpType == 4 || cache[i].OpType == 1) {
            cache[i].Token = token;
          }
        } else {
          cache[i].Raw = convertStringToHex(JSON.stringify(cache[i].Raw));
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
      return getTxJson(that, payment).then(function(data) {
        if (data.status == 'error') {
          throw new Error('getTxJson error');
        }
        var payment = data.tx_json;
        payment.Statements = convertStringToHex(JSON.stringify(payment.Statements));
        return that.api.prepareTx(payment).then(function(tx_json) {
          let signedRet = that.api.sign(tx_json.txJSON, that.connect.secret);
          return that.event.subscriptTx(signedRet.id, cb);
          that.api.submit(signedRet.signedTransaction).then(function(result) {
            if (result.resultCode != 'tesSUCCESS') {
              that.event.unsubscriptTx(signedRet.id, cb);
              throw new Error(result.resultMessage);
            }
          });
        })
      })
    })
  } else {
    Promise.all(ary).then(function(data) {
      for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
          secretMap[key] = data[i][key];
        }
      };
      var payment = {
        "TransactionType": "SQLTransaction",
        "Account": that.connect.address,
        "Statements": [],
        "StrictMode": that.strictMode,
        "NeedVerify": that.needVerify
      };
      for (var i = 0; i < cache.length; i++) {
        if (secretMap[cache[i].TableName]) {

          var token = secretMap[cache[i].TableName];

          var secret = decodeToken(that, secretMap[cache[i].TableName]);
          if (cache[i].Raw) {
            cache[i].Raw = crypto.aesEncrypt(secret, JSON.stringify(cache[i].Raw)).toUpperCase();
          };
          if (cache[i].OpType == 4) {
            token = crypto.eciesEncrypt(secret, cache[i].publicKey);
          };
          if (cache[i].OpType == 4 || cache[i].OpType == 1) {
            cache[i].Token = token;
          }
        } else {
          cache[i].Raw = convertStringToHex(JSON.stringify(cache[i].Raw));
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
      getTxJson(that, payment).then(function(data) {
        if (data.status == 'error') {
          throw new Error('getTxJson error');
        }
        var payment = data.tx_json;
        payment.Statements = convertStringToHex(JSON.stringify(payment.Statements));
        that.api.prepareTx(payment).then(function(tx_json) {
          let signedRet = that.api.sign(tx_json.txJSON, that.connect.secret);
          that.event.subscriptTx(signedRet.id, cb);
          that.api.submit(signedRet.signedTransaction).then(function(result) {
            if (result.resultCode != 'tesSUCCESS') {
              that.event.unsubscriptTx(signedRet.id, cb);
              throw new Error(result.resultMessage);
            }
          });
        })
      })
    })
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

ChainsqlAPI.prototype.submit = function(cb) {
  var that = this;
  if (that.transaction) {
    throw new Error('you are now in transaction,can not be submit')
  } else {
    if ((typeof cb) != 'function') {
      return new Promise(function(resolve, reject) {
        if (that.payment.opType == opType['t_grant']) {
          var payment = that.payment;
          var name = payment.name;
          var publicKey = payment.publicKey;
          getUserToken(that, name).then(function(data) {
		  	console.log(data);
            var token = data[name];
            if (token != '') {
              var secret = decodeToken(that, token);
              try {
                token = generateToken(publicKey, secret).toUpperCase();
              } catch (e) {
                console.log(e)
                throw new Error('your publicKey is not validate')
              }
              payment.token = token;
            }
            
            delete that.payment.name;
            delete that.payment.publicKey;
            that.api.prepareTable(that.payment).then(function(tx_json) {
            getTxJson(that, JSON.parse(tx_json.txJSON)).then(function(data) {
              if (data.status == 'error') {
                reject(new Error('getTxJson error'));
              }
			  console.log("getTxJson:");
			  console.log(data);
              var payment = data.tx_json;
              let signedRet = that.api.sign(JSON.stringify(data.tx_json), that.connect.secret);
              that.event.subscriptTx(signedRet.id, function(err, data) {
                if (err) {
                  reject(err);
                } else {
                  if (cb.expect == data.status && data.type === 'singleTransaction') {
                    resolve({
                      status: cb.expect,
                      tx_hash: signedRet.id
                    })
                  }
                  
                  if (data.status == 'db_error' || data.status == 'db_timeout' || data.status == 'validate_timeout') {
                    reject({
                      error: data.status,
                      tx_hash: signedRet.id
                    })
                  }
                }
              });
              that.api.submit(signedRet.signedTransaction).then(function(result) {
                if (result.resultCode != 'tesSUCCESS') {
                  that.event.unsubscriptTx(signedRet.id);
                  reject(result);
                } else {
                  if (cb.expect == 'send_success') {
                    resolve({
                      status: 'send_success',
                      tx_hash: signedRet.id
                    })
                  }
                }
              }).catch(function(error) {
                  reject(error);
              });
            })
            })
          });
        } else {
        console.log("data.tx_json in line 555:");
			  console.log(that.payment);
          that.api.prepareTable(that.payment).then(function(tx_json) {
			getTxJson(that, JSON.parse(tx_json.txJSON)).then(function(data) {
              if (data.status == 'error') {
                throw new Error('getTxJson error');
              }
              var payment = data.tx_json;
			  console.log("data.tx_json in line 561:");
			  console.log(data.tx_json);
              let signedRet = that.api.sign(JSON.stringify(data.tx_json), that.connect.secret);
			  that.event.subscriptTx(signedRet.id, function(err, data) {  
              console.log('status: ',data.status);
                if (err) {
                  reject(err);
                } else {
                  if (cb.expect == data.status && data.type === 'singleTransaction') {
                    resolve({
                      status: cb.expect,
                      tx_hash: signedRet.id
                    })
                  }
                  if (data.status == 'db_error' || data.status == 'db_timeout' || data.status == 'validate_timeout') {
                    reject({
                      error: data.status,
                      tx_hash: signedRet.id
                    })
                  }
                }
              });
              
              that.api.submit(signedRet.signedTransaction).then(function(result) {
                if (result.resultCode != 'tesSUCCESS') {
                  that.event.unsubscriptTx(signedRet.id);
                  reject(result);
                } else {
                  if (cb.expect == 'send_success') {
                    resolve({
                      status: 'send_success',
                      tx_hash: signedRet.id
                    })
                  }
                }
              }).catch(function(error) {
                  reject(error);
              });
            })
          })
        }
      })
    } else {
      if (that.payment.opType == opType['t_grant']) {
        var payment = that.payment;
        var name = payment.name;
        var publicKey = payment.publicKey;
        getUserToken(that, name).then(function(data) {
          var token = data[name];
          if (token != '') {
            var secret = decodeToken(that, token);
            try {
              token = generateToken(publicKey, secret).toUpperCase();
            } catch (e) {
              console.log(e)
              throw new Error('your publicKey is not validate')
            }
            payment.token = token;
            delete that.payment.name;
            delete that.payment.publicKey;
            that.api.prepareTable(that.payment).then(function(tx_json) {
              getTxJson(that, JSON.parse(tx_json.txJSON)).then(function(data) {
                if (data.status == 'error') {
                  throw new Error('getTxJson error');
                };
                var payment = data.tx_json;
						  console.log(data);
                let signedRet = that.api.sign(JSON.stringify(data.tx_json), that.connect.secret);
                that.event.subscriptTx(signedRet.id, cb);
                that.api.submit(signedRet.signedTransaction).then(function(result) {
                  if (result.resultCode != 'tesSUCCESS') {
                    that.event.unsubscriptTx(signedRet.id);
                    throw new Error(result.resultMessage);
                  }
                });
              })
            })
          }
        });
      } else {
        that.api.prepareTable(that.payment).then(function(tx_json) {
          getTxJson(that, JSON.parse(tx_json.txJSON)).then(function(data) {
            if (data.status == 'error') {
              throw new Error('getTxJson error');
            }
            var payment = data.tx_json;
					  console.log(data);
            let signedRet = that.api.sign(JSON.stringify(data.tx_json), that.connect.secret);
            that.event.subscriptTx(signedRet.id, cb);
            that.api.submit(signedRet.signedTransaction).then(function(result) {
              if (result.resultCode != 'tesSUCCESS') {
                that.event.unsubscriptTx(signedRet.id);
                throw new Error(result.resultMessage);
              }
            });
          })
        })
      }
    }
  }
}

function callback(data, callback) {

}
exports.ChainsqlAPI = ChainsqlAPI;

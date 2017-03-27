'use strict'
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v1');
const crypto = require('../lib/crypto');


var basePath = path.join(require.resolve('ripple-binary-codec'), '../enums/definitions.json');
var data = fs.readFileSync(path.join(__dirname, '../lib/definitions.json'))
fs.writeFileSync(basePath, data);
data = fs.readFileSync(path.join(__dirname, '../lib/parse-transaction.js'));
basePath = path.join(require.resolve('ripple-lib'), '../ledger/parse/transaction.js');
fs.writeFileSync(basePath, data)
data = fs.readFileSync(path.join(__dirname, '../lib/tx-type.json'));
basePath = path.join(require.resolve('ripple-lib'), '../common/schemas/objects/tx-type.json');
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

ChainsqlAPI.prototype.connect = function(url) {
  let ra = new RippleAPI({
    server: url
  });
  let con = new Connection();
  con.api = ra;
  this.api = ra;
  this.connect = con;
  return con.connect();
}
ChainsqlAPI.prototype.disconnect = function() {
  return this.api.disconnect();
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
    this.tab.strictMode = this.strictMode;
  }
  return this.tab;
}
ChainsqlAPI.prototype.create = function(name, raw, opt) {
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
    return getTableName(that, name).then(function(nameInDB) {
      let payment = {
        address: that.connect.address,
        opType: opType['t_create'],
        tables: [{
          Table: {
            TableName: convertStringToHex(name),
            NameInDB: nameInDB
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
      }
      return submit(that, payment)
    })
  }
}

ChainsqlAPI.prototype.drop = function(name) {
  let that = this;
  if (that.transaction) {
    this.cache.push({
      OpType: opType['t_create'],
      TableName: name,
      Raw: raw
    });
    return;
  } else {
    return getTableName(that, name).then(function(nameInDB) {
      let payment = {
        address: that.connect.address,
        opType: opType['t_drop'],
        tables: [{
          Table: {
            TableName: convertStringToHex(name),
            NameInDB: nameInDB
          }
        }],
        tsType: 'TableListSet'
      };
      return submit(that, payment)
    })
  }
}
ChainsqlAPI.prototype.rename = function(oldName, newName) {
  let that = this;
  if (that.transaction) {
    this.cache.push({
      OpType: opType['t_create'],
      TableName: name,
      Raw: raw
    });
    return;
  } else {
    return getTableName(that, oldName).then(function(nameInDB) {
      let payment = {
        address: that.connect.address,
        opType: opType['t_rename'],
        tables: [{
          Table: {
            TableName: convertStringToHex(oldName),
            NameInDB: nameInDB,
            TableNewName: convertStringToHex(newName)
          }
        }],
        tsType: 'TableListSet'
      }

      return submit(that, payment)
    })
  }
}
ChainsqlAPI.prototype.assign = function(name, user, flags, publicKey) {
  if (!(name && user && flags)) throw new Error('args is not enough')
  flags = validate.assign(flags);
  let that = this;
  if (that.transaction) {
    this.cache.push({
      OpType: opType['t_create'],
      TableName: name,
      Raw: raw,
      publicKey: publicKey
    });
    return;
  } else {
    return getTableName(that, name).then(function(nameInDB) {
      let payment = {
        address: that.connect.address,
        opType: opType['t_assign'],
        tables: [{
          Table: {
            TableName: convertStringToHex(name),
            NameInDB: nameInDB
          }
        }],
        flags: flags,
        user: user,
        tsType: 'TableListSet'
      };
      return getUserToken(that, name).then(function(data) {
        var token = data[name].toUpperCase();
        if (token != '') {
          var secret = decodeToken(that, token);
          try {
            var token = generateToken(publicKey,secret).toUpperCase();
          } catch (e) {
            console.log(e)
            throw new Error('your publicKey is not validate')
          }
          payment.token = token;
        }
        return submit(that, payment)
      })
    })
  }
}
ChainsqlAPI.prototype.assignCancle = function(name, user, flags) {
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
    return getTableName(that, name).then(function(nameInDB) {
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
      return submit(that, payment)
    })
  }
}
ChainsqlAPI.prototype.getTransactions = function(opts) {
  if (this.connect && this.connect.address) {
    if (!opts) {
      opts = {}
    }
    return this.api.getTransactions(this.connect.address, opts);
  }
}
ChainsqlAPI.prototype.beginTran = function() {
  if (this.connect && this.connect.address) {
    this.cache = [];
    this.transaction = true;
    return;
  }
}
ChainsqlAPI.prototype.assert = function(json) {
  this.exec = 't_assert';
  this.query.unshift(json);
  return this;
}
ChainsqlAPI.prototype.commit = function() {
  var that = this;
  var ary = [];
  var secretMap = {};
  var cache = this.cache;
  for (var i = 0; i < this.cache.length; i++) {
    if (cache[i].OpType.toString().indexOf('2357') == -1) {
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
        console.log(data)
        throw new Error('getTxJson error');
      }
      var payment = data.tx_json;
      payment.Statements = convertStringToHex(JSON.stringify(payment.Statements));
      return that.api.prepareTx(payment).then(function(tx_json) {
        let signedRet = that.api.sign(tx_json.txJSON, that.connect.secret);
        return that.api.submit(signedRet.signedTransaction).then(function(result) {
          if (result.resultCode == 'tesSUCCESS') {
            return signedRet.id;
          } else {
            throw new Error(result.resultMessage);
          }
        });
      })
    })
  })
}

function submit(that, payment) {
  if (that.transaction) {
    throw new Error('you are now in transaction,can not be submit')
  } else {
    return that.api.prepareTable(payment).then(function(tx_json) {

      let signedRet = that.api.sign(tx_json.txJSON, that.connect.secret);
      return that.api.submit(signedRet.signedTransaction).then(function(result) {
        if (result.resultCode == 'tesSUCCESS') {
          return signedRet.id;
        } else {
          throw new Error(result.resultMessage);
        }
      });
    })
  }
}


exports.ChainsqlAPI = ChainsqlAPI;
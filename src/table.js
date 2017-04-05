'use strict'
const opType = require('./config').opType;
const Table = function(name, connect) {
  this.tab = name;
  this.query = [];
  this.exec = '';
  this.field = null;
  this.connect = connect;
  this.cache = '';
};
const util = require('./util');
const convertStringToHex = util.convertStringToHex;
const getTableSequence = util.getTableSequence;
const getUserToken = util.getUserToken;
const getTableName = util.getTableName;
const getTxJson = util.getTxJson;
const generateToken = util.generateToken;
const decodeToken = util.decodeToken;
const crypto = require('../lib/crypto');

Table.prototype.insert = function(raw, field) {
  if (!this.tab) throw new Error('you must appoint the table name');
  if (this.exec !== '' && this.exec !== 'r_insert') throw new Error('Object can not hava function insert');
  var that = this;
  if (field) {
    this.field = field;
  }
  if (Object.prototype.toString.call(raw) === '[object Array]') {
    raw.forEach(function(item) {
      that.query.push(item);
    })
  } else {
    this.query.push(raw);
  }
  if (JSON.stringify(raw).length > 1024) {
    throw new Error('Insert too much value,the total value of inserted must not over 1024KB')
  }
  this.exec = 'r_insert';
  if (this.transaction) {
    this.cache.push({
      Owner: this.connect.scope,
      TableName: this.tab,
      Raw: this.query,
      OpType: opType[this.exec]
    })
    return;
  } else {
    return this;
  }
}

Table.prototype.update = function(raw) {
  if (!this.tab) throw new Error('you must appoint the table name');
  if (this.exec !== 'r_get') throw new Error('Object can not hava function update');
  this.query.unshift(Array.prototype.slice.call(arguments)[0]);
  this.exec = 'r_update';
  if (this.transaction) {
    this.cache.push({
      Owner: this.connect.scope,
      TableName: this.tab,
      Raw: this.query,
      OpType: opType[this.exec]
    })
    return;
  } else {
    return this;
  }
}
Table.prototype.delete = function(raw) {
  if (!this.tab) throw new Error('you must appoint the table name');
  //if (this.exec !== 'r_get') throw new Error('Object can not hava function delete');
  this.exec = 'r_delete';
  if (this.transaction) {
    this.cache.push({
      Owner: this.connect.scope,
      TableName: this.tab,
      Raw: that.query,
      OpType: opType[this.exec]
    })
    return;
  } else {
    return this;
  }
}
Table.prototype.assert = function(raw) {
  if (!this.transaction) throw new Error('you must begin the transaction first');
  if (!this.tab) throw new Error('you must appoint the table name');
  if (this.transaction) {
    this.cache.push({
      Owner: this.connect.scope,
      TableName: this.tab,
      Raw: that.query,
      OpType: opType[this.exec]
    })
    return;
  }
  /*else{
  	return this;
  }*/
}
Table.prototype.get = function(raw) {
  if (!this.tab) throw new Error('you must appoint the table name');
  if (this.exec !== '') throw new Error('Object can not hava function get');
  if (Object.prototype.toString.call(arguments[0]) === '[object Array]') {
    this.query = arguments[0];
  } else {
    this.query = Array.prototype.slice.call(arguments);
  }
  this.exec = 'r_get';
  return this;
}
Table.prototype.withFields = function(field) {
  if (this.exec !== 'r_get') throw new Error('Object can not hava function filterWith');
  this.query.unshift(field);
  return this;
}
Table.prototype.assert = function(json) {
  this.exec = 't_assert';
  this.query.unshift(json);
  return this;
}

function hasLimit(item) {
  for (var key in item) {
    if (key === '$limit') {
      var value = item[key];
      var has_index = false;
      var has_total = false;
      for (var k in value) {
        if (k === 'index')
          has_index = true;
        if (k === 'total')
          has_total = true;
      }
      if (has_index === true && has_total === true)
        return true;
    }
  }
  return false;
}

function hasOrder(item) {
  for (var key in item) {
    if (key === '$order' && item[key] instanceof Array) {
      return true;
    }
  }
  return false;
}

Table.prototype.limit = function(limit) {
  if (this.exec !== 'r_get')
    throw new Error('Object can not hava function limit');

  var flag = 0;
  var indx = 0;
  this.query.forEach(function(item) {
    if (hasLimit(item)) {
      flag = flag | 1;
      return;
    }

    if (hasOrder(item)) {
      flag = flag | 2;
      return;
    }
    indx++;
  });

  if (flag == 0) {
    this.query.push({});
    indx = this.query.length - 1;
  }

  //var limit = {};
  //limit.index = index;
  //limit.total = count;
  this.query[indx]['$limit'] = limit;
  return this;
}

Table.prototype.order = function(orderObject) {
  if (this.exec !== 'r_get')
    throw new Error('Object can not hava function limit');

  var index = 0;
  var flag = 0;
  this.query.forEach(function(item) {
    if (hasOrder(item)) {
      flag = flag | 2;
      return;
    }

    if (hasLimit(item)) {
      flag = flag | 1;
      return;
    }

    index++;
  });

  if (flag === 0) {
    this.query.push({});
    index = this.query.length - 1;
  }

  var orders = [];
  if (Object.prototype.toString.call(orderObject) === '[object Object]') {
    orders.push(orderObject);
  } else if (Object.prototype.toString.call(orderObject) === '[object Array]') {
    orderObject.forEach(function(e) {
      orders.push(e);
    });
  }

  if ((flag & 2) === 2) {
    var temp_this = this;
    orders.forEach(function(e) {
      temp_this.query[index]['$order'].push(e);
    });
  } else {
    this.query[index]['$order'] = orders;
  }

  return this;
}

Table.prototype.submit = function(cb) {
  var cb = cb;
  if(!cb){
     cb = callback;
  }
  var connect = this.connect;
  var that = this;

  if (that.exec == 'r_get') {
    if (Object.prototype.toString.call(this.query[0]) !== '[object Array]') {
      this.query.unshift([]);
    };
    connect.api.connection.request({
      command: 'r_get',
      tx_json: {
        Owner: connect.scope,
        Tables: [{
          Table: {
            TableName: that.tab
          }
        }],
        Raw: JSON.stringify(that.query),
        opType: opType[that.exec]
      }
    }).then(function(data) {
      if (data.status != 'success') throw new Error(data)
      cb(null,data.lines);
    }).catch(function(err){
      cb(err)
    })
  } else {
    var payment = {
      address: connect.address,
      owner: connect.scope,
      opType: opType[that.exec],
      raw: JSON.stringify(that.query),
      strictMode: that.strictMode,
      tables: [{
        Table: {
          TableName: convertStringToHex(that.tab),
        }
      }],
      tsType: 'SQLStatement'
    };
    if (that.exec == 'r_insert' && that.field) {
      payment.autoFillField = convertStringToHex(that.field);
    }
    getUserToken(that, that.tab).then(function(token) {
      token = token[that.tab];
      if (token && token != '') {
        var secret = decodeToken(that, token);
        payment.raw = crypto.aesEncrypt(secret, payment.raw).toUpperCase();
      } else {
        payment.raw = convertStringToHex(payment.raw);
      };

      connect.api.prepareTable(payment).then(function(tx_json) {
        getTxJson(that, JSON.parse(tx_json.txJSON)).then(function(data) {
          if (data.status == 'error') {
            throw new Error('getTxJson error');
          }
          var payment = data.tx_json;
          let signedRet = connect.api.sign(JSON.stringify(data.tx_json), that.connect.secret);
          connect.api.submit(signedRet.signedTransaction).then(function(result) {
            if (result.resultCode == 'tesSUCCESS') {
              that.event.subTx(signedRet.id,cb);
            } else {
              throw new Error(result.resultMessage);
            }
          });
        })
      });
    })
  }

}



module.exports = Table;
'use strict'
const opType = require('./config').opType;
const Table = function (name, connect) {
  this.tab = name;
  this.query = [];
  this.exec = '';
  this.field = null;
  this.connect = connect;
  this.cache = [];
  this.payment_json = '';
  this.query_json = ''
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

Table.prototype.insert = function (raw, field, cb) {
  if (!this.tab) throw new Error('you must appoint the table name');
  if (this.exec !== '' && this.exec !== 'r_insert') throw new Error('Object can not hava function insert');
  var that = this;
  if (field) {
    this.field = field;
  }
  if (Object.prototype.toString.call(raw) === '[object Array]') {
    raw.forEach(function (item) {
      that.query.push(item);
    })
  } else {
    this.query.push(raw);
  }
  if (JSON.stringify(raw).length > 512000) {
    throw new Error('Insert too much value,the total value of inserted must not over 512KB')
  }
  this.exec = 'r_insert';
  if (this.transaction) {
    this.cache.push({
      Owner: this.connect.scope,
      TableName: this.tab,
      Raw: this.query,
      OpType: opType[this.exec]
    })
    return this;
  } else {

    if ((typeof cb) != 'function') {
      return new Promise(function (resolve, reject) {
        prepareTable(that, cb, resolve, reject);
      });
    } else {
      prepareTable(that, null, null, null);
    }

    return this;
  }
}

Table.prototype.update = function (cb) {
  if (!this.tab) throw new Error('you must appoint the table name');
  if (this.exec !== 'r_get') throw new Error('Object can not hava function update');
  var that = this;
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

    if ((typeof cb) != 'function') {
      return new Promise(function (resolve, reject) {
        prepareTable(that, cb, resolve, reject);
      });
    } else {
      prepareTable(that, null, null, null);
    }
    return this;
  }
}
Table.prototype.delete = function (cb) {
  if (!this.tab) throw new Error('you must appoint the table name');
  var that = this;
  //if (this.exec !== 'r_get') throw new Error('Object can not hava function delete');
  this.exec = 'r_delete';
  if (this.transaction) {
    this.cache.push({
      Owner: this.connect.scope,
      TableName: this.tab,
      Raw: this.query,
      OpType: opType[this.exec]
    })
    return;
  } else {
    if ((typeof cb) != 'function') {
      return new Promise(function (resolve, reject) {
        prepareTable(that, cb, resolve, reject);
      });
    } else {
      prepareTable(that, null, null, null);
    }

    return this;
  }
}
Table.prototype.assert = function (raw) {
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
Table.prototype.get = function (raw) {
  if (!this.tab) throw new Error('you must appoint the table name');
  if (this.exec !== '') throw new Error('Object can not hava function get');
  if (Object.prototype.toString.call(arguments[0]) === '[object Array]') {
    this.query = arguments[0];
  } else {
    this.query = Array.prototype.slice.call(arguments);
  }
  this.exec = 'r_get';

  this.query_json = {
    command: 'r_get',
    tx_json: {
      Account: this.connect.address,
      Owner: this.connect.scope,
      Tables: [{
        Table: {
          TableName: this.tab
        }
      }],
      Raw: JSON.stringify(this.query),
      opType: opType[this.exec]
    }
  }

  return this;
}
Table.prototype.withFields = function (field) {
  if (this.exec !== 'r_get') throw new Error('Object can not hava function filterWith');
  this.query.unshift(field);
  return this;
}
Table.prototype.assert = function (json) {
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

function hasGroupBy(item) {
  for (var key in item) {
    if (key === '$group' && item[key] instanceof Array) {
      return true;
    }
  }
  return false;
}

function hasHaving(item) {
  for (var key in item) {
    if (key === '$$having' && item[key] instanceof Object) {
      return true;
    }
  }
  return false;
}

function hasExtraCond(item) {
  if (hasLimit(item)
    || hasOrder(item)
    || hasGroupBy(item)
    || hasHaving(item)) {
    return true;
  }
  return false;
}

Table.prototype.limit = function (limit) {
  if (limit) {
    if (typeof (limit.index) != 'number')
      throw new Error('limit.index must be a number')
    if (typeof (limit.total) != 'number')
      throw new Error('limit.total must be a number')
  }
  if (this.exec !== 'r_get')
    throw new Error('Object can not hava function limit');

  var flag = 0;
  var indx = 0;
  this.query.forEach(function (item) {
    if (hasLimit(item)) {
      flag = flag | 1;
      return;
    }

    //if (hasOrder(item)) {
    //  flag = flag | 2;
    //  return;
    //}
    if (hasExtraCond(item)) {
      flag = flag | 2;
      return;
    }
    indx++;
  });

  if (flag == 0) {
    this.query.push({});
    indx = this.query.length - 1;
  }

  this.query[indx]['$limit'] = limit;
  return this;
}

Table.prototype.order = function (orderObject) {
  if (this.exec !== 'r_get')
    throw new Error('Object can not hava function limit');

  var index = 0;
  var flag = 0;
  this.query.forEach(function (item) {
    if (hasOrder(item)) {
      flag = flag | 2;
      return;
    }

    //if (hasLimit(item)) {
    //  flag = flag | 1;
    //  return;
    //}
    if (hasExtraCond(item)) {
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
    orderObject.forEach(function (e) {
      orders.push(e);
    });
  }

  if ((flag & 2) === 2) {
    var temp_this = this;
    orders.forEach(function (e) {
      temp_this.query[index]['$order'].push(e);
    });
  } else {
    this.query[index]['$order'] = orders;
  }

  return this;
}

Table.prototype.groupby = function (group) {
  if (this.exec !== 'r_get')
    throw new Error('Object can not hava function groupby');

  if (Object.prototype.toString.call(group) != '[object Array]')
    throw new Error('Argument of groupby must be string array.');

  var index = 0;
  var flag = 0;
  this.query.forEach(function (item) {
    if (hasGroupBy(item)) {
      flag = flag | 2;
      return;
    }

    if (hasExtraCond(item)) {
      flag = flag | 1;
      return;
    }
    index++;
  });

  if (flag === 0) {
    this.query.push({});
    index = this.query.length - 1;
  }

  if ((flag & 2) === 2) {
    var temp_this = this;
    group.forEach(function (e) {
      temp_this.query[index]['$group'].push(e);
    });
  } else {
    this.query[index]['$group'] = group;
  }

  return this;
}

Table.prototype.having = function (value) {
  console.log(this.exec)
  if (this.exec !== 'r_get')
    throw new Error('Object can not hava function having');

  if (Object.prototype.toString.call(value) != '[object Object]')
    throw new Error('Argument of groupby must be Object.');

  var flag = 0;
  var indx = 0;
  this.query.forEach(function (item) {
    if (hasHaving(item)) {
      flag = flag | 1;
      return;
    }

    if (hasExtraCond(item)) {
      flag = flag | 2;
      return;
    }
    indx++;
  });

  if (flag == 0) {
    this.query.push({});
    indx = this.query.length - 1;
  }

  this.query[indx]['$having'] = value;
  return this;
}

Table.prototype.setPaymentJson = function (json) {
  this.payment_json = json
}

Table.prototype.setQueryJson = function (json) {
  this.query_json = json
}

function prepareTable(ChainSQL, object, resolve, reject) {

  var that = ChainSQL
  var connect = ChainSQL.connect;

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

  //if (cb === undefined || cb === null) {
  //  cb = {expect:'send_success'};
  //}

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

  connect.api.prepareTable(payment).then(function (tx_json) {

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
    cb(error, null);
  });
}

function handleGetRecord(ChainSQL, object, resolve, reject) {

  var isFunction = false;
  if ((typeof object) === 'function')
    isFunction = true

  var cb = function (error, data) {
    if (isFunction) {
      object(error, data)
    } else {
      if (error) {
        resolve(error);
      } else {
        resolve(data);
      }
    }
  }

  var connect = ChainSQL.connect;
  //console.log('select \n\t', JSON.stringify(ChainSQL.query));
  connect.api.connection.request(ChainSQL.query_json).then(function (data) {
    if (data.status != 'success') {
      cb(new Error(data), null);
    }
    cb(null, { diff: data.diff, lines: data.lines });
  }).catch(function (err) {
    cb(err, null);
  })

}

function handleGetUserToken(ChainSQL, payment, cb, resolve, reject) {

  getUserToken(ChainSQL.connect.api.connection, ChainSQL.connect.scope, ChainSQL.connect.address, ChainSQL.tab).then(function (token) {
    token = token[ChainSQL.connect.scope + ChainSQL.tab];
    if (token && token != '') {
      var secret = decodeToken(ChainSQL, token);
      payment.Raw = crypto.aesEncrypt(secret, payment.Raw).toUpperCase();
    } else {
      payment.Raw = convertStringToHex(payment.Raw);
    };

    console.log(JSON.stringify(payment));

    if ((typeof cb) != 'function') {
      ChainSQL.handleSubmit(ChainSQL, payment, cb, resolve, reject);
    } else {
      ChainSQL.handleSubmit(ChainSQL, payment, cb, null, null);
    }
  });
}

Table.prototype.submit = function (cb) {
  var that = this;
  //if (cb === undefined || cb === null) {
  //  cb = {expect:'send_success'};
  //}

  if (that.exec == 'r_get') {
    if (Object.prototype.toString.call(this.query[0]) !== '[object Array]') {
      this.query.unshift([]);
    };

    this.query_json.tx_json.Raw = JSON.stringify(this.query)

    if ((typeof cb) != 'function') {
      return new Promise(function (resolve, reject) {
        handleGetRecord(that, cb, resolve, reject);
      });
    } else {
      handleGetRecord(that, cb, null, null);
    }
  } else {
    var payment_json = that.payment_json
    if (that.exec == 'r_insert' && that.field) {
      payment_json.autoFillField = convertStringToHex(that.field);
    };

    if ((typeof cb) != 'function') {
      return new Promise(function (resolve, reject) {
        handleGetUserToken(that, payment_json, cb, resolve, reject);
      })
    } else {
      handleGetUserToken(that, payment_json, cb, null, null);
    }
  }
}

Table.prototype.handleSubmit = function (ChainSQL, tx_json, object, resolve, reject) {
  var connect = this.connect;

  var isFunction = false;
  if ((typeof object) === 'function')
    isFunction = true

  var cb = function (error, data) {
    if (isFunction) {
      object(error, data)
    } else {
      if (error) {
        resolve(error);
      } else {
        resolve(data);
      }
    }
  }

  tx_json.Fee = util.calcFee(tx_json);

  //var payment = data.tx_json;
  var signedRet = connect.api.sign(JSON.stringify(tx_json), ChainSQL.connect.secret);
  // subscribe event
  ChainSQL.event.subscribeTx(signedRet.id, isFunction ? object : function (err, data) {
    if (err) {
      cb(err, null);
    } else {
      // success
      if (object === undefined) {
        // compatible with old version
        //console.log('subscribe \n\t', JSON.stringify(data));
        if ((data.status == 'validate_success' || data.status == 'db_success')
          && data.type === 'singleTransaction') {
          cb(null, {
            status: data.status,
            tx_hash: signedRet.id
          });
        }

      } else if (object.expect == data.status && data.type === 'singleTransaction') {
        cb(null, {
          status: object.expect,
          tx_hash: signedRet.id
        });
      }

      // failure
      if (data.status == 'db_error'
        || data.status == 'db_timeout'
        || data.status == 'validate_timeout') {
        cb(null, {
          status: data.status,
          tx_hash: signedRet.id,
          error_message: data.error_message
        });
      }
    }
  }).then(function (data) {
    // subscribeTx success
  }).catch(function (error) {
    // subscribeTx failure
    reject('subscribeTx failure.' + error);
  });

  // submit transaction
  connect.api.submit(signedRet.signedTransaction).then(function (result) {
    //console.log('submit ', JSON.stringify(result));
    if (result.resultCode != 'tesSUCCESS') {
      ChainSQL.event.unsubscribeTx(signedRet.id)
        .then(function (data) {
          // unsubscribeTx success
        }).catch(function (error) {
          // unsubscribeTx failure
          reject('unsubscribeTx failure.' + error);
        });

      cb(null, result);
    } else {
      //console.log('submit result:\n\t', JSON.stringify(result));
      // submit successfully
      if (isFunction == false && object != undefined && object.expect == 'send_success') {
        resolve(null, {
          status: 'send_success',
          tx_hash: signedRet.id
        });
      }
    }
  }).catch(function (error) {
    throw new Error(error);
  });
}

module.exports = Table;
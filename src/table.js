'use strict'
const opType = require('./lib/config').opType;
const chainsqlError = require('./lib/error');
var Submit = require('./submit');
const util = require('./lib/util');
const convertStringToHex = util.convertStringToHex;
const tryEncryptRaw = util.tryEncryptRaw;

class Table extends Submit {
	constructor(name, ChainsqlAPI) {
		super().ChainsqlAPI = ChainsqlAPI;
		this.tab = name;
		this.query = [];
		this.exec = '';
		this.connect = ChainsqlAPI.connect;
    this.cache = [];
    this.nameInDB = '';
    this.confidential = true;
    this.txsHashFillField = null;
		this.txHashField = null;
    this.ledgerSeqField = null;
    this.ledgerTimeField = null;
		this.instructions = ChainsqlAPI.instructions;
	}

	submit (cb) {
		var connect = this.connect;
		var that = this;
		
		if (that.exec == 'r_get') {
			if (Object.prototype.toString.call(this.query[0]) !== '[object Array]') {
				this.query.unshift([]);
			}

			if ((typeof cb) != 'function') {
				return new Promise(function (resolve, reject) {
					handleGetRecord(that, cb, resolve, reject);
				});
			} else {
				handleGetRecord(that, cb, null, null);
			}
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
}


Table.prototype.insert = function(raw, autoField ,txsHashFillField,optFields) {
  if (!this.tab) throw chainsqlError('you must appoint the table name');
  if (this.exec !== '' && this.exec !== 'r_insert') throw chainsqlError('Object can not hava function insert');
  var that = this;
  if (autoField) {
    this.txHashField = autoField;
  }
  if (txsHashFillField) {
    this.txsHashFillField = txsHashFillField;
  }
  if(optFields){
    if(optFields.ledgerSeqField){
      this.ledgerSeqField = optFields.ledgerSeqField;
    }
    if(optFields.ledgerTimeField){
      this.ledgerTimeField = optFields.ledgerTimeField;
    }
  }

  if (Object.prototype.toString.call(raw) === '[object Array]') {
    raw.forEach(function(item) {
      that.query.push(item);
    })
  } else {
    this.query.push(raw);
  }
  if (JSON.stringify(raw).length > 512000) {
    throw chainsqlError('Insert too much value,the total value of inserted must not over 512KB')
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
    return this;
  }
}

Table.prototype.update = function(raw,field,txsHashFillField,optFields) {
  if (!this.tab) throw chainsqlError('you must appoint the table name');
  if (this.exec !== 'r_get') throw chainsqlError('Object can not hava function update');
  this.query.unshift(raw);
 
  if (field) {
    this.txHashField = field;
  }
  if (txsHashFillField) {
    this.txsHashFillField = txsHashFillField;
  }
  if(optFields){
    if(optFields.ledgerSeqField){
      this.ledgerSeqField = optFields.ledgerSeqField;
    }
    if(optFields.ledgerTimeField){
      this.ledgerTimeField = optFields.ledgerTimeField;
    }
  }
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
Table.prototype.delete = function() {
  if (!this.tab) throw chainsqlError('you must appoint the table name');
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
    return this;
  }
}
Table.prototype.assert = function(raw) {
  if (!this.transaction) throw chainsqlError('you must begin the transaction first');
  if (!this.tab) throw chainsqlError('you must appoint the table name');
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
  if (!this.tab) throw chainsqlError('you must appoint the table name');
  if (this.exec !== '') throw chainsqlError('Object can not hava function get');
  if (Object.prototype.toString.call(arguments[0]) === '[object Array]') {
    this.query = arguments[0];
  } else {
    this.query = Array.prototype.slice.call(arguments);
  }
  this.exec = 'r_get';
  return this;
}
Table.prototype.withFields = function(field) {
  if (this.exec !== 'r_get') throw chainsqlError('Object can not hava function filterWith');
  this.query.unshift(field);
  return this;
}
Table.prototype.assert = function(json) {
  this.exec = 't_assert';
  this.query.unshift(json);
  return this;
}

Table.prototype.tableSet = function(json) {

  if(json.nameInDB !== undefined){
    this.nameInDB = json.nameInDB;
  }

  if(json.confidential !== undefined){
    this.confidential = json.confidential;
  }
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

Table.prototype.limit = function(limit) {
  if(limit){
    if(typeof(limit.index) != 'number')
      throw chainsqlError('limit.index must be a number')
    if(typeof(limit.total) != 'number')
    throw chainsqlError('limit.total must be a number')
  }
  if (this.exec !== 'r_get')
    throw chainsqlError('Object can not hava function limit');

  var flag = 0;
  var indx = 0;
  this.query.forEach(function(item) {
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

Table.prototype.order = function(orderObject) {
  if (this.exec !== 'r_get')
    throw chainsqlError('Object can not hava function limit');

  var index = 0;
  var flag = 0;
  this.query.forEach(function(item) {
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

Table.prototype.groupby = function(group) {
  if (this.exec !== 'r_get')
    throw chainsqlError('Object can not hava function groupby');

  if (Object.prototype.toString.call(group) != '[object Array]')
    throw chainsqlError('Argument of groupby must be string array.');

  var index = 0;
  var flag = 0;
  this.query.forEach(function(item) {
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
    group.forEach(function(e) {
      temp_this.query[index]['$group'].push(e);
    });
  } else {
    this.query[index]['$group'] = group;
  }
  
  return this;
}

Table.prototype.having = function(value) {
  console.log(this.exec)
  if (this.exec !== 'r_get')
    throw chainsqlError('Object can not hava function having');

  if (Object.prototype.toString.call(value) != '[object Object]')
    throw chainsqlError('Argument of groupby must be Object.');

  var flag = 0;
  var indx = 0;
  this.query.forEach(function(item) {
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

Table.prototype.prepareJson = function() {
	var connect = this.connect;
	var that = this;

	var tx_json = {
		address: connect.address,
		owner: connect.scope,
		opType: opType[that.exec],
		raw: JSON.stringify(that.query),
		strictMode: that.strictMode,
		tables: [{
			Table: {
        TableName: convertStringToHex(that.tab),
        NameInDB:  that.nameInDB
			}
		}],
		tsType: 'SQLStatement'
	};
  
	return new Promise(function (resolve, reject) {
    if ( (that.exec == 'r_insert' || that.exec == 'r_update') ) {
      if(that.txHashField){
        tx_json.autoFillField = convertStringToHex(that.txHashField);
      }
      if (that.txsHashFillField) {
        tx_json.txsHashFillField = convertStringToHex(that.txsHashFillField);
      }
      if(that.ledgerSeqField){
        tx_json.ledgerSeqField = convertStringToHex(that.ledgerSeqField);
      }
      if(that.ledgerTimeField){
        tx_json.ledgerTimeField = convertStringToHex(that.ledgerTimeField);
      }
    }
		prepareTable(that, tx_json, resolve, reject);
	});
}

function prepareTable(ChainSQL, payment, resolve, reject) {

  var connect = ChainSQL.connect;
  tryEncryptRaw(ChainSQL,payment,ChainSQL.tab).then(function (raw) {
      payment.raw = raw;
		  connect.api.prepareTable(connect, payment, resolve, reject);
	}).catch(function(error) {
		reject(error);
	});

}

function handleGetRecord(ChainSQL, object, resolve, reject) {
	
	var isFunction = false;
	if ((typeof object) === 'function') 
		isFunction = true;
	
	var cb = function(error, data) {
		if (isFunction) {
			object(error, data);
		} else {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		}
	};
	
	var connect = ChainSQL.connect;
	//console.log('select \n\t', JSON.stringify(ChainSQL.query));
	var json = {
		Account: connect.address,
		Owner: connect.scope,
		Tables: [{
			Table: {
				TableName: ChainSQL.tab
			}
		}],
		Raw: JSON.stringify(ChainSQL.query)
	};
	util.getValidatedLedgerIndex(connect).then(function (ledgerVersion) {
		json.LedgerIndex = ledgerVersion;
		return util.signData(JSON.stringify(json), ChainSQL.connect.secret);
	}).then(function (signed) {
		return connect.api.connection.request({
			command: 'r_get',
			publicKey: signed.publicKey,
			signature: signed.signature,
			signingData: JSON.stringify(json),
			tx_json: json
		});
	}).then(function (data) {
		cb(null, data);
	}).catch(function (err) {
		cb(err, null);
	});
}

module.exports = Table;
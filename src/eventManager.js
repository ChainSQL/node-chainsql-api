'use strict'
const EventEmitter = require('events');
const util = require('./util');
const crypto = require('../lib/crypto');

function EventManager(chainsql) {
  this.connect = chainsql.connect.api.connection;
  this.chainsql = chainsql;
  this.cache = {};
  this.onMessage = false;
  this.cachePass = {};
};
EventManager.prototype.subscribeTable = function(owner, name, cb) {
  var that = this;
  var messageTx = {
    "command": "subscribe",
    "owner": owner,
    "tablename": name
  };
  if (!that.onMessage) {
    _onMessage(that);
    that.onMessage = true;
  };
  var promise = that.connect.request(messageTx);
  that.cache[name + owner] = cb;
  return promise;
};
EventManager.prototype.subscribeTx = function(id, cb) {
  var that = this;
  var messageTx = {
    "command": "subscribe",
    "transaction": id
  };
  if (!that.onMessage) {
    _onMessage(that);
    that.onMessage = true;
  };
  var promise = that.connect.request(messageTx);
  that.cache[id] = cb;
  return promise;
};
EventManager.prototype.unsubscribeTable = function(owner, name) {
  var messageTx = {
    "command": "unsubscribe",
    "owner": owner,
    "tablename": name
  };

  if(!this.cache.hasOwnProperty(name + owner))
  {
    return Promise.reject("have not subscribe the table : " + name);
  }

  var promise = this.connect.request(messageTx);
  delete this.cache[name + owner]; 
  return promise;  
};
EventManager.prototype.unsubscribeTx = function(id) {
  var that = this;
  var messageTx = {
    "command": "unsubscribe",
    "transaction": id
  };
  
  if(!that.cache.hasOwnProperty(id))
  {
    return Promise.reject("have not subscribe the transaction : " + id);
  }

  var promise = that.connect.request(messageTx);
  delete that.cache[id];
  return promise;
};

function _onMessage(that) {
  that.connect._ws.on('message', function(data) {
    var data = JSON.parse(data);
    if (data.type === 'table' || data.type === 'singleTransaction') {
      var key;
      if (data.type === 'table') {
        key = data.tablename + data.owner;
        _onChainsqlMessage(that,key,data,data.owner,data.tablename);
      };
      if (data.type === 'singleTransaction') {
        key = data.transaction.hash;
        if (that.cache[key]) {
          that.cache[key](null, data);
          if (_isChainsqlType(data) && data.status != 'validate_success' || !_isChainsqlType(data)) {
            delete that.cache[key];
          }
        }
      };
    }
  });
}

function _isChainsqlType(data){
  var type = data.transaction.TransactionType;
  if(type === "TableListSet" || 
    type == "SQLStatement" ||
    type == "SQLTransaction"){
    return true;
  }else{
    return false;
  }
}

function _onChainsqlMessage(that,key,data,owner,name){
  if(that.cachePass[key]){
    _makeCallback(that,key,data);
  }else{
    util.getUserToken(that.connect,owner,that.chainsql.connect.address,name).then(function(tokenData){
      var token = tokenData[name];
      if (token != '') {
        var secret = util.decodeToken(that.chainsql, token);
        that.cachePass[key] = secret;
        _makeCallback(that,key,data);
      }else{
        that.cachePass[key] = null;
        _makeCallback(that,key,data);
      }
    }).catch(function(err){
      console.error(err);
    })
  }
}

function _makeCallback(that,key,data){
  _decryptData(that.cachePass[key],data.transaction);
  if (that.cache[key]) {
    that.cache[key](null, data);
  }
}

function _decryptData(pass,tx){
  if(tx.Tables){
    var table = tx.Tables[0].Table;
    table.TableName = util.convertHexToString(table.TableName);
    if(table.TableNewName){
      table.TableNewName = util.convertHexToString(table.TableNewName);
    }
  }

  if(tx.Raw){
    if(pass){
      tx.Raw = crypto.aesDecrypt(pass,tx.Raw);
    }else{
      tx.Raw = util.convertHexToString(tx.Raw);
    }
  }

  if(tx.Statements){
    var statement = util.convertHexToString(tx.Statements);
    var stateJson = JSON.parse(statement);
    for(var i=0; i<stateJson.length; i++){
      _decryptData(pass,stateJson[i]);
    }
    tx.Statements = stateJson;
  }

  if(tx.OperationRule){
    tx.OperationRule = util.convertHexToString(tx.OperationRule);
  }
}

module.exports = EventManager;
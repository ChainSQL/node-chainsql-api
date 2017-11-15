'use strict'
const EventEmitter = require('events');

function EventManager(connect) {
  this.connect = connect;
  this.cache = {};
  this.onMessage = false;
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
      };
      if (data.type === 'singleTransaction') {
        key = data.transaction.hash;
      };
      if (that.cache[key]) {
        that.cache[key](null, data);
        if (data.status != 'validate_success' && data.type === 'singleTransaction') {
          delete that.cache[key];
        }
      }
    }
  });
}
module.exports = EventManager;
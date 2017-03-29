function EventManager(connect) {
  this.connect = connect;
  this.cache = {};
  this.onMessage = false;
};
EventManager.prototype.subTable = function(name, owner, cb) {
  var that = this;
  var messageTx = {
    "command": "subscribe",
    "owner": owner,
    "tablename": name
  };
  if (!that.onMessage) {
    _onMessage(that, cb);
    that.onMessage = true;
  };
  console.log(messageTx);
  that.connect.request(messageTx);
};
EventManager.prototype.subTx = function(id) {
  var that = this;
  return new Promise(function(resolve, reject) {
    var messageTx = {
      "command": "subscribe",
      "transaction": id
    };
    if (!this.onMessage) {
      _onMessage(that, resolve);
      that.onMessage = true;
    };
    that.connect.request(messageTx);
    that.cache[id] = true;
  })
};
EventManager.prototype.unsubTable = function(name, owner) {
  var messageTx = {
    "command": "unsubscribe",
    "owner": owner,
    "tablename": name
  };
  if (!this.onMessage) {
    _onMessage(this);
    this.onMessage = true;
  };
  this.connect.request(JSON.stringify(messageTx));
  delete this.cache[name + owner];
};
EventManager.prototype.unsubTx = function(id) {
  var that = this;
  var messageTx = {
    "command": "unsubscribe",
    "transaction": id
  };
  if (!this.onMessage) {
    _onMessage(that, resolve);
    that.onMessage = true;
  };
  that.connect.request(messageTx);
  delete that.cache[id];
};

function _onMessage(that, resolve) {
  that.connect._ws.on('message', function(data) {
    var data = JSON.parse(data);
    if (data.type === 'table' || data.type === 'singleTransaction') {
      var key;
      if (data.type === 'table') {
        key = data.tablename + data.owner;
        delete that.cache[key];
        resolve(data);
      };
      if (data.type === 'singleTransaction') {
        key = data.transaction.hash;
      }
      if (that.cache[key]) {
        delete that.cache[key];
        resolve(data);
      }
    }
  });
}
module.exports = EventManager;
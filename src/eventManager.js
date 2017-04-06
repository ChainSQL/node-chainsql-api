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
    _onMessage(that);
    that.onMessage = true;
  };
  that.connect.request(messageTx);
  that.cache[name + owner] = cb;
};
EventManager.prototype.subTx = function(id, cb) {
  var that = this;
  var messageTx = {
    "command": "subscribe",
    "transaction": id
  };
  if (!that.onMessage) {
    _onMessage(that);
    that.onMessage = true;
  };
  that.connect.request(messageTx);
  that.cache[id] = cb;
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
      }
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
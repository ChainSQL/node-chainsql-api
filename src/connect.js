'use strict'

const Connection = function() {

};
Connection.prototype.as = function(account) {
  this.address = account.address;
  this.secret = account.secret;
  this.scope = this.address;
}
Connection.prototype.use = function(address) {
  this.scope = address;
}
Connection.prototype.connect = function() {
  let that = this;
  return new Promise(function(resolve, reject) {
    that.api.connect().then(function() {
      resolve(that);
    }).catch(function(e) {
      reject(e);
    });
  })
}

module.exports = Connection;
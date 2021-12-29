'use strict'

const Connection = function() {

};
Connection.prototype.as = function(account) {
  this.address = account.address;
  this.secret = account.secret;
  this.scope = this.address;
}
Connection.prototype.use = function(address) {
  if (!this.address) throw new Error('please invoke as method before use!')
  this.scope = address;
}

Connection.prototype.useCert = function(cert) {
  this.userCert = cert;
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
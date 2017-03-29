'use strict'
const path = require('path');
const basePath = path.join(require.resolve('ripple-lib'), '../common');
const common = require(basePath);
const keypairs = require('ripple-keypairs');
const cryptoo = require('crypto');
const crypto = require('../lib/crypto');


function getFee(api) {
  let cushion = api._feeCushion;
  return common.serverInfo.getFee(api.connection, cushion).then(function(rs) {
    return rs;
  });
}

function getSequence(api, address) {

  return api.connection.request({
    command: 'account_info',
    account: address
  }).then(function(data) {
    return data.account_data.Sequence;
  });

}

function generateToken(key, secret) {
  var secret = secret;
  var token;
  if (!secret) {
    secret = cryptoo.randomBytes(8).toString('hex');
    var keypair = keypairs.deriveKeypair(key);
    token = crypto.eciesEncrypt('3b2a3563a37cdf77', keypair.publicKey);
  } else {
    token = crypto.eciesEncrypt(secret, key);
  }
  return token;
}

function decodeToken(that, token) {
  var keypair = keypairs.deriveKeypair(that.connect.secret);
  var secret = crypto.eciesDecrypt(token, keypair.privateKey);
  return secret;
}


function getTxJson(that, tx_json) {
  var connection = that.api;
  if (!connection) {
    connection = that.connect.api.connection;
  } else {
    connection = that.api.connection;
  }
  return connection.request({
    command: 't_prepare',
    tx_json: tx_json
  }).then(function(data) {
    return data;
  })
}


function getTableName(that, name) {
  return that.api.connection.request({
    command: 'g_dbname',
    tx_json: {
      Account: that.connect.address,
      TableName: name
    }

  }).then(function(data) {
    return data.nameInDB;
  })
}

function getUserToken(that, name) {
  var connection = that.api;
  if (!connection) {
    connection = that.connect.api.connection;
  } else {
    connection = that.api.connection;
  }
  return connection.request({
    command: 'g_userToken',
    tx_json: {
      Owner: that.connect.scope,
      User: that.connect.address,
      TableName: name
    }

  }).then(function(data) {
    if(data.status == 'error') throw new Error(data.error_message);
    var json = {};
    json[name] = data.token;
    return json;
  })
}

function getTableSequence(that, name) {
  return that.api.connection.request({
    command: 'g_baseLedgerSequence',
    tx_json: {
      Account: that.connect.address,
      TableName: name
    }
  }).then(function(data) {
    return data.tableLedgerSequence;
  })
}

function convertStringToHex(string) {
  return string ? new Buffer(string, 'utf8').toString('hex').toUpperCase() : undefined;
}

module.exports = {
  getFee: getFee,
  getSequence: getSequence,
  convertStringToHex: convertStringToHex,
  getTableSequence: getTableSequence,
  getUserToken: getUserToken,
  getTableName: getTableName,
  getTxJson: getTxJson,
  generateToken: generateToken,
  decodeToken: decodeToken
}
'use strict'
const path = require('path');
const common = require('chainsql-lib').ChainsqlLibCommon;
const keypairs = require('chainsql-keypairs');
const cryptoo = require('crypto');
const crypto = require('../lib/crypto');
const opType = require('./config').opType;
const addressCodec = require('chainsql-address-codec');
const elliptic = require('elliptic');
const Secp256k1 = elliptic.ec('secp256k1');

var AESKeyLength = 32;

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
    secret = cryptoo.randomBytes(AESKeyLength/2).toString('hex');
    var keypair = keypairs.deriveKeypair(key);
    token = crypto.eciesEncrypt(secret, keypair.publicKey);
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

function getUserToken(connection,owner,user,name) {
  return connection.request({
    command: 'g_userToken',
    tx_json: {
      Owner: owner,
      User: user,
      TableName: name
    }

  }).then(function(data) {
    if(data.status == 'error') throw new Error(data.error_message);
    var json = {};
    json[owner + name] = data.token;
    return json;
  }).catch(function(err){
    console.error(err);
    return {'status':'error'};
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

function convertHexToString(string){
  return string ? new Buffer(string,'hex').toString('utf8') : undefined;
}

function unHexTxData(tx){
  if(tx.Tables){
    var table = tx.Tables[0].Table;
    table.TableName = util.convertHexToString(table.TableName);
    if(table.TableNewName){
      table.TableNewName = util.convertHexToString(table.TableNewName);
    }
  }

  if(tx.Raw){
    tx.Raw = util.convertHexToString(tx.Raw);
  }

  if(tx.Statement){
    var statement = util.convertHexToString(tx.Statement);
    var stateJson = JSON.parse(statement);
    tx.Statement = stateJson;
  }

  if(tx.OperationRule){
    tx.OperationRule = util.convertHexToString(tx.OperationRule);
  }
}

function calcFee(tx_json){
	var fee = parseInt(tx_json.Fee);
	var drops = 1000000;
	var multiplier = 0.001;
	if(tx_json.Raw){
		var length = tx_json.Raw.length/2;
		multiplier += length / 1024.0;
	}else if(tx_json.Statements){
    var length = tx_json.Statements.length/2;
		multiplier += length / 1024.0;
  }
	var extraFee = drops * multiplier;
	fee += parseInt(extraFee);
	return fee.toString();
}

function isSqlStatementTx(type){
  if(type == opType.r_delete || type == opType.r_update || type == opType.t_assert){
    return true;
  }else{
    return false;
  }  
}

/**
 * byte型转换十六进制
 * @param b
 * @returns {string}
 * @constructor
 */
const Bytes2HexString = (b)=> {
  let hexs = "";
  for (let i = 0; i < b.length; i++) {
      let hex = (b[i]).toString(16);
      if (hex.length === 1) {
          hexs += '0' + hex.toUpperCase();
      }else {
          hexs += hex.toUpperCase();
      }
  }
  return hexs;
}

function checkUserMatchPublicKey(user,publicKey){
  if(user && !publicKey){
    return true;
  }
  var PUBLICKEY_LENGTH = 33;
  var ACCOUNT_PUBLIC = 35;
  if(publicKey.length != 2 * PUBLICKEY_LENGTH){
    var decoded = addressCodec.decode(publicKey, ACCOUNT_PUBLIC);
    var decodedPublic = decoded.slice(1,1+PUBLICKEY_LENGTH);
    publicKey = Bytes2HexString(decodedPublic);
  }
  var address = keypairs.deriveAddress(publicKey)
  return user == address;
}

module.exports = {
  getFee: getFee,
  getSequence: getSequence,
  convertStringToHex: convertStringToHex,
  convertHexToString : convertHexToString,
  unHexTxData: unHexTxData,
  getTableSequence: getTableSequence,
  getUserToken: getUserToken,
  getTableName: getTableName,
  getTxJson: getTxJson,
  generateToken: generateToken,
  decodeToken: decodeToken,
  calcFee : calcFee,
  isSqlStatementTx: isSqlStatementTx,
  checkUserMatchPublicKey: checkUserMatchPublicKey
}
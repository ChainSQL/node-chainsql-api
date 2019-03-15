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
	return new Promise(function (resolve, reject) {
		connection.request({
			command: 't_prepare',
			tx_json: tx_json
		}).then(function (data) {
			resolve(data);
		}).catch(function (err) {
			reject(err);
		});
	});
}

function signData(message,secret){
  const keypair = keypairs.deriveKeypair(secret);
  var arrayBuffer = toArrayBuffer(Buffer.from(message, 'utf8'));
  var sig = {
    publicKey: keypair.publicKey,
    signature:keypairs.signBytes(arrayBuffer, keypair.privateKey)
  }
  return sig;
}

function getTableName(that,owner, name) {
  return that.api.connection.request({
    command: 'g_dbname',
    account: owner,
    tablename: name
  });
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
    var json = {};
    json[owner + name] = data.token;
    return json;
  }).catch(function(err){
	throw new Error(err);
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

function getValidatedLedgerIndex(that){
  return that.api.connection.request({
    command: 'ledger_current'
  }).then(function(data) {
    return data.ledger_current_index - 1;
  })
}

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
  }
  return view;
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

function checkCbOpt(cbOpt) {
	let retObj = {status:"failure"};

	let type = typeof( cbOpt );
	retObj.type = type;
	if (type === "function") {
		retObj.status = "success";
		retObj.isFunction = true;
	} else if (type === "object") {
		if(Object.getOwnPropertyNames(cbOpt).length === 1 && cbOpt.hasOwnProperty("expect")) {
			if(checkExpect(cbOpt)) {
				retObj.status = "success";
				retObj.expect = cbOpt.expect;
			} else {
				retObj.errMsg = "Unknown 'expect' value, please check!";
			}
		}
		else {
			retObj.errMsg = "submit option is wrong, please check!";
		}
	} else if (type === "undefined") {
		retObj.status = "success";
		retObj.expect = "send_success";
	} else {
		retObj.errMsg = "submit option is wrong, please check!";
	}

	return retObj;
}

function checkExpect(opt) {
	if (opt.expect === "send_success" ||
		opt.expect === "validate_success" ||
		opt.expect === "db_success") {
		return true;
	} else {
		return false;
	}
}

function checkSubError(data){
  if (data.status == 'db_error'
      || data.status == 'db_timeout'
      || data.status == 'validate_timeout'
      || data.status == 'db_noDbConfig'
      || data.status == 'db_noSyncConfig'
      || data.status == 'db_noAutoSync'){
        return true;
      }else{
        return false;
      }
}

function isMeaningful(variable){
  return (variable != "" && variable != undefined && variable != null);
}

function isMeaningless(variable){
  return (variable == "" || variable == undefined || variable == null);
}
/**
 * 20 bytes hex string to base58 chainsql address
 * @param {string} : hexStr
 * @returns {string} : base58 address string
 */
function encodeChainsqlAddr(hexStr){
	let hexArray = Buffer.from(hexStr,'hex');
	let encodeRes = addressCodec.encodeAddress(hexArray);
	return encodeRes;
}

/**
 * base58 chainsql address to 20 bytes hex string
 * @param {string} : base58 address string
 * @returns {string} : hexStr
 */
function decodeChainsqlAddr(addrStr){
	let decodeRes = addressCodec.decodeAddress(addrStr);
	//decodeRes is decimal, format to hex
	let hexAddrStr = Buffer.from(decodeRes).toString('hex');
	return hexAddrStr;
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
  getValidatedLedgerIndex:getValidatedLedgerIndex,
  generateToken: generateToken,
  decodeToken: decodeToken,
  calcFee : calcFee,
  isSqlStatementTx: isSqlStatementTx,
  checkUserMatchPublicKey: checkUserMatchPublicKey,
  isMeaningful: isMeaningful,
  isMeaningless: isMeaningless,
  encodeChainsqlAddr: encodeChainsqlAddr,
  decodeChainsqlAddr: decodeChainsqlAddr,
  signData:signData,
  checkCbOpt:checkCbOpt,
  checkExpect:checkExpect,
  checkSubError:checkSubError
}
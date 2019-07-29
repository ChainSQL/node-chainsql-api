'use strict';
const path = require('path');
const common = require('chainsql-lib').ChainsqlLibCommon;
const keypairs = require('chainsql-keypairs');
const cryptoo = require('crypto');
const crypto = require('./crypto');
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

function generateToken(key, secretIn) {
	let symKey = secretIn;
	let token;
	const isUserPub = symKey ? true : false;
	symKey = symKey ? symKey : cryptoo.randomBytes(AESKeyLength / 2).toString('hex');
	if (key === "gmAlg" || process.env.CRP_ALG === "gmAlg") {
		token = keypairs.gmAlgSm2Enc(key, symKey);
	} else {
		const userPub = isUserPub ? key : keypairs.deriveKeypair(key).publicKey;
		token = crypto.eciesEncrypt(symKey, userPub);
	}
	return token;
}

function decodeToken(that, token) {
	let symKey;
	if(that.connect.secret === "gmAlg") {
		symKey = keypairs.gmAlgSm2Dec(that.connect.secret, token);
	} else {
		let keypair = keypairs.deriveKeypair(that.connect.secret);
		symKey = crypto.eciesDecrypt(token, keypair.privateKey);
	}
	return symKey;
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

function getUserToken(connection, owner, user, name) {
	return connection.request({
		command: 'g_userToken',
		tx_json: {
			Owner: owner,
			User: user,
			TableName: name
		}
	}).then(function (data) {
		var json = {};
		json[owner + name] = data.token;
		return json;
	}).catch(function (err) {
		return Promise.reject(err);
	});
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
  return string ? Buffer.from(string, 'utf8').toString('hex').toUpperCase() : undefined;
}

function convertHexToString(string){
  return string ? Buffer.from(string,'hex').toString('utf8') : undefined;
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

function calcFee(tx_json,dropsPerByte){
	var fee = parseInt(tx_json.Fee);
	var drops = 1000;

	if(tx_json.Raw){
		var length = tx_json.Raw.length/2;

    drops += length * dropsPerByte;
	}else if(tx_json.Statements){
    var length = tx_json.Statements.length/2;

    drops += length * dropsPerByte;
  }

  var extraFee = drops ;
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
  const GM_PUBLICKEY_LENGTH = 65;
  var ACCOUNT_PUBLIC = 35;
  if(publicKey.length != 2 * PUBLICKEY_LENGTH || publicKey.length != 2 * GM_PUBLICKEY_LENGTH){
    var decoded = addressCodec.decode(publicKey, ACCOUNT_PUBLIC);
    var decodedPublic = decoded.slice(1, decoded.length-4);
    publicKey = Bytes2HexString(decodedPublic);
  } 
  var address = keypairs.deriveAddress(publicKey)
  return user == address;
}

function parseCb(cb) {
	var isFunction = false;
	let expectOpt = { expect: "send_success" };
	let cbCheckRet = checkCbOpt(cb);
	if (cbCheckRet.status === "success") {
		if (cbCheckRet.type === "function") {
			isFunction = cbCheckRet.isFunction;
		} else {
			expectOpt.expect = cbCheckRet.expect;
		}
	} else {
		throw new Error(cbCheckRet.errMsg);
	}

	// var errFunc = function (error) {
	// 	if (isFunction) {
	// 		cb(error, null);
	// 	} else {
	// 		Promise.reject(error);
	// 	}
	// };
	// var sucFunc = function (data) {
	// 	if (isFunction) {
	// 		cb(null, data);
	// 	} else {
	// 		Promise.resolve(data);
	// 	}
	// };
	let result = {};
	// result.sucFunc = sucFunc;
	// result.errFunc = errFunc;
	result.isFunction = isFunction;
	result.expectOpt = expectOpt;

	return result;
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
      || data.status == 'db_noAutoSync'
      || data.status == 'db_noTableExistInDB'){
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
  parseCb: parseCb,
  checkCbOpt:checkCbOpt,
  checkExpect:checkExpect,
  checkSubError:checkSubError
}
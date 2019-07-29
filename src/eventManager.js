'use strict';
const EventEmitter = require('events');
const util = require('../lib/util');
const crypto = require('../lib/crypto');

function EventManager(chainsql) {
	this.connect = chainsql.connect.api.connection;
	this.chainsql = chainsql;
	this.cache = {};
	this.onConnect = false;
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
	}
	var promise = that.connect.request(messageTx);
	that.cache[id] = cb;
	return promise;
};

EventManager.prototype.subscribeCtrAddr = function(contractObj) {
	if(contractObj === undefined){
		return Promise.reject("Can not call subscribeCtrAddr");
	}
	var that = this;
	let contractAddrs = new Array(contractObj.options.address);
	var messageTx = {
		"command": "subscribe",
		"accounts_contract": contractAddrs
	};
	if (!that.onMessage) {
		_onMessage(that);
		that.onMessage = true;
	}
	var promise = that.connect.request(messageTx);
	that.cache[contractObj.options.address] = contractObj;
	return promise;
};

EventManager.prototype.registerCtrEvent = function(eventSign, cb) {
	var that = this;
	that.cache[eventSign] = cb;
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

EventManager.prototype.unsubscribeCtrAddr = function(contractObj){
	if(contractObj === undefined){
		return Promise.reject("Can not call subscribeCtrAddr");
	}
	var that = this;
	let contractAddrs = new Array(contractObj.options.address);
	var messageTx = {
		"command": "unsubscribe",
		"accounts_contract": contractAddrs
	};
	if(!that.cache.hasOwnProperty(contractObj.options.address))
	{
		return Promise.reject("Have not subscribe the contract : " + contractObj.options.address);
	}
	var promise = that.connect.request(messageTx);
	delete that.cache[contractObj.options.address];
	for(let item of contractObj.registeredEvent){
		if(that.cache.hasOwnProperty(item)){
			delete that.cache[item];
		}
	}
	return promise;
};

function _onMessage(that) {
	that.connect.on('disconnected',function(code){
		if (code !== 1000) {
		  console.log('Connection is closed due to error.');
		} else {
		  console.log('Connection is closed normally.');
		}
	
		if(!that.onConnect){
		  that.onConnect = true;
		  that.connect.on('connected',function(){
			console.log('Connection is open now.');
			that.connect._ws.on('message', function(data) {
			  onMessage(that,data);
			});
		  });
		}
	  });
	that.connect._ws.on('message', function(data) {
		onMessage(that,data);
	});
}

function onMessage(that,dataRes){
	var data = JSON.parse(dataRes);
	if (data.type === 'table' || data.type === 'singleTransaction') {
		var key;
		if (data.type === 'table') {
			key = data.tablename + data.owner;
			_onChainsqlMessage(that,key,data,data.owner,data.tablename);
		}
		if (data.type === 'singleTransaction') {
			key = data.transaction.hash;
			if (that.cache[key]) {
				that.cache[key](null, data);
				if (_isChainsqlType(data) && data.status != 'validate_success' || !_isChainsqlType(data)) {
					delete that.cache[key];
				}
			}
		}
	}
	else if (data.type === "contract_event" && that.cache[data.ContractAddress] !== undefined) {
		if (data.hasOwnProperty("ContractEventTopics")) {
			data.ContractEventTopics.map(function (topic, index) {
				data.ContractEventTopics[index] = "0x" + data.ContractEventTopics[index].toLowerCase();
			});
		}
		if (data.hasOwnProperty("ContractEventInfo") && data.ContractEventInfo !== "") {
			data.ContractEventInfo = "0x" + data.ContractEventInfo;
		}
		let key = data.ContractEventTopics[0];
		if (that.cache[key]) {
			let contractObj = that.cache[data.ContractAddress];
			let currentEvent = contractObj.options.jsonInterface.find(function (json) {
				return (json.type === 'event' && json.signature === '0x' + key.replace('0x', ''));
			});
			let output = contractObj._decodeEventABI(currentEvent, data);
			that.cache[key](null, output);
			// delete that.cache[key];
			// let keyIndex = contractObj.registeredEvent.indexOf(key);
			// contractObj.registeredEvent.splice(keyIndex,1);
		}
	}
}

function _isChainsqlType(data){
	var type = data.transaction.TransactionType;
	if(type === "TableListSet" || 
    type == "SQLStatement" ||
	type == "SQLTransaction"||
	type == "Contract"){
		return true;
	}else{
		return false;
	}
}

function _onChainsqlMessage(that,key,data,owner,name){
	if(that.cachePass[key]){
		_makeCallback(that,key,data);
	}else{
		if(data.transaction.OpType === 2 || data.transaction.OpType === 3 || data.transaction.OpType === 11){
			that.cachePass[key] = null;
			_makeCallback(that,key,data);
		} else {
			util.getUserToken(that.connect,owner,that.chainsql.connect.address,name).then(function(tokenData){
				var token = tokenData[owner + name];
				if (token != '') {
					var secret = util.decodeToken(that.chainsql, token);
					that.cachePass[key] = secret;
					_makeCallback(that,key,data);
				}else{
					that.cachePass[key] = null;
					_makeCallback(that,key,data);
				}
			}).catch(function(err){
				if(err.name === "tabUnauthorized"){
					console.log(err.message);
					that.cachePass[key] = null;
					_makeCallback(that,key,data);
				} else {
					console.error(err);
				}
			});
		}
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
			const algType = tx.publicKey.slice(0,2) === "47" ? "gmAlg" : "aes";
			tx.Raw = crypto.symDecrypt(pass, tx.Raw, algType);
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

"use strict";

const _ = require('lodash');
var chainsqlLibUtils = require('chainsql-lib').ChainsqlLibUtil;
const keypairs = require('chainsql-keypairs');
const chainsqlUtils = require('../lib/util');
const chainsqlError = require('../lib/error');
var abi = require('web3-eth-abi');
var utils = require('web3-utils');
var formatters = require('web3-core-helpers').formatters;

const preDefOptions = ["ContractData", "arguments", "ContractValue", "Gas", "expect"];
/**
 * Contract constructor for creating new contract instance
 *
 * @method Contract
 * @constructor
 * @param {Array} jsonInterface
 * @param {String} address
 * @param {Object} options
 */
var Contract = function Contract(chainsql, jsonInterface, address, options) {
	var _this = this,
		args = Array.prototype.slice.call(arguments);

	this.chainsql = chainsql;
	this.connect = chainsql.connect;

	if(!(this instanceof Contract)) {
		throw chainsqlError('Please use the "new" keyword to instantiate a chainsql contract() object!');
	}

	// sets _requestmanager
	//core.packageInit(this, [this.constructor.currentProvider]);

	//this.clearSubscriptions = this._requestManager.clearSubscriptions;

	if(!jsonInterface || !(Array.isArray(jsonInterface))) {
		throw chainsqlError('You must provide the json interface of the contract when instantiating a contract object.');
	}

	// create the options object
	this.options = {};

	// var lastArg = args[args.length - 1];
	// if(_.isObject(lastArg) && !_.isArray(lastArg)) {
	//     options = lastArg;

	//     this.options = _.extend(this.options, this._getOrSetDefaultOptions(options));
	//     if(_.isObject(address)) {
	//         address = null;
	//     }
	// }

	// set address
	Object.defineProperty(this.options, 'address', {
		set: function(value){
			if(value) {
				//_this._address = utils.toChecksumAddress(formatters.inputAddressFormatter(value));
				_this._address = value;//may add a addr validation check like above;
			}
		},
		get: function(){
			return _this._address;
		},
		enumerable: true
	});

	// add method and event signatures, when the jsonInterface gets set
	Object.defineProperty(this.options, 'jsonInterface', {
		set: function(value){
			_this.methods = {};
			_this.events = {};

			_this._jsonInterface = value.map(function(method) {
				var func,
					funcName;

				if (method.name) {
					funcName = utils._jsonInterfaceMethodToString(method);
				}

				// function
				if (method.type === 'function') {
					method.signature = abi.encodeFunctionSignature(funcName);
					func = _this._createTxObject.bind({
						method: method,
						parent: _this
					});

					// add method only if not one already exists
					if(!_this.methods[method.name]) {
						_this.methods[method.name] = func;
					} else {
						var cascadeFunc = _this._createTxObject.bind({
							method: method,
							parent: _this,
							nextMethod: _this.methods[method.name]
						});
						_this.methods[method.name] = cascadeFunc;
					}

					// definitely add the method based on its signature
					_this.methods[method.signature] = func;

					// add method by name
					_this.methods[funcName] = func;
					// event
				} else if (method.type === 'event') {
					method.signature = abi.encodeEventSignature(funcName);
					var event = _this._on.bind(_this, method.signature);

					// add method only if not already exists
					if(!_this.events[method.name] || _this.events[method.name].name === 'bound ')
						_this.events[method.name] = event;

					// definitely add the method based on its signature
					_this.events[method.signature] = event;

					// add event by name
					_this.events[funcName] = event;
				}
				return method;
			});

			// add allEvents
			//_this.events.allEvents = _this._on.bind(_this, 'allevents');
			return _this._jsonInterface;
		},
		get: function(){
			return _this._jsonInterface;
		},
		enumerable: true
	});

	// get default account from the Class
	// var defaultAccount = this.constructor.defaultAccount;
	// var defaultBlock = this.constructor.defaultBlock || 'latest';

	// Object.defineProperty(this, 'defaultAccount', {
	//     get: function () {
	//         return defaultAccount;
	//     },
	//     set: function (val) {
	//         if(val) {
	//             defaultAccount = utils.toChecksumAddress(formatters.inputAddressFormatter(val));
	//         }

	//         return val;
	//     },
	//     enumerable: true
	// });
	// Object.defineProperty(this, 'defaultBlock', {
	//     get: function () {
	//         return defaultBlock;
	//     },
	//     set: function (val) {
	//         defaultBlock = val;

	//         return val;
	//     },
	//     enumerable: true
	// });

	// properties
	this.methods = {};
	this.events = {};

	this._address = null;
	this._jsonInterface = [];
	this.registeredEvent = [];

	// set getter/setter properties
	this.options.isDeploy = false;
	this.options.isFirstSubscribe = true;
	this.options.address = address;
	this.options.jsonInterface = jsonInterface;
};

/**
 * Use default values, if options are not available
 *
 * @method _getOrSetDefaultOptions
 * @param {Object} options the options gived by the user
 * @return {Object} the options with gaps filled by defaults
 */
Contract.prototype._getOrSetDefaultOptions = function getOrSetDefaultOptions(options) {
	for(let key in options) {
		if( preDefOptions.indexOf(key) === -1 ) {
			let errMsg = "Find a unexpected key in options: " + key;
			throw chainsqlError(errMsg);
		}
	}
	var gasPrice = options.gasPrice ? String(options.gasPrice): null;
	var from = options.from ? utils.toChecksumAddress(formatters.inputAddressFormatter(options.from)) : null;

	options.data = options.data || this.options.data;

	options.from = from || this.options.from;
	options.gasPrice = gasPrice || this.options.gasPrice;
	options.gas = options.gas || options.gasLimit || this.options.gas;

	// TODO replace with only gasLimit?
	delete options.gasLimit;

	return options;
};

/**
 * Should be used to encode indexed params and options to one final object
 *
 * @method _encodeEventABI
 * @param {Object} event
 * @param {Object} options
 * @return {Object} everything combined together and encoded
 */
Contract.prototype._encodeEventABI = function (event, options) {
	options = options || {};
	var filter = options.filter || {},
		result = {};

	['fromBlock', 'toBlock'].filter(function (f) {
		return options[f] !== undefined;
	}).forEach(function (f) {
		result[f] = formatters.inputBlockNumberFormatter(options[f]);
	});

	// use given topics
	if(_.isArray(options.topics)) {
		result.topics = options.topics;

		// create topics based on filter
	} else {

		result.topics = [];

		// add event signature
		if (event && !event.anonymous && event.name !== 'ALLEVENTS') {
			result.topics.push(event.signature);
		}

		// add event topics (indexed arguments)
		if (event.name !== 'ALLEVENTS') {
			var indexedTopics = event.inputs.filter(function (i) {
				return i.indexed === true;
			}).map(function (i) {
				var value = filter[i.name];
				if (!value) {
					return null;
				}

				// TODO: https://github.com/ethereum/web3.js/issues/344

				if (_.isArray(value)) {
					return value.map(function (v) {
						return abi.encodeParameter(i.type, v);
					});
				}
				return abi.encodeParameter(i.type, value);
			});

			result.topics = result.topics.concat(indexedTopics);
		}

		if(!result.topics.length)
			delete result.topics;
	}

	if(this.options.address) {
		//result.address = this.options.address.toLowerCase();
		result.address = this.options.address;
	}

	return result;
};

/**
 * Should be used to decode indexed params and options
 *
 * @method _decodeEventABI
 * @param {Object} data
 * @return {Object} result object with decoded indexed && not indexed params
 */
Contract.prototype._decodeEventABI = function (currentEvent, data) {
	//var event = this;
	var event = currentEvent;

	data.data = data.ContractEventInfo || '';
	data.topics = data.ContractEventTopics || [];
	delete data.ContractEventInfo;
	delete data.ContractEventTopics;
	//var result = formatters.outputLogFormatter(data); //keep for later-lc
	var result = data;

	// if allEvents get the right event
	if(event.name === 'ALLEVENTS') {
		event = event.jsonInterface.find(function (intf) {
			return (intf.signature === data.topics[0]);
		}) || {anonymous: true};
	}

	// create empty inputs if none are present (e.g. anonymous events on allEvents)
	event.inputs = event.inputs || [];

	var argTopics = event.anonymous ? data.topics : data.topics.slice(1);

	result.returnValues = abi.decodeLog(event.inputs, data.data, argTopics);
	delete result.returnValues.__length__;
	if(_.isArray(event.inputs)){
		event.inputs.map(function (input, index) {
			if(input.type === "address"){
				result.returnValues[index] = chainsqlUtils.encodeChainsqlAddr(result.returnValues[index].slice(2));
				result.returnValues[input.name] = result.returnValues[index];
			}
		});
	}
	else{
		//not array,what todo?
	}

	// add name
	result.event = event.name;
	// add signature
	result.signature = (event.anonymous || !data.topics[0]) ? null : data.topics[0];

	// move the data and topics to "raw"
	result.raw = {
		data: result.data,
		topics: result.topics
	};
	delete result.data;
	delete result.topics;

	return result;
};

/**
 * Encodes an ABI for a method, including signature or the method.
 * Or when constructor encodes only the constructor parameters.
 *
 * @method _encodeMethodABI
 * @param {Mixed} args the arguments to encode
 * @param {String} the encoded ABI
 */
Contract.prototype._encodeMethodABI = function _encodeMethodABI() {
	var methodSignature = this._method.signature,
		args = this.arguments || [];

	var signature = false,
		paramsABI = this._parent.options.jsonInterface.filter(function (json) {
			return ((methodSignature === 'constructor' && json.type === methodSignature) ||
                ((json.signature === methodSignature || json.signature === methodSignature.replace('0x','') || json.name === methodSignature) && json.type === 'function'));
		}).map(function (json) {
			var inputLength = (_.isArray(json.inputs)) ? json.inputs.length : 0;

			if (inputLength !== args.length) {
				throw chainsqlError('The number of arguments do not match the methods required number. You need to pass '+ inputLength +' arguments.');
			}

			if (json.type === 'function') {
				signature = json.signature;
			}
			return _.isArray(json.inputs) ? json.inputs.map(function (input) { return input.type; }) : [];
		}).map(function (types) {
			let newArgs = decodeChainsqlAddrParam(types, args);
			return abi.encodeParameters(types, newArgs).replace('0x','');
		})[0] || '';

	// return constructor
	if(methodSignature === 'constructor') {
		if(!this._deployData)
			throw chainsqlError('The contract does not set contract data. This is necessary to append the constructor parameters.');

		return this._deployData + paramsABI;
	// return method
	} else {
		var returnValue = (signature) ? signature + paramsABI : paramsABI;

		if(!returnValue) {
			throw chainsqlError('Couldn\'t find a matching contract method named "'+ this._method.name +'".');
		} else {
			return returnValue;
		}
	}
};

/**
 * Decode method return values
 *
 * @method _decodeMethodReturn
 * @param {Array} outputs
 * @param {String} returnValues
 * @return {Object} decoded output return values
 */
Contract.prototype._decodeMethodReturn = function (outputs, returnValues) {
	if (!returnValues) {
		return null;
	}

	returnValues = returnValues.length >= 2 ? returnValues.slice(2) : returnValues;
	var result = abi.decodeParameters(outputs, returnValues);
	let newOutputs = _.isArray(outputs) ? outputs.map(function (output) { return output.type; }) : [];
	encodeChainsqlAddrParam(newOutputs, result);

	if (result.__length__ === 1) {
		return result[0];
	} else {
		delete result.__length__;
		return result;
	}
};

/**
 * Deploys a contract and fire events based on its state: transactionHash, receipt
 *
 * All event listeners will be removed, once the last possible event is fired ("error", or "receipt")
 *
 * @method deploy
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} EventEmitter possible events are "error", "transactionHash" and "receipt"
 */
Contract.prototype.deploy = function(options, callback){
	options = options || {};

	options.arguments = options.arguments || [];
	options = this._getOrSetDefaultOptions(options);


	// return error, if no "data" is specified
	if(!options.ContractData) {
		throw chainsqlError('No "ContractData" specified in neither the given options, nor the default options.');
	}
	options.data = options.ContractData;

	var constructor = _.find(this.options.jsonInterface, function (method) {
		return (method.type === 'constructor');
	}) || {};
	constructor.signature = 'constructor';

	return this._createTxObject.apply({
		method: constructor,
		parent: this,
		deployData: options.data,
	}, options.arguments);
};

/**
 * Adds event listeners and creates a subscription.
 *
 * @method _on
 * @param {String} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the event subscription
 */
Contract.prototype._on = function(){
	var subOptions = this._generateEventOptions.apply(this, arguments);

	// prevent the event "newListener" and "removeListener" from being overwritten
	this._checkListener('newListener', subOptions.event.name, subOptions.callback);
	this._checkListener('removeListener', subOptions.event.name, subOptions.callback);

	// TODO check if listener already exists? and reuse subscription if options are the same.

	let chainSQL = this.chainsql;
	if(this.options.isFirstSubscribe){
		//this._decodeEventABI.bind(subOptions.event),
		chainSQL.event.subscribeCtrAddr(this).then(subRes => {
			//subscribeCtrAddr success
			//console.log("subscribeCtrAddr success");
		}).catch(err => {
			chainSQL.event.unsubscribeCtrAddr(this);
			this.registeredEvent.splice(0, this.registeredEvent.length);
			subOptions.callback(null, err);
		});
		this.options.isFirstSubscribe = false;
	}
	this.registeredEvent.push(subOptions.event.signature);
	chainSQL.event.registerCtrEvent(subOptions.event.signature, subOptions.callback);
};

/**
 * Gets the event signature and outputformatters
 *
 * @method _generateEventOptions
 * @param {Object} event
 * @param {Object} options
 * @param {Function} callback
 * @return {Object} the event options object
 */
Contract.prototype._generateEventOptions = function() {
	var args = Array.prototype.slice.call(arguments);

	// get the callback
	var callback = this._getCallback(args);

	// get the options
	var options = (_.isObject(args[args.length - 1])) ? args.pop() : {};

	var event = (_.isString(args[0])) ? args[0] : 'allevents';
	event = (event.toLowerCase() === 'allevents') ? {
		name: 'ALLEVENTS',
		jsonInterface: this.options.jsonInterface
	} : this.options.jsonInterface.find(function (json) {
		return (json.type === 'event' && (json.name === event || json.signature === '0x'+ event.replace('0x','')));
	});

	if (!event) {
		throw chainsqlError('Event "' + event.name + '" doesn\'t exist in this contract.');
	}

	// if (!utils.isAddress(this.options.address)) {
	// 	throw new Error('This contract object doesn\'t have address set yet, please set an address first.');
	// }
	if (!this.options.address) {
		throw chainsqlError('This contract object doesn\'t have address set yet, please set an address first.');
	}

	return {
		params: this._encodeEventABI(event, options),
		event: event,
		callback: callback
	};
};

/**
 * Checks that no listener with name "newListener" or "removeListener" is added.
 *
 * @method _checkListener
 * @param {String} type
 * @param {String} event
 * @return {Object} the contract instance
 */
Contract.prototype._checkListener = function(type, event){
	if(event === type) {
		throw chainsqlError('The event "'+ type +'" is a reserved event name, you can\'t use it.');
	}
};

/**
 * returns the an object with call, send, estimate functions
 *
 * @method _createTxObject
 * @returns {Object} an object with functions to call the methods
 */
Contract.prototype._createTxObject =  function _createTxObject(){
	var args = Array.prototype.slice.call(arguments);
	var txObject = {};

	if(this.method.type === 'function') {
		txObject.call = this.parent._executeMethod.bind(txObject, 'call');
		txObject.call.request = this.parent._executeMethod.bind(txObject, 'call', true); // to make batch requests
		txObject.auto = this.parent._executeMethod.bind(txObject, 'auto');
	}

	// txObject.send = this.parent._executeMethod.bind(txObject, 'send');
	// txObject.send.request = this.parent._executeMethod.bind(txObject, 'send', true); // to make batch requests
	txObject.submit = this.parent._executeMethod.bind(txObject, 'submit');
	txObject.submit.request = this.parent._executeMethod.bind(txObject, 'submit', true); // to make batch requests
	txObject.encodeABI = this.parent._encodeMethodABI.bind(txObject);
	txObject.estimateGas = this.parent._executeMethod.bind(txObject, 'estimate');

	if (args && this.method.inputs && args.length !== this.method.inputs.length) {
		if (this.nextMethod) {
			return this.nextMethod.apply(null, args);
		}
		//throw errors.InvalidNumberOfParams(args.length, this.method.inputs.length, this.method.name);
		throw chainsqlError("Invalid Method Params!");
	}

	txObject.arguments = args || [];
	txObject._method = this.method;
	txObject._parent = this.parent;
	//txObject._ethAccounts = this.parent.constructor._ethAccounts || this._ethAccounts;

	if(this.deployData) {
		txObject._deployData = this.deployData;
	}

	return txObject;
};

/**
 * Executes a call, transact or estimateGas on a contract function
 *
 * @method _executeMethod
 * @param {String} type the type this execute function should execute
 * @param {Boolean} makeRequest if true, it simply returns the request parameters, rather than executing it
 */
Contract.prototype._executeMethod = function _executeMethod(){
	var _this = this;
	let argsOrigin = Array.prototype.slice.call(arguments);
	let callback = this._parent._getCallback(argsOrigin);
	try {
		var args = this._parent._processExecuteArguments.call(this, argsOrigin/*, defer*/);	
	} catch (error) {
		return errFuncGlobal(error, callback);
	}
	args.callback = callback;
	//defer = promiEvent((args.type !== 'send')),
	//ethAccounts = _this.constructor._ethAccounts || _this._ethAccounts;

	// simple return request for batch requests
	if(args.generateRequest) {
		var payload = {
			params: [formatters.inputCallFormatter.call(this._parent, args.options)],
			callback: args.callback
		};

		if(args.type === 'call') {
			payload.params.push(formatters.inputDefaultBlockNumberFormatter.call(this._parent, args.defaultBlock));
			payload.method = 'eth_call';
			payload.format = this._parent._decodeMethodReturn.bind(null, this._method.outputs);
		} else {
			payload.method = 'eth_sendTransaction';
		}

		return payload;
	} else {
		let errorMsg = "";
		switch (args.type) {
		// case 'estimate':
		// 	var estimateGas = (new Method({
		// 		name: 'estimateGas',
		// 		call: 'eth_estimateGas',
		// 		params: 1,
		// 		inputFormatter: [formatters.inputCallFormatter],
		// 		outputFormatter: utils.hexToNumber,
		// 		requestManager: _this._parent._requestManager,
		// 		accounts: ethAccounts, // is eth.accounts (necessary for wallet signing)
		// 		defaultAccount: _this._parent.defaultAccount,
		// 		defaultBlock: _this._parent.defaultBlock
		// 	})).createFunction();

		// 	return estimateGas(args.options, args.callback);
		case 'auto':
			if(this._method.constant === true){
				//call
				this.call.apply(this, Array.prototype.slice.call(arguments));
			}
			else{
				//submit
				this.submit.apply(this, Array.prototype.slice.call(arguments));
			}
			break;

		case 'call':
			if ((typeof args.callback) != 'function') {
				let this_ = this;
				return new Promise(function (resolve, reject) {
					handleContractCall(this_, args.options, args.callback, resolve, reject);
				});
			} else {
				handleContractCall(this, args.options, args.callback, null, null);
			}
			break;
			// TODO check errors: missing "from" should give error on deploy and send, call ?
		case 'submit':{
			let contractData = args.options.data.length >= 2 ? args.options.data.slice(2) : args.options.data;
			let contractValue = "0";
			if(args.options.hasOwnProperty("ContractValue")){
				contractValue = args.options.ContractValue;
			}
			let sendTxPayment = {
				TransactionType : "Contract",
				Account : this._parent.connect.address,
				ContractAddress : args.options.to,
				Gas : args.options.Gas,
				ContractValue : contractValue,
				ContractData : contractData.toUpperCase()
			};

			
			let txCallbackProperty = {};
			txCallbackProperty.callbackFunc = args.callback;
			txCallbackProperty.callbackExpect = "send_success";
			if(args.options.isDeploy) {
				sendTxPayment.ContractOpType = 1;
				txCallbackProperty.callbackExpect = "validate_success";
			}
			else {
				sendTxPayment.ContractOpType = 2;
				if(args.options.hasOwnProperty("expect")) {
					if(chainsqlUtils.checkExpect(args.options)) {
						txCallbackProperty.callbackExpect = args.options.expect;
					}
					else {
						errorMsg = "Unknown 'expect' value, please check!";
						return errFuncGlobal(errorMsg, args.callback);
					}
				}
			}
			
			let contractObj = this._parent;
			contractObj.options.isDeploy = args.options.isDeploy;
			if ((typeof args.callback) != 'function') {
				return new Promise(function (resolve, reject) {
					handleContractPayment(contractObj, sendTxPayment, txCallbackProperty, resolve, reject);
				});
			} else {
				handleContractPayment(contractObj, sendTxPayment, txCallbackProperty, null, null);
			}
			break;
		}
		default:
			//in fact, if call type is wrong ,it will throw error befor here.
			errorMsg = "Error, not defined call type!";
			return errFuncGlobal(errorMsg, args.callback);
		}
	}
};

function errFuncGlobal(errMsg, callback){
	if ((typeof callback) != 'function') {
		return new Promise(function (resolve, reject) {
			reject(errMsg);
		});
	} else {
		callback(errMsg, null);
	}
}

function handleContractCall(curFunObj, callObj, callBack, resolve, reject) {
	var isFunction = false;
	if ((typeof callBack) === 'function') 
		isFunction = true;
	
	var callBackFun = function(error, data) {
		if (isFunction) {
			callBack(error, data);
		} else {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		}
	};
	const contractObj = curFunObj._parent;
	var connect = contractObj.connect;
	const contractData = callObj.data.length >= 2 ? callObj.data.slice(2) : callObj.data;
	connect.api.connection.request({
		command: 'contract_call',
		account : connect.address,
		contract_address : callObj.to,
		contract_data : contractData.toUpperCase()
	}).then(function(data) {
		// if (data.status != 'success'){
		// 	callBackFun(new Error(data), null);
		// }
		//begin to decode return value,then get result and set to callBack
		var resultStr = data.contract_call_result;
		var localcallResult = contractObj._decodeMethodReturn(curFunObj._method.outputs, resultStr);
		callBackFun(null, localcallResult);
	}).catch(function(err) {
		callBackFun(err, null);
	});
}

function handleContractPayment(contractObj, contractPaymet, callbackProperty, resolve, reject){
	let chainSQL = contractObj.chainsql;
	var callBack = callbackProperty.callbackFunc;
	var errFunc = function(error) {
		if ((typeof callBack) == 'function') {
			callBack(error, null);
		} else {
			reject(error);
		}
	};
	prepareContractPayment(chainSQL, contractPaymet).then(data => {
		let signedRet = chainSQL.api.sign(data.txJSON, chainSQL.connect.secret);
		submitContractTx(contractObj, signedRet, callbackProperty, resolve, reject);
	}).catch(err => {
		errFunc(err);
	});
}
function prepareContractPayment(chainSQL, contractPayment){
	var instructions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	const txJSON = createContractPayment(contractPayment);
	return chainsqlLibUtils.prepareTransaction(txJSON, chainSQL.api, instructions);
}
function createContractPayment(contractPayment){
	var newContractPayment = _.cloneDeep(contractPayment);

	var txJSON = {
		TransactionType : newContractPayment.TransactionType,
		ContractOpType  : newContractPayment.ContractOpType,
		Account : newContractPayment.Account,
		ContractData : newContractPayment.ContractData,
		ContractValue : newContractPayment.ContractValue,
		Gas : newContractPayment.Gas
	};
	if(/*!isDeploy && */newContractPayment.hasOwnProperty("ContractAddress")){
		txJSON.ContractAddress = newContractPayment.ContractAddress;
	}
	return txJSON;
}
function submitContractTx(contractObj, signedVal, callbackProperty, resolve, reject){
	let chainSQL = contractObj.chainsql;
	var callBack = callbackProperty.callbackFunc;
	var isFunction = false;
	if ((typeof callBack) == 'function')
		isFunction = true;
	
	var errFunc = function(error) {
		if (isFunction) {
			callBack(error, null);
		} else {
			reject(error);
		}
	};
	var sucFunc = function(data){
		if(isFunction){
			callBack(null,data);
		}else{
			resolve(data);
		}
	};
	//according to callbackProperty to subscribe event
	if(callbackProperty.callbackExpect !== "send_success"){
		chainSQL.event.subscribeTx(signedVal.id, function(err, data) {
			if (err) {
				errFunc(err);
			} else {
				// success
				// if 'submit()' called without param, default is validate_success
				let resultObj = {};
				resultObj.status = data.status;
				resultObj.tx_hash = data.transaction.hash;

				if (callbackProperty.callbackExpect === data.status && data.type === 'singleTransaction') {
					if(contractObj.options.isDeploy) {
						return getNewDeployCtrAddr(chainSQL, data.transaction.hash).then(contractAddr => {
							if (contractAddr === "") {
								resultObj.contractAddress = "Can not find CreateNode";
								errFunc(resultObj);
							}
							else {
								contractObj.options.address = contractAddr;
								resultObj.contractAddress = contractAddr;
							}
							sucFunc(resultObj);
						}).catch(err => {
							errFunc(err);
						});
					}
					else{
						return sucFunc(resultObj);
					}
				}
				// failure
				if (chainsqlUtils.checkSubError(data)) {
					if (data.hasOwnProperty("error_message")) {
						resultObj.error_message = data.error_message;
					}
					return errFunc(resultObj);
				}
			}
		}).then(function(data) {
			// subscribeTx success
		}).catch(function(error) {
			// subscribeTx failure
			errFunc('subscribeTx exception.' + error);
		});
	}
	
	// submit transaction
	chainSQL.api.submit(signedVal.signedTransaction).then(function(result) {
		//console.log('submit ', JSON.stringify(result));
		if (result.resultCode !== 'tesSUCCESS') {
			if(callbackProperty.callbackExpect !== "send_success"){
				unsubscribeTx(callbackProperty.callbackExpect, chainSQL, signedVal, errFunc);
			}
			//return error message
			errFunc(result);
		} else {
			// submit successfully
			if(callbackProperty.callbackExpect === "send_success"){
				sucFunc({
					status: "send_success",
					tx_hash: signedVal.id
				});
			}
		}
	}).catch(function(error) {
		unsubscribeTx(callbackProperty.callbackExpect, chainSQL, signedVal, errFunc);
		errFunc(error);
	});
}

function unsubscribeTx(expectValue, chainsql, signedVal, errFunc){
	if(expectValue !== "send_success"){
		chainsql.event.unsubscribeTx(signedVal.id).then(function(data) {
			// unsubscribeTx success
		}).catch(function(error) {
			// unsubscribeTx failure
			errFunc('unsubscribeTx failure.' + error);
		});
	}
}

function getNewDeployCtrAddr(chainSQL, txHash){
	return new Promise(function(resolve, reject){
		chainSQL.api.getTransaction(txHash).then(txDetail => {
			let isMatch = false;
			let calCtrAddr = calculateCtrAddr(txDetail.address, txDetail.sequence);
			let affectedNodes = txDetail.specification.meta.AffectedNodes;
			let suspectCtrAddr = "";
			for (let node of affectedNodes) {
				if (node.hasOwnProperty("CreatedNode") && node.CreatedNode.NewFields.hasOwnProperty("ContractCode")) {
					let createdNodeObj = node.CreatedNode;
					suspectCtrAddr = createdNodeObj.NewFields.Account;
					if(calCtrAddr === suspectCtrAddr){
						isMatch = true;
						break;
					}
				}
				// else continue;
			}
			if(isMatch){
				resolve(calCtrAddr);
			}
			else reject("Can not find Contract Address");
		}).catch(err => {
			reject(err);
		});
	});
}

function calculateCtrAddr(ctrOwnerAddr, sequence){
	let hexAddrStr = chainsqlUtils.decodeChainsqlAddr(ctrOwnerAddr).toUpperCase();
	let hexSeqStr = dec2FixLenHex(sequence, 2*4);
	let hexFinalStr = hexAddrStr + hexSeqStr;
	return keypairs.deriveAddress(hexFinalStr);
}

function dec2FixLenHex(decVal, fixedLen){
	let hexStr = decVal.toString(16);
	let paddingLen = fixedLen - hexStr.length;
	for(let i = 0; i < paddingLen; i++){
		hexStr = '0' + hexStr;
	}
	return hexStr;
}

function encodeChainsqlAddrParam(types, result){
	types.map(function(item, index) {
		if(item === "address"){
			result[index] = chainsqlUtils.encodeChainsqlAddr(result[index].slice(2));
		}
	});
}

function decodeChainsqlAddrParam(types, args){
	let newArgs = args.map(function(item, index) { 
		if(types[index] === "address"){
			item = chainsqlUtils.decodeChainsqlAddr(item).toUpperCase();
		}
		return item;
	});
	return newArgs;
}

/**
 * Get the callback and modiufy the array if necessary
 *
 * @method _getCallback
 * @param {Array} args
 * @return {Function} the callback
 */
Contract.prototype._getCallback = function getCallback(args) {
	if (args && _.isFunction(args[args.length - 1])) {
		return args.pop(); // modify the args array!
	}
};

/**
 * Generates the options for the execute call
 *
 * @method _processExecuteArguments
 * @param {Array} args
 * @param {Promise} defer
 */
Contract.prototype._processExecuteArguments = function _processExecuteArguments(args/*, defer*/) {
	var processedArgs = {};

	processedArgs.type = args.shift();

	// get the callback
	// processedArgs.callback = this._parent._getCallback(args);

	// get block number to use for call
	//if(processedArgs.type === 'call' && args[args.length - 1] !== true && (_.isString(args[args.length - 1]) || isFinite(args[args.length - 1])))
	//    processedArgs.defaultBlock = args.pop();

	// get the options
	processedArgs.options = (_.isObject(args[args.length - 1])) ? args.pop() : {};

	// get the generateRequest argument for batch requests
	processedArgs.generateRequest = (args[args.length - 1] === true)? args.pop() : false;

	processedArgs.options = this._parent._getOrSetDefaultOptions(processedArgs.options);
	processedArgs.options.data = this.encodeABI();

	// add contract address
	//if(!this._deployData && !utils.isAddress(this._parent.options.address))
	if(!this._deployData && !this._parent.options.address)
		throw chainsqlError('This contract object doesn\'t have address set yet, please set an address first.');

	if(!this._deployData) {
		processedArgs.options.to = this._parent.options.address;
		processedArgs.options.isDeploy = false;
	}
	else {
		processedArgs.options.isDeploy = true;
	}

	// return error, if no "data" is specified
	//if(!processedArgs.options.data)
	//    return utils._fireError(new Error('Couldn\'t find a matching contract method, or the number of parameters is wrong.'), defer.eventEmitter, defer.reject, processedArgs.callback);

	return processedArgs;
};

module.exports = Contract;
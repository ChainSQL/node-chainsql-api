'use strict'; // eslint-disable-line 

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var WebSocket = require('ws');
var parseURL = require('url').parse;
var RangeSet = require('./rangeset').RangeSet;

var _require2 = require('./errors'),
    RippledError = _require2.RippledError,
    DisconnectedError = _require2.DisconnectedError,
    NotConnectedError = _require2.NotConnectedError,
    TimeoutError = _require2.TimeoutError,
    ResponseFormatError = _require2.ResponseFormatError,
    ConnectionError = _require2.ConnectionError,
    RippledNotInitializedError = _require2.RippledNotInitializedError;

function isStreamMessageType(type) {
  return type === 'ledgerClosed' || type === 'transaction' || type === 'path_find';
}

var Connection = function (_EventEmitter) {
  _inherits(Connection, _EventEmitter);

  function Connection(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Connection);

    var _this = _possibleConstructorReturn(this, (Connection.__proto__ || Object.getPrototypeOf(Connection)).call(this));

    _this.setMaxListeners(Infinity);
    _this._url = url;
    _this._trace = options.trace;
    if (_this._trace) {
      // for easier unit testing
      _this._console = console;
    }
    _this._proxyURL = options.proxy;
    _this._proxyAuthorization = options.proxyAuthorization;
    _this._authorization = options.authorization;
    _this._trustedCertificates = options.trustedCertificates;
    _this._key = options.key;
    _this._passphrase = options.passphrase;
    _this._certificate = options.certificate;
    _this._timeout = options.timeout || 20 * 1000;
    _this._isReady = false;
    _this._ws = null;
    _this._ledgerVersion = null;
    _this._availableLedgerVersions = new RangeSet();
    _this._nextRequestID = 1;
    _this._retry = 0;
    _this._retryTimer = null;
    _this._onOpenErrorBound = null;
    _this._onUnexpectedCloseBound = null;
    _this._fee_base = null;
    _this._fee_ref = null;
    return _this;
  }

  _createClass(Connection, [{
    key: '_updateLedgerVersions',
    value: function _updateLedgerVersions(data) {
      this._ledgerVersion = Number(data.ledger_index);
      if (data.validated_ledgers) {
        this._availableLedgerVersions.reset();
        this._availableLedgerVersions.parseAndAddRanges(data.validated_ledgers);
      } else {
        this._availableLedgerVersions.addValue(this._ledgerVersion);
      }
    }
  }, {
    key: '_updateFees',
    value: function _updateFees(data) {
      this._fee_base = Number(data.fee_base);
      this._fee_ref = Number(data.fee_ref);
    }

    // return value is array of arguments to Connection.emit

  }, {
    key: '_parseMessage',
    value: function _parseMessage(message) {
      var data = JSON.parse(message);
      if (data.type === 'response') {
        if (!(Number.isInteger(data.id) && data.id >= 0)) {
          throw new ResponseFormatError('valid id not found in response');
        }
        return [data.id.toString(), data];
      } else if (isStreamMessageType(data.type)) {
        if (data.type === 'ledgerClosed') {
          this._updateLedgerVersions(data);
		  this._updateFees(data);
        }
        return [data.type, data];
      } else if (data.type === undefined && data.error) {
        return ['error', data.error, data.error_message, data]; // e.g. slowDown
      }else if(data.type === 'table' || data.type === 'singleTransaction'){
        return {};
      }
      throw new ResponseFormatError('unrecognized message type: ' + data.type);
    }
  }, {
    key: '_onMessage',
    value: function _onMessage(message) {
      var parameters = void 0;
      if (this._trace) {
        this._console.log(message);
      }
      try {
        parameters = this._parseMessage(message);
      } catch (error) {
        this.emit('error', 'badMessage', error.message, message);
        return;
      }
      // we don't want this inside the try/catch or exceptions in listener
      // will be caught
      this.emit.apply(this, _toConsumableArray(parameters));
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      return this._state === WebSocket.OPEN && this._isReady;
    }
  }, {
    key: '_onUnexpectedClose',
    value: function _onUnexpectedClose(beforeOpen, resolve, reject, code) {
      if (this._onOpenErrorBound) {
        this._ws.removeListener('error', this._onOpenErrorBound);
        this._onOpenErrorBound = null;
      }
      // just in case
      this._ws.removeAllListeners('open');
      this._ws = null;
      this._isReady = false;
      if (beforeOpen) {
        // connection was closed before it was properly opened, so we must return
        // error to connect's caller
        this.connect().then(resolve, reject);
      } else {
        // if first parameter ws lib sends close code,
        // but sometimes it forgots about it, so default to 1006 - CLOSE_ABNORMAL
        this.emit('disconnected', code || 1006);
        this._retryConnect();
      }
    }
  }, {
    key: '_calculateTimeout',
    value: function _calculateTimeout(retriesCount) {
      return retriesCount < 40 ?
      // First, for 2 seconds: 20 times per second
      1000 / 20 : retriesCount < 40 + 60 ?
      // Then, for 1 minute: once per second
      1000 : retriesCount < 40 + 60 + 60 ?
      // Then, for 10 minutes: once every 10 seconds
      10 * 1000 :
      // Then: once every 30 seconds
      30 * 1000;
    }
  }, {
    key: '_retryConnect',
    value: function _retryConnect() {
      var _this2 = this;

      this._retry += 1;
      var retryTimeout = this._calculateTimeout(this._retry);
      this._retryTimer = setTimeout(function () {
        _this2.emit('reconnecting', _this2._retry);
        _this2.connect().catch(_this2._retryConnect.bind(_this2));
      }, retryTimeout);
    }
  }, {
    key: '_clearReconnectTimer',
    value: function _clearReconnectTimer() {
      clearTimeout(this._retryTimer);
      this._retryTimer = null;
    }
  }, {
    key: '_onOpen',
    value: function _onOpen() {
      var _this3 = this;

      if (!this._ws) {
        return Promise.reject(new DisconnectedError());
      }
      if (this._onOpenErrorBound) {
        this._ws.removeListener('error', this._onOpenErrorBound);
        this._onOpenErrorBound = null;
      }

      var request = {
        command: 'subscribe',
        streams: ['ledger']
      };
      return this.request(request).then(function (data) {
        if (_.isEmpty(data) || !data.ledger_index) {
          // rippled instance doesn't have validated ledgers
          return _this3._disconnect(false).then(function () {
            throw new RippledNotInitializedError('Rippled not initialized');
          });
        }

        _this3._updateLedgerVersions(data);
        _this3._updateFees(data);
        _this3._rebindOnUnxpectedClose();

        _this3._retry = 0;
        _this3._ws.on('error', function (error) {
          if (process.browser && error && error.type === 'error') {
            // we are in browser, ignore error - `close` event will be fired
            // after error
            return;
          }
          _this3.emit('error', 'websocket', error.message, error);
        });

        _this3._isReady = true;
        _this3.emit('connected');

        return undefined;
      });
    }
  }, {
    key: '_rebindOnUnxpectedClose',
    value: function _rebindOnUnxpectedClose() {
      if (this._onUnexpectedCloseBound) {
        this._ws.removeListener('close', this._onUnexpectedCloseBound);
      }
      this._onUnexpectedCloseBound = this._onUnexpectedClose.bind(this, false, null, null);
      this._ws.once('close', this._onUnexpectedCloseBound);
    }
  }, {
    key: '_unbindOnUnxpectedClose',
    value: function _unbindOnUnxpectedClose() {
      if (this._onUnexpectedCloseBound) {
        this._ws.removeListener('close', this._onUnexpectedCloseBound);
      }
      this._onUnexpectedCloseBound = null;
    }
  }, {
    key: '_onOpenError',
    value: function _onOpenError(reject, error) {
      this._onOpenErrorBound = null;
      this._unbindOnUnxpectedClose();
      reject(new NotConnectedError(error && error.message));
    }
  }, {
    key: '_createWebSocket',
    value: function _createWebSocket() {
      var options = {};
      if (this._proxyURL !== undefined) {
        var parsedURL = parseURL(this._url);
        var parsedProxyURL = parseURL(this._proxyURL);
        var proxyOverrides = _.omit({
          secureEndpoint: parsedURL.protocol === 'wss:',
          secureProxy: parsedProxyURL.protocol === 'https:',
          auth: this._proxyAuthorization,
          ca: this._trustedCertificates,
          key: this._key,
          passphrase: this._passphrase,
          cert: this._certificate
        }, _.isUndefined);
        var proxyOptions = _.assign({}, parsedProxyURL, proxyOverrides);
        var HttpsProxyAgent = void 0;
        try {
          HttpsProxyAgent = require('https-proxy-agent');
        } catch (error) {
          throw new Error('"proxy" option is not supported in the browser');
        }
        options.agent = new HttpsProxyAgent(proxyOptions);
      }
      if (this._authorization !== undefined) {
        var base64 = new Buffer(this._authorization).toString('base64');
        options.headers = { Authorization: 'Basic ' + base64 };
      }
      var optionsOverrides = _.omit({
        ca: this._trustedCertificates,
        key: this._key,
        passphrase: this._passphrase,
        cert: this._certificate
      }, _.isUndefined);
      var websocketOptions = _.assign({}, options, optionsOverrides);
      var websocket = new WebSocket(this._url, null, websocketOptions);
      // we will have a listener for each outstanding request,
      // so we have to raise the limit (the default is 10)
      if (typeof websocket.setMaxListeners === 'function') {
        websocket.setMaxListeners(Infinity);
      }
      return websocket;
    }
  }, {
    key: 'connect',
    value: function connect() {
      var _this4 = this;

      this._clearReconnectTimer();
      return new Promise(function (resolve, reject) {
        if (!_this4._url) {
          reject(new ConnectionError('Cannot connect because no server was specified'));
        }
        if (_this4._state === WebSocket.OPEN) {
          resolve();
        } else if (_this4._state === WebSocket.CONNECTING) {
          _this4._ws.once('open', resolve);
        } else {
          _this4._ws = _this4._createWebSocket();
          // when an error causes the connection to close, the close event
          // should still be emitted; the "ws" documentation says: "The close
          // event is also emitted when then underlying net.Socket closes the
          // connection (end or close)."
          // In case if there is connection error (say, server is not responding)
          // we must return this error to connection's caller. After successful
          // opening, we will forward all errors to main api object.
          _this4._onOpenErrorBound = _this4._onOpenError.bind(_this4, reject);
          _this4._ws.once('error', _this4._onOpenErrorBound);
          _this4._ws.on('message', _this4._onMessage.bind(_this4));
          // in browser close event can came before open event, so we must
          // resolve connect's promise after reconnect in that case.
          // after open event we will rebound _onUnexpectedCloseBound
          // without resolve and reject functions
          _this4._onUnexpectedCloseBound = _this4._onUnexpectedClose.bind(_this4, true, resolve, reject);
          _this4._ws.once('close', _this4._onUnexpectedCloseBound);
          _this4._ws.once('open', function () {
            return _this4._onOpen().then(resolve, reject);
          });
        }
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      return this._disconnect(true);
    }
  }, {
    key: '_disconnect',
    value: function _disconnect(calledByUser) {
      var _this5 = this;

      if (calledByUser) {
        this._clearReconnectTimer();
        this._retry = 0;
      }
      return new Promise(function (resolve) {
        if (_this5._state === WebSocket.CLOSED) {
          resolve();
        } else if (_this5._state === WebSocket.CLOSING) {
          _this5._ws.once('close', resolve);
        } else {
          if (_this5._onUnexpectedCloseBound) {
            _this5._ws.removeListener('close', _this5._onUnexpectedCloseBound);
            _this5._onUnexpectedCloseBound = null;
          }
          _this5._ws.once('close', function (code) {
            _this5._ws = null;
            _this5._isReady = false;
            if (calledByUser) {
              _this5.emit('disconnected', code || 1000); // 1000 - CLOSE_NORMAL
            }
            resolve();
          });
          _this5._ws.close();
        }
      });
    }
  }, {
    key: 'reconnect',
    value: function reconnect() {
      var _this6 = this;

      return this.disconnect().then(function () {
        return _this6.connect();
      });
    }
  }, {
    key: '_whenReady',
    value: function _whenReady(promise) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        if (!_this7._shouldBeConnected) {
          reject(new NotConnectedError());
        } else if (_this7._state === WebSocket.OPEN && _this7._isReady) {
          promise.then(resolve, reject);
        } else {
          _this7.once('connected', function () {
            return promise.then(resolve, reject);
          });
        }
      });
    }
  }, {
    key: 'getLedgerVersion',
    value: function getLedgerVersion() {
      return this._whenReady(Promise.resolve(this._ledgerVersion));
    }
  }, {
    key: 'hasLedgerVersions',
    value: function hasLedgerVersions(lowLedgerVersion, highLedgerVersion) {
      return this._whenReady(Promise.resolve(this._availableLedgerVersions.containsRange(lowLedgerVersion, highLedgerVersion || this._ledgerVersion)));
    }
  }, {
    key: 'hasLedgerVersion',
    value: function hasLedgerVersion(ledgerVersion) {
      return this.hasLedgerVersions(ledgerVersion, ledgerVersion);
    }
  }, {
    key: 'getFeeBase',
    value: function getFeeBase() {
      return this._whenReady(Promise.resolve(Number(this._fee_base)));
    }
  }, {
    key: 'getFeeRef',
    value: function getFeeRef() {
      return this._whenReady(Promise.resolve(Number(this._fee_ref)));
    }
  }, {
    key: '_send',
    value: function _send(message) {
      var _this8 = this;

      if (this._trace) {
        this._console.log(message);
      }
      return new Promise(function (resolve, reject) {
        _this8._ws.send(message, undefined, function (error, result) {
          if (error) {
            reject(new DisconnectedError(error.message));
          } else {
            resolve(result);
          }
        });
      });
    }
  }, {
    key: 'request',
    value: function request(_request, timeout) {
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        if (!_this9._shouldBeConnected) {
          reject(new NotConnectedError());
        }

        var timer = null;
        var self = _this9;
        var id = _this9._nextRequestID;
        _this9._nextRequestID += 1;
        var eventName = id.toString();

        function onDisconnect() {
          clearTimeout(timer);
          self.removeAllListeners(eventName);
          reject(new DisconnectedError());
        }

        function cleanup() {
          clearTimeout(timer);
          self.removeAllListeners(eventName);
          if (self._ws !== null) {
            self._ws.removeListener('close', onDisconnect);
          }
        }

        function _resolve(response) {
          cleanup();
          resolve(response);
        }

        function _reject(error) {
          cleanup();
          reject(error);
        }

        _this9.once(eventName, function (response) {
          if (response.status === 'error') {
            _reject(new RippledError(response.error));
          } else if (response.status === 'success') {
            _resolve(response.result);
          } else {
            _reject(new ResponseFormatError('unrecognized status: ' + response.status));
          }
        });

        _this9._ws.once('close', onDisconnect);

        // JSON.stringify automatically removes keys with value of 'undefined'
        var message = JSON.stringify(Object.assign({}, _request, { id: id }));

        _this9._whenReady(_this9._send(message)).then(function () {
          var delay = timeout || _this9._timeout;
          timer = setTimeout(function () {
            return _reject(new TimeoutError());
          }, delay);
        }).catch(_reject);
      });
    }
  }, {
    key: '_state',
    get: function get() {
      return this._ws ? this._ws.readyState : WebSocket.CLOSED;
    }
  }, {
    key: '_shouldBeConnected',
    get: function get() {
      return this._ws !== null;
    }
  }]);

  return Connection;
}(EventEmitter);


module.exports = Connection;
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.MultiEncrypt = (function() {

    /**
     * Properties of a MultiEncrypt.
     * @exports IMultiEncrypt
     * @interface IMultiEncrypt
     * @property {Array.<MultiEncrypt.IHashToken>|null} [hashTokenPair] MultiEncrypt hashTokenPair
     * @property {Uint8Array} cipher MultiEncrypt cipher
     */

    /**
     * Constructs a new MultiEncrypt.
     * @exports MultiEncrypt
     * @classdesc Represents a MultiEncrypt.
     * @implements IMultiEncrypt
     * @constructor
     * @param {IMultiEncrypt=} [properties] Properties to set
     */
    function MultiEncrypt(properties) {
        this.hashTokenPair = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MultiEncrypt hashTokenPair.
     * @member {Array.<MultiEncrypt.IHashToken>} hashTokenPair
     * @memberof MultiEncrypt
     * @instance
     */
    MultiEncrypt.prototype.hashTokenPair = $util.emptyArray;

    /**
     * MultiEncrypt cipher.
     * @member {Uint8Array} cipher
     * @memberof MultiEncrypt
     * @instance
     */
    MultiEncrypt.prototype.cipher = $util.newBuffer([]);

    /**
     * Creates a new MultiEncrypt instance using the specified properties.
     * @function create
     * @memberof MultiEncrypt
     * @static
     * @param {IMultiEncrypt=} [properties] Properties to set
     * @returns {MultiEncrypt} MultiEncrypt instance
     */
    MultiEncrypt.create = function create(properties) {
        return new MultiEncrypt(properties);
    };

    /**
     * Encodes the specified MultiEncrypt message. Does not implicitly {@link MultiEncrypt.verify|verify} messages.
     * @function encode
     * @memberof MultiEncrypt
     * @static
     * @param {IMultiEncrypt} message MultiEncrypt message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MultiEncrypt.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.hashTokenPair != null && message.hashTokenPair.length)
            for (var i = 0; i < message.hashTokenPair.length; ++i)
                $root.MultiEncrypt.HashToken.encode(message.hashTokenPair[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.cipher);
        return writer;
    };

    /**
     * Encodes the specified MultiEncrypt message, length delimited. Does not implicitly {@link MultiEncrypt.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MultiEncrypt
     * @static
     * @param {IMultiEncrypt} message MultiEncrypt message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MultiEncrypt.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MultiEncrypt message from the specified reader or buffer.
     * @function decode
     * @memberof MultiEncrypt
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MultiEncrypt} MultiEncrypt
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MultiEncrypt.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MultiEncrypt();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.hashTokenPair && message.hashTokenPair.length))
                    message.hashTokenPair = [];
                message.hashTokenPair.push($root.MultiEncrypt.HashToken.decode(reader, reader.uint32()));
                break;
            case 2:
                message.cipher = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("cipher"))
            throw $util.ProtocolError("missing required 'cipher'", { instance: message });
        return message;
    };

    /**
     * Decodes a MultiEncrypt message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MultiEncrypt
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MultiEncrypt} MultiEncrypt
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MultiEncrypt.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MultiEncrypt message.
     * @function verify
     * @memberof MultiEncrypt
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MultiEncrypt.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.hashTokenPair != null && message.hasOwnProperty("hashTokenPair")) {
            if (!Array.isArray(message.hashTokenPair))
                return "hashTokenPair: array expected";
            for (var i = 0; i < message.hashTokenPair.length; ++i) {
                var error = $root.MultiEncrypt.HashToken.verify(message.hashTokenPair[i]);
                if (error)
                    return "hashTokenPair." + error;
            }
        }
        if (!(message.cipher && typeof message.cipher.length === "number" || $util.isString(message.cipher)))
            return "cipher: buffer expected";
        return null;
    };

    /**
     * Creates a MultiEncrypt message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MultiEncrypt
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MultiEncrypt} MultiEncrypt
     */
    MultiEncrypt.fromObject = function fromObject(object) {
        if (object instanceof $root.MultiEncrypt)
            return object;
        var message = new $root.MultiEncrypt();
        if (object.hashTokenPair) {
            if (!Array.isArray(object.hashTokenPair))
                throw TypeError(".MultiEncrypt.hashTokenPair: array expected");
            message.hashTokenPair = [];
            for (var i = 0; i < object.hashTokenPair.length; ++i) {
                if (typeof object.hashTokenPair[i] !== "object")
                    throw TypeError(".MultiEncrypt.hashTokenPair: object expected");
                message.hashTokenPair[i] = $root.MultiEncrypt.HashToken.fromObject(object.hashTokenPair[i]);
            }
        }
        if (object.cipher != null)
            if (typeof object.cipher === "string")
                $util.base64.decode(object.cipher, message.cipher = $util.newBuffer($util.base64.length(object.cipher)), 0);
            else if (object.cipher.length)
                message.cipher = object.cipher;
        return message;
    };

    /**
     * Creates a plain object from a MultiEncrypt message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MultiEncrypt
     * @static
     * @param {MultiEncrypt} message MultiEncrypt
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MultiEncrypt.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.hashTokenPair = [];
        if (options.defaults)
            if (options.bytes === String)
                object.cipher = "";
            else {
                object.cipher = [];
                if (options.bytes !== Array)
                    object.cipher = $util.newBuffer(object.cipher);
            }
        if (message.hashTokenPair && message.hashTokenPair.length) {
            object.hashTokenPair = [];
            for (var j = 0; j < message.hashTokenPair.length; ++j)
                object.hashTokenPair[j] = $root.MultiEncrypt.HashToken.toObject(message.hashTokenPair[j], options);
        }
        if (message.cipher != null && message.hasOwnProperty("cipher"))
            object.cipher = options.bytes === String ? $util.base64.encode(message.cipher, 0, message.cipher.length) : options.bytes === Array ? Array.prototype.slice.call(message.cipher) : message.cipher;
        return object;
    };

    /**
     * Converts this MultiEncrypt to JSON.
     * @function toJSON
     * @memberof MultiEncrypt
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MultiEncrypt.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    MultiEncrypt.HashToken = (function() {

        /**
         * Properties of a HashToken.
         * @memberof MultiEncrypt
         * @interface IHashToken
         * @property {Uint8Array} publicHash HashToken publicHash
         * @property {string} token HashToken token
         */

        /**
         * Constructs a new HashToken.
         * @memberof MultiEncrypt
         * @classdesc Represents a HashToken.
         * @implements IHashToken
         * @constructor
         * @param {MultiEncrypt.IHashToken=} [properties] Properties to set
         */
        function HashToken(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HashToken publicHash.
         * @member {Uint8Array} publicHash
         * @memberof MultiEncrypt.HashToken
         * @instance
         */
        HashToken.prototype.publicHash = $util.newBuffer([]);

        /**
         * HashToken token.
         * @member {string} token
         * @memberof MultiEncrypt.HashToken
         * @instance
         */
        HashToken.prototype.token = "";

        /**
         * Creates a new HashToken instance using the specified properties.
         * @function create
         * @memberof MultiEncrypt.HashToken
         * @static
         * @param {MultiEncrypt.IHashToken=} [properties] Properties to set
         * @returns {MultiEncrypt.HashToken} HashToken instance
         */
        HashToken.create = function create(properties) {
            return new HashToken(properties);
        };

        /**
         * Encodes the specified HashToken message. Does not implicitly {@link MultiEncrypt.HashToken.verify|verify} messages.
         * @function encode
         * @memberof MultiEncrypt.HashToken
         * @static
         * @param {MultiEncrypt.IHashToken} message HashToken message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HashToken.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.publicHash);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.token);
            return writer;
        };

        /**
         * Encodes the specified HashToken message, length delimited. Does not implicitly {@link MultiEncrypt.HashToken.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MultiEncrypt.HashToken
         * @static
         * @param {MultiEncrypt.IHashToken} message HashToken message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HashToken.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HashToken message from the specified reader or buffer.
         * @function decode
         * @memberof MultiEncrypt.HashToken
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MultiEncrypt.HashToken} HashToken
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HashToken.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MultiEncrypt.HashToken();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.publicHash = reader.bytes();
                    break;
                case 2:
                    message.token = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("publicHash"))
                throw $util.ProtocolError("missing required 'publicHash'", { instance: message });
            if (!message.hasOwnProperty("token"))
                throw $util.ProtocolError("missing required 'token'", { instance: message });
            return message;
        };

        /**
         * Decodes a HashToken message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MultiEncrypt.HashToken
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MultiEncrypt.HashToken} HashToken
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HashToken.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HashToken message.
         * @function verify
         * @memberof MultiEncrypt.HashToken
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HashToken.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!(message.publicHash && typeof message.publicHash.length === "number" || $util.isString(message.publicHash)))
                return "publicHash: buffer expected";
            if (!$util.isString(message.token))
                return "token: string expected";
            return null;
        };

        /**
         * Creates a HashToken message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MultiEncrypt.HashToken
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MultiEncrypt.HashToken} HashToken
         */
        HashToken.fromObject = function fromObject(object) {
            if (object instanceof $root.MultiEncrypt.HashToken)
                return object;
            var message = new $root.MultiEncrypt.HashToken();
            if (object.publicHash != null)
                if (typeof object.publicHash === "string")
                    $util.base64.decode(object.publicHash, message.publicHash = $util.newBuffer($util.base64.length(object.publicHash)), 0);
                else if (object.publicHash.length)
                    message.publicHash = object.publicHash;
            if (object.token != null)
                message.token = String(object.token);
            return message;
        };

        /**
         * Creates a plain object from a HashToken message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MultiEncrypt.HashToken
         * @static
         * @param {MultiEncrypt.HashToken} message HashToken
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HashToken.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.publicHash = "";
                else {
                    object.publicHash = [];
                    if (options.bytes !== Array)
                        object.publicHash = $util.newBuffer(object.publicHash);
                }
                object.token = "";
            }
            if (message.publicHash != null && message.hasOwnProperty("publicHash"))
                object.publicHash = options.bytes === String ? $util.base64.encode(message.publicHash, 0, message.publicHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.publicHash) : message.publicHash;
            if (message.token != null && message.hasOwnProperty("token"))
                object.token = message.token;
            return object;
        };

        /**
         * Converts this HashToken to JSON.
         * @function toJSON
         * @memberof MultiEncrypt.HashToken
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HashToken.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HashToken;
    })();

    return MultiEncrypt;
})();

module.exports = $root;

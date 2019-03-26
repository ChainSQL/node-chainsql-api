"use strict";

const chainsqldError = require('chainsql-lib').ChainsqlLibCommon.errors.ChainsqldError;

function chainsqlError( errMsg ) {
	let errName = "apiGeneralErr";
	return new chainsqldError(errName, errMsg);
}

module.exports = chainsqlError;
'use strict';

var _ = require('lodash');
const path = require('path');
const getTxJson = require('../lib/util').getTxJson;
const calcFee = require('../lib/util').calcFee;
var utils = require('chainsql-lib').ChainsqlLibUtil;
var validate = utils.common.validate;
var toRippledAmount = utils.common.toRippledAmount;
var paymentFlags = utils.common.txFlags.Payment;
var ValidationError = utils.common.errors.ValidationError;


function isXRPToXRPPayment(payment) {
  var sourceCurrency = _.get(payment, 'source.maxAmount.currency', _.get(payment, 'source.amount.currency'));
  var destinationCurrency = _.get(payment, 'destination.amount.currency', _.get(payment, 'destination.minAmount.currency'));
  return sourceCurrency === 'ZXC' && destinationCurrency === 'ZXC';
}

function isIOUWithoutCounterparty(amount) {
  return amount && amount.currency !== 'ZXC' && amount.counterparty === undefined;
}

function applyAnyCounterpartyEncoding(payment) {
  // Convert blank counterparty to sender or receiver's address
  //   (Ripple convention for 'any counterparty')
  // https://ripple.com/build/transactions/
  //    #special-issuer-values-for-sendmax-and-amount
  // https://ripple.com/build/ripple-rest/#counterparties-in-payments
  _.forEach([payment.source, payment.destination], function(adjustment) {
    _.forEach(['amount', 'minAmount', 'maxAmount'], function(key) {
      if (isIOUWithoutCounterparty(adjustment[key])) {
        adjustment[key].counterparty = adjustment.address;
      }
    });
  });
}

function createMaximalAmount(amount) {
  var maxXRPValue = '100000000000';
  var maxIOUValue = '9999999999999999e80';
  var maxValue = amount.currency === 'ZXC' ? maxXRPValue : maxIOUValue;
  return _.assign({}, amount, {
    value: maxValue
  });
}

function createPaymentTransaction(paymentArgument) {
  var payment = _.cloneDeep(paymentArgument);

  var txJSON = {
    TransactionType: payment.tsType,
    Tables: payment.tables,
    TableNewName: payment.tableNewName,
    OpType: payment.opType,
    Raw: payment.raw,
    Account: payment.address,
    Owner: payment.owner,
    Flags: payment.flags,
    User:payment.user,
    AutoFillField:payment.autoFillField,
    Token:payment.token,
    StrictMode: payment.strictMode,
    OperationRule: payment.operationRule,
    TxsHashFillField:payment.txsHashFillField,
  }
  return txJSON;
}

function checkTablePayment(payment)
{
  if(payment.address === undefined)  return "account is null, please use the function 'as' first.";
  return "";
}
function prepareTablePayment(payment, chainsqlApi) {
  var instructions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  //validate.preparePayment({ address: address, payment: payment, instructions: instructions });
  let err = checkTablePayment(payment)
  if( err != "")  return Promise.reject(err);
  var txJSON = createPaymentTransaction(payment);
  return utils.prepareTransaction(txJSON, chainsqlApi, instructions);
}

function prepareTable(ChainSQL, payment, resolve, reject) {


	prepareTablePayment(payment, ChainSQL.api).then(function (tx_json) {

      var dropsPerByte = Math.ceil(1000000.0 / 1024);;
    
      ChainSQL.api.getServerInfo().then(res => {

        if(res.validatedLedger.dropsPerByte != undefined){
          dropsPerByte =  parseInt(res.validatedLedger.dropsPerByte);
        }

        // 1 calculate fee
        var txJson  = JSON.parse(tx_json.txJSON);
        txJson.Fee  = calcFee(txJson,dropsPerByte);
    
        if(  txJson.Tables.length === 1 
          && txJson.Tables[0].Table.NameInDB !== undefined 
          && txJson.Tables[0].Table.NameInDB !== ''){
            
          resolve({txJSON:txJson});
          return ;
        }
      
        // 2  get table's NameInDB
        getTxJson(ChainSQL, txJson).then(function (data) {
          resolve({txJSON:data.tx_json});
        }).catch(function (error) {
          reject(error);
        });

      }).catch(err => {
          reject(err);
      });

  }).catch(err => {
      reject(err);
  });


}

module.exports = prepareTable;
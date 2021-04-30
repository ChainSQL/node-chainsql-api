'use strict';

var _ = require('lodash');
const path = require('path');
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


function prepareTxPayment(payment) {
  var instructions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  //validate.preparePayment({ address: address, payment: payment, instructions: instructions });
  return utils.prepareTransaction(payment, this, instructions).then(function(ret){
  /*console.log('preparetx:')
  let obj = JSON.parse(ret.txJSON);
  console.log(obj.Memos[0].Memo.MemoData);
  obj.Memos[0].Memo.MemoData = "----test";
  console.log(obj);
  ret.txJSON = JSON.stringify(obj);
  console.log(ret);*/
  return ret;
  });

}


module.exports = prepareTxPayment;
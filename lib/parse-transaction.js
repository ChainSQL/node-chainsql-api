'use strict'; // eslint-disable-line strict

var assert = require('assert');
var utils = require('./utils');
var parsePayment = require('./payment');
var parseTrustline = require('./trustline');
var parseOrder = require('./order');
var parseOrderCancellation = require('./cancellation');
var parseSettings = require('./settings');
var parseSuspendedPaymentCreation = require('./suspended-payment-creation');
var parseSuspendedPaymentExecution = require('./suspended-payment-execution');
var parseSuspendedPaymentCancellation = require('./suspended-payment-cancellation');
var parseFeeUpdate = require('./fee-update');
var parseAmendment = require('./amendment');

function parseTransactionType(type) {
  var mapping = {
    Payment: 'payment',
    TrustSet: 'trustline',
    OfferCreate: 'order',
    OfferCancel: 'orderCancellation',
    AccountSet: 'settings',
    SetRegularKey: 'settings',
    SuspendedPaymentCreate: 'suspendedPaymentCreation',
    SuspendedPaymentFinish: 'suspendedPaymentExecution',
    SuspendedPaymentCancel: 'suspendedPaymentCancellation',
    SignerListSet: 'settings',
    SetFee: 'feeUpdate', // pseudo-transaction
    EnableAmendment: 'amendment', // pseudo-transaction
    TableListSet: 'tableListSet',
    SQLStatement: 'sqlStatement'
  };
  return mapping[type] || null;
}

function parseTransaction(tx) {
  var type = parseTransactionType(tx.TransactionType);
  // console.log(type)

  var mapping = {
    'payment': parsePayment,
    'trustline': parseTrustline,
    'order': parseOrder,
    'orderCancellation': parseOrderCancellation,
    'settings': parseSettings,
    'suspendedPaymentCreation': parseSuspendedPaymentCreation,
    'suspendedPaymentExecution': parseSuspendedPaymentExecution,
    'suspendedPaymentCancellation': parseSuspendedPaymentCancellation,
    'feeUpdate': parseFeeUpdate,
    'amendment': parseAmendment
  };
  var specification, outcome;
  if (type !== 'tableListSet' && type !== 'sqlStatement') {
    var parser = mapping[type];
    assert(parser !== undefined, 'Unrecognized transaction type');
    specification = parser(tx);

  }
  outcome = utils.parseOutcome(tx);
  return utils.removeUndefined({
    type: type,
    address: tx.Account,
    sequence: tx.Sequence,
    id: tx.hash,
    specification: utils.removeUndefined(specification),
    outcome: outcome ? utils.removeUndefined(outcome) : undefined
  });
}

module.exports = parseTransaction;
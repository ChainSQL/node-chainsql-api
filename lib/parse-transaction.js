'use strict'; // eslint-disable-line strict

var assert = require('assert');
var utils = require('./utils');
var parsePayment = require('./payment');
var parseTrustline = require('./trustline');
var parseOrder = require('./order');
var parseOrderCancellation = require('./cancellation');
var parseSettings = require('./settings');
var parseEscrowCreation = require('./escrow-creation');
var parseEscrowExecution = require('./escrow-execution');
var parseEscrowCancellation = require('./escrow-cancellation');
var parsePaymentChannelCreate = require('./payment-channel-create');
var parsePaymentChannelFund = require('./payment-channel-fund');
var parsePaymentChannelClaim = require('./payment-channel-claim');
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
    EscrowCreate: 'escrowCreation',
    EscrowFinish: 'escrowExecution',
    EscrowCancel: 'escrowCancellation',
    PaymentChannelCreate: 'paymentChannelCreate',
    PaymentChannelFund: 'paymentChannelFund',
    PaymentChannelClaim: 'paymentChannelClaim',
    SignerListSet: 'settings',
    SetFee: 'feeUpdate', // pseudo-transaction
    EnableAmendment: 'amendment', // pseudo-transaction
    TableListSet: 'tableListSet',
    SQLStatement: 'sqlStatement',
    SQLTransaction:'sqlTransaction'
  };
  return mapping[type] || null;
}

function parseTransaction(tx) {
  var type = parseTransactionType(tx.TransactionType);
  var mapping = {
    'payment': parsePayment,
    'trustline': parseTrustline,
    'order': parseOrder,
    'orderCancellation': parseOrderCancellation,
    'settings': parseSettings,
    'escrowCreation': parseEscrowCreation,
    'escrowExecution': parseEscrowExecution,
    'escrowCancellation': parseEscrowCancellation,
    'paymentChannelCreate': parsePaymentChannelCreate,
    'paymentChannelFund': parsePaymentChannelFund,
    'paymentChannelClaim': parsePaymentChannelClaim,
    'feeUpdate': parseFeeUpdate,
    'amendment': parseAmendment
  };
  var specification, outcome;
  if (type !== 'tableListSet' && type !== 'sqlStatement' && type != 'sqlTransaction') {
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
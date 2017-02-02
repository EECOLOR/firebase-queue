'use strict';

var _ = require('lodash');
var path = require('path');
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./key.json')),
  databaseURL: require('./url.js')
});

module.exports = function() {
  var self = this;

  this.testRef = admin.database().ref(_.random(1, 2 << 29));
  this.offset = 0;
  self.testRef.root.child('.info/serverTimeOffset').on('value', function(snapshot) {
    self.offset = snapshot.val();
  });
  this.Queue = require('../src/queue.js');
  this.QueueWorker = require('../src/lib/queue_worker.js');

  this.QueueWorkerWithoutProcessingOrTimeouts = function() {
    self.QueueWorker.apply(this, arguments);

    this._tryToProcess = _.noop
    this._setUpTimeouts = _.noop
  };

  this.QueueWorkerWithoutProcessing = function() {
    self.QueueWorker.apply(this, arguments);

    this._tryToProcess = _.noop
  };

  this.validBasicTaskSpec = {
    inProgressState: 'in_progress'
  };
  this.validTaskSpecWithStartState = {
    inProgressState: 'in_progress',
    startState: 'start_state'
  };
  this.validTaskSpecWithFinishedState = {
    inProgressState: 'in_progress',
    finishedState: 'finished_state'
  };
  this.validTaskSpecWithErrorState = {
    inProgressState: 'in_progress',
    errorState: 'error_state'
  };
  this.validTaskSpecWithTimeout = {
    inProgressState: 'in_progress',
    timeout: 10
  };
  this.validTaskSpecWithRetries = {
    inProgressState: 'in_progress',
    retries: 4
  };
  this.validTaskSpecWithEverything = {
    inProgressState: 'in_progress',
    startState: 'start_state',
    finishedState: 'finished_state',
    errorState: 'error_state',
    timeout: 10,
    retries: 4
  };

  return this;
};

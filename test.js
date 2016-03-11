'use strict';

process.title = "etcdtest";

/** @var EtcdWatcher */
const EtcdWatcher = require('.');
const hs = require('human-size');
const debug = require('debug')('EtcdWatcherTester');

const watcher = new EtcdWatcher(process.argv[2] || 'test_key');

process.on('SIGINT', () => {
  debug(`Interrupted`);
  watcher.offChange(console.log);
  process.exit(0);
});

setInterval(() => {
  debug(`Memory usage: ${hs(process.memoryUsage().heapUsed)}`);
}, 5000);

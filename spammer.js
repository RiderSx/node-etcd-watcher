'use strict';

const cp = require('child_process');
const progress = require('progress');

const iters = 10000;
const bar = new progress(`Spamming EtcdWatcher, done :percent, remaining :etas ╢:bar╟`, {
    width: 100,
    total: iters,
    complete: '█',
    incomplete: '░'
});

for (let i = 0; i < iters; i++) {
    bar.tick();
    cp.spawnSync('etcdctl', ['set', 'test_key', Math.random()]);
}
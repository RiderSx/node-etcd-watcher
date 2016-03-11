# EtcdWatcher
Will watch for etcd key changes

## Installation
```shell
$ npm i --save node-etcd-watcher
```

## Usage
```js
'use strict';

const EtcdWatcher = require('node-etcd-watcher');

const watcher = new EtcdWatcher('some-key');

watcher.onChange(value => console.log(value));
```

'use strict';

const got = require('got');
const debug = require('debug')('EtcdWatcher');
const EventEmitter = require('events');

class EtcdWatcher extends EventEmitter {
  
  /**
   * Ctor
   * 
   * @param {string} key to watch
   * @param {string} endpoint etcd endpoint, http://127.0.0.1:2379/v2/keys by default
   */
  constructor(key, endpoint) {
    super();
    debug(`Watching for key: ${key}`);
    
    this._endpoint = endpoint || 'http://127.0.0.1:2379/v2/keys/';
    this._stream = null;
    this._url = this._endpoint + key + '?recursive=false&wait=true&waitIndex=0';
    
    this._errorHandler = error => {
      if (error === 'ETIMEDOUT') {
        debug('Stream timed out, recreating');
        this._makeStream();
      } else {
        debug('Unexpected error', error);
        this._emitError(error);
      }
    };
    
    this._dataHandler = data => {
      const value = JSON.parse(data).node.value;
      debug(`Value received: ${value}`);
      this._emitChange(value);
      this._makeStream();
    };
    
    this.resume();
  }
  
  /**
   * Resume watching
   */
  resume() {
    this._makeStream();
  }
  
  /**
   * Stop watching
   */
  abort() {
    this._unlinkStream();
  }
  
  /**
   * @private
   */
  _unlinkStream() {
    this._stream = null;
    delete this._stream;
  }
  
  /**
   * @private
   */
  _makeStream() {
    this._unlinkStream();
    this._stream = got.stream.get(this._url);
    this._stream.on('error', this._errorHandler);
    this._stream.on('data', this._dataHandler);
  }
  
  /**
   * @private
   */
  _emitChange(value) {
    this.emit('change', value);
  }
  
  /**
   * Register listener to key value change
   * 
   * @callback cb
   */
  onChange(cb) {
    this.on('change', cb);
  }
  
  /**
   * Unregister listener to key value change
   * 
   * @callback cb
   */
  offChange(cb) {
    this.removeListener('change', cb);
  }
  
  /**
   * @private
   */
  _emitError(error) {
    this.emit('error', error);
  }
  
  /**
   * Register handler for error events
   * @callback cb
   */
  onError(cb) {
    this.on('error', cb);
  }
  
  /**
   * Unregister handler for error events
   * @callback cb
   */
  offError(cb) {
    this.removeListener('error', cb);
  }
}

module.exports = EtcdWatcher;

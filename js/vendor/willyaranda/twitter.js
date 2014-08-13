/* jshint browser: true, esnext: true, strict: true */

/**
 * @module tuiter
 */
(function(window) {
  'use strict';

  var tuiter = window.tuiter = function() {};

  var creds = {};

  var ready = false;

  var listeners = {};

  tuiter.getCredentials = function() {
    return creds;
  };

  tuiter.setCredentials = function(tokens) {
    // Check if we have all data
    var neededTokens = ['consumerKey', 'consumerSecret', 'oauthAccessToken', 'oauthAccessTokenSecret'];
    var fullConfig = neededTokens.every(function(el) {
      return tokens[el] ? true : false;
    });

    if (fullConfig) {
      creds = tokens;
      ready = true;
    } else {
      console.warn('Not enough tokens data', tokens);
    }

    return fullConfig;
  };

  /**
   * Internal method to make a request to the Twitter API.
   * This is a low level API. Use at your own risk, but we 
   * recommend to use the High level APIs that encapsulate
   * the requests.
   * @name _request
   * @param  {string}   endpoint URL to hit
   * @param  {string}   method   HTTP verb to use
   * @param  {Object}   params   extra params for the petition
   */
  tuiter._request = function(endpoint, method, params, callback) {
    var message = {
      action: endpoint,
      method: method,
      parameters: params
    };
    OAuth.completeRequest(message, accessor);
    OAuth.SignatureMethod.sign(message, accessor);
    var final = message.action + '?' + OAuth.formEncode(message.parameters);
    console.log('req.url=' + final);
    var xhr = new XMLHttpRequest({mozSystem: true});
    xhr.open(message.method, final);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
  };

  /**
   * Opens a connection to the specified stream, calling any callback
   * stored on listeners for the events received.
   * @param  {string} endpoint U
   * @return {type}          [description]
   */
  tuiter._stream = function(endpoint) {
    var data = _parseData(length, data);
    if (Array.isArray(listeners[data.type])) {
        listeners[data.type].forEach(function(elem) {
            if (typeof elem === 'function') {
                elem(msg);
            }
        });
    }
    var stream = new XMLHttpRequest({ mozSystem: true});
    //stream.
  };

  tuiter._parseData = function(length, data) {
    return {
        type: type,
        msg: msg
    };
  };

  tuiter.listenEvents = function (listenEvent, cb) {
    if (!Array.isArray(listeners[listenEvent])) {
        listeners[listenEvent] = [];
    }
    listeners[listenEvent].push(cb);
  };

  return {
    listenEvents: tuiter.listenEvents,
    initialize: tuiter.initialize
  };
})(window);
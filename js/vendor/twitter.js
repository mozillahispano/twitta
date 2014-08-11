/* jshint browser: true, esnext: true, strict: true */

(function(window) {
  'use strict';

  /*
  var creds = {
    consumer_key: '6G62H3Cv6shuI4LbjsVe7rxJx',
    consumer_secret: 'ASSDrn797pc5igFOkzGdeyQnS2IbUpCKHZivcRVIcctLl6VZxS',
    access_token: '3827311-zOKeUvMoWEAEcgrqJP9uoVM9kB2DsJAMIjPnjE0qOB',
    access_token_secret: 'NlO800QSliBNK50tlXYI8rPmqPv7VOWKW4lUrePPXHooH'
  };*/

  var oauth_consumer_key = 'WD6hC8ti2fFbPzj3sZ7dNbzDb';
  var oauth_nonce;
  var oauth_signature;

  var tuiter = window.tuiter = function() {};

  var listeners = {};

  tuiter.create_nonce = function() {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var nonce = [];
    for (var i = 0; i < 32; i++) {
        nonce.push(chars[Math.random() * chars.length]);
    }
    var str = nonce.join('');
    return btoa(str);
  };

  tuiter.create_signature = function(method, url) {

  };

  tuiter.getCredentials = function() {
    var creds = {};
    creds.consumer_key = localStorage.getItem('consumer_key');
    creds.consumer_secret = localStorage.getItem('consumer_secret');
    creds.access_token = localStorage.getItem('access_token');
    creds.access_token_secret = localStorage.getItem('access_token_secret');
    return creds;
  };

  tuiter.setCredentials = function(tokens) {
    tuiter.setAuth(tokens);
    localStorage.setItem('consumer_key', tokens['consumer_key']);
    localStorage.setItem('consumer_secret', tokens['consumer_secret']);
    localStorage.setItem('access_token', tokens['access_token']);
    localStorage.setItem('access_token_secret', tokens['access_token_secret']);
  };

  tuiter.initialize = function() {

    // Check if we have all data
    var neededTokens = ['consumer_key', 'consumer_secret', 'access_token', 'access_token_secret'];
    var tokens = tuiter.getCredentials();
    var fullConfig = neededTokens.every(function(el) {
      return tokens[el] ? true : false;
    });

    if (!fullConfig) {
      console.warn('Not enough data, please, call setCredentials with proper twitter access data');
      return false;
    }

    // Track user stream. Enough for realtime things
    var stream = tuiter.stream('user');
    var listEvents = ['blocked', 'unblocked', 'favorite', 'unfavorite', 'follow', 'unfollow', 'user_update', 'list_created',
    'list_destroyed', 'list_updated', 'list_member_added', 'list_member_removed', 'list_user_subscribed', 'list_user_unsubscribed',
    'unknown_user_event', 'tweet', 'error'];

    /*var timelineCtrl = new timeline.controller();
    var count = 0;
    listEvents.forEach(function(elem, i) {
      stream.on(listEvents[i], function(msg) {
        console.log(listEvents[i], msg);
        if (listEvents[i] === 'tweet') {
          timelineCtrl.add(msg);
          if (++count == 10) {
            stream.stop();
          }
        }
      });
    });*/

    // Everything looks good and is set
    return true;
  };

  /**
   * Opens a connection to the specified stream, calling any callback
   * stored on listeners for the events received.
   * @param  {[string]} endpoint U
   * @return {[type]}          [description]
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
    stream.
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
    listenEvents: listenEvents,
    initialize: initialize
  };
}(window);
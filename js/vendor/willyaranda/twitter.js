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

  tuiter.init = function(tokens) {
    console.log('tuiter.init');
    var neededTokens = ['consumerKey', 'consumerSecret', 'oauthAccessToken', 'oauthAccessTokenSecret'];

    // If we do not receive tokens, just load from localStorage
    if (!tokens) {
      tokens = {};
      neededTokens.forEach(function(token) {
        tokens[token] = localStorage.getItem(token);
      });
    }
    // If receive, just save on localStorage for next usages
    else {
      neededTokens.forEach(function(token) {
        localStorage.setItem(token, tokens[token]);
      });
    }
    // Check if we have all data
    var fullConfig = neededTokens.every(function(el) {
      return tokens[el] ? true : false;
    });

    if (fullConfig) {
      creds = tokens;
      ready = true;
    } else {
      console.warn('Not enough tokens data. Check that you have sent a object with',
        neededTokens, '. Received ', tokens);
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
    console.log('tuiter.request');

    if (!ready) {
      callback('Not ready yet!');
      return;
    }
    var message = {
      action: endpoint,
      method: method,
      parameters: params
    };
    var accessor = tuiter.getCredentials();
    OAuth.completeRequest(message, accessor);
    OAuth.SignatureMethod.sign(message, accessor);
    var url = message.action + '?' + OAuth.formEncode(message.parameters);
    console.log(url);
    var xhr = new XMLHttpRequest({mozSystem: true});
    xhr.open(message.method, url);
    xhr.responseType = 'json';

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              callback(null, xhr.response);
            } else {
              callback(xhr.response || 'unknown error');
            }
        }
    };
    xhr.send();
  };

  /**
   * Returns a collection of the most recent Tweets and retweets posted by the
   * authenticating user and the users they follow. The home timeline is
   * central to how most users interact with the Twitter service.
   * Up to 800 Tweets are obtainable on the home timeline. It is more volatile
   * for users that follow many users or follow users who tweet frequently.
   *
   * @link https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
   * @param  {Object}   params Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the JSON returned (error, json)
   */
  tuiter.getHomeTimeline = function(parms, cb)  {
    var endpoint = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
    var method = 'GET';
    var params = {
      count: parms.count || 20,
      since_id: parms.since_id || null,
      max_id: parms.max_id || null,
      trim_user: parms.trim_user || false,
      exclude_replies: parms.exclude_replies || false,
      contributor_details: parms.contributor_details || true,
      include_entities: parms.include_entities || true
    };
    tuiter._request(endpoint, method, params, cb);
  };

  tuiter.getUserTimeline = function(id, screen_name, params, cb) {
    if (!id || !screen_name) {
      callback('You did not specify a id or screen_name');
      return;
    }
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
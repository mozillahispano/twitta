/* global OAuth */

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
    var neededTokens = ['consumerKey', 'consumerSecret', 'token', 'tokenSecret'];

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

    function filterParams(params) {
      var rv = {};
      var keys = Object.keys(params);
      keys.forEach(function(key) {
        if (params[key]) {
          rv[key] = params[key];
        }
      });
      return rv;
    }

    if (!ready) {
      callback('Not ready yet!');
      return;
    }

    var message = {
      action: endpoint,
      method: method,
      parameters: filterParams(params)
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
              console.error(xhr.response);
              callback(xhr.response.errors[0].message || 'unknown error');
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
      count: parms.count,
      since_id: parms.since_id,
      max_id: parms.max_id,
      trim_user: parms.trim_user,
      exclude_replies: parms.exclude_replies,
      contributor_details: parms.contributor_details,
      include_entities: parms.include_entities
    };
    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Returns the 20 most recent mentions (tweets containing a users's @screen_name)
   * for the authenticating user.
   *
   * @link https://dev.twitter.com/docs/api/1.1/get/statuses/mentions_timeline
   * @param  {Object}   params Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the JSON returned (error, json)
   */
  tuiter.getMentionsTimeline = function(parms, cb)  {
    var endpoint = 'https://api.twitter.com/1.1/statuses/mentions_timeline.json';
    var method = 'GET';
    var params = {
      count: parms.count,
      since_id: parms.since_id,
      max_id: parms.max_id,
      trim_user: parms.trim_user,
      contributor_details: parms.contributor_details,
      include_entities: parms.include_entities
    };
    tuiter._request(endpoint, method, params, cb);
  };

  tuiter.getUserTimeline = function(id, screen_name, params, cb) {
    if (!id || !screen_name) {
      cb('You did not specify a id or screen_name');
      return;
    }
  };

  tuiter.updateStatus = function(text, reply_to, cb) {
    console.log('tuiter.updateStatus', text, reply_to);
    var endpoint = 'https://api.twitter.com/1.1/statuses/update.json';
    var method = 'POST';
    var params = {
      status: text,
      in_reply_to_status_id: reply_to
    };

    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Opens a connection to the specified stream, calling any callback
   * stored on listeners for the events received.
   * @param  {string} endpoint U
   * @return {type}          [description]
   */
  tuiter._stream = function(endpoint) {
    var data = tuiter._parseData(length, data);
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

  tuiter.listenEvents = function(listenEvent, cb) {
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
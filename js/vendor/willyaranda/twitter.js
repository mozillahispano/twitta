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
  var streaming = false;

  var _pendingData = '';

  tuiter.getCredentials = function() {
    return creds;
  };

  /**
   * Initialize tuiter library.
   * @param  {Object} tokens Access tokens: [`consumerKey`, `consumerSecret`,
   * `token`, `tokenSecret`];
   * @param  {Boolean} stream If we should start streaming right now (does not
   * wait for events)
   * @param  {Object} parms  If `stream` is true, posible params to start.
   */
  tuiter.init = function(tokens, stream, parms) {
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

    // Auto start stream
    if (stream) {
      tuiter.userStream(parms);
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

  tuiter.updateStatus = function(text, reply_to, cb) {
    var endpoint = 'https://api.twitter.com/1.1/statuses/update.json';
    var method = 'POST';
    var params = {
      status: text,
      in_reply_to_status_id: reply_to
    };

    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Returns the 20 most recent direct messages sent to the authenticating user.
   * Includes detailed information about the sender and recipient user. You can
   * request up to 200 direct messages per call, up to a maximum of 800 incoming DMs.
   *
   * @link https://dev.twitter.com/docs/api/1.1/get/direct_messages
   * @param  {Object}   parms
   * @param  {Function} cb     Callback with the JSON returned (error, json)
   */
  tuiter.getDirectMessages = function(parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/direct_messages.json';
    var method = 'GET';
    var params = {
      since_id: parms.since_id,
      max_id: parms.max_id,
      count: parms.count,
      include_entities: parms.include_entities,
      skip_status: parms.skip_status
    };

    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * User Streams provide a stream of data and events specific to the authenticated user.
   *
   * This will call callbacks registered with the function addListener(type, cb);
   *
   * See link to get possible events to listen to.
   *
   * @link https://dev.twitter.com/docs/streaming-apis/streams/user
   * @param  {Object} parms Extra parameters for the request, check link
   */
  tuiter.userStream = function(parms) {
    console.log('tuiter._stream');
    parms = parms || {};

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

    if (streaming) {
      console.warn('We are streaming, cancelling this request. Please, use the ' +
        'addListener(type, cb) for listening for events');
      return;
    }

    // Test again in 10 seconds if we are not ready
    /*if (!ready) {
      setTimeout(function() {
        tuiter._stream(parms);
      }, 10000);
      return;
    }*/

    var endpoint = 'https://userstream.twitter.com/1.1/user.json';
    var method = 'GET';
    var params = {
      delimited: parms.delimited,
      stall_warnings: parms.stall_warnings,
      'with': parms['with'],
      replies: parms.replies,
      track: parms.track,
      locations: parms.locations,
      stringify_friends_ids: parms.stringify_friends_ids
    };

    var message = {
      action: endpoint,
      method: method,
      parameters: filterParams(params)
    };

    var accessor = tuiter.getCredentials();
    OAuth.completeRequest(message, accessor);
    OAuth.SignatureMethod.sign(message, accessor);

    var url = message.action + '?' + OAuth.formEncode(message.parameters);

    var xhr = new XMLHttpRequest({mozSystem: true});
    xhr.open(message.method, url);
    xhr.responseType = 'moz-chunked-text';
    xhr.onprogress = tuiter._onDataAvailable;
    xhr.send();
  };

  // see http://hg.instantbird.org/instantbird/file/tip/chat/protocols/twitter/twitter.js
  tuiter._onDataAvailable = function(aRequest) {
    streaming = true;
    var newText = _pendingData + aRequest.target.response;
    var messages = newText.split(/\r\n?/); // split by twitter spec
    _pendingData = messages.pop(); // just get all the messages except the last
                                   // one (not fully received? Save it!)
    messages.forEach(function(message) {
      var json = {};

      // First, remove empty messages (do not flood log)
      if (message === '') {
        return;
      }

      try {
        json = JSON.parse(message);
      } catch (e) {
        console.error('Failing to parse', message);
        return;
      }
      tuiter._parseData(json);
    });
  };

  tuiter._parseData = function(data) {
    console.log(data);
    // Twit event
    if (data['text']) {
      tuiter._fireEvent('text', data);
    }
    // Friends lists (friends)
    else if (data['friends']) {
      tuiter._fireEvent('friends', data['friends']);
    }
    // Status deletion notices
    else if (data['delete']) {
      tuiter._fireEvent('delete', data['delete'].status.id_str);
    }
    // Location deletion notices
    else if (data['scrub_geo']) {
      tuiter._fireEvent('scrub_geo', data);
    }
    //Limit notices (limit)
    else if (data['limit']) {
      tuiter._fireEvent('limit', data);
    }
    //Withheld content notices (status_withheld, user_withheld)
    else if (data['status_withheld']) {
      tuiter._fireEvent('status_withheld', data);
    }
    else if (data['user_withheld']) {
      tuiter._fireEvent('user_withheld', data);
    }
    //Disconnect messages (disconnect)
    else if (data['disconnect']) {
      streaming = false;
      tuiter._fireEvent('disconnect', data);
    }
    //Stall warnings (warning)
    else if (data['warning']) {
      tuiter._fireEvent('warning', data);
    }
    //Events (event) --> target (user), source (user), target_object, created_at
    else if (data['event']) {
      tuiter._fireEvent(data['event'], data['target'], data['source'], data['target_object']);
    } else {
      console.warn('unknown message??', data);
    }
  };

  tuiter._fireEvent = function(event, msg) {
    console.log('Firing ' + event + ' event');
    var toFire = listeners[event];
    if (Array.isArray(toFire)) {
      toFire.forEach(function(elem) {
          if (typeof elem === 'function') {
              elem(msg);
          }
      });
    }
  };

  tuiter.addListener = function(eventType, cb) {
    if (!Array.isArray(listeners[eventType])) {
        listeners[eventType] = [];
    }
    listeners[eventType].push(cb);
  };

})(window);

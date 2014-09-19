/* global OAuth */

/** @module tuiter */

'use strict';

(function(window) {

  /**
   * Global object
   * @type {Object}
   */
  var tuiter = {};

  /**
   * Holds methods for getting own configuration information
   * @type {Object}
   */
  tuiter.conf = {};

  /**
   * Holds credentials set by `tuiter.init()` or by localStorage
   * @type {Object}
   */
  var creds = {};

  /**
   * Holds config from twitter (like URL shortened length…)
   * @see https://dev.twitter.com/docs/api/1.1/get/help/configuration
   * @type {Object}
   */
  var config = {};

  var userConfig = {};

  var friends = [];

  /**
   * Holds if the library is ready.
   * This is set when
   * @type {Boolean}
   */
  var ready = false;

  /**
   * This holds a event_type - [listeners].
   * When a event_type is received, it calls all listeners that has subscribed
   * to this event with `tuiter.addListener`
   * @type {Object}
   */
  var listeners = {};

  /**
   * Holds if we are streaming from Twitter using the Streaming API.
   * (but you can also use the REST API)
   * @type {Boolean}
   */
  var streaming = false;

  /**
   * Holds the stream XHR request, so it can be aborted with `abortStream()`
   * @type XMLHttpRequest
   */
  var _streamXHR;

  /**
   * Holds pending data from twitter Streaming API
   * @type {String}
   */
  var _pendingData = '';

  /**
   * Normalize screen name. Removes leading @ if it is sent
   * @param  {String} screen_name The screen_name of the user to normalize
   * @return {String} The normalized screen_name
   */
  function normalizeScreenName(screen_name) {
    var name = (screen_name[0] === '@') ? screen_name.slice(1) : screen_name;
    return name;
  }

  /**
   * Returns the tokens used to perform requests to twitter
   * @function getCredentials
   * @return {Object} With keys: [`consumerKey`, `consumerSecret`, `token`, `tokenSecret`]
   */
  tuiter.getCredentials = function() {
    return creds;
  };

  /**
   * Returns if the library is ready, so you can call other tuiter methods
   * after this
   * @function isReady
   * @return {Boolean} The readyness of the library
   */
  tuiter.isReady = function() {
    return ready;
  };

  /**
   * Initialize tuiter library.
   *
   * @function init
   * @param  {Object} tokens Access tokens: [`consumerKey`, `consumerSecret`,
   * `token`, `tokenSecret`]
   * @param  {Boolean} stream If we should start streaming right now (does not
   * wait for events)
   * @param  {Object} parms  If `stream` is true, posible params to start.
   */
  tuiter.init = function(tokens, stream, parms) {
    console.log('tuiter.init');

    if (ready) {
      return;
    }

    var neededTokens = ['consumerKey', 'consumerSecret', 'token', 'tokenSecret'];

    // Check if we have all data
    var fullConfig = neededTokens.every(function(el) {
      return tokens[el] ? true : false;
    });

    if (fullConfig) {
      creds = tokens;
    } else {
      console.warn('Not enough tokens data. Check that you have sent a object with',
        neededTokens, '. Received ', tokens);
      return false;
    }

    var getConfig = function getConfig() {
      var endpoint = 'https://api.twitter.com/1.1/help/configuration.json';
      var method = 'GET';
      var params = {};
      tuiter._request(endpoint, method, params, function(error, json) {
        if (error) {
          setTimeout(getConfig, 2000); // Retry again later…
        } else {
          config = json;
        }
      });
    };

    var getOwnUser = function getOwnUser(parms) {
      var endpoint = 'https://api.twitter.com/1.1/account/verify_credentials.json';
      var method = 'GET';
      var params = {
        include_entities: parms.include_entities,
        skip_status: parms.skip_status
      };

      tuiter._request(endpoint, method, params, function(error, json) {
        if (error) {
          setTimeout(getOwnUser.bind(this, parms), 2000); // Retry again later…
        } else {
          userConfig = json;
          // Caching friends when not in streaming mode
          if (!stream) {
            tuiter.getFriendsIds(null, userConfig['screen_name'], {},
              function(error, data) {
                if (error) {
                  console.error(error);
                  return;
                }
                friends = data['ids'];
            });
          }
        }
      });
    };

    // Auto start stream
    if (stream) {
      tuiter.userStream(parms);
      tuiter.addListener('friends', function(friendList) {
        friends = friendList;
      });
    }

    // Get Initial data for both streaming or REST
    setTimeout(function() {
      getConfig();
    }, 100);

    setTimeout(function() {
      getOwnUser({ skip_status: 1});
    }, 300);


    ready = true;

    return true;
  };

  /**
   * Returns the own user as send by GET account/verify_credentials
   *
   * @function conf.getOwnUser
   * @param {String} param If set, returns just this variable, instead of the
   *                       whole object
   * @link https://dev.twitter.com/docs/api/1.1/get/account/verify_credentials
   * @return {Object} Own user information
   */
  tuiter.conf.getOwnUser = function(param) {
    return param ? userConfig[param] : userConfig;
  };

  /**
   * Internal method to make a request to the Twitter API.
   * This is a low level API. Use at your own risk, but we
   * recommend to use the High level APIs that encapsulate
   * the requests.
   *
   * @function _request
   * @param  {string}   endpoint URL to hit
   * @param  {string}   method   HTTP verb to use
   * @param  {Object}   params   extra params for the petition
   */
  tuiter._request = function(endpoint, method, params, callback, data) {

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
      callback('Not ready yet, check tuiter.init() response!');
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
    //console.log(url);
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
    xhr.send(data);
  };

  /**
   * Returns the 20 most recent mentions (tweets containing a users's @screen_name)
   * for the authenticating user.
   *
   * @function getMentionsTimeline
   * @link https://dev.twitter.com/docs/api/1.1/get/statuses/mentions_timeline
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the mentions returned in JSON (error, json)
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

  /**
   * Returns a collection of the most recent Tweets posted by the user indicated
   * by the screen_name or user_id parameters.
   *
   * @function getUserTimeline
   * @link https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
   * @param  {String}   user_id User id to request the timeline
   * @param  {String}   screen_name User screen name to request the timeline
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the timeline returned in JSON (error, json)
   */
  tuiter.getUserTimeline = function(user_id, screen_name, parms, cb)  {
    if (user_id && screen_name) {
      cb('Please, set only user_id or screen_name, but NOT both');
      return;
    }

    var endpoint = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
    var method = 'GET';
    var params = {
      user_id: user_id,
      screen_name: screen_name,
      since_id: parms.since_id,
      count: parms.count,
      max_id: parms.max_id,
      trim_user: parms.trim_user,
      exclude_replies: parms.exclude_replies,
      contributor_details: parms.contributor_details,
      include_rts: parms.include_rts
    };
    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Returns a collection of the most recent Tweets and retweets posted by the
   * authenticating user and the users they follow. The home timeline is
   * central to how most users interact with the Twitter service.
   * Up to 800 Tweets are obtainable on the home timeline. It is more volatile
   * for users that follow many users or follow users who tweet frequently.
   *
   * @function getHomeTimeline
   * @link https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
   * @param  {Object}   params Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the timeline in JSON (error, json)
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
   * Returns the most recent tweets authored by the authenticating user that
   * have been retweeted by others. This timeline is a subset of the user's
   * GET statuses/user_timeline.
   *
   * @function getRetweetsOfMe
   * @link https://dev.twitter.com/docs/api/1.1/get/statuses/retweets_of_me
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the timeline in JSON (error, json)
   */
  tuiter.getRetweetsOfMe = function(parms, cb)  {
    var endpoint = 'https://api.twitter.com/1.1/statuses/retweets_of_me.json';
    var method = 'GET';
    var params = {
      count: parms.count,
      since_id: parms.since_id,
      max_id: parms.max_id,
      trim_user: parms.trim_user,
      include_entities: parms.include_entities,
      include_user_entities: parms.include_user_entities
    };
    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Retweets a tweet. Returns the original tweet with retweet details embedded.
   *
   * @function getRetweetsOfMe
   * @link https://dev.twitter.com/docs/api/1.1/post/statuses/retweet/%3Aid
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the timeline in JSON (error, json)
   */
  tuiter.retweetId = function(id, parms, cb)  {
    var endpoint = 'https://api.twitter.com/1.1/statuses/retweet/' + id + '.json';
    var method = 'POST';
    var params = {
      trim_user: parms.trim_user
    };
    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Favorites the status specified in the ID parameter as the authenticating user.
   * Returns the favorite status when successful.
   *
   * @function favoritesCreate
   * @link  https://api.twitter.com/1.1/favorites/create.json
   * @param  {Stting}   id    The numerical ID of the desired status.
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the resulted status
   */
  tuiter.favoritesCreate = function(id, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/favorites/create.json';
    var method = 'POST';
    var params = {
      id: id,
      include_entities: parms.include_entities
    };
    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Un-favorites the status specified in the ID parameter as the authenticating user.
   * Returns the un-favorited status in the requested format when successful.
   *
   * @function favoritesDestroy
   * @link https://dev.twitter.com/docs/api/1.1/post/favorites/destroy
   * @param  {String}   id    The numerical ID of the desired status.
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the resulted status
   */
  tuiter.favoritesDestroy = function(id, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/favorites/destroy.json';
    var method = 'POST';
    var params = {
      id: id,
      include_entities: parms.include_entities
    };
    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Updates the authenticating user's current status, also known as tweeting.
   *
   * @function updateStatus
   * @link https://dev.twitter.com/docs/api/1.1/post/statuses/update
   * @param  {String}   text     The text of your status update, typically up to
   *                             140 characters.
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb       Callback with the new Tweet returned (error, tweet)
   */
  tuiter.updateStatus = function(text, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/statuses/update.json';
    var method = 'POST';
    var params = {
      status: text,
      in_reply_to_status_id: parms.in_reply_to_status_id,
      possibly_sensitive: parms.possibly_sensitive,
      lat: parms.lat,
      long: parms.long,
      place_id: parms.place_id,
      display_coordinates: parms.display_coordinates,
      trim_user: parms.trim_user
    };

    tuiter._request(endpoint, method, params, cb);
  };

  tuiter.updateStatusWithMedia = function(text, media, parms, cb) {
    if (Array.isArray(media)) {
      if (media.length > config['max_media_per_upload']) {
        cb('You wanted to send ' + media.length + ' media objects but twitter ' +
           'only supports ' + config['max_media_per_upload'] + ' per tweet');
      }
    } else {
      cb('media parameter must be a Array');
    }
    var endpoint = 'https://api.twitter.com/1.1/statuses/update_with_media.json';
    var method = 'POST';
    var params = {
      status: text,
      media: media,
      possibly_sensitive: parms.possibly_sensitive,
      in_reply_to_status_id: parms.reply_to,
      lat: parms.lat,
      long: parms.long,
      place_id: parms.place_id,
      display_coordinates: parms.display_coordinates,
    };

    var fd = new FormData();
    fd.append('media[]', media[0]);

    tuiter._request(endpoint, method, params, cb, fd);
  };

  /**
   * Returns a collection of up to 100 user IDs belonging to users who have
   * retweeted the tweet specified by the id parameter.
   *
   * @function getRetweetersStatus
   * @link https://dev.twitter.com/docs/api/1.1/get/statuses/retweeters/ids
   * @param  {String}   id     Status id to get users that has RT
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the JSON returned (error, json)
   */
  tuiter.getRetweetersStatus = function(id, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/statuses/retweeters/ids.json';
    var method = 'GET';
    var params = {
      id: id,
      cursor: parms.cursor,
      stringify_ids: parms.stringify_ids
    };

    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Returns a collection of the 100 most recent retweets of the tweet
   * specified by the id parameter.
   *
   * @function getRetweetsStatus
   * @link https://dev.twitter.com/docs/api/1.1/get/statuses/retweets/%3Aid
   * @param  {String}   id     Status id to get retweets information
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the JSON returned (error, json)
   */
  tuiter.getRetweetsStatus = function(id, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/statuses/retweets/' + id + '.json';
    var method = 'GET';
    var params = {
      id: id,
      count: parms.count,
      trim_user: parms.trim_user
    };

    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Returns a single Tweet, specified by the id parameter. The Tweet's author
   * will also be embedded within the tweet.
   *
   * @function getStatusShow
   * @link https://dev.twitter.com/docs/api/1.1/get/statuses/show/%3Aid
   * @param  {String}   id     Status id to get information
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the JSON returned (error, json)
   */
  tuiter.getStatusShow = function(id, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/statuses/show.json';
    var method = 'GET';
    var params = {
      id: id,
      trim_user: parms.trim_user,
      include_my_retweet: parms.include_my_retweet,
      include_entities: parms.include_entities
    };

    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Destroys the status specified by the required ID parameter. The
   * authenticating user must be the author of the specified status. Returns
   * the destroyed status if successful.
   *
   * @function destroyStatus
   * @link https://dev.twitter.com/docs/api/1.1/post/statuses/destroy/%3Aid
   * @param  {String}   id     Status id to destroy information
   * @param  {Object}   parms Extra parameters for the query, see link
   * @param  {Function} cb     Callback with the status deleted (error, deletedStatus)
   */
  tuiter.destroyStatus = function(id, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/statuses/destroy/' + id + '.json';
    var method = 'POST';
    var params = {
      id: id,
      trim_user: parms.trim_user
    };

    tuiter._request(endpoint, method, params, cb);
  };


  /**
   * Returns the 20 most recent direct messages sent to the authenticating user.
   * Includes detailed information about the sender and recipient user. You can
   * request up to 200 direct messages per call, up to a maximum of 800 incoming DMs.
   *
   * @function getDirectMessages
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
   * Returns a cursored collection of user IDs for every user the specified user
   * is following (otherwise known as their "friends").
   *
   * @function getFriendsIds
   * @link https://dev.twitter.com/docs/api/1.1/get/friends/ids
   * @param  {String}   id_str      The ID of the user for whom to return results
   *                                for.
   * @param  {String}   screen_name The screen name of the user for whom to return
   *                                results for.
   * @param  {Object}   parms       Extra parameters, check link
   * @param  {Function} cb          Callback with the JSON returned (error, json)
   */
  tuiter.getFriendsIds = function(id_str, screen_name, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/friends/ids.json';
    var method = 'GET';
    var params = {
      user_id: id_str,
      screen_name: screen_name ? normalizeScreenName(screen_name) : undefined,
      cursor: parms.cursor,
      stringify_ids: parms.stringify_ids,
      count: parms.count
    };

    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Returns all lists the authenticating or specified user subscribes to, including
   * their own. The user is specified using the user_id or screen_name parameters.
   * If no user is given, the authenticating user is used.
   *
   * @function getLists
   * @link https://dev.twitter.com/rest/reference/get/lists/list
   * @param  {String}   id_str      The ID of the user for whom to return results
   *                                for.
   * @param  {String}   screen_name The screen name of the user for whom to return
   *                                results for.
   * @param  {Object}   parms       Extra parameters, check link
   * @param  {Function} cb          Callback with the JSON returned (error, json)
   */
  tuiter.getLists = function(id_str, screen_name, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/lists/list.json';
    var method = 'GET';
    var params = {
      user_id: id_str,
      screen_name: screen_name ? normalizeScreenName(screen_name) : undefined,
      reverse: parms.reverse
    };

    tuiter._request(endpoint, method, params, cb);

  };

  /**
   * Returns a variety of information about the user specified by the required user_id
   * or screen_name parameter. The author's most recent Tweet will be returned
   * inline when possible.
   *
   * @function getUserShow
   * @link https://dev.twitter.com/docs/api/1.1/get/users/show
   * @param  {String}   id_str      ID of the user (1134374479)
   * @param  {String}   screen_name Screen name of the user (willyaranda)
   * @param  {Object}   parms       Extra parameters, check link
   * @param  {Function} cb          Callback with the JSON returned (error, json)
   */
  tuiter.getUserShow = function(id_str, screen_name, parms, cb) {
    var endpoint = 'https://api.twitter.com/1.1/users/show.json';
    var method = 'GET';
    var params = {
      user_id: id_str,
      screen_name: screen_name ? normalizeScreenName(screen_name) : undefined,
      include_entities: parms.include_entities
    };

    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Allows the authenticating users to follow the user specified in the ID parameter.
   *
   * @function friendshipsCreate
   * @link https://dev.twitter.com/docs/api/1.1/post/friendships/create
   * @param  {String}   user_id     The ID of the user for whom to befriend.
   * @param  {String}   screen_name The screen name of the user for whom to befriend.
   * @param  {Boolean}   follow      Enable notifications for the target user.
   * @param  {Function} cb          Callback with the JSON returned (error, json)
   */
  tuiter.friendshipsCreate = function(user_id, screen_name, follow, cb) {
    var endpoint = 'https://api.twitter.com/1.1/friendships/create.json';
    var method = 'POST';
    var params = {
      user_id: user_id,
      screen_name: screen_name,
      follow: follow || true
    };

    tuiter._request(endpoint, method, params, cb);
  };

  /**
   * Allows the authenticating user to unfollow the user specified in the ID parameter.
   *
   * @function friendshipsDestroy
   * @link https://dev.twitter.com/docs/api/1.1/post/friendships/destroy
   * @param  {String}   user_id     The ID of the user for whom to unfollow.
   * @param  {String}   screen_name The screen name of the user for whom to unfollow.
   * @param  {Function} cb          Callback with the JSON returned (error, json)
   */
  tuiter.friendshipsDestroy = function(user_id, screen_name, cb) {
    var endpoint = 'https://api.twitter.com/1.1/friendships/destroy.json';
    var method = 'POST';
    var params = {
      user_id: user_id,
      screen_name: screen_name
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
    //console.log('tuiter.userStream');
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

    _streamXHR = new XMLHttpRequest({mozSystem: true});
    _streamXHR.open(message.method, url);
    _streamXHR.responseType = 'moz-chunked-text';
    _streamXHR.onprogress = _onDataAvailable;
    _streamXHR.send();
  };

  // see http://hg.instantbird.org/instantbird/file/tip/chat/protocols/twitter/twitter.js
  function _onDataAvailable(aRequest) {
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
      _parseData(json);
    });
  }

  function _parseData(data) {
    // Twit event
    if (data['text']) {
      _fireEvent('text', data);
    }
    // Direct message (direct_message)
    else if (data['direct_message']) {
      _fireEvent('direct_message', data['direct_message']);
    }
    // Friends lists (friends)
    else if (data['friends']) {
      _fireEvent('friends', data['friends']);
    }
    // Status deletion notices
    else if (data['delete']) {
      _fireEvent('delete', data['delete'].status.id_str);
    }
    // Location deletion notices
    else if (data['scrub_geo']) {
      _fireEvent('scrub_geo', data);
    }
    //Limit notices (limit)
    else if (data['limit']) {
      _fireEvent('limit', data);
    }
    //Withheld content notices (status_withheld, user_withheld)
    else if (data['status_withheld']) {
      _fireEvent('status_withheld', data);
    }
    else if (data['user_withheld']) {
      _fireEvent('user_withheld', data);
    }
    //Disconnect messages (disconnect)
    else if (data['disconnect']) {
      streaming = false;
      _fireEvent('disconnect', data);
    }
    //Stall warnings (warning)
    else if (data['warning']) {
      _fireEvent('warning', data);
    }
    //Events (event) --> target (user), source (user), target_object, created_at
    else if (data['event']) {
      _fireEvent(data['event'], data['target'], data['source'], data['target_object']);
    } else {
      console.warn('unknown message??', data);
    }
  }

  function _fireEvent(event, ...msg) {
    console.log('Firing ' + event + ' event');
    var toFire = listeners[event];
    if (Array.isArray(toFire)) {
      toFire.forEach(function(elem) {
          if (typeof elem === 'function') {
              elem(...msg);
          }
      });
    }
  }

  tuiter.abortStreaming = function() {
    _streamXHR.abort();
  };

  tuiter.removeAllListeners = function() {
    listeners = {};
  };

  tuiter.addListener = function(eventType, cb) {
    if (!Array.isArray(listeners[eventType])) {
        listeners[eventType] = [];
    }
    listeners[eventType].push(cb);
  };

  tuiter.removeListener = function(eventType, cb) {
    var index = listeners[eventType].indexOf(cb);
    if (index >= 0) {
        listeners[eventType].splice(index, 1);
        return true;
    }
    return false;
  };

  window.tuiter = tuiter;

}(window));

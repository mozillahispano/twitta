/* jshint browser: true, esnext: true, strict: true */

(function(window) {
  'use strict';
  var Twit = require('twit');

  var T = new Twit({
      consumer_key: '6G62H3Cv6shuI4LbjsVe7rxJx',
      consumer_secret: 'ASSDrn797pc5igFOkzGdeyQnS2IbUpCKHZivcRVIcctLl6VZxS',
      access_token: '3827311-zOKeUvMoWEAEcgrqJP9uoVM9kB2DsJAMIjPnjE0qOB',
      access_token_secret: 'NlO800QSliBNK50tlXYI8rPmqPv7VOWKW4lUrePPXHooH'
  });

  T.setCredentials = function(tokens) {
    T.setAuth(tokens);
  };

  T.initialize = function() {

    // Check if we have all data
    var neededTokens = ['consumer_key', 'consumer_secret', 'access_token', 'access_token_secret'];
    var tokens = T.getAuth();
    var fullConfig = neededTokens.every(function(el) {
      return tokens[el] ? true : false;
    });

    if (!fullConfig) {
      console.warn('Not enough data!');
      // TODO: ask for credentials in the UI
    }

    // Track user stream. Enough for realtime things
    var stream = T.stream('user');
    var listEvents = ['blocked', 'unblocked', 'favorite', 'unfavorite', 'follow', 'unfollow', 'user_update', 'list_created',
    'list_destroyed', 'list_updated', 'list_member_added', 'list_member_removed', 'list_user_subscribed', 'list_user_unsubscribed',
    'unknown_user_event', 'tweet', 'error'];

    var timelineCtrl = new timeline.controller();
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
    });
  };

  window.T = T;

})(window);
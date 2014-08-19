/* global user, tuiter, moment, UIhelpers */

'use strict';

var timeline = timeline || {};
(function(window) {

    var userController;
    var timelineController;
    var timelineRefreshInterval;
    var latestHomeRequestSinceEpochMs;
    var eldestTweetId;
    var newestTweetId;

    var ELEM = document.getElementById('timeline');

    // Models
    timeline.Tweet = function(tweet) {
        // Lazy initialize
        if (!userController) {
            userController = new user.controller();
        }

        this.id_str = m.prop(tweet.id_str);
        this.created_at = m.prop((new Date(tweet.created_at)).getTime());
        this.text = m.prop(tweet.text);
        this.user = new user.User(tweet.user);
        userController.add(this.user);

        // Placeholders
        this.is_retweet = m.prop(false);
        this.media = m.prop(false);

        // this is a RT
        if (tweet.retweeted_status) {
            this.is_retweet = m.prop(true);
            this.orig_id = m.prop(tweet.retweeted_status.id);
            this.retweeted_by_username = m.prop(tweet.user.screen_name);
            this.orig_user = new user.User(tweet.retweeted_status.user);
            userController.add(this.orig_user);
        }

        // This has media
        if (tweet.entities && tweet.entities.media) {
            this.media = m.prop(true);
            this.media_url = m.prop(tweet.entities.media[0].media_url_https);
            this.expanded_url = m.prop(tweet.entities.media[0].expanded_url);
        }

        // Own actions:
        this.retweeted = m.prop(tweet.retweeted);
        this.favorited = m.prop(tweet.favorited);
    };

    // List of tweets: timeline
    var tweetList = [];

    // Controller
    timeline.controller = function() {
        this.add = function(tweet) {
            var tuit = new timeline.Tweet(tweet);

            // Check if we have this tweet, if so, do nothing.
            if (this.find(tuit.id_str())) {
                return;
            }
            tweetList.push(tuit);
            // Do not render if we are not on the view
            if (m.route() !== '/timeline') { return; }
            UIhelpers.showOnlyThisSection(ELEM);

            m.render(ELEM, timeline.view(this));
        }.bind(this);

        this.find = function(id) {
            var found = null;
            function findFunction(element, index) {
                if (element.id_str() === id) {
                    found = {};
                    found.value = element;
                    found.index = index;
                    return true;
                } else {
                    return false;
                }
            }
            // Find the tweet
            tweetList.some(findFunction);
            return found;
        };

        this.remove = function(id) {
            var tw = this.find(id);
            if (tw) {
                tweetList.splice(tw.index, 1);
            }
        }.bind(this);

        this.favorited = function(id) {
            var tw = this.find(id);
            tw.favorited(true);
        }.bind(this);

        this.unfavorited = function(id) {
            var tw = this.find(id);
            tw.favorited(false);
        }.bind(this);

        this.retweeted = function(id) {
            var tw = this.find(id);
            tw.retweeted(true);
        }.bind(this);

        this.unretweeted = function(id) {
            var tw = this.find(id);
            tw.retweeted(false);
        }.bind(this);

        if (!timelineRefreshInterval) {
            timelineRefreshInterval = setTimeout(function() {
                timeline.test();
            }, 1000);
        }
    };

    timeline.test = function() {
        if (!timelineController) {
            timelineController = new timeline.controller();
        }
        tuiter.getHomeTimeline({}, function(error, data) {
            if (error) {
                console.error(error);
            } else {
                data.forEach(function(tw) {
                    timelineController.add(tw);
                });
            }
        });
    };

    // View
    timeline.view = function(controller) {
        function mediaNodes(tweet) {
            if (tweet.media()) {
                return m('a', {
                    href: tweet.expanded_url()
                    }, m('img', {src: tweet.media_url()})
                );
            }
        }

        // We want this in reverse order, let's return the other way around
        function compareFunc(a, b) {
            if (a.id_str() < b.id_str()) {
                return 1;
            } else if (b.id_str() < a.id_str()) {
                return -1;
            } else {
                return 0;
            }
        }

        // Sort the Array
        tweetList.sort(compareFunc);

        return tweetList.map(function(tweet) {
            var ago = moment(tweet.created_at()).fromNow();
            return m('div#' + tweet.id_str(), [
                       m('div#img', [
                           m('img', {src: tweet.user.profile_image_url_https()})
                       ]),
                       m('p#name', [
                         tweet.user.name() + ' ',
                         m('a',
                           {href: '/user/' + tweet.user.id(), config: m.route },
                           '@' + tweet.user.screen_name()
                         )]
                       ),
                       m('p#text', tweet.text()),
                       m('p#date', ago),
                       m('p#retweeted', tweet.is_retweet()),
                       mediaNodes(tweet)
                ]);
        });
    };

})(window);

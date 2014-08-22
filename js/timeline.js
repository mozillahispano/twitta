/* global tweet, tuiter, UIhelpers, header */

'use strict';

var timeline = timeline || {};
(function(window) {

    var timelineRefreshInterval;
    var latestHomeRequestSinceEpochMs;
    var eldestTweetId;
    var newestTweetId;
    var firstRun = true;

    var init = false;

    var ELEM = document.getElementById('timeline');

    // List of tweets: timeline
    var tweetList = [];

    // Controller
    timeline.controller = function() {
        this.add = function(tw) {
            var tuit = new tweet.Tweet(tw);

            // Check if we have this tweet, if so, do nothing.
            if (this.find(tuit.id_str())) {
                return;
            }
            tweetList.push(tuit);
            header.update();

            // Do not show the section if we are not on the route
            if (m.route() === '/timeline') {
                UIhelpers.showOnlyThisSection(ELEM);
            }
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
        }.bind(this);

        this.remove = function(id) {
            var tw = this.find(id);
            if (tw) {
                tweetList.splice(tw.index, 1);
                header.update();
                m.render(ELEM, timeline.view(this));
            }
        }.bind(this);

        this.favorited = function(id) {
            var tw = this.find(id);
            if (tw.value) {
                tw.value.favorited(true);
            }
        }.bind(this);

        this.unfavorited = function(id) {
            var tw = this.find(id);
            if (tw.value) {
                tw.value.favorited(false);
            }
        }.bind(this);

        this.retweeted = function(id) {
            var tw = this.find(id);
            if (tw.value) {
                tw.value.retweeted(true);
            }
        }.bind(this);

        this.unretweeted = function(id) {
            var tw = this.find(id);
            if (tw.value) {
                tw.value.retweeted(false);
            }
        }.bind(this);



        // Initialize
        if (!init) {
            var that = this;
            // Wait a little to load timeline
            setTimeout(function() {
                timeline.refresh.bind(that)();
                timeline.listenToEvents.bind(that)();
                tuiter.userStream();
            }, 300);
        }

        if (m.route() === '/timeline') {
            UIhelpers.showOnlyThisSection(ELEM);
        }
        m.render(ELEM, timeline.view(this));
        init = true;
    };

    timeline.listenToEvents = function() {
        var that = this;
        tuiter.addListener('text', function(data) {
            that.add(data);
        });
        tuiter.addListener('delete', function(tweetId) {
            that.remove(tweetId);
        });
    };

    timeline.refresh = function(forced) {
        if (forced) {
            console.log('timeline.refresh forced');
        }
        var now = Date.now();
        if (!latestHomeRequestSinceEpochMs) {
            latestHomeRequestSinceEpochMs = now;
        }

        if (!firstRun && !forced && (now - latestHomeRequestSinceEpochMs < 60000)) {
            console.log('stall', now, latestHomeRequestSinceEpochMs);
            return;
        } else {
            latestHomeRequestSinceEpochMs = now;
        }

        var that = this;

        if (!timelineRefreshInterval) {
            timelineRefreshInterval = window.setInterval(function() {
                timeline.refresh.bind(that)();
            }, 600000);
        }

        // Just get new tweets
        var params = {
            since_id: newestTweetId
        };
        tuiter.getHomeTimeline(params, function(error, data) {
            if (error) {
                console.error(error);
                m.render(ELEM, timeline.view(that));
            } else {
                data.forEach(function(tw) {
                    that.add(tw);
                });
            }
            firstRun = false;
        });
    };

    timeline.getLength = function() {
        return tweetList.length;
    };

    timeline.loadMore = function() {
        var that = this;
        var params = {
            max_id: eldestTweetId
        };
        tuiter.getHomeTimeline(params, function(error, data) {
            if (error) {
                console.error(error);
                m.render(ELEM, timeline.view(that));
            } else {
                data.forEach(function(tw) {
                    that.add(tw);
                });
            }
        });
    };

    // View
    timeline.view = function(controller) {

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

        if (tweetList.length === 0) { return; }

        // Make the timeline, if we have tweets
        // 1) Sort the Array
        tweetList.sort(compareFunc);

        // 2) Save data for next queries
        newestTweetId = tweetList[0].id_str();
        eldestTweetId = tweetList[tweetList.length - 1].id_str();

        // 3) Create the DOM
        var tl = tweetList.map(function(tw) {
            return tweet.view(tw);
        });

        var rv = [];
        rv.push(tl);

        var loadMore = m('div#loadmore', [
            m('button', { onclick: timeline.loadMore.bind(controller)}, 'Load moar')
        ]);
        rv.push(loadMore);

        return rv;
    };

    m.module(ELEM, timeline);

})(window);

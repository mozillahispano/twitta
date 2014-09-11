/* global tweet, tuiter, UIhelpers, header */

'use strict';

var timeline = timeline || {};
(function(window) {

    var controller;

    var timelineRefreshInterval;
    var latestHomeRequestSinceEpochMs;
    var latestLoadMoreRequestSinceEpochMs;

    var eldestTweetId;
    var newestTweetId;
    var firstRun = true;

    var init = false;

    // List of tweets: timeline
    var tweetList = [];

    // Controller
    timeline.controller = function() {
        this.redraw = function() {
            if (m.route() === '/timeline') {
                m.redraw();
            }
        };

        this.add = function(tw) {
            var tuit = new tweet.Tweet(tw);

            // Check if we have this tweet, if so, do nothing.
            if (this.find(tuit.id_str())) {
                return;
            }
            // If it is a RT and we can find it, set the retweet attr to true
            else if (tuit.is_retweet()) {
                var t = this.find(tuit.orig_id_str());
                if (!t) {
                    tweetList.push(tuit);
                    return;
                }
                tweet.changeRTInternal(t, true);
            } else {
                tweetList.push(tuit);
            }

            // Do not show the section if we are not on the route
            if (m.route() === '/timeline') {
                this.redraw();
            }
        }.bind(this);

        this.find = function(id_str) {
            var found = null;

            function findFunction(element, index) {
                if (element.id_str() === id_str) {
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
                this.redraw();
            }
        }.bind(this);

        this.favorited = function(id) {
            var tw = this.find(id);
            if (tw && tw.value) {
                tw.value.favorited(true);
                this.redraw();
            }
        }.bind(this);

        this.unfavorited = function(id) {
            var tw = this.find(id);
            if (tw && tw.value) {
                tw.value.favorited(false);
                this.redraw();
            }
        }.bind(this);

        this.retweeted = function(id) {
            var tw = this.find(id);
            if (tw && tw.value) {
                tw.value.retweeted(true);
                this.redraw();
            }
        }.bind(this);

        this.unretweeted = function(id) {
            var tw = this.find(id);
            if (tw && tw.value) {
                tw.value.retweeted(false);
                this.redraw();
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

        this.redraw();
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
        tuiter.addListener('favorite', function(a, b, tw) {
            that.favorited(tw.id_str);
        });
        tuiter.addListener('unfavorite', function(a, b, tw) {
            that.unfavorited(tw.id_str);
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
            console.log('stall timeline.refresh', now, latestHomeRequestSinceEpochMs);
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
                m.redraw();
            } else {
                data.forEach(function(tw) {
                    that.add(tw);
                });
            }
            firstRun = false;
        });
    };

    timeline.loadMore = function() {
        var params = {
            max_id: eldestTweetId
        };

        var now = Date.now();
        if (!latestLoadMoreRequestSinceEpochMs) {
            latestLoadMoreRequestSinceEpochMs = now;
        }

        if (now - latestLoadMoreRequestSinceEpochMs < 2000) {
            console.log('stall timeline.loadMore', now,
                latestLoadMoreRequestSinceEpochMs);
            return;
        } else {
            latestLoadMoreRequestSinceEpochMs = now;
        }

        tuiter.getHomeTimeline(params, function(error, data) {
            if (error) {
                console.error(error);
            } else {
                var ctrl = new timeline.controller();
                data.forEach(function(tw) {
                    ctrl.add(tw);
                });
            }
        });
    };

    var loadMoreIfVisible = function(elem, isInitialized, context) {
        //don't redraw if we did once already
        if (isInitialized) {
            return;
        }

        function isElementInViewport(elem) {
            var rect = elem.getBoundingClientRect();
            return false;
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        function handler() {
            if (isElementInViewport(elem)) {
                timeline.loadMore();
            }
        }
        addEventListener('scroll', handler, false);
    };

    timeline.view = function(controller, timelineToShow) {

        function compareFunc(a, b) {
            if (a.id_str() < b.id_str()) {
                return 1;
            } else if (b.id_str() < a.id_str()) {
                return -1;
            } else {
                return 0;
            }
        }

        var list = timelineToShow ? timelineToShow : tweetList;

        if (list.length === 0) { return; }

        // Make the timeline, if we have tweets
        // 1) Sort the Array
        list.sort(compareFunc);

        // 2) Save data for next queries
        newestTweetId = list[0].id_str();
        eldestTweetId = list[list.length - 1].id_str();

        // 3) Create the DOM
        var tl = [];
        // Think that we do not have the spacer when we sending a list,
        // just the render of the timeline
        if (!timelineToShow) {
            tl.push(m('div.header_spacer'));
        }
        var map = list.map(function(tw) {
            return tweet.view(tw);
        });

        var rv = m('div.timeline_items', tl.concat(map));

        var loadMore = m('div#loadmore', [
            m('button', {
                onclick: timeline.loadMore,
                //config: loadMoreIfVisible
            }, 'Load moar')
        ]);

        return [header.view(), rv, loadMore];
    };

})(window);

/* global tuiter, moment, UIhelpers, tweet, header */

'use strict';

var mentions = mentions || {};
(function(window) {

    var mentionsRefreshInterval;
    var latestHomeRequestSinceEpochMs;
    var eldestTweetId;
    var newestTweetId;
    var firstRun = true;

    // List of tweets: timeline
    var tweetList = [];

    // Controller
    mentions.controller = function() {
        this.redraw = function() {
            if (m.route() === '/mentions') {
                m.redraw();
            }
        }

        this.add = function(tw) {
            var tuit = new tweet.Tweet(tw);

            // Check if we have this tweet, if so, do nothing.
            if (this.find(tuit.id_str())) {
                return false;
            }
            tweetList.push(tuit);

            // Do not show the section if we are not on the route
            if (m.route() === '/mentions') {
                //UIhelpers.showOnlyThisSection(ELEM);
            }

            this.redraw();
            return true;
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
            }
            this.redraw();
        }.bind(this);

        this.favorited = function(id) {
            var tw = this.find(id);
            if (tw.value) {
                tw.value.favorited(true);
            }
            this.redraw();
        }.bind(this);

        this.unfavorited = function(id) {
            var tw = this.find(id);
            if (tw.value) {
                tw.value.favorited(false);
            }
            this.redraw();
        }.bind(this);

        this.retweeted = function(id) {
            var tw = this.find(id);
            if (tw.value) {
                tw.value.retweeted(true);
            }
            this.redraw();
        }.bind(this);

        this.unretweeted = function(id) {
            var tw = this.find(id);
            if (tw.value) {
                tw.value.retweeted(false);
            }
            this.redraw();
        }.bind(this);

        var that = this;
        // Wait a little to load mentions
        setTimeout(function() {
            mentions.refresh.bind(that)();
            if (firstRun) {
                mentions.listenToEvents.bind(that)();
            }
        }, 3000);

        this.redraw();
    };

    function showNotification(tw) {
        var onclick = function() {
            m.route('/mentions');
        };

        var onclose = function() {};
        UIhelpers.showNotification(tw.user.screen_name, tw.text, onclick, onclose);
    }

    mentions.listenToEvents = function() {
        function isMention(tw) {
            var screen_name = tuiter.conf.getOwnUser('screen_name');
            var text = tw.text.toLowerCase();
            if (text.indexOf(screen_name) >= 0) {
                return true;
            }
            return false;
        }

        var that = this;
        tuiter.addListener('text', function(data) {
            if (isMention(data)) {
                var added = that.add(data);
                if (added) {
                    showNotification(data);
                }
            }
        });
        tuiter.addListener('delete', function(tweetId) {
            that.remove(tweetId);
        });
    };

    mentions.refresh = function(forced) {
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

        if (!mentionsRefreshInterval) {
            mentionsRefreshInterval = window.setInterval(function() {
                mentions.refresh.bind(that)();
            }, 600000);
        }

        // Just get new tweets
        var params = {
            since_id: newestTweetId
        };
        tuiter.getMentionsTimeline(params, function(error, data) {
            if (error) {
                console.error(error);
                m.render(document.body, mentions.view(that));
            } else {
                data.forEach(function(tw) {
                    var t = that.add(tw);
                    // Only show notification if the tweet is added (maybe it's
                    // added previously on streaming API)
                    if (!firstRun && t) {
                        showNotification(tw);
                    }
                });
                firstRun = false;
            }
        });
    };

    mentions.getLength = function() {
        return tweetList.length;
    };

    // View
    mentions.view = function(controller) {
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

        return tl;
    };

})(window);

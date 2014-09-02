/* global tuiter, UIhelpers, dm, header */

'use strict';

var dms = dms || {};
(function(window) {

    var dmRefreshInterval;
    var latestDMRequestSinceEpochMs;
    var eldestDmId;
    var newestDmId;
    var firstRun = true;

    var ELEM = document.getElementById('dms');

    // List of tweets: timeline
    var dmList = [];

    // Controller
    dms.controller = function() {
        this.add = function(d) {
            var dm_obj = new dm.DM(d);

            // Check if we have this tweet, if so, do nothing.
            if (this.find(dm_obj.id_str())) {
                return;
            }
            dmList.push(dm_obj);

            // Do not show the section if we are not on the route
            if (m.route() === '/dms') {
                UIhelpers.showOnlyThisSection(ELEM);
            }

            m.render(ELEM, dms.view(this));
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
            dmList.some(findFunction);
            return found;
        }.bind(this);

        this.remove = function(id) {
            var tw = this.find(id);
            if (tw) {
                dmList.splice(tw.index, 1);
            }
            m.render(ELEM, dms.view(this));
        }.bind(this);

        var that = this;
        // Wait a little to load timeline
        setTimeout(function() {
            dms.refresh.bind(that)();
        }, 6000);

        if (m.route() === '/dms') {
            UIhelpers.showOnlyThisSection(ELEM);
        }
        m.render(ELEM, dms.view(this));
    };

    dms.refresh = function(forced) {
        var now = Date.now();
        if (!latestDMRequestSinceEpochMs) {
            latestDMRequestSinceEpochMs = now;
        }

        if (!firstRun && !forced && (now - latestDMRequestSinceEpochMs < 600000)) {
            console.log('stall', now, latestDMRequestSinceEpochMs);
            return;
        } else {
            latestDMRequestSinceEpochMs = now;
        }

        var that = this;

        if (!dmRefreshInterval) {
            dmRefreshInterval = window.setInterval(function() {
                dms.refresh.bind(that)();
            }, 1200000);
        }

        // Just get new tweets
        var params = {
            since_id: newestDmId
        };
        tuiter.getDirectMessages(params, function(error, data) {
            if (error) {
                console.error(error);
                m.render(ELEM, dms.view(that));
            } else {
                data.forEach(function(tw) {
                    that.add(tw);
                });
            }
        });
        firstRun = false;
    };

    dms.getLength = function() {
        return dmList.length;
    };

    // View
    dms.view = function(controller) {

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

        if (dmList.length === 0) { return; }

        // 1) Sort the Array
        dmList.sort(compareFunc);

        // 2) Save data for next queries
        newestDmId = dmList[0].id_str();
        eldestDmId = dmList[dmList.length - 1].id_str();

        // 3) Make the DOM
        var tl = dmList.map(function(d) {
            return dm.view(d);
        });

        return tl;
    };

    m.module(ELEM, dms);

})(window);

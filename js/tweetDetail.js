/* global UIhelpers, tuiter, tweet */
'use strict';

var tweetDetail = tweetDetail || {};

(function(window) {
    var ELEM = document.getElementById('tweetdetail');

    tweetDetail.controller = function() {
        var id = m.route.param('id');
        tuiter.getStatusShow(id, {}, function(error, json) {
            if (error) {
                console.error(error);
                return;
            }
            var tw = new tweet.Tweet(json);
            UIhelpers.showOnlyThisSection(ELEM);
            m.render(ELEM, tweet.view(tw, true));
        });
    };

    tweetDetail.view = function() {

    };
})(window);

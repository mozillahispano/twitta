/* jshint browser: true, esnext: true, strict: true */

var home = home || {};
// Controller
(function(window) {
    'use strict';

    home.controller = function() {
        window.tokens = [];
        window.tokens['consumerKey'] = '9j88NaS7eXuiMTzc0T4mEIEVo';
        window.tokens['consumerSecret'] = 'XBU9sIkM4qrbYhmVTdEpsdNkMSO7orrflrocFqts8eZDF4BgLc';

        var neededTokens = ['consumerKey', 'consumerSecret',
            'oauthAccessToken', 'oauthAccessTokenSecret'];
        neededTokens.forEach(function(el) {
            if (el.match(/consumer.*/)) { return; }
            window.tokens[el] = localStorage.getItem(el);
        });

        neededTokens.forEach(function(el) {
            console.log(el, window.tokens[el])
        })

        function allKeys() {
            return window.tokens.every(function(el) {
                return window.tokens[el] ? true : false;
            })
        }

        // We do not have any keys for connecting to twitter, so let's redirect
        // to /login
        if (!allKeys()) {
            console.log('Keys not found, first launch? Routing to /login');
            m.route('/login');
        } else {
            console.log('We have keys, routing to /timeline');
            m.route('/timeline');
        }
    };
})(window);


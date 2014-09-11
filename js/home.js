/* global tuiter */
'use strict';

var home = home || {};
(function(window) {

    home.controller = function() {
        window.tokens = [];
        window.tokens['consumerKey'] = '9j88NaS7eXuiMTzc0T4mEIEVo';
        window.tokens['consumerSecret'] = 'XBU9sIkM4qrbYhmVTdEpsdNkMSO7orrflrocFqts8eZDF4BgLc';

        var neededTokens = ['token', 'tokenSecret'];

        neededTokens.forEach(function(el) {
            window.tokens[el] = localStorage.getItem(el);
        });

        neededTokens.push('consumerKey');
        neededTokens.push('consumerSecret');

        function allKeys() {
            return neededTokens.every(function(el) {
                return (window.tokens[el] !== null) ? true : false;
            });
        }

        // Check if we have all tokens needed for working with Twitter
        if (!allKeys()) {
            m.route('/login');
        } else {
            tuiter.init(window.tokens);
            m.route('/timeline');
        }
    };
})(window);


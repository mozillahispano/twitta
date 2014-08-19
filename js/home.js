var home = home || {};
(function(window) {
    'use strict';

    home.controller = function() {
        window.tokens = [];
        window.tokens['consumerKey'] = '9j88NaS7eXuiMTzc0T4mEIEVo';
        window.tokens['consumerSecret'] = 'XBU9sIkM4qrbYhmVTdEpsdNkMSO7orrflrocFqts8eZDF4BgLc';

        var neededTokens = ['consumerKey', 'consumerSecret',
            'token', 'tokenSecret'];
        neededTokens.forEach(function(el) {
            if ((el === 'consumerKey') || (el === 'consumerSecret')) { return; }
            window.tokens[el] = localStorage.getItem(el);
        });

        neededTokens.forEach(function(el) {
            console.log(el, window.tokens[el]);
        });

        function allKeys() {
            return neededTokens.every(function(el) {
                return (window.tokens[el] !== null) ? true : false;
            });
        }

        // Check if we have all tokens needed for working with Twitter
        if (!allKeys()) {
            console.log('Keys not found, first launch? Routing to /login');
            m.route('/login');
        } else {
            console.log('We have keys, routing to /timeline');
            tuiter.init(window.tokens);
            m.route('/timeline');
        }
    };
})(window);


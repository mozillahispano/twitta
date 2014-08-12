/* jshint browser: true, esnext: true, strict: true */

var home = home || {};
// Controller
(function(window) {
    'use strict';

    home.controller = function() {
        var keys = localStorage.getItem('keys');

        // We do not have any keys for connecting to twitter, so let's redirect
        // to /login
        if (keys === null) {
            console.log('routing to /login');
            m.route('/login');
        } else {
            console.log('routing to /timeline');
            m.route('/timeline');
        }
    };
    m.module(document.getElementById('home'), home);
})(window);


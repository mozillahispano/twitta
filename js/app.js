/* global home, timeline, login, user, compose, mentions */

(function(window) {
    'use strict';

    window.addEventListener('load', function() {
        m.route.mode = 'hash';
        var start = document.getElementById('routing');
        m.route(start, '/', {
            '/': home,
            '/timeline': timeline,
            '/login': login,
            // '/profile': ownProfile,
            '/compose': compose,
            '/mentions': mentions,
            '/user/:id': user
            /*,
            '/dm': dm,
            '/tweet/:id': tweetDetail,
            '/list/:id': listDetail,
            '/settings': settings*/
        });
    });

})(window);

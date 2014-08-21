/* global home, timeline, login, user, compose, mentions, dms */

(function(window) {
    'use strict';

    window.addEventListener('load', function() {
        m.route.mode = 'hash';
        var start = document.getElementById('routing');
        m.route(start, '/', {
            '/': home,
            '/timeline': timeline,
            '/login': login,
            '/compose': compose,
            '/mentions': mentions,
            '/user/:id': user,
            '/dms': dms,
            /*'/tweet/:id': tweetDetail,
            '/list/:id': listDetail,
            '/settings': settings*/
        });
    });

})(window);

/* global home, timeline, login, user, compose, mentions, dms,
tweetDetail */

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
            '/tweet/:id': tweetDetail,
            /*'/list/:id': listDetail,
            '/settings': settings*/
            //'/search/:id': search
        });
        // Ugh...
        setTimeout(function() {
            start.parentNode.removeChild(start);
        }, 2000);
    });

})(window);

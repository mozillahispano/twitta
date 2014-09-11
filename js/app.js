/* global home, timeline, login, user, compose, mentions, dms,
tweetDetail */

(function(window) {
    'use strict';

    window.addEventListener('load', function() {
        m.route.mode = 'hash';
        m.route(document.body, '/', {
            '/': home,
            '/timeline': timeline,
            '/login': login,
            '/compose': compose,
            '/compose/:reply_text/:reply_to_id_str': compose,
            '/mentions': mentions,
            '/user/:id': user,
            '/dms': dms,
            '/tweet/:id': tweetDetail,
            /*'/list/:id': listDetail,
            '/settings': settings*/
            //'/search/:id': search
        });
    });

})(window);

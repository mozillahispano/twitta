/* jshint browser: true, esnext: true, strict: true */

(function(window) {
    'use strict';
    //T.initialize();

    window.addEventListener('load', function() {
        m.route.mode = "hash";
        var start = document.getElementById('routing');
        m.route(start, "/", {
            "/": home,
            "/timeline": timeline,
            "/login": login,
            /*
            "/profile": ownProfile,
            "/compose": compose,
            "/mentions": mentions,*/
            "/user/:id": user
            /*,
            "/dm/:id": dm,
            "/tweet/:id": tweetDetail,
            "/list/:id": listDetail,
            "/settings": settings*/
        });
    });

})(window);

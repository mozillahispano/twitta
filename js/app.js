/* jshint browser: true, esnext: true, strict: true */

(function(window) {
    'use strict';
    //T.initialize();

    // Stubs
    window.home = {
        model: {},
        controller: {},
        view: {}
    };
    window.timeline = {
        model: {},
        controller: {},
        view: {}
    };

    window.user = {
        model: {},
        controller: {},
        view: {}
    };

    window.login = {
        model: {},
        controller: {},
        view: {}
    };

    window.onload = function() {
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
    }

})(window);

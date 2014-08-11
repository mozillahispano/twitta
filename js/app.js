/* jshint browser: true, esnext: true, strict: true */

(function(window) {
    'use strict';
    //T.initialize();

    m.route.mode = "hash";
    var start = document.getElementById('home');
    m.route(start, "/home", {
        "/home": home,
        "/timeline": timeline,
        /*
        "/login": login,
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

})(window);

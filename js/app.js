(function(window) {
    'use strict';

    T.initialize();

    m.route(document.body, "/", {
        "/": timeline/*,
        "/login": login,
        "/profile": ownProfile,
        "/compose": compose,
        "/mentions": mentions,
        "/user/:id": userProfile,
        "/dm": dm,
        "/tweet/:id": tweetDetail,
        "/list/:id": listDetail,
        "/settings": settings*/
    });


})(window);

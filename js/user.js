/* jshint browser: true, esnext: true, strict: true */

var user = user || {};
(function(window) {
    'use strict';

    // Models
    user.User = function(user) {
        this.id = m.prop(user.id_str);
        this.description = m.prop(user.description);
        this.location = m.prop(user.location);
        this.name = m.prop(user.name); //long name: Guillermo López
        this.screen_name = m.prop(user.screen_name); // username: willyaranda
        this.verified = m.prop(user.verified);
        this.profile_image_url_https = m.prop(user.profile_image_url_https);
        this.statuses_count = m.prop(user.statuses_count);
        this.friends_count = m.prop(user.friends_count);
        this.followers_count = m.prop(user.followers_count);
    };

    user.UserList = Array;

    // Controller
    user.controller = function() {
        this.list = new user.UserList();

        this.add = function(u) {
            var previouslyAdded = false;
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].id() === u.id()) {
                    previouslyAdded = true;
                    console.log('previouslyAdded', this.list[i].id(), u.id());
                } else {
                    console.log('NOT previouslyAdded', this.list[i].id(), u.id());

                }
            }
            if (previouslyAdded) { return; }
            this.list.push(new user.User(u));
            console.log('this.list.length', this.list.length);
            console.log(this.list);
        }.bind(this);

        this.id = m.route.param('id');
        m.render(document.getElementById('userprofile'), user.view(this));
    };

    // View
    user.view = function(controller) {
        console.log('user.view');
        console.log(controller.list);
        return m('section#userprofile', [
            m('div', [
                m('p', controller.id)
            ])
        ]);
    };

    m.module(document.getElementById('userprofile'), user);
})(window);

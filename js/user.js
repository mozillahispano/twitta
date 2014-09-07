/* global UIhelpers, tuiter, tweet */

'use strict';

var user = user || {};
(function(window) {

    var ELEM = document.getElementById('userprofile');

    function changeToBigger(profile_url) {
        return profile_url.replace('_normal', '_bigger');
    }

    // Models
    user.User = function(user) {
        this.id_str = m.prop(user.id_str);
        this.description = m.prop(user.description);
        this.loc = m.prop(user['location']);
        this.name = m.prop(user.name); //long name: Guillermo López
        this.screen_name = m.prop(user.screen_name); // username: willyaranda
        this.url = m.prop(false);
        if (user.entities && user.entities.url &&
            user.entities.url.urls && user.entities.url.urls[0] &&
            user.entities.url.urls[0].expanded_url) {
            this.url(user.entities.url.urls[0].expanded_url);
        }
        this.verified = m.prop(user.verified);
        this.profile_image_url_https = m.prop(user.profile_image_url_https);
        //this.profile_background_tile = m.prop(user.profile_background_tile);
        this.profile_banner_url = m.prop(user.profile_banner_url);
        this.profile_background_image_url_https =
            m.prop(user.profile_background_image_url_https);
        this.statuses_count = m.prop(user.statuses_count);
        this.friends_count = m.prop(user.friends_count);
        this.followers_count = m.prop(user.followers_count);
        this.protected = m.prop(user.protected);
        this.following = m.prop(user.following);
    };

    var userList = [];

    // Controller
    user.controller = function() {
        this.add = function(u) {
            if (this.findById(u.id_str())) { return; }
            userList.push(u);
        }.bind(this);

        this.findById = function(id) {
            var foundValue;
            for (var i = 0; i < userList.length; i++) {
                var el = userList[i];
                if (el.id_str() === id) {
                    foundValue = el;
                    break;
                }
            }
            return foundValue;
        };

        this.findByScreenName = function(screen_name) {

            function normalizeScreenName(sn) {
              var name = (sn[0] === '@') ? sn.slice(1) : sn;
              return name;
            }

            screen_name = normalizeScreenName(screen_name);
            var foundValue;
            for (var i = 0; i < userList.length; i++) {
                var el = userList[i];
                if (el.screen_name() === screen_name) {
                    foundValue = el;
                    break;
                }
            }
            return foundValue;
        };

        var id = m.route.param('id');
        this.u = null;

        if (!id) {
            m.route('/timeline');
            return;
        }

        var isId_str = !isNaN(id);

        // We have been called with screen_name
        if (!isId_str) {
            this.u = this.findByScreenName(id);
        }
        // Called with id_str
        else {
            this.u = this.findById(id);
        }
        if (!this.u) {
            var id_str;
            var screen_name;
            var that = this;
            if (isId_str) {
                id_str = id;
            } else {
                screen_name = id;
            }
            tuiter.getUserShow(id_str, screen_name, {}, function(error, data) {
                if (error) {
                    console.error(error);
                    m.route('/');
                    return;
                }
                var u = new user.User(data);
                that.add(u);
                that.u = u;
                UIhelpers.showOnlyThisSection(ELEM);
                m.render(ELEM, user.view(that));
            });
        } else {
            UIhelpers.showOnlyThisSection(ELEM);
            m.render(ELEM, user.view(this));
        }
    };

    // View
    user.view = function(ctrl) {
        var u = ctrl.u;
        if (!u) {
            return;
        }

        function showHeader() {
            var rv = '';
            if (u.profile_banner_url()) {
                rv = m('img', {
                    className: 'profile_image',
                    src: u.profile_banner_url() + '/mobile'
                });
            }
            return rv;
        }

        function showUserWebsite() {
            var rv = '';
            if (u.url()) {
                rv = m('a', {
                    onclick: window.open.bind(null, u.url())
                }, u.url());
            }
            return rv;

        }

        return m('div.profile_container', [
            m('div.header_spacer'),
            m('header.profile_image_header.clearfix', [
                showHeader(),
                m('img', {
                    className: 'profile_user_avatar',
                    src: changeToBigger(u.profile_image_url_https())
                })
            ]),
            m('div.user_stats.clearfix', [
                m('a.user_stat_item', [
                    m('span.stat_text', 'Tweets'),
                    m('span.stat_number', u.statuses_count())
                ]),
                m('a.user_stat_item', [
                    m('span.stat_text', 'Siguiendo'),
                    m('span.stat_number', u.friends_count())
                ]),
                m('a.user_stat_item', [
                    m('span.stat_text', 'Seguidores'),
                    m('span.stat_number', u.followers_count())
                ])
            ]),
            m('div.user_info.clearfix', [
                m('div.name_nick.clearfix', [
                    m('span.name', u.name()),
                    m('span.nickname', '@' + u.screen_name())
                ]),
                m('button', {
                    className: 'follow_user ' + (u.following() ? 'unfollow' : 'follow'),
                    onclick: function() {}
                })
            ]),
            m('div.user_bio', [
                m('p', tweet.linkEntities(u.description())),
                m('p', [
                    m('span', u.loc() ? u.loc() : '(Sin ubicación)'),
                    m('span', ' · '),
                    showUserWebsite()
                ])
            ]),
            m('a.tweets', [
                m('div.user_followers', [
                    m('span', 'Seguido por este y el otro'),
                ])
            ]),
            m('h3.profile_tweets_header', 'Tweets')
        ]);
    };

})(window);

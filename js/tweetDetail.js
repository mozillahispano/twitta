/* global header, tuiter, tweet, moment, user */
'use strict';

var tweetDetail = tweetDetail || {};

(function(window) {

    tweetDetail.controller = function() {
        var id = m.route.param('id');
        this.tw = {};
        var that = this;
        setTimeout(function() {tuiter.getStatusShow(id, {}, function(error, json) {
            if (error) {
                console.error(error);
                return;
            }
            that.tw = new tweet.Tweet(json);
            m.redraw();
        })}, 1000);
        var ctrl = new timeline.controller();
        this.tw = ctrl.find(id).value;
        tweetDetail.view(this)
    };

    var toggleTweetOptions = function() {
        var elem = document.querySelector('.tweet_overlay_options');
        elem.classList.toggle('hide');
        var elem2 = document.querySelector('.overlay_options');
        elem2.classList.toggle('hide');
    };

    var backToHome = function() {
        m.route('/timeline');
    };

    tweetDetail.redraw = function() {
        m.render(document.body, tweetDetail.view(this));
    }

    tweetDetail.view = function(controller) {
        var tw = controller.tw;
        // This is sync call of view, wait for async (after getStatusShow)
        if (!tw) {
            return;
        }
        var u = tw.orig_user || tw.user;
        var ago = moment(tw.created_at()).fromNow();
        return [header.view(), m('div', [
            m('div.overlay_options', {
                className: 'hide',
                onclick: toggleTweetOptions
            }, [
                m('ul.tweet_overlay_options.hide', [
                    m('li', [
                        m('a', {
                           href: '#silenciar'
                        }, [
                            'Silenciar a',
                            m('span.user_nick', '@' + u.screen_name())
                        ])
                    ]),
                    m('li', [
                        m('a', {
                            href: '#bloquear'
                        }, 'Bloquear o reportar')
                    ])
                ])
            ]),
            m('div.tweet_container', [
                m('div.header_spacer'),
                m('header.app_header_menu.clearfix', [
                    m('button', {
                        className: 'back',
                        onclick: backToHome
                    }, [
                        m('span', '‹')
                    ]),
                    m('span.window_title', 'Tweet'),
                    m('button.toggle_tweet_options', {
                        onclick: toggleTweetOptions
                    })
                ]),
                m('header.tweet_header.clearfix', [
                    m('button', {
                        className: 'follow_user ' + (u.following() ?
                            ' unfollow' : 'follow'),
                        onclick: user.toggleFollow.bind(u)
                    }),
                    m('img', {
                        className: 'user_avatar',
                        src: u.profile_image_url_https(),
                        onclick: function(evt) {
                            evt.stopPropagation();
                            m.route('/user/' + u.id_str);
                        }
                    }),
                    m('span.tweet_author', u.name()),
                    m('span.tweet_author_nick', '@' + u.screen_name())
                ]),
                m('p.tweet_text', tweet.linkEntities(tw.text())),
                m('div.tweet_stats.clearfix', [
                    m('div.stat_items', [
                        m('div.retweets', [
                            m('span.text', 'Retweets'),
                            m('span.number', tw.retweet_count()),
                        ]),
                        m('div.favorites', [
                            m('span.text', 'Favorites'),
                            m('span.number', tweet.normalizeFavCount(tw)),
                        ])
                    ]),
                    m('div.tweet_stats_photos', [
                        m('div.post_options.clearfix', [
                            m('a', {
                                className: 'reply',
                                onclick: function(evt) {
                                    evt.stopPropagation();
                                    tweet.answerTo(tw);
                                }
                            }),
                            m('a', {
                                className: 'retweet' + (tw.retweeted() ? ' active' : ''),
                                onclick: tweet.toggleRT.bind(null, tw)
                            }),
                            m('a', {
                                className: 'favorite' + (tw.favorited() ? ' active' : ''),
                                onclick: tweet.toggleFAV.bind(null, tw)
                            }),
                            m('a', {
                                className: 'share',
                                onclick: function() {}
                            }),
                        ])
                    ])
                ]),
                m('div.tweet_date', ago)
            ])
        ])];
    };
})(window);

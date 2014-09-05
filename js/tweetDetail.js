/* global UIhelpers, tuiter, tweet, moment */
'use strict';

var tweetDetail = tweetDetail || {};

(function(window) {
    var ELEM = document.getElementById('tweetdetail');

    tweetDetail.controller = function() {
        var id = m.route.param('id');
        tuiter.getStatusShow(id, {}, function(error, json) {
            if (error) {
                console.error(error);
                return;
            }
            var tw = new tweet.Tweet(json);
            UIhelpers.showOnlyThisSection(ELEM);
            m.render(ELEM, tweetDetail.view(tw));
        });
    };

    var toggleTweetOptions = function() {
        var elem = document.querySelector('.tweet_overlay_options');
        elem.classList.toggle('hide');
        var elem2 = document.querySelector('.overlay_options');
        elem2.classList.toggle('hide');
    };

    var backToHome = function() {
        m.route('/timeline');
    }

    tweetDetail.view = function(tw) {
        var u = tw.orig_user || tw.user;
        var ago = moment(tw.created_at()).fromNow();
        return m('div', [
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
                    m('button.follow_user.follow'),
                    m('img', {
                        className: 'user_avatar',
                        src: u.profile_image_url_https()
                    }),
                    m('span.tweet_author', u.name()),
                    m('tweet_author_nick', '@' + u.screen_name())
                ]),
                m('p.tweet_text', tweet.linkEntities(tw.text())),
                m('div.post_options.clearfix', [
                    m('a.reply'),
                    m('a', {
                        className: 'retweet' + (tw.retweeted() ? ' active' : ''),
                    }, tw.favorite_count()),
                    m('a', {
                        className: 'favorite' + (tw.favorited() ? ' active' : ''),
                    }, tw.retweet_count()),
                    m('a.share')
                ]),
                m('div.tweet_stats.clearfix', [
                    m('div.stat_items', [
                        m('div.retweets', [
                            m('span.text', 'Retweets'),
                            m('span.number', tw.retweet_count()),
                        ]),
                        m('div.favorites', [
                            m('span.text', 'Favorites'),
                            m('span.number', tw.favorite_count()),
                        ])
                    ],
                    m('div.tweet_stats_photos', [
                        m('img', {
                            src: 'img/demo_content/user1.jpg'
                        }),
                        m('img', {
                            src: 'img/demo_content/user1.jpg'
                        }),
                        m('img', {
                            src: 'img/demo_content/user1.jpg'
                        }),
                        m('img', {
                            src: 'img/demo_content/user1.jpg'
                        })
                    ]))
                ]),
                m('div.tweet_date', ago)
            ])
        ]);
    };
})(window);

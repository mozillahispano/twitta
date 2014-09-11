/* global user, moment, twttr, tuiter */
'use strict';

var tweet = tweet || {};

(function(window) {
    var userController;

    // Models
    tweet.Tweet = function(tweet) {
        // Lazy initialize
        if (!userController) {
            userController = new user.controller();
        }

        this.id_str = m.prop(tweet.id_str);
        this.created_at = m.prop((new Date(tweet.created_at)).getTime());
        this.text = m.prop(tweet.text);
        this.user = new user.User(tweet.user);
        this.favorite_count = m.prop(tweet.favorite_count);
        this.retweet_count = m.prop(tweet.retweet_count);
        this.in_reply_to_status_id_str = m.prop(tweet.in_reply_to_status_id_str);

        userController.add(this.user);

        // Placeholders
        this.is_retweet = m.prop(false);
        this.media = m.prop(false);

        // this is a RT
        if (tweet.retweeted_status) {
            this.is_retweet = m.prop(true);
            this.orig_id_str = m.prop(tweet.retweeted_status.id_str);
            this.orig_user = new user.User(tweet.retweeted_status.user);
            this.text = m.prop(tweet.retweeted_status.text);
            userController.add(this.orig_user);
        }

        // This has media
        if (tweet.entities && tweet.entities.media) {
            this.media = m.prop(true);
            this.media_url = m.prop(tweet.entities.media[0].media_url_https);
            this.expanded_url = m.prop(tweet.entities.media[0].expanded_url);
        }

        // Own actions:
        this.retweeted = m.prop(tweet.retweeted);
        this.favorited = m.prop(tweet.favorited);
    };

    tweet.controller = function() {
    };

    var showTweet = function() {
        // This is the id of the tweet
        var nextRoute = '/tweet/' + this;
        m.route(nextRoute);
    };

    tweet.getTopInfo = function(tw) {
        return m('div.post_top_info', [
            m('span.retweeted', [
                m('img', {
                    align: 'absmiddle',
                    src: 'img/retweeted.png'
                }),
                tw.user.name() || tw.user.screen_name()
            ])
        ]);
    };

    tweet.toggleRT = function(tw) {
        if (tw.retweeted()) {
            //TODO
        } else {
            tuiter.retweetId(tw.id_str(), { trim_user: 1 }, function(err, d) {
                if (err) {
                    console.error(err);
                    return;
                }
                tweet.changeRTInternal(tw, true);
           });
        }
    };

    tweet.toggleFAV = function(tw) {
        if (tw.favorited()) {
            tuiter.favoritesDestroy(tw.id_str(), {}, function(err, d) {
                if (err) {
                    console.error(err);
                    return;
                }
                tweet.changeFAVInternal(tw, false);
            });
        } else {
            tuiter.favoritesCreate(tw.id_str(), {}, function(err, d) {
                if (err) {
                    console.error(err);
                    return;
                }
                tweet.changeFAVInternal(tw, true);
            });
        }
    };

    tweet.answerTo = function(tw) {
        var user = (function() {
            if (tw.orig_user) {
                return '@' + tw.orig_user.screen_name() + ' @' + tw.user.screen_name();
            } else {
                return '@' + tw.user.screen_name();
            }
        })();

        var route = '/compose/' + user + '/' + tw.id_str();
        m.route(route);
    };

    tweet.changeRTInternal = function(tw, isRetweeted) {
        tw.retweeted(isRetweeted);
        var count = tw.retweet_count();
        var future = isRetweeted ? (count + 1) : (count - 1);
        tw.retweet_count(future);
        m.redraw();
    };

    tweet.changeFAVInternal = function(tw, isFavorited) {
        tw.favorited(isFavorited);
        var count = tw.favorite_count();
        var future = isFavorited ? (count + 1) : (count - 1);
        tw.favorite_count(future);
        m.redraw();
    };

    tweet.linkEntities = function(text) {
        var entities = [];
        // Extract entities with own's twitter library
        entities = twttr.txt.extractEntitiesWithIndices(text);
        if (entities.length === 0) {
            return text;
        }

        //Sort by indice
        entities.sort(function(a, b) {
            return a.indices[0] > b.indices[0];
        });


        var entity;
        var elements = [];
        var index = 0;

        // Generate the virtual DOM with mithril
        while ((entity = entities.shift()) !== undefined) {
            var tmp = text.slice(index, entity.indices[0]);
            if (tmp.length >= 0) {
                elements.push(tmp);
            }
            if (entity.screenName) {
                elements.push(m('a', {
                    'data-link': entity.screenName,
                    onclick: function(evt) {
                        evt.stopPropagation();
                        m.route('/user/@' + evt.target.dataset.link);
                    },
                    href: '#'
                }, '@' + entity.screenName));
            } else if (entity.hashtag) {
                elements.push(m('a', {
                    'data-link': entity.hashtag,
                    // TODO: create an internal view of this.
                    // Since we were authenticated on the login step, we should be able
                    // to do stuff on twitter website.
                    onclick: function(evt) {
                        evt.stopPropagation();
                        window.open('https://twitter.com/hashtag/' + evt.target.dataset.link);
                        //m.route('/search/#' + evt.target.dataset.link);
                    },
                    href: '#'
                }, '#' + entity.hashtag));
            } else if (entity.url) {
                 elements.push(m('a', {
                    'data-link': entity.url,
                    onclick: function(evt) {
                        evt.stopPropagation();
                        window.open(evt.target.dataset.link);
                    },
                    href: '#'
                }, entity.url));
            } else {
                // Cashtags
                // user/list
                // we do not care for now so just add the text
                elements.push(tmp);
            }
            index = entity.indices[1];
        }

        // Add remaining text
        if (index < text.length) {
            elements.push(text.slice(index));
        }

        // Return it
        return elements;
    };

    tweet.normalizeFavCount = function(tw) {
        // twitter may send a count of 0, but we have FAV. Return 1, at least.
        if ((tw.favorite_count() === 0) &&
             tw.favorited()) {
            return 1;
        }

        // We may deFAV but have a favorite_count of 0 (check previous comment)
        // so let's return 0;
        if(tw.favorite_count() < 0) {
            return 0;
        }

        // If we are not in a corner case, return the fav count from twitter.
        return tw.favorite_count();
    }

    tweet.view = function(tw) {

        /*function mediaNodes(tw) {
            if (tw.media()) {
                return m('a', {
                    href: tw.expanded_url(),
                    target: '_blank'
                    }, m('img', {src: tw.media_url()})
                );
            }
        }*/

        var ago = moment(tw.created_at()).fromNow();
        var u = tw.orig_user || tw.user;

        function getTopInfo() {
            if (tw.is_retweet()) {
                return tweet.getTopInfo(tw);
            }
        }

        return m('div', {
                className: 'item clearfix',
                id: tw.id_str(),
                onclick: showTweet.bind(tw.id_str())
            }, [
            getTopInfo(),
            m('div.left', [
                m('img', {
                    className: 'user_avatar',
                    src: u.profile_image_url_https(),
                    onclick: function(evt) {
                        evt.stopPropagation();
                        m.route('/user/' + u.id_str());
                    }
                }),
                m('span.post_date', ago)
            ]),
            m('header.post_header', [
                m('span.author_name', u.name()),
                m('span.author_alias', '@' + u.screen_name())
            ]),
            m('p.post_content.clearfix', tweet.linkEntities(tw.text())),
            m('div.post_options', [
                m('a', {
                    className: 'reply',
                    onclick: function(evt) { evt.stopPropagation(); tweet.answerTo(tw); }
                }),
                m('a', {
                    className: 'retweet' + (tw.retweeted() ? ' active' : ''),
                    onclick: function(evt) { evt.stopPropagation(); tweet.toggleRT(tw); }
                }, tw.retweet_count()),
                m('a', {
                    className: 'favorite' + (tw.favorited() ? ' active' : ''),
                    onclick: function(evt) { evt.stopPropagation(); tweet.toggleFAV(tw); }
                }, tweet.normalizeFavCount(tw))
            ])
        ]);
    };
})(window);

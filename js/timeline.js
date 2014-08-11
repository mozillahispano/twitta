/* jshint browser: true, esnext: true, strict: true */

var timeline = timeline || {};
(function(window) {
    'use strict';

    var userController;

    // Models
    timeline.Tweet = function(tweet) {
        // Lazy initialize
        if (!userController) {
            userController = new user.controller();
        }

        this.id_str = m.prop(tweet.id_str);
        this.created_at = m.prop((new Date(tweet.created_at)).getTime());
        this.text = m.prop(tweet.text);
        this.user = new user.User(tweet.user);
        userController.add(this.user);

        // Placeholders
        this.is_retweet = m.prop(false);
        this.media = m.prop(false);

        // this is a RT
        if (tweet.retweeted_status) {
            this.is_retweet = m.prop(true);
            this.orig_id = m.prop(tweet.retweeted_status.id);
            this.retweeted_by_username = m.prop(tweet.user.screen_name);
            this.orig_user = new user.User(tweet.retweeted_status.user);
            //userController.add(this.orig_user);
        }

        // This has media
        if (tweet.entities && tweet.entities.media) {
            this.media = m.prop(true);
            this.media_url = m.prop(tweet.entities.media[0].media_url_https);
            this.expanded_url = m.prop(tweet.entities.media[0].expanded_url);
        }
    };

    // List of tweets: timeline
    timeline.TweetList = Array;

    // Controller
    timeline.controller = function() {
        if (!this.list) {
            this.list = new timeline.TweetList();
        }

        this.add = function(tweet) {
            this.list.push(new timeline.Tweet(tweet));
            // Do not render if we are not on the view
            if (m.route() !== '/timeline') { return; }
            m.render(document.getElementById('timeline'), timeline.view(this));
        }.bind(this);
    };

    // View
    timeline.view = function(controller) {
        console.log('timeline.view');

        function mediaNodes(tweet) {
            if (tweet.media()) {
                return m('a', {
                    href: tweet.expanded_url()
                    }, m('img', {src: tweet.media_url()})
                );
            }
        }

        if (controller.list.length === 0) return;
        return controller.list.map(function(tweet) {
            var ago = moment(tweet.created_at()).fromNow();
            return m('div#' + tweet.id_str(), [
                       m('div#img', [
                           m('img', {src: tweet.user.profile_image_url_https()})
                       ]),
                       m('p#name', [
                         tweet.user.name() + ' ',
                         m('a',
                           {href: '/user/' + tweet.user.id(), config: m.route },
                           '@' + tweet.user.screen_name()
                         )]
                       ),
                       m('p#text', tweet.text()),
                       m('p#date', ago),
                       m('p#retweeted', tweet.is_retweet() || false),
                       mediaNodes(tweet)
                ]);
        });
    };

    m.module(document.getElementById('timeline'), timeline);
})(window);

var timeline = timeline || {};

(function() {
	'use strict';

	var ELEM = document.querySelector('section#timeline');

	// Models
	timeline.Tweet = function(tweet) {
		this.id = m.prop(tweet.id);
		this.created_at_ms = m.prop(new Date(tweet.created_at).getMilliseconds());
		this.retweeted = m.prop(tweet.retweeted);
		this.text = m.prop(tweet.text);
	};

	// List of tweets: timeline
	timeline.TweetList = Array;

	// Controller
	timeline.controller = function() {
		this.list = new timeline.TweetList();

		this.add = function(tweet) {
			this.list.push(new timeline.Tweet(tweet));
			m.render(ELEM, timeline.view(this));
		}.bind(this)
	}

	// View
	timeline.view = function (controller) {
		console.log('called timeline.view');
		console.log('controller.list.length=' + controller.list.length);
		//return m('h1', controller.list.length);
		return m('ol', [
			controller.list.map(function(tweet) {
				console.log('mapping');
				return m('li', tweet.id());
			})
		]);
	}

	m.module(ELEM, timeline);
})();
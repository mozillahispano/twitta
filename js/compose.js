/* global header, tuiter */
'use strict';

var compose = compose || {};
(function(window) {

    var allowedLength = 140;

    compose.controller = function() {
        this.text = m.prop('');

        this.reply_to = m.route.param('reply_to_id_str');

        var text = m.route.param('reply_text');
        if (text) {
            this.text(text + ' ');
        }

        this.update = function() {
            var el = document.getElementById('addimage');
            if (el && el.files && el.files[0]) {
                allowedLength = 140 -
                    tuiter.conf.getOwnUser('characters_reserved_per_media');
            }
            m.redraw();
        }.bind(this);

        this.updateStatus = function() {
            var that = this;
            var el = document.getElementById('addimage');
            var file;
            // We have media
            if (el && el.files && (file = el.files[0])) {
                if (file.size > tuiter.conf.getOwnUser('photo_size_limit')) {
                    window.alert(navigator.mozL10n.get('image-too-big'));
                    return;
                }
                tuiter.updateStatusWithMedia(this.text(), el.files, {},
                    function(error) {
                        if (error) {
                            window.alert(error);
                        } else {
                            that.text('');
                            m.route('/timeline');
                        }
                });
            }
            // Just plain text
            else {
                var obj = {
                    in_reply_to_status_id: this.reply_to
                };
                tuiter.updateStatus(this.text(), obj, function(error) {
                    if (error) {
                        window.alert(error);
                    } else {
                        that.text('');
                        m.route('/timeline');
                    }
                });
            }
        }.bind(this);
    };

    var backToHome = function() {
        m.route('/timeline');
    };

    compose.view = function(controller) {

        var tweetPlaceholder = navigator.mozL10n.get('tweet-placeholder');

        return [header.view(), m('div.compose_container', [
            m('div.header_spacer'),
            m('header.app_header_menu.clearfix', [
                m('button', {
                    className: 'back',
                    onclick: backToHome
                }, [
                    m('span', '‹')
                ]),
                m('span', {
                    className: 'window_title',
                    'data-l10n-id': 'compose-tweet'
                }, 'CoMpOsE Twe3t'),
                m('button', {
                    className: 'send_tweet',
                    'data-l10n-id': 'send-tweet',
                    onclick: controller.updateStatus
                }, 'Twe3t')
            ]),
            m('div.char_count_images_cont', [
                m('label.camera', [
                    m('input', {
                        type: 'file',
                        name: 'addimage',
                        accept: 'image/*',
                        placeholder: 'Image',
                        onchange: controller.update
                    })
                ]),
                m('span', {
                    className: 'char_count'
                }, allowedLength - controller.text().length)
            ]),
            m('div.text_container', [
                m('textarea', {
                    name: 'compose-area',
                    className: 'tweet_text',
                    placeholder: tweetPlaceholder,
                    autofocus: true,
                    oninput: m.withAttr('value', controller.text),
                    onkeyup: controller.update,
                    value: controller.text()
                }, controller.text())
            ])
        ])];
    };

})(window);


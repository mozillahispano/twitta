/* global UIhelpers, tuiter */
'use strict';

var compose = compose || {};
(function(window) {

    var ELEM = document.getElementById('compose');

    var allowedLength = 140;

    compose.controller = function() {
        this.text = m.prop('');

        this.update = function() {
            var el = document.getElementById('addimage');
            if (el && el.files && el.files[0]) {
                allowedLength = 140 -
                    tuiter.conf.getOwnUser('characters_reserved_per_media');
            }
            m.render(ELEM, compose.view(this));
        }.bind(this);

        this.updateStatus = function() {
            var that = this;
            var el = document.getElementById('addimage');
            var file;
            // We have media
            if (el && el.files && (file = el.files[0])) {
                if (file.size > tuiter.conf.getOwnUser('photo_size_limit')) {
                    window.alert('Imagen demasiado grande, elige otra');
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
                tuiter.updateStatus(this.text(), {}, function(error) {
                    if (error) {
                        window.alert(error);
                    } else {
                        that.text('');
                        m.route('/timeline');
                    }
                });
            }
        }.bind(this);

        UIhelpers.showOnlyThisSection(ELEM);
        m.render(ELEM, compose.view(this));
    };

    var backToHome = function() {
        m.route('/timeline');
    };

    compose.view = function(controller) {
        return m('div.compose_container', [
            m('div.header_spacer'),
            m('header.app_header_menu.clearfix', [
                m('button', {
                    className: 'back',
                    onclick: backToHome
                }, [
                    m('span', '‹')
                ]),
                m('span.window_title', 'Redactar Tweet'),
                m('button', {
                    className: 'send_tweet',
                    onclick: controller.updateStatus
                }, 'Twittear')
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
                    placeholder: 'What do you want to say?',
                    autofocus: true,
                    oninput: m.withAttr('value', controller.text),
                    onkeyup: controller.update
                })
            ])
        ]);
    };
})(window);


/* global tuiter */
'use strict';

var header = header || {};

(function(window) {

    var credsInterval;

    header.controller = function() {
        credsInterval = setInterval(function credsHeader() {
            if (tuiter.ready) {
                m.redraw();
                clearInterval(credsInterval);
            }
        }, 1000);
    };

    header.toggleExtended = function() {
        var but = document.querySelector('nav > button');
        but.classList.toggle('active');

        var nav = document.querySelector('nav > ul.dropdown_menu');
        nav.classList.toggle('hide');
    };

    var routeToSelfUser = function() {
        m.route('/user/' + tuiter.conf.getOwnUser('id_str'));
    };

    header.view = function() {
        return m('header.app_header_menu', [
            m('nav.horizontal_menu.clearfix', [
                m('ul.menu.clearfix', [
                    m('li', [
                        m('a', {
                            className: 'home_link',
                            href: '/timeline',
                            config: m.route
                        })
                    ]),
                    m('li', [
                        m('a', {
                            className: 'compose_link',
                            href: '/compose',
                            config: m.route
                        })
                    ]),
                    m('li', [
                        m('a', {
                            className: 'discover_link',
                            href: '/discover',
                            config: m.route
                        })
                    ]),
                    m('li', [
                        m('a', {
                            className: 'message_link',
                            href: '/dms',
                            config: m.route
                        })
                    ]),
                    m('li', [
                        m('a', {
                            className: 'lists_link',
                            href: '/lists',
                            config: m.route
                        })
                    ])
                ]),
                m('button.toggle_menu', {
                        onclick: header.toggleExtended
                    }, [
                        m('span.bullet'),
                        m('span.bullet'),
                        m('span.bullet')
                    ]
                ),
                m('ul.dropdown_menu.clearfix.hide', [
                    m('li.view_profile', [
                        m('a', {
                            className: 'clearfix',
                            onclick: routeToSelfUser
                        }, [
                            m('img', {
                                className: 'profile_menu_photo',
                                src: tuiter.conf.getOwnUser('profile_image_url_https')
                            }),
                            m('span.profile_menu_name', tuiter.conf.getOwnUser('name')),
                            m('br'),
                            m('span.profile_menu_user', '@' +
                                tuiter.conf.getOwnUser('screen_name'))
                        ])
                    ]),
                    m('li', [
                        m('a.search_link', 'Buscar')
                    ]),
                    m('li', [
                        m('a.notifications_link', 'Notificaciones')
                    ]),
                    m('li', [
                        m('a.settings_link', 'Ajustes generales')
                    ])
                ])
            ])
        ]);
    };

})(window);

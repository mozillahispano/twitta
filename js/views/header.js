/* global timeline, mentions, dms */
'use strict';

var header = header || {};

(function(window) {

    header.view = function(controller) {
        return m('div#header', [
            m('div#sidebar', [
                m('img', { src: '/img/sidebar.png'}),
                m('span', 'Sidebar')
            ]),
            m('div#tl', [
                m('a', {href: '/timeline', config: m.route}, [
                    m('img', { src: '/img/timeline.png'}),
                    m('span', timeline.getLength())
                ])
            ]),
            m('div#mentions', [
                m('a', {href: '/mentions', config: m.route}, [
                    m('img', { src: '/img/mentions.png'}),
                    m('span', mentions.getLength())
                ])
            ]),
            m('div#direct', [
                m('a', {href: '/dms', config: m.route}, [
                    m('img', { src: '/img/direct.png'}),
                    m('span', dms.getLength()) // FIXME
                ])
            ]),
            m('div#senddiv', [
                m('a', {
                    href: '/compose',
                    config: m.route
                }, [
                    m('img#send', { src: '/img/send128.png'})
                ])
            ])
        ]);
    };
})(window);

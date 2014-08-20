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
                    m('img', { src: '/img/tl.png'}),
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
                m('a', {href: '/dm', config: m.route}, [
                    m('img', { src: '/img/direct.png'}),
                    m('span', 7/*dms.getLength()*/) // FIXME
                ])
            ]),
            m('a', {
                href: '/compose',
                config: m.route
            }, [
                m('div#send')
            ])
        ]);
    };
})(window);

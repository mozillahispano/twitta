/* global timeline, mentions, dms */

'use strict';

var header = header || {};

(function(window) {

    var ELEM = document.getElementById('header');

    var previousRoute = '/';

    header.controller = function() {};

    // Called to update the header from timeline, mentions, dm…
    header.update = function(back) {
        previousRoute = back || previousRoute;
        m.redraw();
    };

    header.view = function(controller) {
        var data = [];

        if (previousRoute) {
            var back = m('div#back', [
                m('a', {
                    href: previousRoute, config: m.route
                }, [
                    m('img', { src: '/img/back.png'})
                ])
            ]);
            data.push(back);
        }

        var center = [];

        center.push(m('div#tl', [
            m('a', {href: '/timeline', config: m.route}, [
                m('img', { src: '/img/timeline.png'}),
                m('span', timeline.getLength())
            ])
        ]));
        center.push(m('div#mentions', [
            m('a', {href: '/mentions', config: m.route}, [
                m('img', { src: '/img/mentions.png'}),
                m('span', mentions.getLength())
            ])
        ]));
        center.push(m('div#direct', [
            m('a', {href: '/dms', config: m.route}, [
                m('img', { src: '/img/direct.png'}),
                m('span', dms.getLength())
            ])
        ]));

        data.push(m('div#headercenter', center));

        data.push(m('div#senddiv', [
            m('a', {
                href: '/compose',
                config: m.route
            }, [
                m('img#send', { src: '/img/send.png'})
            ])
        ]));

        return m('div.inline', data);
    };
    m.module(ELEM, header);
})(window);

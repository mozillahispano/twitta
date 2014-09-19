/* global tuiter, moment, UIhelpers, tweet, header */

'use strict';

var listAll = listAll || {};
(function(window) {

    /**
     * Holds a lists array, with list objects, with the format:
     * - id_str
     * - name
     * - description
     * - member_count
     * - owner_id_str
     * @type {Array}
     */
    var listsSubscribed = [];
    var listsMember = {};

    function parseListsData(data) {
        var rv = [];
        data.forEach(function(list) {
            var obj = {};
            obj['id_str'] = list.id_str;
            obj['name'] = list.name;
            obj['description'] = list.description;
            obj['member_count'] = list.member_count;
            obj['owner_id_str'] = list.user.id_str;
            obj['owner_screen_name'] = list.user.screen_name;
            obj['owner_profile_image'] = list.user.profile_image_url_https;
            rv.push(obj);
        });
        return rv;
    }

    // Controller
    listAll.controller = function() {
        console.log('listAll.controller');

        var that = this;
        tuiter.getLists(null, null, {}, function(error, data) {
            if (error) {
                console.error(error);
                return;
            }
            listsSubscribed = parseListsData(data);
            m.redraw();
        });
    };

    var backToHome = function() {
        m.route('/timeline');
    };

    listAll.view = function(controller) {
        console.log('listAll.view');

        function getMemberMsg(n) {
            return navigator.mozL10n.get('members', {n: n});
        }

        function getOwnerMsg(name) {
            var msg = '';
            if (name !== tuiter.conf.getOwnUser('screen_name')) {
                msg = ' ' + navigator.mozL10n.get('owned-by', {name: name});
            }
            return msg;
        }

        return [header.view(), m('div.all_list_container', [
            m('div.header_spacer'),
            m('header.app_header_menu.clearfix', [
                m('button', {
                    className: 'back',
                    onclick: backToHome
                }, '‹'),
                m('span', {
                    className: 'window_title',
                    'data-l10n-id': 'lists-title'
                }, 'L1st4s'),
                m('button', {
                    className: 'send_tweet',
                    'data-l10n-id': 'create'
                }, 'Cr34r l1st4')
            ]),
            m('div.list_tabs.cols_2.clearfix', [
                m('a', {
                    className: 'col active',
                    href: '#',
                    'data-l10n-id': 'subscribed-to',
                    onclick: function() {},
                }, 'SuScR1t0 4'),
                m('a', {
                    className: 'col',
                    href: '#',
                    'data-l10n-id': 'member-of',
                    onclick: function() {}
                }, 'M13mbr0 d3')
            ]),
            m('div.tab_container', [
                m('div.tab_content.memberof',
                    listsSubscribed.map(function(el) {
                        return m('div.item.clearfix', {
                            'data-id': el.id_str,
                            onclick: function(evt) {
                                evt.stopPropagation();
                                m.route('/list/' + evt.target.dataset.id);
                            }
                        }, [
                            m('img', {
                                className: 'user_avatar right',
                                src: el.owner_profile_image
                            }),
                            m('a.list_name', el.name),
                            m('span.list_owner_name', getOwnerMsg(el.owner_screen_name)),
                            m('p.list_desc', el.description),
                            m('span.count_members', getMemberMsg(el.member_count))
                        ]);
                    })
                )
            ])
        ])];
    };

})(window);

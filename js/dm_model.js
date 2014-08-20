/* global user, moment */
'use strict';

var dm = dm || {};

(function(window) {
    var userController;

    // Models
    dm.DM = function(dm) {
        console.log('dm.DM');
        // Lazy initialize
        if (!userController) {
            userController = new user.controller();
        }

        this.id_str = m.prop(dm.id_str);
        this.created_at = m.prop((new Date(dm.created_at)).getTime());
        this.text = m.prop(dm.text);
        this.recipient = new user.User(dm.recipient);
        this.sender = new user.User(dm.sender);
        userController.add(this.recipient);
        userController.add(this.sender);
    };

    dm.view = function(controller) {
        var ago = moment(controller.created_at()).fromNow();
        return m('div#' + controller.id_str(), [
            m('div#img', [
                m('img', {src: controller.sender.profile_image_url_https()})
            ]),
            m('p#name', [
                controller.sender.name() + ' ',
                m('a',
                    {href: '/user/' + controller.sender.id(), config: m.route },
                    '@' + controller.sender.screen_name()
                )]
            ),
            m('p#text', controller.text()),
            m('p#date', ago),
        ]);
    };

})();
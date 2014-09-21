/* global UIhelpers */

'use strict';
var login = login || {};
// Controller
(function(window) {

    function parseData(data) {
        return data.match(/oauthAccessToken=(.*)&oauthAccessTokenSecret=(.*)/);
    }

    function saveTokens(tokens) {
        localStorage.setItem('token', tokens[1]);
        localStorage.setItem('tokenSecret', tokens[2]);
    }

    function authorizeWithTwitter() {
        // Trust me, show me the code:
        // https://github.com/willyaranda/twitta
        // See server.js, that is what is running on my server.
        // Please file any issues you might encounter. Thanks!
        var w = window.open('https://twitta.pijusmagnificus.com/sessions/connect');
        window.addEventListener('message', receiveMessage, false);

        function receiveMessage(event) {
            if (event.origin !== 'https://twitta.pijusmagnificus.com') {
                return;
            }

            var tokens = parseData(event.data);
            w.close();
            if (tokens && tokens[1] && tokens[2]) {
                saveTokens(tokens);
            } else {
                var msg = navigator.mozL10n.get('data-error');
                window.alert(msg);
            }
            // And start again
            m.route('/');
        }
    }

    login.controller = function() {
    };

    login.view = function(ctrl) {
        var data = [];
        data.push(m('img', {
            className: 'login_logo',
            src: 'img/logos/128.png'
        }));
        data.push(m('h1.login_app_name', 'twitta'));
        var msg = navigator.mozL10n.get('login-message');
        data.push(m('p.login_message', m.trust(msg)));
        data.push(m('button', {
            className: 'auth_app_button',
            onclick: authorizeWithTwitter,
            'data-l10n-id': 'authorize'
        }, 'AuTh0r1z3'));
        return m('div.login_container', data);
    };

})(window);


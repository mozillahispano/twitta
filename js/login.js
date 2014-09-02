/* global UIhelpers */

'use strict';
var login = login || {};
// Controller
(function(window) {

    var ELEM = document.getElementById('login');

    function parseData(data) {
        return data.match(/oauthAccessToken=(.*)&oauthAccessTokenSecret=(.*)/);
    }

    function saveTokens(tokens) {
        localStorage.setItem('token', tokens[1]);
        localStorage.setItem('tokenSecret', tokens[2]);
    }

    login.controller = function() {
        this.lg = function() {
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
                    window.alert('We did not receive expected data from Twitter. ' +
                        'Please try again in a few minutes. We are sorry :(');
                }
                // And start again
                m.route('/');
            }
        }.bind(this);

        UIhelpers.showOnlyThisSection(ELEM, true);
        m.render(ELEM, login.view(this));
    };

    login.view = function(ctrl) {
        var data = [];
        data.push(m('img', {
            className: 'login_logo',
            src: 'img/home-logo.png'
        }));
        data.push(m('h1.login_app_name', 'twitta'));
        var msg = 'Para comenzar a utilizar <span>twitta</span> debes ' +
            ' autorizar la aplicación en tu cuenta de Twitter.';
        data.push(m('p.login_message', m.trust(msg)));
        data.push(m('button', {
            className: 'auth_app_button',
            onclick: ctrl.lg
        }, 'Autorizar'));
        return m('div.login_container', data);
    };

})(window);


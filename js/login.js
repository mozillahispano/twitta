var login = login || {};
// Controller
(function(window) {
    'use strict';

    function parseData(data) {
        return data.match(/oauthAccessToken=(.*)&oauthAccessTokenSecret=(.*)/);
    }

    function saveTokens(tokens) {
        localStorage.setItem('token', tokens[1]);
        localStorage.setItem('tokenSecret', tokens[2]);
    }

    login.controller = function() {
        console.log('login.controller');
        this.lg = function() {
            // Trust me, show me the code:
            // https://github.com/willyaranda/twitta
            // See server.js, that is what is running on my server
            var w = window.open('https://twitta.pijusmagnificus.com/sessions/connect');
            window.addEventListener('message', receiveMessage, false);

            function receiveMessage(event) {
                if (event.origin !== 'https://twitta.pijusmagnificus.com') {
                    return;
                }

                var tokens = parseData(event.data);
                console.log(tokens);
                if (tokens && tokens[1] && tokens[2]) {
                    saveTokens(tokens);
                } else {
                    // TODO: Show error
                }
                w.close();
                // And start again
                m.route('/');
            }
        }.bind(this);
        //m.render(document.getElementById('login'), login.view(this))
    };

    login.view = function(ctrl) {
        console.log('login.view');
        var data = [];
        data.push(m('h3', 'Bienvenido a twitta'));
        data.push(m('p', 'Para poder usar la aplicación, tienes que permitir' +
            ' a esta aplicación registrarse en Twitter.'));
        data.push(m('p', 'Por favor, pulsa en "Conectarme a Twitter"'));
        data.push(m('button', {
            onclick: ctrl.lg
        }, 'Conectarme'));
        data.push(m('p', 'willyaranda / Mozilla Hispano, 2014'));
        return m('div', data);
    };

})(window);


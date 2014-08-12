/* jshint browser: true, esnext: true, strict: true */

var login = login || {};
// Controller
(function(window) {
    'use strict';

    login.controller = function() {
        console.log('login.controller');
        this.lg = function() {
            console.log('login.controller.login called');
            var w = window.open('https://twitta.pijusmagnificus.com/sessions/connect');
            window.addEventListener("message", receiveMessage, false);

            function receiveMessage(event)
            {
              if (event.origin !== "https://twitta.pijusmagnificus.com") {
                return;
              }
              var data = event.data;
            }
        }.bind(this)
    };

    login.view = function(ctrl) {
        var data = [];
        data.push(m('h3', 'Bienvenido a twitta'));
        data.push(m('p', 'Para poder usar la aplicación, tienes que permitir a esta aplicación registrarse en Twitter.'));
        data.push(m('p', 'Por favor, pulsa en "Conectarme a Twitter"'));
        data.push(m('button', {
            onclick: ctrl.lg
        }, 'Conectarme'));
        data.push(m('p', 'willyaranda / Mozilla Hispano, 2014'))
        return m('div', data);
    };

    m.module(document.getElementById('login'), login);
})(window);


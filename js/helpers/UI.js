/* global Notification */
(function(window) {
    'use strict';

    var UIhelpers = window.UIhelpers = {};

    UIhelpers.showOnlyThisSection = function(element, hideHeader) {
        var elems = document.querySelectorAll('section.show');
        for (var i = 0; i < elems.length; i++) {
            elems[i].classList.remove('show');
            elems[i].classList.add('hidden');
        }
        element.classList.add('show');
        element.classList.remove('hidden');
        if (hideHeader) {
            UIhelpers.hideHeader();
        }
    };

    UIhelpers.hideHeader = function() {
        var el = document.getElementsByTagName('header')[0];
        el.classList.toggle('hidden');
    };

    UIhelpers.showNotification = function(title, body, onclick, onclose) {
        var n = new Notification(title, {body: body});
        n.onclick = onclick;
        n.onclose = onclose;
    };

})(window);

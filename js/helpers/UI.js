/* global Notification */
(function(window) {
    'use strict';

    var UIhelpers = window.UIhelpers = {};

    UIhelpers.showOnlyThisSection = function(element) {
        var elems = document.querySelectorAll('section.show');
        for (var i = 0; i < elems.length; i++) {
            elems[i].classList.remove('show');
            elems[i].classList.add('hidden');
        }
        element.classList.add('show');
        element.classList.remove('hidden');
    };

    UIhelpers.showNotification = function(title, body, onclick, onclose) {
        var n = new Notification(title, {body: body});
        n.onclick = onclick;
        n.onclose = onclose;
    };

    UIhelpers.fireIfElementVisible = function(query, callback) {

        var elem = document.querySelector(query);
        if (!elem) {
            setTimeout(function() {
                UIhelpers.fireIfElementVisible(query, callback)
            }, 100);
            return;
        }

        function isElementInViewport (elem) {
            var rect = elem.getBoundingClientRect();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        function handler() {
            if (isElementInViewport(elem)) {
                callback();
            }
        }

        addEventListener('DOMContentLoaded', handler, false);
        addEventListener('load', handler, false);
        addEventListener('scroll', handler, false);
        addEventListener('resize', handler, false);
    };

})(window);

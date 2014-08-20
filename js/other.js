/* global tuiter */

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

})(window);

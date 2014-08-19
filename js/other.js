/* global tuiter */

(function(window) {
    'use strict';

    var charsCountFunc = function() {
        var textAreaElem = document.querySelector('#compose > textarea');
        var counterElem = document.getElementById('charsleft');
        textAreaElem.addEventListener('keyup', function() {
            var length = this.textLength;
            var count = 140 - length;
            if (counterElem < 0) {
                // TODO poner en rojo
            }
            counterElem.textContent = count;
        });
    };

    var sendTwitFunc = function() {
        var textAreaElem = document.getElementById('compose-area');
        var inputElem = document.getElementById('addimage');
        var sendButtonElem = document.getElementById('sendbutton');
        var counterElem = document.getElementById('charsleft');

        sendButtonElem.addEventListener('click', function() {
            var text = textAreaElem.value;
            if (text.length > 140) {
                window.alert('You cannot send a twit with more than 140 characters');
                return;
            } else if (text.length === 0) {
                window.alert('You cannot send an empty tweet');
                return;
            }

            var image = inputElem.files && inputElem.files[0] || null;
            if (image) {
                //TODO: media upload
            } else {
                tuiter.updateStatus(text, undefined, function(error, msg) {
                    if (!error) {
                        document.getElementById('compose').classList.add('hide');
                        textAreaElem.value = '';
                        counterElem.textContent = 140;
                    } else {
                        window.alert('Error received: ' + error);
                        console.error(error);
                    }
                });
            }
        });
    };

    window.addEventListener('load', function addThings() {
       charsCountFunc();
       sendTwitFunc();
    });

})(window);

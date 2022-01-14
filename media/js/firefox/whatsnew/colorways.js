/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

(function () {
    'use strict';

    const container = document.querySelector('.colorways-container');

    function isFirefoxDesktop(ua) {
        ua = ua || navigator.userAgent;

        return (
            /\sFirefox/.test(ua) &&
            !/Mobile|Tablet|Fennec/.test(ua) &&
            !/Iceweasel|IceCat|SeaMonkey|Camino|like Firefox/i.test(ua)
        );
    }

    function getFirefoxMajorVersion(ua) {
        ua = ua || navigator.userAgent;

        const matches = /Firefox\/(\d+(?:\.\d+){1,2})/.exec(ua);
        const version = matches ? matches[1] : '0';
        return parseInt(version, 10);
    }

    function getColorways() {
        return new Promise((resolve, reject) => {
            Mozilla.UITour.getConfiguration('colorway', function (colorways) {
                if (colorways && colorways.length > 1) {
                    resolve(colorways);
                }
                reject('No colorways found');
            });
        });
    }

    function setColorway(id) {
        if (typeof id !== 'string') {
            return false;
        }

        Mozilla.UITour.setConfiguration('colorway', id);
    }

    function renderColorwayButton(colorway) {
        return `<button class="mzp-c-button mzp-t-product c-button-colorway" type="button" data-id="${colorway}">${colorway}</button>`;
    }

    function renderResetButton() {
        return `<button class="mzp-c-button mzp-t-product c-button-colorway c-button-reset" type="button" data-id="">Reset Colorway</button>`;
    }

    function renderNotification(message) {
        return `<div class="mzp-c-notification-bar mzp-t-warning"><p>${message}</p></div>`;
    }

    function handleButtonClick(e) {
        const target = e.target;

        if (target.tagName !== 'BUTTON') {
            return;
        }

        setColorway(target.dataset.id);
    }

    function init() {
        getColorways()
            .then((colorways) => {
                colorways.forEach((colorway) => {
                    const button = renderColorwayButton(colorway);
                    container.insertAdjacentHTML('afterbegin', button);
                });

                const resetButton = renderResetButton();
                container.insertAdjacentHTML('beforebegin', resetButton);

                container.addEventListener('click', handleButtonClick);
                document
                    .querySelector('.c-button-reset')
                    .addEventListener('click', handleButtonClick);
            })
            .catch(() => {
                const message = renderNotification(
                    'Sorry, no colorway themes were found for your profile.'
                );
                container.insertAdjacentHTML('beforebegin', message);
            });
    }

    if (isFirefoxDesktop() && getFirefoxMajorVersion() >= 97) {
        init();
    } else {
        const message = renderNotification(
            'This page requires Firefox 97 or above.'
        );
        container.insertAdjacentHTML('beforebegin', message);
    }
})();

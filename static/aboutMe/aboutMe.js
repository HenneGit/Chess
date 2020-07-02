(function () {
    'use strict';
    init();

    async function init() {
        await fetch("/static/aboutMe/aboutMe.json").then(resp => resp.json()).then(data => appendText(data));
    }

    /**
     * appends text from request to content-div.
     * @param data
     */
    function appendText(data) {
        let contentDiv = document.getElementById('content-div');
        for (let text in data) {
            let p = document.createElement('p');
            p.innerText = data[text];
            p.classList.add('block-text');
            contentDiv.appendChild(p);
        }
    }
}());

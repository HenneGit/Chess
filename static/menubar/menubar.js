import {buildLetterGrid, clearElement, toggleScript, toggleCss} from "/static/main.js";

(function () {

    init();


    async function init() {
        await fetch('/getMenu').then(resp => resp.json()).then(data => addSideBar(data));
        let mirror = document.getElementById('mirror');
        await buildLetterGrid('start', mirror);
    }

    function addSideBar(data) {
        let dataParsed = JSON.parse(data);
        let mainDiv = document.getElementById('nav-bar');
        for (let entry of dataParsed) {

            let div = document.createElement("div");
            let p = document.createElement("div");
            p.classList.add('nav-bar-entry');
            p.textContent = entry[0];
            p.addEventListener('click', function () {
                let contentPage = createContentPage(entry[1], entry[2]);
                setMirror(entry[0].toLowerCase());
            });

            div.appendChild(p);
            mainDiv.appendChild(div)

        }
    }

    async function createContentPage(url, css) {
        let contentDiv = document.getElementById('content-div');
        clearElement(contentDiv);
        toggleScript(url);
        toggleCss(css);

    }

    function setMirror(text) {
        let mirror = document.getElementById('mirror');
        clearElement(mirror);
        let letterGrid = buildLetterGrid(text, mirror);
    }

}());
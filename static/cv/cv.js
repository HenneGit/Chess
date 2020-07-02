(function () {
    'use strict';

    init();

    async function init() {
        await fetch("/static/cv/cv.json").then(resp => resp.json()).then(json => createGrid(json));
    }

    /**
     * creates a div grid depending on request entries and appends according headlines and paragraphs
     * @param json
     */
    function createGrid(json) {
        const contentDiv = document.getElementById('content-div');
        for (let div in json) {
            let newDiv = document.createElement('div');
            let headLine = document.createElement("h2");
            headLine.innerText = div;
            newDiv.id = div;
            newDiv.classList.add('cv-div');
            newDiv.appendChild(headLine);
            let content = json[div];
            for (let p in content) {
                if (p.includes('h')) {
                    let h1 = document.createElement('h1');
                    h1.innerText = content[p];
                    newDiv.appendChild(h1);
                }
                if (p.includes('p')) {
                    let para = document.createElement("p");
                    para.innerText = content[p];
                    newDiv.appendChild(para);
                }
            }
            contentDiv.appendChild(newDiv);
        }
    }
}());
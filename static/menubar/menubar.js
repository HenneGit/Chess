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
                createContentPage(entry[1], entry[2]);
                setMirror(entry[0].toLowerCase());
            });

            div.appendChild(p);
            mainDiv.appendChild(div)

        }
    }

    async function buildLetterGrid(word, container) {

        let letters = 0;
        while (letters < word.length) {
            let rows = 0;
            let letterDiv = document.createElement('div');
            letterDiv.id = 'l' + letters;
            letterDiv.classList.add('letter-box');
            while (rows < 7) {
                let cells = 0;
                while (cells < 5) {
                    let cell = document.createElement('div');
                    cell.id = 'l' + letters + 'r' + rows + 'c' + cells;
                    cell.classList.add('pixel');
                    letterDiv.appendChild(cell);
                    cells++;
                }
                rows++;
            }
            container.appendChild(letterDiv);
            letters++;
        }
        await getLetters(word);
    }
    async function getLetters(word) {
             await fetch("/getLetters",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(word)
            }).then(resp => resp.json()).then(json => colorLetters(json));


    }

    function colorLetters(data) {
        let l = 0;
        for (let letter of data) {
            for (let id of letter) {
                let pixel = document.getElementById('l' + l + id);
                if (pixel === null){
                    console.log(id);
                }
                pixel.classList.add('pixel-active');
            }
            l++;
        }
        cleanLetters();
    }


    function lazyLoadScript(url) {
        let script = document.getElementById('lazyLoaded');
        if (script === null) {
            let body = document.querySelector('body');
            let script = document.createElement('script');
            script.id = 'lazyLoaded';
            script.type = 'text/javascript';
            script.src = url;
            body.appendChild(script);
        } else {
            script.src = url;
        }
    }

    function mountCss(file) {
        if (file === null) {
            return;
        }
        let link = document.getElementById('lazy-css');
        if (link === null) {
            let head = document.querySelector('head');
            let link = document.createElement('link');
            link.id = 'lazy-css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = file;
            head.appendChild(link);
        } else {
            link.href = file;
        }
    }

    function unloadCSS() {
        let link = document.getElementById('lazy-css');
        let head = document.querySelector('head');
        if (link === null) {
            return
        }
        head.removeChild(link);
    }


    async function createContentPage(url, css) {
        let contentDiv = document.getElementById('content-div');
        clearElement(contentDiv);
        if (url.includes('.js')) {
            unloadScript();
            unloadCSS();
            lazyLoadScript(url);
            mountCss(css);
        } else {
            unloadScript();
            unloadCSS();
            mountCss(css);
            await fetch(url).then(resp => resp.text()).then(data => {

                let p = document.createElement("p");
                p.innerText = data;
                contentDiv.appendChild(p);

            });
        }
    }

    function unloadScript() {
        let script = document.getElementById('lazyLoaded');
        let body = document.querySelector('body');
        if (script === null) {
            return;
        }
        body.removeChild(script);
    }

    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

    }

    function cleanLetters(){
        let letters = document.querySelectorAll('.letter-box');
        let columnNo = ['c0', 'c1', 'c2', 'c3', 'c4'];

        for (let letter of letters){
            let inactive  = Array.from(letter.children).filter(pixel => {
                return !pixel.classList.contains('pixel-active');
            });

            let pixelToRemove = [];
            columnNo.forEach(no => pixelToRemove.push(inactive.filter(pixel => {
                return pixel.id.includes(no);
            })));
            let columnCount = 5;
            for (let column of pixelToRemove){
                if (column.length === 7){
                   column.forEach(pixel => letter.removeChild(pixel));
                   columnCount--;
                }
            }
            letter.style.gridTemplateColumns = "repeat(" + columnCount + ", 1fr)";
        }
    }

    function setMirror(text) {
        let mirror = document.getElementById('mirror');
        clearElement(mirror);
        buildLetterGrid(text, mirror);
    }

}());
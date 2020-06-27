(function () {

    init();


    async function init() {
        await fetch('/getMenu').then(resp => resp.json()).then(data => addSideBar(data));
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
                setMirror(entry[0]);
            });

            div.appendChild(p);
            mainDiv.appendChild(div)

        }
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
        if (file === null){
            return;
        }
        let link = document.getElementById('lazy-css');
        if (link === null) {
            let head = document.querySelector('head');
            let link = document.createElement('link');
            link.id = 'lazy-css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = '/static/' + file;
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

    function setMirror(text) {
        let mirror = document.getElementById('mirror');
        mirror.innerText = text;
    }

}());
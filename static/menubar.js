

init();

async function init() {
    await fetch('/getMenu').then(resp => resp.json()).then(data => addSideBar(data));
}

function addSideBar(data){
    let dataParsed = JSON.parse(data);
    let mainDiv = document.getElementById('nav-bar');
    for (let entry of dataParsed) {

        let div = document.createElement("div");
        let p = document.createElement("div");
        p.classList.add('nav-bar-entry');
        p.textContent = entry[0];
        p.addEventListener('click', function () {
            createContentPage(entry[1]);
            setMirror(entry[0]);
        });

        div.appendChild(p);
        mainDiv.appendChild(div)

    }
}

async function createContentPage(url) {
    let contentDiv = document.getElementById('content-div');
    clearElement(contentDiv);
    await fetch(url).then(resp => resp.text()).then(data => {
        console.log(data);
        let p = document.createElement("p");
        p.innerText = data;
        contentDiv.appendChild(p);
    });
}

function clearElement(element) {
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }

}

function setMirror(text) {
    let mirror = document.getElementById('mirror');
    mirror.innerText = text;
}


export async function buildLetterGrid(word, container) {

    let letterCount = 0;
    while (letterCount < word.length) {
        let rows = 0b0;
        let letterDiv = document.createElement('div');
        letterDiv.id = 'l' + letterCount;
        letterDiv.classList.add('letter-box');
        while (rows < 7) {
            let cells = 0;
            while (cells < 5) {
                let cell = document.createElement('div');
                cell.id = 'l' + letterCount + 'r' + rows + 'c' + cells;
                cell.classList.add('pixel');
                letterDiv.appendChild(cell);
                cells++;
            }
            rows++;
        }
        container.appendChild(letterDiv);
        letterCount++;
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

export function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function colorLetters(data) {
    let l = 0;
    for (let letter of data) {
        for (let id of letter) {
            let pixel = document.getElementById('l' + l + id);
            if (pixel === null) {
                console.log(id);
            }
            pixel.classList.add('pixel-active');
        }
        l++;
    }
    cleanLetters();
}


function cleanLetters() {
    let letters = document.querySelectorAll('.letter-box');
    let columnNo = ['c0', 'c1', 'c2', 'c3', 'c4'];

    for (let letter of letters) {
        let inactive = Array.from(letter.children).filter(pixel => {
            return !pixel.classList.contains('pixel-active');
        });

        let pixelToRemove = [];
        columnNo.forEach(no => pixelToRemove.push(inactive.filter(pixel => {
            return pixel.id.includes(no);
        })));
        let columnCount = 5;
        for (let column of pixelToRemove) {
            if (column.length === 7) {
                column.forEach(pixel => letter.removeChild(pixel));
                columnCount--;
            }
        }
        letter.style.gridTemplateColumns = "repeat(" + columnCount + ", 1fr)";
    }
}


export function toggleScript(url) {
    let js = document.getElementById('lazy-loaded-js');
    let body = document.querySelector('body');
    body.removeChild(js);
    let newJs = document.createElement('script');
    newJs.type = "text/javascript";
    newJs.id = 'lazy-loaded-js';
    newJs.src = url;
    body.appendChild(newJs);
}

export function toggleCss(url) {
    let css = document.getElementById('lazy-loaded-css');
    let head = document.querySelector('head');
    head.removeChild(css);
    css.href = url;
    head.appendChild(css);
}


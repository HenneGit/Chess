document.addEventListener('DOMContentLoaded', init);

/**
 * inits the page, collects active pixels and sets animation for appearing.
 * @returns {Promise<void>}
 */
async function init() {
    buildLetterGrid("Hello");

    await fetch('/getLetters').then(res => res.json()).then(data => colorLetters(data));

    console.log("does it wait?");
    //makeAjaxCall('/getLetters', 'GET', null, 'application/json', colorLetters);
    let display = document.getElementById('display');
    const pixels = display.querySelectorAll('.pixel-active');

    let array = [];
    let i = 0;
    for (let el of pixels) {
        array.push(el.id);
    }
    shuffle(array);

    let timer = setInterval(function () {

        const td = document.getElementById(array[i]);
        td.classList.add('fade');
        i++;
        if (i === pixels.length) {
            clearInterval(timer);
            complete();
        }
    }, 30);

}


/**
 * sets up the display, adds ids to pixels.
 * @param word
 */
function buildLetterGrid(word) {

    let letters = 0;
    let wrapper = document.getElementById('wrapper');
    let display = document.createElement('div');
    addEmptyDivs(wrapper);

    display.id = 'display';
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
                cell.classList.add('pixel')
                letterDiv.appendChild(cell);
                cells++;
            }
            rows++;

        }
        display.appendChild(letterDiv);
        letters++;
    }
    wrapper.appendChild(display);
    addEmptyDivs(wrapper);
}

function addEmptyDivs(wrapper) {
    for (let i = 0; i < 4; i++) {
        wrapper.appendChild(getEmptyDiv());
    }
}


function getEmptyDiv() {
    return document.createElement('div');

}

function colorLetters(data) {
    let l = 0;
    for (let letter of data) {
        for (let id of letter) {
            let td = document.getElementById('l' + l + id);
            td.classList.add('pixel-active');
        }
        l++;
    }
}


async function moveDown() {
    const rows = getShuffledRows();

    for (let row of rows) {
        await startAnimationAndResolve(row);
        console.log("it does not wait");
    }
    console.log('done');
}

async function fetchJson(url) {
    let header = {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json'
        }
    };


    let request = new Request(url, header);

    fetch(url).then(function (resp) {
        console.log(resp);
        return resp.json()
    }).then(function (data) {
        console.log(data);
    })

}

/**
 * waits 10 * row length ms and starts the animation for given rows.
 * @param row
 * @returns {Promise<Promise<unknown>>}
 */
async function startAnimationAndResolve(row) {

    return new Promise(resolve => {
        setTimeout(function () {
            playAnimation(row);
            resolve();
        }, row.length * 10)
    });
}

/**
 * sets the class to all elements in row with an offset of 10ms
 * @param row
 */
function playAnimation(row) {

    let i = 0;
    const timer = setInterval(function () {
        document.getElementById(row[i]).classList.add('move');
        i++;
        if (row === null || i === row.length) {
            clearInterval(timer);
        }
    }, 10)

}

/**
 * shuffles all elements of an array.
 * @param array
 */
function shuffle(array) {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
}

/**
 * creates tooltip and appends it to a random pixel. Sets timeout for pixel to add blinking class.
 */
function complete() {
    let pixels = document.querySelectorAll('.pixel-active');
    let toolTip = document.createElement('span');
    toolTip.classList.add('tooltip');
    toolTip.innerText = "Enter";

    //add event to tooltip
    toolTip.addEventListener('click', moveDown);
    const timeOut = setTimeout( () => {
        pix.classList.add('blink');
    }, 1);

    //pick random pixel and append tooltip.
    let x = Math.floor(Math.random() * Math.floor(pixels.length));
    let pix = pixels[x];
    pix.style.backgroundColor = 'red';
    pix.classList.add('toolTipDiv');
    pix.appendChild(toolTip);

}

/**
 * gets all active pixels of a row and shuffles them. Returns an array with all rows shuffled.
 * @returns {[]}
 */
function getShuffledRows() {
    let elements = document.querySelectorAll('.pixel-active');
    let ids = Array.from(elements).map((element) => element.id);

    let rowNumbers = ['r6', 'r5', 'r4', 'r3', 'r2', 'r1', 'r0'];
    let rowIds = [];
    //filter ids for including each row no and push on rowIds array.
    rowNumbers.forEach(no => rowIds.push(ids.filter(id => {return id.includes(no)})));

    rowIds.forEach((row) => shuffle(row));
    return rowIds;
}


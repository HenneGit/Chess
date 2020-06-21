document.addEventListener('DOMContentLoaded', init);


function init() {
    buildLetterGrid("Hello")
    makeAjaxCall('/getLetters', 'GET', null, 'application/json', colorLetters);
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


async function startAnimationAndResolve(row) {

    return new Promise(resolve => {
        setTimeout(function () {
            playAnimation(row);
            resolve();
        }, row.length * 10 / 3)
    });
}

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

function complete() {
    let display = document.getElementById('display');
    let pixels = display.querySelectorAll('.pixel-active');

    let toolTip = document.createElement('span');
    toolTip.classList.add('tooltip');
    toolTip.innerText = "Enter";

    //add event to tooltip
    toolTip.addEventListener('click', moveDown);
    const timeOut = setTimeout(function () {
        pix.classList.add('blink');
    }, 1);

    //pick random pixel and append tooltip.
    let x = Math.floor(Math.random() * Math.floor(pixels.length));
    let pix = pixels[x];
    pix.style.backgroundColor = 'red';
    pix.classList.add('toolTipDiv');
    pix.appendChild(toolTip);

}

function getShuffledRows() {
    let display = document.getElementById('display');

    const elements = display.querySelectorAll('.pixel-active');
    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];
    let row5 = [];
    let row6 = [];
    let row7 = [];

    for (let el of elements) {
        if (el.id.includes('r0')) {
            row1.push(el.id);
        }
        if (el.id.includes('r1')) {
            row2.push(el.id);
        }
        if (el.id.includes('r2')) {
            row3.push(el.id);
        }
        if (el.id.includes('r3')) {
            row4.push(el.id);
        }
        if (el.id.includes('r4')) {
            row5.push(el.id);
        }
        if (el.id.includes('r5')) {
            row6.push(el.id);
        }
        if (el.id.includes('r6')) {
            row7.push(el.id);
        }

    }
    shuffle(row1);
    shuffle(row2);
    shuffle(row3);
    shuffle(row4);
    shuffle(row5);
    shuffle(row6);
    shuffle(row7);
    return [row7, row6, row5, row4, row3, row2, row1];
}

function makeAjaxCall(url, method, data, datatype, callback) {

    var request = new XMLHttpRequest();
    request.open(method, url, false);
    request.setRequestHeader('Content-type', datatype);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.readyState === 204) {
                console.log("request success");
                callback();
            }
            if (request.readyState === 200) {
                var response = request.responseText;
                callback(response);
            } else {
                console.log(request.status + " :request failed");

            }
        } else {
            console.log(request.status + " :request processing...")
        }

    }
    request.send(data);
    if (datatype === 'application/json') {
        callback(JSON.parse(request.responseText));
    } else {
        callback(request.responseText);
    }
    console.log(" request success");
}

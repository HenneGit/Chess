import {buildLetterGrid, clearElement, toggleScript, toggleCss} from "/static/main.js";

(function () {

    'use strict';

    init();

    /**
     * inits the page, collects active pixels and sets animation for appearing.
     * @returns {Promise<void>}
     */
    async function init() {
        let contentDiv = document.getElementById('content-div');

        await buildLetterGrid("hello", contentDiv);

        const pixels = contentDiv.querySelectorAll('.pixel-active');

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
        }, 10);

    }


    async function moveDown() {
        const rows = getShuffledRows();
        for (let row of rows) {
            await startAnimationAndResolve(row);
        }
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
     * sets the transition class to all elements in row with an offset of 10ms
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
     * Pics random pixel. Sets timeout for pixel to add blinking class.
     */
    async function complete() {
        let pixels = document.querySelectorAll('.pixel-active');

        //pick random pixel and append tooltip.
        let x = Math.floor(Math.random() * Math.floor(pixels.length));
        let pix = pixels[x];


        //add event to tooltip
        pix.addEventListener('click', function () {
            moveDown();
            setTimeout(lazyLoadMain, 2000);
        });
        const timeOut = setTimeout(() => {
            pix.classList.add('blink');
        }, 1);

        pix.style.backgroundColor = 'red';
        pix.classList.add('toolTipDiv');
    }

    function lazyLoadMain() {
        clearElement(document.getElementById('content-div'));
        let script = document.createElement('script');
        script.type = "module";
        script.src = "/static/menubar/menubar.js";
        document.querySelector('body').appendChild(script);
        toggleCss("");
        let head = document.querySelector('head');
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/static/menubar/menubar.css';
        head.appendChild(link);
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
        rowNumbers.forEach(no => rowIds.push(ids.filter(id => {
            return id.includes(no)
        })));

        rowIds.forEach((row) => shuffle(row));
        return rowIds;
    }

}());
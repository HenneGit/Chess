(function () {
    'use strict';

    init();

    function init() {
        let contentDiv = document.getElementById('content-div');
        let letters = ['i', 'h', 'f', 'e', 'd', 'c', 'b', 'a'];
        for (let n = 0; n < 8; n++) {
            let letter = letters[n];
            let row = document.createElement('div');
            row.classList.add('row');

            n % 2 === 0 ? row.classList.add('even') : row.classList.add('odd');

            for (let i = 1; i < 9; i++) {
                let field = document.createElement('div');
                if (letters[n] === "b" || letters[n] === "h"){
                    let pawn = document.createElement('img');
                    letters[n] === "h" ? pawn.src = "/static/media/chess_icons/black-pawn.svg" : pawn.src = "/static/media/chess_icons/white-pawn.svg";
                    pawn.draggable = true;
                    pawn.addEventListener('dragstart', dragStart);
                    pawn.addEventListener('dragend', dragEnd);
                    field.appendChild(pawn);

                }

                field.classList.add('field');
                field.id = letter + i;
                row.appendChild(field);

            }
            contentDiv.appendChild(row);
        }
    }

    function dragStart() {


    }

    function dragEnd() {


    }

}());
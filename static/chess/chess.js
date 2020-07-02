'use strict';

const positions = {
    "a8": new Piece('rook', 'black', 'black-rook.svg'),
    "b8": new Piece('knight', 'black', "black-knight.svg"),
    "c8": new Piece('bishop', 'black', "black-bishop.svg"),
    "d8": new Piece('king', 'black', "black-king.svg"),
    "e8": new Piece('queen', 'black', "black-queen.svg"),
    "f8": new Piece('bishop', 'black', "black-bishop.svg"),
    "g8": new Piece('knight', 'black', "black-knight.svg"),
    "h8": new Piece('rook', 'black', "black-rook.svg"),
    "a1": new Piece('rook', 'white', "white-rook.svg"),
    "b1": new Piece('knight', 'white', "white-knight.svg"),
    "c1": new Piece('bishop', 'white', "white-bishop.svg"),
    "d1": new Piece('king', 'white', "white-king.svg"),
    "e1": new Piece('queen', 'white', "white-queen.svg"),
    "f1": new Piece('bishop', 'white', "white-bishop.svg"),
    "g1": new Piece('knight', 'white', "white-knight.svg"),
    "h1": new Piece('rook', 'white', "white-rook.svg")
};

function Piece(type, color, svg) {
    this.type = type;
    this.color = color;
    this.svg = svg;
}

function Field(piece, id, x, y) {
    this.piece = piece;
    this.id = id;
    this.x = x;
    this.y = y;
    this.containsPiece = function () {
        return this.piece === null;
    }

}


function Board(fields) {
    this.fields = fields;
}

newGame();


function newGame() {

    let fields = [];

    let letters = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
    for (let i = 1; i < 9; i++) {
        for (let j = 0; j < 8; j++) {
            let letter = letters[j];
            let piece = positions[letter + i] === undefined ? null : positions[letter + i];
            if (i === 2 || i === 7) {
                let color = i === 7 ? 'black' : 'white';
                let svg = i === 7 ? 'black-pawn.svg' : 'white-pawn.svg';
                piece = new Piece('pawn', color, svg);
            }

            let field = new Field(piece, letter + i, j + 1, i);
            fields.push(field);
        }
    }
    let board = new Board(fields);
    console.log(board);
    createBoard(board);
}


function createBoard(board) {
    let contentDiv = document.getElementById('content-div');

    let blackOrWhite = -1;
    for (let field of board.fields) {

        let domField = document.createElement('div');
        domField.id = field.id;
        blackOrWhite < 0 ? domField.classList.add('white') : domField.classList.add('black');

        domField.classList.add('field');
        if (field.piece !== null) {
            let svg = document.createElement('img');
            svg.draggable = true;
            svg.src = field.piece.svg;
            domField.appendChild(svg);
            svg.addEventListener('dragstart', dragStart);
            svg.addEventListener('dragend', dragEnd);
        }
        domField.addEventListener('dragover', dragOver);
        domField.addEventListener('dragleave', dragLeave);
        domField.addEventListener('dragenter', dragEnter);
        domField.addEventListener('drop', dragDrop);

        contentDiv.appendChild(domField);
        blackOrWhite = blackOrWhite * -1;
        if (field.x === 8) {
            blackOrWhite = blackOrWhite * -1;
        }
    }
    }

    function dragStart() {
        this.classList = 'hold';
        this.classList.add('dragged');
        setTimeout(() => this.classList.add('invisible'), 0);

    }

    function dragEnd() {
        this.classList.remove('invisible');
        this.classList.remove('hold');
        this.classList.add("field");

    }

    function dragOver(event) {
        event.preventDefault();
        this.classList.add('hovered');

    }

    function dragEnter(event) {
        event.preventDefault();
        this.classList.add('hovered');

    }

    function dragLeave() {
        this.classList.remove('hovered');

    }

    function dragDrop() {
        let draggedElement = document.querySelector('.dragged');
        this.classList.remove('hovered');

        this.append(draggedElement);
        draggedElement.classList.remove('dragged');
    }

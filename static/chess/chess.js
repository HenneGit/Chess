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

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

let board = null;

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
        return this.piece !== null;

    }


}

function Board(fields) {
    this.fields = fields;

}

newGame();

function newGame() {

    let fields = [];


    for (let i = 1; i < 9; i++) {
        for (let j = 8; j > 0; j--) {
            let letter = letters[j-1];
            let piece = positions[letter + i] === undefined ? null : positions[letter + i];
            if (i === 2 || i === 7) {
                let color = i === 7 ? 'black' : 'white';
                let svg = i === 7 ? 'black-pawn.svg' : 'white-pawn.svg';
                piece = new Piece('pawn', color, svg);
            }

            let field = new Field(piece, letter + i, j, i);
            fields.push(field);
        }
    }
    board = new Board(fields);
    console.log(board);
    createBoard(board);
}


function createBoard(board) {
    let contentDiv = document.getElementById('content-div');
    let boardDiv = document.createElement('div');
    boardDiv.id = 'board-div';
    let blackOrWhite = -1;
    for (let field of board.fields) {

        let domField = document.createElement('div');
        domField.id = field.id;
        let classType = blackOrWhite < 0 ? 'black' : 'white';
        domField.classList.add(classType);
        domField.classList.add('field');
        domField.setAttribute('x', field.x);
        domField.setAttribute('y', field.y);
        if (field.piece !== null) {
            let svg = document.createElement('img');
            svg.src = field.piece.svg;
            svg.classList.add("piece");
            svg.draggable = true;
            svg.addEventListener('dragstart', dragStart);
            svg.addEventListener('dragend', dragEnd);
            domField.appendChild(svg);
        }


        boardDiv.appendChild(domField);
        blackOrWhite = blackOrWhite * -1;
        if (field.x === 8) {
            blackOrWhite = blackOrWhite * -1;
        }
    }
    contentDiv.appendChild(boardDiv);
    let xAxis = document.createElement('div');
    let yAxis = document.createElement('div');
    xAxis.id = "x-axis";
    yAxis.id = "y-axis";
    appendAxis(yAxis, true);
    appendAxis(xAxis, false);
    contentDiv.appendChild(yAxis);
    contentDiv.appendChild(xAxis);
    flip();

}

function appendAxis(axis, hasLetters) {
    let letterCount = 7;
    for (let i = 0; i < 8; i++) {
        let div = document.createElement('div');
        hasLetters ? div.innerText = i + 1 : div.innerText = letters[letterCount];
        axis.appendChild(div);
        letterCount--;
    }

}

function flip() {
    let boarDiv = document.getElementById('board-div');
    let xAxis = document.getElementById('x-axis');
    let yAxis = document.getElementById('y-axis');
    let elements = [boarDiv, xAxis, yAxis];
    for (let element of elements) {
        for (let i = 1; i < element.childNodes.length; i++) {
            element.insertBefore(element.childNodes[i], element.firstChild);
        }
    }
}

function move(sourceField, targetField) {
    let source = document.getElementById(sourceField);
    let piece = source.querySelector('.piece');
    let target = document.getElementById(targetField);
    target.appendChild(piece);
}


function dragStart() {
    this.classList = 'hold';
    this.classList.add('dragged');
    setTimeout(() => this.classList.add('invisible'), 0);
    let fieldId = this.parentElement.id;
    getLegalMoves(getField(fieldId)).forEach(field => setUpLegelFields(field));

}

function setUpLegelFields(legalField) {
    let domField = document.getElementById(legalField.id);
    domField.classList.add('legal');
    domField.addEventListener('dragover', dragOver);
    domField.addEventListener('dragleave', dragLeave);
    domField.addEventListener('dragenter', dragEnter);
    domField.addEventListener('drop', dragDrop);
}


function dragEnd() {
    //remove legal move highlighting
    document.querySelectorAll('.legal').forEach(element => element.classList.remove('legal'));
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
    let oldFieldId = draggedElement.parentElement.id;
    this.classList.remove('hovered');
    this.append(draggedElement);


    draggedElement.classList.remove('dragged');
    updateField(oldFieldId, this.id);

}

function updateField(oldField, newField) {
    let piece = getPiece(getField(oldField));
    console.log(piece);
    getField(newField).piece = piece;
    console.log(board);
}

function getField(fieldId) {
    for (let field of board.fields) {
        if (field.id === fieldId) {
            return field;
        }
    }
}

function getPiece(currentField) {
    for (let field of board.fields) {

        if (field.id === currentField.id) {
            return field.piece;
        }
    }
}


function getLegalMoves1(field) {
    let piece = getPiece(field);
    let legalMoves = [];
    switch (piece.type) {
        case 'pawn':
            let direction = 1;
            piece.color === 'black' ? direction = -1 : direction = 1;
            if (field.y === 7 || field.y === 2) {
                let targetField = getFieldByXY(field.x, (field.y + 2 * direction));

                if (!targetField.containsPiece()) {
                    legalMoves.push(targetField);
                }

            }
            let enemyPiece1 = getFieldByXY(field.x + 1, field.y + direction);
            let enemyPiece2 = getFieldByXY(field.x - 1, field.y + direction);
            if (enemyPiece1.containsPiece() && enemyPiece1.piece.color !== piece.color) {
                legalMoves.push(enemyPiece1);
            }

            if (enemyPiece2.containsPiece() && enemyPiece2.piece.color !== piece.color) {
                legalMoves.push(enemyPiece2);
            }

            legalMoves.push(getFieldByXY(field.x, field.y + direction));
            return legalMoves;
        default:
            return legalMoves;

    }

}


function getLegalMoves(currentField) {
    let piece = getPiece(currentField);
    let fields = board.fields;

    console.log(fields);
    switch (piece.type) {
        case 'pawn':
            getPawnMoves(currentField);
            return fields;
        case 'bishop':
            break;
        default:
            break;

    }

}

function getPawnMoves(currentField) {

}

function getFieldByXY(x, y) {
    for (let field of board.fields) {
        if (field.x === x && field.y === y) {
            return field;
        }
    }
}
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

const directions = {
    diagonal: {
        upLeft: [-1, 1],
        upRight: [1, 1],
        downLeft: [-1, -1],
        downRight: [1, -1]
    },
    straight: {
        left: [-1, 0],
        right: [1, 0],
        up: [0, +1],
        down: [0, -1]
    }
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

    };
    this.getUpLeft = function () {
        return [this.x + 1, this.y + 1];
    };


}

function Board(fields) {
    this.fields = fields;

}

newGame();

function newGame() {

    let fields = [];


    for (let i = 1; i < 9; i++) {
        for (let j = 8; j > 0; j--) {
            let letter = letters[j - 1];
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
    let boardDiv = getDiv('board-div');
    let blackOrWhite = -1;
    for (let field of board.fields) {

        let domField = getDiv(field.id);
        let classType = blackOrWhite < 0 ? 'white' : 'black';
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
        if (field.x === 1) {
            blackOrWhite = blackOrWhite * -1;
        }
    }
    contentDiv.appendChild(boardDiv);
    let xAxis = getDiv("x-axis");
    let yAxis = getDiv('y-axis');
    appendAxis(yAxis, true);
    appendAxis(xAxis, false);
    contentDiv.appendChild(yAxis);
    contentDiv.appendChild(xAxis);

    let panel = getDiv('panel');
    createPanel(panel);
    contentDiv.appendChild(panel);
    flip();

}

function createPanel(panel) {
    let whiteGraveyard = getDiv('white-graveyard');
    let blackGraveyard = getDiv('black-graveyard');
    let details = getDiv('details');
    blackGraveyard.classList.add('graveyard');
    whiteGraveyard.classList.add('graveyard');
    panel.appendChild(blackGraveyard);
    panel.appendChild(details);
    panel.appendChild(whiteGraveyard);

}

function getDiv(id) {
    let div = document.createElement('div');
    div.id = id;
    return div;
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
    const {straight} = directions;
    let legalFields = getLegalMoves(getField(fieldId), 2, straight);
    for (let field of legalFields) {
        if (field !== undefined) {
            setUpLegalFields(field);
        }
    }

}

function setUpLegalFields(legalField) {
    let domField = document.getElementById(legalField.id);
    if (legalField.containsPiece()){
        domField.classList.add('take');
    } else {
        domField.classList.add('legal');
    }
    domField.addEventListener('dragover', dragOver);
    domField.addEventListener('dragleave', dragLeave);
    domField.addEventListener('dragenter', dragEnter);
    domField.addEventListener('drop', dragDrop);
}


function dragEnd() {
    clearDragAndDropProps();

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

function dragLeave(event) {
    event.preventDefault();
    this.classList.remove('hovered');

}

function clearDragAndDropProps() {
     document.querySelectorAll('.legal').forEach(element => {
        element.classList.remove('legal');
        element.classList.remove('take');
        element.removeEventListener('dragover', dragOver);

        element.removeEventListener('dragleave', dragLeave);
        element.removeEventListener('dragenter', dragEnter);
        element.removeEventListener('drop', dragDrop);

    });
}

function dragDrop() {
    let draggedElement = document.querySelector('.dragged');

    let field = getField(this.id);
    if (field.containsPiece()){
        let pieceColor = field.piece.color;
        let domPiece = this.querySelector('img');
        document.getElementById(pieceColor + "-graveyard").appendChild(domPiece);
        field.piece = null;
    }
    let oldFieldId = draggedElement.parentElement.id;
    this.classList.remove('hovered');
    this.classList.remove('take');
    this.appendChild(draggedElement);
    draggedElement.classList.remove('dragged');
    updateField(oldFieldId, this.id);

    clearDragAndDropProps();

}

function updateField(oldFieldId, newFieldId) {
    let oldField = getField(oldFieldId);

    let piece = getPiece(oldField);
    oldField.piece = null;
    console.log(piece);
    getField(newFieldId).piece = piece;
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

function getLegalMoves(startField, depth, movingType) {
    let fields = [];
    for (let offSet in movingType) {
        let offSetXY = movingType[offSet];
        fields.push(...getMovement(startField, depth, offSetXY[0], offSetXY[1]));
    }
    return fields
}

function getMovement(startField, depth, offsetX, offSetY) {

    let fields = [];
    let containsPieceOrIsInvalid = false;
    for (let i = 1; i <= depth; i++) {
        if (!containsPieceOrIsInvalid) {
            let nextField = getFieldByXY(startField.x + offsetX * i, startField.y + offSetY * i);
            if (nextField === undefined || nextField.containsPiece()) {
                if (nextField !== undefined && nextField.piece.color !== startField.piece.color){
                    fields.push(nextField);
                }
                containsPieceOrIsInvalid = true;
                return fields;
            } else {
                fields.push(nextField);
            }
        }
    }
    return fields;
}


function getFieldByXY(x, y) {
    for (let field of board.fields) {
        if (field.x === x && field.y === y) {
            return field;
        }
    }
}
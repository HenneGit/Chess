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
    console.log(Array.from(board));
    console.log(getAllFieldWithPiecesByColor('black'));

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
    let legalFields = getMovesForPiece(getField(fieldId));
    for (let field of legalFields) {
        if (field !== undefined) {
            setUpLegalFields(field);
        }
    }

}

function setUpLegalFields(legalField) {
    let domField = document.getElementById(legalField.id);
    if (legalField.containsPiece()) {
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
        removeListeners(element);


    });
    document.querySelectorAll('.take').forEach(element => {
        element.classList.remove('take');
        removeListeners(element);
    });

    function removeListeners(element) {
        element.removeEventListener('dragover', dragOver);
        element.removeEventListener('dragleave', dragLeave);
        element.removeEventListener('dragenter', dragEnter);
        element.removeEventListener('drop', dragDrop);
    }

}

function dragDrop() {
    let draggedElement = document.querySelector('.dragged');

    let field = getField(this.id);
    if (field.containsPiece()) {
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

function getLegalMoves(startField, depth, movingType, strikePeace) {
    let fields = [];
    for (let offSet in movingType) {
        let offSetXY = movingType[offSet];
        fields.push(...getMovement(startField, depth, offSetXY[0], offSetXY[1], strikePeace));
    }
    return fields
}

function getMovement(startField, depth, offsetX, offSetY, strikePeace) {

    let fields = [];
    let containsPieceOrIsInvalid = false;
    for (let i = 1; i <= depth; i++) {
        if (!containsPieceOrIsInvalid) {
            let nextField = getFieldByXY(startField.x + offsetX * i, startField.y + offSetY * i);
            if (nextField === undefined) {
                containsPieceOrIsInvalid = true;
            } else if (nextField.containsPiece()) {
                let nextFieldPiece = nextField.piece;
                //set field as legal if there is a piece of opposite color which is not the king.
                if (nextFieldPiece.color !== startField.piece.color && strikePeace && nextFieldPiece.type !== 'king') {
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


function getPawnMoves(field) {
    let legalMoves = [];
    let color = field.piece.color;
    let yOffset = color === 'black' ? -1 : 1;
    const {straight} = directions;
    //if pawn on base line movement is two.
    if (field.y === 2 || field.y === 7) {
        legalMoves.push(...getLegalMoves(field, 2, straight, false));

    } else {
        legalMoves.push(...getLegalMoves(field, 1, straight, false));
    }
    let fieldLeft = getFieldByXY(field.x + 1, field.y + yOffset);
    let fieldRight = getFieldByXY(field.x - 1, field.y + yOffset);
    if (fieldLeft !== undefined && fieldLeft.containsPiece() && fieldLeft.piece.color !== color) {

        legalMoves.push(fieldLeft);

    }
    if (fieldRight !== undefined && fieldRight.containsPiece() && fieldRight.piece.color !== color) {

        legalMoves.push(fieldRight);

    }
    let filterMoves = function (legalField) {
        return color === 'black' ? legalField.y < field.y : legalField.y > field.y;
    };


    return legalMoves.filter(legalField => filterMoves(legalField));
}


function getBishopMoves(field) {
    const {diagonal} = directions;
    return getLegalMoves(field, 7, diagonal, true);
}

function getRookMoves(field) {
    const {straight} = directions;
    return getLegalMoves(field, 7, straight, true);
}

function getQueenMoves(field) {
    const {straight} = directions;
    const {diagonal} = directions;
    let legalMoves = [];
    legalMoves.push(...getLegalMoves(field, 7, straight, true));
    legalMoves.push(...getLegalMoves(field, 7, diagonal, true));
    return legalMoves;
}

function getKingMoves(field) {
    const {straight} = directions;
    const {diagonal} = directions;
    let color = field.piece.color === 'white' ? "black" : "white";
    let legalMoves = [];
    legalMoves.push(...getLegalMoves(field, 1, straight));
    legalMoves.push(...getLegalMoves(field, 1, diagonal));

    return legalMoves.filter(field => !fieldHasChess(field, color));
}

function fieldHasChess(fieldToCheck, color) {
    let enemyFields = getAllFieldWithPiecesByColor(color);
    let allLegalMoves = [];
    for (let enemyField of enemyFields) {
        allLegalMoves.push(...getMovesForPiece(enemyField));
    }
    for (let field of allLegalMoves) {
        if (field === fieldToCheck) {
            return true;
        }

    }
    return false;
}

function fieldIsCovered() {

}

function getAllFieldWithPiecesByColor(color) {
    return Array.from(board.fields).reduce((total, field) => {
        if (field.containsPiece() && field.piece.color === color) {
            total.push(field);
        }
        return total;
    }, []);
}

/**
 * constructs moves for piece knight.
 * @param field the field to start from
 * @returns {[Field]} array of fields with legal moves.
 */
function getKnightMoves(field) {
    let legalFields = [];
    let vectors = [[2, -1], [2, 1], [-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [-2, 1]];

    for (let vector of vectors) {
        let nextField = getFieldByXY(field.x + vector[0], field.y + vector[1]);
        if (nextField === undefined || nextField.containsPiece()) {
            if (nextField !== undefined && nextField.piece.color !== field.piece.color) {
                legalFields.push(nextField);
            }
        } else {
            legalFields.push(nextField);
        }
    }
    return legalFields;
}


/**
 * decides which legal moves to return according to given peace.
 * @param field
 * @returns {Field[]|[]}
 */
function getMovesForPiece(field) {
    switch (field.piece.type) {
        case "pawn":
            return getPawnMoves(field);
        case "bishop":
            return getBishopMoves(field);
        case 'rook':
            return getRookMoves(field);
        case 'queen':
            return getQueenMoves(field);
        case 'king' :
            return getKingMoves(field);
        case 'knight':
            return getKnightMoves(field);
    }
}


function getFieldByXY(x, y) {
    for (let field of board.fields) {
        if (field.x === x && field.y === y) {
            return field;
        }
    }
}
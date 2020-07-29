'use strict';

const positions = {
    "a8": new Piece('rook', 'black', 'black-rook.svg', 0),
    "b8": new Piece('knight', 'black', "black-knight.svg", 0),
    "c8": new Piece('bishop', 'black', "black-bishop.svg", 0),
    "d8": new Piece('queen', 'black', "black-queen.svg", 0),
    "e8": new Piece('king', 'black', "black-king.svg", 0),
    "f8": new Piece('bishop', 'black', "black-bishop.svg", 0),
    "g8": new Piece('knight', 'black', "black-knight.svg", 0),
    "h8": new Piece('rook', 'black', "black-rook.svg", 0),
    "a1": new Piece('rook', 'white', "white-rook.svg", 0),
    "b1": new Piece('knight', 'white', "white-knight.svg", 0),
    "c1": new Piece('bishop', 'white', "white-bishop.svg", 0),
    "d1": new Piece('queen', 'white', "white-queen.svg", 0),
    "e1": new Piece('king', 'white', "white-king.svg", 0),
    "f1": new Piece('bishop', 'white', "white-bishop.svg", 0),
    "g1": new Piece('knight', 'white', "white-knight.svg", 0),
    "h1": new Piece('rook', 'white', "white-rook.svg", 0)
};

const piecePicker = function (color) {
    let piecePickerMap = new Map;
    piecePickerMap.set('bishop', new Piece('bishop', color, color + "-bishop.svg", 0));
    piecePickerMap.set('knight', new Piece('knight', color, color + "-knight.svg", 0));
    piecePickerMap.set('rook', new Piece('rook', color, color + "-rook.svg", 0));
    piecePickerMap.set('queen', new Piece('queen', color, color + "-queen.svg", 0));
    return piecePickerMap;
};

let pieceWasPicked = true;

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
const boardHistory = [];
let moveCounter = 0;
let moveTracker = [];

function Piece(type, color, svg, moveNumber) {
    this.type = type;
    this.color = color;
    this.svg = svg;
    this.moveNumber = moveNumber;
}

function Field(piece, id, x, y) {
    this.piece = piece;
    this.id = id;
    this.x = x;
    this.y = y;
}

function Board(fields, graveyard) {
    this.fields = fields;
    this.graveyard = graveyard;

}

newGame();

/**
 * init a new board with pieces in starting position.
 */
function newGame() {

    let fields = [];
    let graveyard = [];

    for (let i = 1; i < 9; i++) {
        for (let j = 8; j > 0; j--) {
            let letter = letters[j - 1];
            let piece = positions[letter + i] === undefined ? null : positions[letter + i];
            if (i === 2 || i === 7) {
                let color = i === 7 ? 'black' : 'white';
                let svg = i === 7 ? 'black-pawn.svg' : 'white-pawn.svg';
                piece = new Piece('pawn', color, svg, false);
            }

            let field = new Field(piece, letter + i, j, i);
            fields.push(field);
        }
    }
    board = new Board(fields, graveyard);
    console.log(board);
    createBoard();
}

/**
 * create the board and add pieces to it.
 * @param board
 */
function createBoard() {
    let contentDiv = document.getElementById('content-div');
    clearElement(contentDiv);
    let boardDiv = getDiv('board-div');
    let blackOrWhite = -1;
    for (let field of board.fields) {

        let domField = getDiv(field.id);
        let classType = blackOrWhite < 0 ? 'white' : 'black';
        domField.classList.add(classType);
        domField.classList.add('field');
        domField.setAttribute('x', field.x);
        domField.setAttribute('y', field.y);
        domField.style.gridArea = field.y + "/" + field.x;
        if (field.piece !== null) {
            let imgDiv = createImgFromField(field, true);
            domField.appendChild(imgDiv);
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
    console.log(getAllFieldsWithPiecesByColor('black'));
    console.log(getAllFieldsWithPiecesByColor('white'));
    console.log(board);

}

/**
 * create the panel where graveyard, moves and time is displayed.
 * @param panel
 */
function createPanel(panel) {
    let whiteGraveyard = getDiv('white-graveyard');
    let blackGraveyard = getDiv('black-graveyard');
    let details = getDiv('details');
    blackGraveyard.classList.add('graveyard');
    whiteGraveyard.classList.add('graveyard');
    panel.appendChild(blackGraveyard);
    panel.appendChild(details);
    panel.appendChild(whiteGraveyard);
    let blackPieces = getPiecesFromGraveyard('black');
    let whitePieces = getPiecesFromGraveyard('white');
    if (blackPieces !== null || true) {

        appendPiecesToGraveyard(blackPieces, blackGraveyard);
    }
    if (whitePieces !== null || true) {

        appendPiecesToGraveyard(whitePieces, whiteGraveyard);
    }

}

function appendPiecesToGraveyard(pieces, graveyard) {
    Array.from(pieces).forEach(piece => {
        let img = document.createElement('img');
        let imgDiv = document.createElement('div');
        img.src = piece.svg;
        imgDiv.appendChild(img);
        graveyard.appendChild(imgDiv);
    });

}

function createImgFromField(field) {
    let img = document.createElement('img');
    let imgDiv = document.createElement('div');
    imgDiv.id = field.id + "-piece";
    img.src = field.piece.svg;
    imgDiv.classList.add("piece");
    imgDiv.draggable = true;
    imgDiv.addEventListener('dragstart', dragStart);
    imgDiv.addEventListener('dragend', dragEnd);
    imgDiv.appendChild(img);

    return imgDiv;
}

function getPiecesFromGraveyard(color) {
    let capturedPieces = board.graveyard;
    if (capturedPieces !== null || true) {
        capturedPieces = capturedPieces.filter(piece => piece.color === color);
        console.log(capturedPieces);
        return capturedPieces;
    }
    return null;
}

/**
 * create a simple div and add given id.
 * @param id the id to add to the created div.
 * @returns {HTMLDivElement} the created element.
 */
function getDiv(id) {
    let div = document.createElement('div');
    div.id = id;
    return div;
}

/**
 * append x(a - h) and y(1-8) axis
 * @param axis
 * @param hasLetters
 */
function appendAxis(axis, hasLetters) {
    let letterCount = 7;
    for (let i = 0; i < 8; i++) {
        let div = document.createElement('div');
        hasLetters ? div.innerText = i + 1 : div.innerText = letters[letterCount];
        axis.appendChild(div);
        letterCount--;
    }

}

/**
 * mirror the board.
 */
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


/**
 * start dragging a piece. Applies classes.
 */
function dragStart() {
    this.classList = 'hold';
    document.querySelectorAll('.dragged').forEach(el => el.classList.remove('dragged'));
    this.classList.add('dragged');
    setTimeout(() => this.classList.add('invisible'), 0);
    let fieldId = this.parentElement.id;
    let currentField = getField(fieldId);
    let piece = currentField.piece;
    let color = getOppositeColor(currentField.piece.color);
    let legalFields = getMovesForPiece(currentField);
    console.log(checkForCheck(color));
    if (checkForCheck(color)) {
        legalFields = legalFields.filter(field => {
            updateField(currentField.id, field.id);
            let resolvesCheck = checkForCheck(color);
            const boardCopy = jsonCopy(boardHistory.pop());
            board = boardCopy;
            console.log(board);
            console.log(boardHistory);
            return !resolvesCheck;
        })

    }
    //make every legal move and check if check is given
    legalFields = legalFields.filter(field => {
        updateField(currentField.id, field.id);
        let createsCheck = checkForCheck(color);
        const boardCopy = jsonCopy(boardHistory.pop());
        board = boardCopy;
        console.log(board);
        console.log(boardHistory);
        return !createsCheck;
    });

    for (let field of legalFields) {
        if (field !== undefined) {
            setUpLegalFields(field, piece);
        }
    }

}

/**
 * applies listeners and classes to a field that is legal for the given piece.
 * @param legalField the field the piece is allowed to move on.
 */
function setUpLegalFields(legalField, piece) {
    let domField = document.getElementById(legalField.id);
    if (containsPiece(legalField)) {
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

    let interval = setInterval(function () {
        if (pieceWasPicked === true) {
            clearInterval(interval);
            createBoard();
        }
    }, 10);

}

/**
 * triggered when a piece is holding above a field.
 * @param event
 */
function dragOver(event) {
    event.preventDefault();
    this.classList.add('hovered');

}

/**
 * triggered when a piece enters a field while dragged.
 * @param event
 */
function dragEnter(event) {
    event.preventDefault();
    this.classList.add('hovered');

}

/**
 * triggered when a piece leaves a field while dragged.
 * @param event
 */
function dragLeave(event) {
    event.preventDefault();
    this.classList.remove('hovered');

}

/**
 * updates board after movement and test if a check is given.
 * @param oldfieldId old field of moved piece.
 * @param newFieldId field the piece moved to.
 */
function resolveDrop(oldFieldId, newFieldId) {
    updateField(oldFieldId, newFieldId);
    moveTracker.push([oldFieldId, newFieldId]);
}


/**
 * triggered when a piece was dropped on a field.
 */
async function dragDrop() {
    let draggedElement = document.querySelector('.dragged');
    let dropField = getField(this.id);
    let oldFieldId = draggedElement.parentElement.id;
    let oldField = getField(oldFieldId);
    let movedPiece = oldField.piece;
    if (movedPiece.type === 'pawn' && (dropField.y === 1 || dropField.y === 8)) {
        pieceWasPicked = false;
        await createPiecePicker(dropField, oldField, movedPiece.color);

    } else {
        movedPiece.moveNumber += 1;
        resolveDrop(oldFieldId, this.id);
        createBoard();
    }
}


/**
 * update piece movement in board.
 * @param oldFieldId the old field to delete piece from.
 * @param newFieldId the new field to set the piece on.
 */
function updateField(oldFieldId, newFieldId) {
    const boardCopy = jsonCopy(board);
    boardHistory.push(boardCopy);
    console.log(boardHistory);
    console.log(board);
    let newField = getField(newFieldId);
    let oldField = getField(oldFieldId);
    if (containsPiece(newField)) {
        let enemyPiece = newField.piece;
        board.graveyard.push(enemyPiece);
        newField.piece = null;
    }
    let piece = getPiece(oldField);
    oldField.piece = null;
    newField.piece = piece;
    console.log(board);

}


function jsonCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * iterates over the given direction and returns legal fields.
 * @param startField the field to start from.
 * @param depth the amount of tiles to scan.
 * @param movingType straight or diagonal.
 * @param capturePeace if true a discovered enemy piece is marked as captureable.
 * @returns {[fields]} all legal fields for the given piece.
 */
function getLegalMoves(startField, depth, movingType, capturePeace) {
    let fields = [];
    for (let offSet in movingType) {
        let offSetXY = movingType[offSet];
        fields.push(...getMovement(startField, depth, offSetXY[0], offSetXY[1], capturePeace));
    }
    return fields
}


/**
 * walks all fields in given depth in the given directions until a friendly or an enemy piece is discovered or if
 * end of field is reached. Returns all collected fields.
 * @param startField the field to start from
 * @param depth the amount of tiles to walk into a certain direction.
 * @param offsetX direction x.
 * @param offSetY direction y.
 * @param capturePeace if true a discovered enemy piece is marked as captureable.
 * @returns {[]} all legal fields.
 */
function getMovement(startField, depth, offsetX, offSetY, capturePeace) {

    let fields = [];
    let containsPieceOrIsInvalid = false;
    for (let i = 1; i <= depth; i++) {
        if (!containsPieceOrIsInvalid) {
            let nextField = getFieldByXY(startField.x + offsetX * i, startField.y + offSetY * i);
            if (nextField === undefined) {
                containsPieceOrIsInvalid = true;
            } else if (containsPiece(nextField)) {
                let nextFieldPiece = nextField.piece;
                if (nextFieldPiece.color !== startField.piece.color && capturePeace) {
                    fields.push(jsonCopy(nextField));
                }
                containsPieceOrIsInvalid = true;
                return fields;
            } else {
                fields.push(jsonCopy(nextField));
            }
        }
    }
    return fields;
}


/**
 * checks if the field is in range of an enemy piece.
 * @param fieldToCheck the field the king wants to move on.
 * @param color opposite color of current piece.
 * @returns {boolean} true if an enemy piece controls the field.
 */
function fieldHasCheck(fieldToCheck, color) {
    let enemyFields = getAllFieldsWithPiecesByColor(color);
    //schließt felder mit eigenen Figuren aus. Deckung wird nicht erkannt.
    let allLegalMoves = getLegalMovesForAllPieces(enemyFields);
    for (let field of allLegalMoves) {
        if (field === fieldToCheck) {
            return true;
        }
    }
    return false;
}

/**
 * get all legal moves for all pieces currently on board.
 * @param fields fields with piece
 /**s.
 * @returns {[]} all legal moves for all pieces currently on board.
 */
function getLegalMovesForAllPieces(fields) {
    let allLegalMoves = [];
    for (let enemyField of fields) {
        if (enemyField.piece.type === 'king') {
            const {diagonal} = directions;
            const {straight} = directions;
            allLegalMoves.push(...getLegalMoves(enemyField, 1, diagonal, true))
            allLegalMoves.push(...getLegalMoves(enemyField, 1, straight, true))
        } else {
            allLegalMoves.push(...getMovesForPiece(enemyField));
        }
    }
    return allLegalMoves;
}

/**
 * check if a check is given.
 * @param color the color to check if it is in check.
 * @returns {boolean} true if color has a current check.
 */
function checkForCheck(color) {
    let allFieldsWithColor = getAllFieldsWithPiecesByColor(color);
    allFieldsWithColor.filter(field => field.piece.type !== 'king');
    let legalMoves = getLegalMovesForAllPieces(allFieldsWithColor);
    let containsKing = legalMoves.filter(field => {
        if (containsPiece(field)) {
            return field.piece.type === 'king';
        }
    });
    return containsKing.length > 0;
}

/**
 * get all fields containing pieces by given color.
 * @param color the color to get all pieces from.
 * @returns {fields} all fields with pieces.
 */
function getAllFieldsWithPiecesByColor(color) {
    return Array.from(board.fields).reduce((total, field) => {
        if (containsPiece(field) && field.piece.color === color) {
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
    let vectors = [[2, -1], [2, 1], [-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [-2, -1]];

    for (let vector of vectors) {
        let nextField = getFieldByXY(field.x + vector[0], field.y + vector[1]);
        if (nextField === undefined || containsPiece(nextField)) {
            if (nextField !== undefined && nextField.piece.color !== field.piece.color) {
                legalFields.push(jsonCopy(nextField));
            }
        } else {
            legalFields.push(jsonCopy(nextField));
        }
    }
    return legalFields;
}

function getPawnMoves(field) {
    let legalMoves = [];
    let color = field.piece.color;
    let yOffset = color === 'black' ? -1 : 1;
    const {straight} = directions;

    if (field.y === 2 || field.y === 7) {
        legalMoves.push(...getLegalMoves(field, 2, straight, false));

    } else {
        legalMoves.push(...getLegalMoves(field, 1, straight, false));
    }
    let fieldUpRight = getFieldByXY(field.x + 1, field.y + yOffset);
    let fieldUpLeft = getFieldByXY(field.x - 1, field.y + yOffset);

    if (fieldUpRight !== undefined && containsPiece(fieldUpRight) && fieldUpRight.piece.color !== color) {

        legalMoves.push(jsonCopy(fieldUpRight));

    }
    if (fieldUpLeft !== undefined && containsPiece(fieldUpLeft) && fieldUpLeft.piece.color !== color) {

        legalMoves.push(jsonCopy(fieldUpLeft));

    }

    //filter behind pawn according to color.
    let filteredMoves = legalMoves.filter(legalField => {
        return color === 'black' ? legalField.y < field.y : legalField.y > field.y;
    });
    console.log(filteredMoves);

    //let filterMoves = function (legalField) {};
    let fieldRight = getFieldByXY(field.x + 1, field.y);
    let fieldLeft = getFieldByXY(field.x - 1, field.y);
    getEnPassant(fieldRight, field, fieldUpRight, filteredMoves);
    getEnPassant(fieldLeft, field, fieldUpLeft, filteredMoves);

    return filteredMoves;
}

async function createPiecePicker(dropField, oldField, color) {
    let pieceMap = piecePicker(color);
    let container = document.createElement('div');
    let contentDiv = document.getElementById('board-div');
    container.id = 'piece-picker-box';
    container.style.gridArea = 1 + "/" + dropField.x + "/" + 5;

    for (let [pieceType, piece]  of pieceMap) {
        if (piece.hasOwnProperty('svg')) {
            let newField = new Field(piece, dropField.id, dropField.x, dropField.y);
            let pieceBox = document.createElement('div');
            let imgDiv = createImgFromField(newField, true);
            pieceBox.appendChild(imgDiv);
            pieceBox.setAttribute('piece', pieceType);
            pieceBox.addEventListener('click', function () {
                oldField.piece = pieceMap.get(this.getAttribute('piece'));
                pieceWasPicked = true;
                resolveDrop(oldField.id, dropField.id);
            });
            pieceBox.classList.add('piece-in-piece-picker');
            container.appendChild(pieceBox);
        }
    }
    contentDiv.append(container);
    let promise = await waitForPiecePicked();
}

async function waitForPiecePicked() {
    return new Promise(resolve => {
        let timer = setInterval(function () {
            if (pieceWasPicked === true) {
                clearInterval(timer);
                resolve();
            }
        }, 20);
    });
}


function piecePicked() {
    pieceWasPicked = true;
}

/**
 * check if en passant is valid and add according move.
 * @param enemyField the field to the left or righ.
 * @param currentField field of current pawn.
 * @param captureMoveField Field to move to when capturing.
 * @param legalMoves current legal moves to add en passant field to.
 */
function getEnPassant(enemyField, currentField, captureMoveField, legalMoves) {
    let lastMove = moveTracker[moveTracker.length - 1];
    if (enemyField !== undefined && lastMove !== undefined) {
        let piece = enemyField.piece;
        if (piece !== null) {

            //let fieldRight = getFieldByXY(field.x + 1, field.y);
            if (piece.type === 'pawn' && piece.moveNumber === 1 && piece.color !== currentField.piece.color
                && lastMove[1] === enemyField.id && (enemyField.y === 4 || enemyField.y === 5)) {
                let domField = document.getElementById(captureMoveField.id);
                // class captureMove
                domField.classList.add('take');
                let enemeyDomField = document.getElementById(enemyField.id);
                // class pieceBeingCaptured
                enemeyDomField.classList.add('take');
                legalMoves.push(captureMoveField);
                domField.removeEventListener('drop', dragDrop);
                domField.addEventListener('drop', function () {
                    executeEnpassant(enemyField, currentField, captureMoveField)
                });
            }
        }
    }
}

function executeEnpassant(enemyField, currentField, captureMoveField) {

    let movedPiece = getField(currentField.id).piece;
    movedPiece.moveNumber += 1;
    captureMoveField.piece = movedPiece;
    let captureField = getField(enemyField.id);
    currentField.piece = null;
    board.graveyard.push(captureField.piece);
    captureField.piece = null;
    resolveDrop(currentField.id, captureMoveField.id);
    createBoard();

}

function castleRight(kingField) {
    let rookField = getFieldByXY(kingField.x + 3, kingField.y);
    getField(kingField.id).piece.moveNumber += 1;
    let rookTargetField = getFieldByXY(kingField.x + 1, kingField.y);

    rookTargetField.piece = rookField.piece;
    rookField.piece = null;
    let moveTargetKing = getFieldByXY(kingField.x + 2, kingField.y);

    resolveDrop(kingField.id, moveTargetKing.id);
    createBoard();

}

function castleLeft(kingField) {
    let rookField = getFieldByXY(kingField.x - 4, kingField.y);
    getField(kingField.id).piece.moveNumber += 1;
    let rookTargetField = getFieldByXY(kingField.x - 1, kingField.y);

    rookTargetField.piece = rookField.piece;
    rookField.piece = null;
    let moveTargetKing = getFieldByXY(kingField.x - 2, kingField.y);

    resolveDrop(kingField.id, moveTargetKing.id);
    createBoard();
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

function getKingMoves(currentField) {
    const {straight} = directions;
    const {diagonal} = directions;
    let color = currentField.piece.color === 'white' ? "black" : "white";
    let legalMoves = [];
    legalMoves.push(...getLegalMoves(currentField, 1, straight, true));
    legalMoves.push(...getLegalMoves(currentField, 1, diagonal, true));
    if (currentField.piece.moveNumber === 0) {
        legalMoves.push(...checkForCastle(currentField));
    }

    let withoutCheck = legalMoves.filter(field => !fieldHasCheck(field, color));

    //filter moves with covered enemy pieces on it.
    return withoutCheck.filter(field => {
        updateField(currentField.id, field.id);
        let hasCheck = checkForCheck(color);
        const boardCopy = jsonCopy(boardHistory.pop());
        board = boardCopy;
        return !hasCheck;
    });

}

/**
 * checks if castling is possbile and if so sets up event listeners on the fields and returns them as legal moves.
 * @param kingField the field the king is on.
 * @returns {[]} legalMoves
 */
function checkForCastle(kingField) {


    let legalMoves = [];
    let color = getOppositeColor(kingField.piece.color);
    let rookRight = getFieldByXY(kingField.x - 4, kingField.y).piece;
    let rookLeft = getFieldByXY(kingField.x + 3, kingField.y).piece;

    let fieldRightX1 = getFieldByXY(kingField.x + 1, kingField.y);
    let fieldRightX2 = getFieldByXY(kingField.x + 2, kingField.y);
    let fieldLeftX1 = getFieldByXY(kingField.x - 1, kingField.y);
    let fieldLeftX2 = getFieldByXY(kingField.x - 2, kingField.y);
    let fieldLeftX3 = getFieldByXY(kingField.x - 3, kingField.y);

    if (!containsPiece(fieldRightX1) && !containsPiece(fieldRightX2) && rookRight.moveNumber === 0 && !fieldHasCheck(fieldRightX1, color)
        && !fieldHasCheck(fieldRightX2, color)) {
        document.getElementById(fieldRightX2.id).addEventListener('drop', function () {
            castleRight(kingField);
        });
        legalMoves.push(jsonCopy(fieldRightX2));
    }
    if (!containsPiece(fieldLeftX1) && !containsPiece(fieldLeftX2) && !containsPiece(fieldLeftX3) && rookLeft.moveNumber === 0
        && !fieldHasCheck(fieldLeftX1, color) && !fieldHasCheck(fieldLeftX2, color) && !fieldHasCheck(fieldLeftX3, color)) {
        document.getElementById(fieldLeftX2.id).addEventListener('drop', function () {
            castleLeft(kingField);
        });
        legalMoves.push(jsonCopy(fieldLeftX2));
    }
    return legalMoves;
}

function displayNotation() {
    let details = document.getElementById('details');
    while (details.firstChild) {
        details.removeChild(details.firstChild);
    }
    let notationDiv = document.createElement('div');
    notationDiv.id = 'notationDiv';
    let table = document.createElement('table');
    let blackTh = document.createElement('th');
    blackTh.innerText = "Black";
    let whiteTh = document.createElement('th');
    whiteTh.innerText = 'White';
    let tr = document.createElement('tr');
    table.append(whiteTh, blackTh);
    let i = moveTracker.length < 15 ? 0 : 15;
    for (i; i < moveTracker.length; i++) {

        let td = document.createElement('td');
        td.innerText = moveTracker[i][1];
        if (i % 2 === 0) {
            tr = document.createElement('tr');
            tr.append(td);
        } else {
            tr.append(td);
        }
        table.append(tr);
    }
    notationDiv.append(table);
    details.append(notationDiv);
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
        case 'king':
            return getKingMoves(field);
        case 'knight':
            return getKnightMoves(field);
    }
}

/**
 * get field by fieldId
 * @param fieldId
 */
function getField(fieldId) {
    for (let field of board.fields) {
        if (field.id === fieldId) {
            return field;
        }
    }
}

/**
 * get piece from given field.
 * @param currentField
 * @returns {null|*|undefined}
 */
function getPiece(currentField) {
    for (let field of board.fields) {

        if (field.id === currentField.id) {
            return field.piece;
        }
    }
}

function getOppositeColor(color) {
    return color === 'white' ? 'black' : 'white';
}

/**
 * get field by x,y coordinates.
 * @param x
 * @param y
 */
function getFieldByXY(x, y) {
    for (let field of board.fields) {
        if (field.x === x && field.y === y) {
            return field;
        }
    }
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function containsPiece(field) {
    return field.piece !== null;
}

console.log("chess");

const unicodes = new Map();
unicodes.set('BK',  "\u{265A}");
unicodes.set('BQ',  "\u{265B}"); 
unicodes.set('BR',  "\u{265C}"); 
unicodes.set('BB',  "\u{265D}"); 
unicodes.set('BN',  "\u{265E}"); 
unicodes.set('BP',  "\u{265F}"); 
unicodes.set('WK',  "\u{2654}"); 
unicodes.set('WQ',  "\u{2655}"); 
unicodes.set('WR',  "\u{2656}"); 
unicodes.set('WB',  "\u{2657}"); 
unicodes.set('WN',  "\u{2658}"); 
unicodes.set('WP',  "\u{2659}"); 

const positions = new Map();
let moves = [];

class PiecePosition {
    constructor(piece, position) {
        this.piece = piece;
        this.position = position;
    }
}

class Position {
    constructor(letter, number) {
        this.key = letter + number;
        this.letter = letter;
        this.number = number;
    }

    static PositionInstance(positionLabel) {
        const letter = positionLabel.substring(0, 1);
        const number = positionLabel.substring(1);
        return new Position(letter, number);        
    }
}

class Piece {
    constructor(isWhite, label) {
        this.isWhite = isWhite;
        if(isWhite) {
            this.key = 'W' + label;
        } else {
            this.key = 'B' + label;
        }
    }
}

class Move {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

class Pawn extends Piece {
    constructor(isWhite) {
        super(isWhite, 'P');
    }

    isValidMove(from, to) {
        console.log(this, 'from', from, 'to', to);

        if(this.isWhite) {
            if(from.letter === to.letter) {
                // if pawn in initial position can move two squares
                if(from.number === 2 && to.number === 4) {
                    if(isPathClear(from, to, true)) {
                        return true;
                    }
                }

                // if any other position can move one square forward
                if(to.number - from.number === 1) {
                    if(isPathClear(from, to, true)) {
                        return true;
                    }
                }
            }

            if(this.isCapturingMove(from, to)) {
                return true;
            }

        } else {
            if(from.letter === to.letter) {
                // if pawn in initial position can move two squares
                if(from.number === 7 && to.number === 5) {
                    if(isPathClear(from, to, true)) {
                        return true;
                    }
                }

                // if any other position can move one square forward
                if(from.number - to.number === 1) {
                    if(isPathClear(from, to, true)) {
                        return true;
                    }
                }
            }

            if(this.isCapturingMove(from, to)) {
                return true;
            }
        }

        return false;
    }

    isCapturingMove(from, to, isAttackedTest) {
        if(this.isWhite) {
             // when captureing can move one squre diagonal
            if(Math.abs(from.letter.charCodeAt(0) - to.letter.charCodeAt(0)) === 1 && to.number - from.number === 1) {
                if(positions.get(to.key) && !positions.get(to.key).isWhite) {
                    return true;
                }

                //en passant
                let lastMove = moves[moves.length - 1];
                if(lastMove.to.piece instanceof Pawn && lastMove.to.position.number === from.number) {
                    if(lastMove.from.position.number - lastMove.to.position.number === 2) {
                        drawBox(document.getElementById("chessBoard").getContext("2d"), lastMove.to.position, null);
                        return true;
                    }
                }
            }
        } else {
            console.log("capturing move", from, to);
            // when captureing can move one squre diagonal
            if(Math.abs(from.letter.charCodeAt(0) - to.letter.charCodeAt(0)) === 1 && from.number - to.number === 1) {
                if((positions.get(to.key) && positions.get(to.key).isWhite) || isAttackedTest) {
                    return true;
                }

                //en passant
                let lastMove = moves[moves.length-1];
                if(lastMove.to.piece instanceof Pawn && lastMove.to.position.number === from.number) {
                    if(lastMove.to.position.number - lastMove.from.position.number === 2) {
                        drawBox(document.getElementById("chessBoard").getContext("2d"), lastMove.to.position, null);
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
 
function isPathClear(from, to, isPawn) {
    // if from and to in same column (same letter)
    if(from.letter === to.letter) {
        const numberOfSquaresToCheck = Math.abs(to.number - from.number) - 1;

        for (let i = 1; i <= numberOfSquaresToCheck; i++) {
            if(from.number < to.number) {
                if(positions.get(`${from.letter}${from.number + i}`) != null) {
                    return false;
                }
            } else {
                if(positions.get(`${from.letter}${from.number - i}`) != null) {
                    return false;
                } 
            }
        }

        if(isPawn) {
            if(positions.get(`${to.letter}${to.number}`) != null) {
                return false;
            }
        }
        
    }

    // check path clear in the diagonal
    if(Math.abs(from.letter.charCodeAt(0) - to.letter.charCodeAt(0)) ===  Math.abs(from.number - to.number)) {
        const numberOfSquaresToCheck = Math.abs(to.number - from.number) - 1;
        console.log(numberOfSquaresToCheck);
        for (let i = 1; i <= numberOfSquaresToCheck; i++) {
            if(from.number < to.number) {
                if(from.letter.charCodeAt(0) < to.letter.charCodeAt(0)) {
                    if(positions.get(`${String.fromCharCode(from.letter.charCodeAt(0) + i)}${from.number + i}`) != null) {
                        return false;
                    }
                } else {
                    if(positions.get(`${String.fromCharCode(from.letter.charCodeAt(0) - i)}${from.number + i}`) != null) {
                        return false;
                    }
                }                
            } else {
                if(from.letter.charCodeAt(0) < to.letter.charCodeAt(0)) {
                    if(positions.get(`${String.fromCharCode(from.letter.charCodeAt(0) + i)}${from.number - i}`) != null) {
                        return false;
                    }
                } else {
                    if(positions.get(`${String.fromCharCode(from.letter.charCodeAt(0) - i)}${from.number - i}`) != null) {
                        return false;
                    }
                }
            }
        }
    }

    // check path claer in the row or column
    if(Math.abs(from.letter === to.letter)) {
        const numberOfSquaresToCheck = Math.abs(to.number - from.number) - 1;
        for (let i = 1; i <= numberOfSquaresToCheck; i++) {
            if(from.number < to.number) {
                if(positions.get(`${from.letter}${from.number + i}`) != null) {
                    return false;
                }
            } else {
                if(positions.get(`${from.letter}${from.number - i}`) != null) {
                    return false;
                }
            }
        }
    }

    if(Math.abs(from.number === to.number)) {
        const numberOfSquaresToCheck = Math.abs(to.letter.charCodeAt(0) - from.letter.charCodeAt(0)) - 1;
        for (let i = 1; i <= numberOfSquaresToCheck; i++) {
            if(from.letter.charCodeAt(0) < to.letter.charCodeAt(0)) {
                if(positions.get(`${String.fromCharCode(from.letter.charCodeAt(0) + i)}${from.number}`) != null) {
                    return false;
                }
            } else {
                if(positions.get(`${String.fromCharCode(from.letter.charCodeAt(0) - i)}${from.number}`) != null) {
                    return false;
                }
            }
        }
    }

    return true;
}

class Bishop extends Piece {
    constructor(isWhite) {
        super(isWhite, 'B');
    }

    isValidMove(from, to) {
        //check if destination is in the diagonal
        if(Math.abs(from.letter.charCodeAt(0) - to.letter.charCodeAt(0)) ===  Math.abs(from.number - to.number)) {
            // check if destination is valid
            if(isDestinationValid(this, to)) {
                // check if path is clear
                if(isPathClear(from, to, false)) {
                    return true;
                }
            }
        }
        return false;
    }
}

class Knight extends Piece {
    constructor(isWhite) {
        super(isWhite, 'N');
    }

    isValidMove(from, to) {
        //when to location is one left or one right file
        if(Math.abs(from.letter.charCodeAt(0) - to.letter.charCodeAt(0)) === 1) {
            if(Math.abs(from.number - to.number) === 2) {
                if(isDestinationValid(this, to)) {
                    return true;
                }
            }
        }

        if(Math.abs(from.letter.charCodeAt(0) - to.letter.charCodeAt(0)) === 2) {
            if(Math.abs(from.number - to.number) === 1) {
                if(isDestinationValid(this, to)) {
                    return true;
                }
            }
        }
        return false;
    }
}

// Check if it is legal to move the piece to the destination
// Not to used with Pawns
function isDestinationValid(piece, to) {
    if(positions.get(to.key) == null) {
        return true;
    }
    if(positions.get(to.key).isWhite !== piece.isWhite) {
        return true;
    }
    return false;
}

class Rook extends Piece {
    constructor(isWhite) {
        super(isWhite, 'R');
    }

    isValidMove(from, to) {
        //check if destination is in the row or column
        if(from.letter === to.letter || from.number === to.number) {
            // check if destination is valid
            if(isDestinationValid(this, to)) {
                // check if path is clear
                if(isPathClear(from, to, false)) {
                    return true;
                }
            }
        }
        return false;
    }
}

class Queen extends Piece {
    constructor(isWhite) {
        super(isWhite, 'Q');
    }

    isValidMove(from, to) {
        //check if destination is in the row or column
        if(from.letter === to.letter || from.number === to.number) {
            // check if destination is valid
            if(isDestinationValid(this, to)) {
                // check if path is clear
                if(isPathClear(from, to, false)) {
                    return true;
                }
            }
        }

        //check if destination is in the diagonal
        if(Math.abs(from.letter.charCodeAt(0) - to.letter.charCodeAt(0)) ===  Math.abs(from.number - to.number)) {
            // check if destination is valid
            if(isDestinationValid(this, to)) {
                // check if path is clear
                if(isPathClear(from, to, false)) {
                    return true;
                }
            }
        }
        return false;
    }
}

class King extends Piece {
    constructor(isWhite) {
        super(isWhite, 'K');
    }

    isValidMove(from, to) {

        if(Math.abs(from.letter.charCodeAt(0) - to.letter.charCodeAt(0)) > 1 || Math.abs(from.number - to.number) > 1) {
            return false;
        }

        //check if destination is in the row or column
        if(from.letter === to.letter || from.number === to.number) {
            // check if destination is valid
            if(isDestinationValid(this, to)) {
                // check if path is clear
                if(isPathClear(from, to, false)) {
                    if(!isAttacked(to, this.isWhite)) {
                        return true;
                    }
                }
            }
        }

        //check if destination is in the diagonal
        if(Math.abs(from.letter.charCodeAt(0) - to.letter.charCodeAt(0)) ===  Math.abs(from.number - to.number)) {
            // check if destination is valid
            if(isDestinationValid(this, to)) {
                // check if path is clear
                if(isPathClear(from, to, false)) {
                    if(!isAttacked(to, this.isWhite)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
}

function isAttacked(position, isWhite) {
    console.log("check is attacked", position, isWhite);
    for (const [positionLabel, piece] of positions.entries()) {
        if(!(piece instanceof Pawn) && piece.isWhite !== isWhite) {
            if(piece.isValidMove(Position.PositionInstance(positionLabel), position)) {
                console.log("\n\n is attacked !!!!!!!!")
                return true;
            }
        }

        if(piece instanceof Pawn && piece.isWhite !== isWhite) {
            console.log("check for attachk by pawn");
            if(piece.isCapturingMove(Position.PositionInstance(positionLabel), position, true)) {
                console.log("\n\n is attacked !!!!!!!!")
                return true;
            }
        }
    }
    return false;
}

function isStaleMate(moveByWhite) {
    let kingPosition
    if(moveByWhite) {
        for (const [positionLabel, piece] of positions.entries()) {
            if(piece instanceof King && !piece.isWhite) {
                kingPosition = Position.PositionInstance(positionLabel);
                break;
            }
        }
    } else {
        for (const [positionLabel, piece] of positions.entries()) {
            if(piece instanceof King && piece.isWhite) {
                kingPosition = Position.PositionInstance(positionLabel);
                break;
            }
        }
    }

    console.log("is stale mate", kingPosition, moveByWhite)

    // check move forward
    if(new King(!moveByWhite).isValidMove(kingPosition, new Position(kingPosition.letter, kingPosition.number + 1))) {
        console.log("1");
        return false;
    }

    // check move backwards
    if(new King(!moveByWhite).isValidMove(kingPosition, new Position(kingPosition.letter, kingPosition.number - 1))) {
        console.log("2");
        return false;
    }

    // check move left
    if(new King(!moveByWhite).isValidMove(kingPosition, new Position(String.fromCharCode(kingPosition.letter.charCodeAt(0) - 1), kingPosition.number))) {
        console.log("3");
        return false;
    }

    // check move right
    if(new King(!moveByWhite).isValidMove(kingPosition, new Position(String.fromCharCode(kingPosition.letter.charCodeAt(0) + 1), kingPosition.number))) {
        console.log("4");
        return false;
    }

    // check move up right
    if(new King(!moveByWhite).isValidMove(kingPosition, new Position(String.fromCharCode(kingPosition.letter.charCodeAt(0) + 1), kingPosition.number + 1))) {
        console.log("5");
        return false;
    }

    // check move up left
    if(new King(!moveByWhite).isValidMove(kingPosition, new Position(String.fromCharCode(kingPosition.letter.charCodeAt(0) - 1), kingPosition.number + 1))) {
        console.log("6");
        return false;
    }

    // check move down right
    if(new King(!moveByWhite).isValidMove(kingPosition, new Position(String.fromCharCode(kingPosition.letter.charCodeAt(0) + 1), kingPosition.number - 1))) {
        console.log("7");
        return false;
    }

    // check move down left
    if(new King(!moveByWhite).isValidMove(kingPosition, new Position(String.fromCharCode(kingPosition.letter.charCodeAt(0) - 1), kingPosition.number - 1))) {
        console.log("8");
        return false;
    }

    console.log("end");

    return true;
}

function isCheckMate(moveByWhite) {
    console.log("check checkmate");
    let kingPosition
    if(moveByWhite) {
        for (const [positionLabel, piece] of positions.entries()) {
            if(piece instanceof King && !piece.isWhite) {
                console.log(positionLabel);
                kingPosition = Position.PositionInstance(positionLabel);
                break;
            }
        }
    } else {
        for (const [positionLabel, piece] of positions.entries()) {
            if(piece instanceof King && piece.isWhite) {
                console.log(positionLabel);
                kingPosition = Position.PositionInstance(positionLabel);
                break;
            }
        }
    }

    if(moveByWhite) {
        console.log("move by white", kingPosition);
        if(isAttacked(kingPosition, false) && isStaleMate(moveByWhite)) {
            return true;
        }
    } else {
        if(isAttacked(kingPosition, true) && isStaleMate(moveByWhite)) {
            return true;
        }
    }
    return false;
}

function drawBoard() {
    const c = document.getElementById("chessBoard");
    const ctx = c.getContext("2d");

    let from = null;

    c.addEventListener('click', function(event) { 
        const x = event.pageX - c.getBoundingClientRect().left;
        const y = event.pageY - c.getBoundingClientRect().top;

        let letter;
        let number;

        switch(true) {
            case x < 90:
                letter = 'a';
                break;
            case x < 180:
                letter = 'b';
                break;
            case x < 270:
                letter = 'c';
                break;
            case x < 360:
                letter = 'd';
                break;
            case x < 450:
                letter = 'e';
                break;
            case x < 540:
                letter = 'f';
                break;
            case x < 630:
                letter = 'g';
                break;
            case x < 720:
                letter = 'h';
                break;
        }

        switch(true) {
            case y > 630:
                number = 1;
                break;
            case y > 540:
                number = 2;
                break;
            case y > 450:
                number = 3;
                break;
            case y > 360:
                number = 4;
                break;
            case y > 270:
                number = 5;
                break;
            case y > 180:
                number = 6;
                break;
            case y > 90:
                number = 7;
                break;
            case y > 0:
                number = 8;
                break;
        }
        console.log("from", from);
        if(from === null && positions.get(letter + number)) {
            let position = new Position(letter, number);
            from = new PiecePosition(positions.get(letter + number), position);
        } else {
            if(from && from.piece.isValidMove(from.position, new Position(letter, number))) {
                drawBox(ctx, from.position, null);
                drawBox(ctx, new Position(letter, number), from.piece);
                moves.push(new Move(from, new PiecePosition(from.piece, new Position(letter, number))));

                // if(isStaleMate(from.piece.isWhite)) {
                //     alert("Draw by Stalemate");
                // }

                if(isCheckMate(from.piece.isWhite)) {
                   if(from.piece.isWhite) {
                       alert("White won by Checkmate");
                   } else {
                       alert("Black won by Checkmate");
                   }
                }
            }
            // when click on same piece two times, it remains as from value
            if(from && from.position.key !== new Position(letter, number).key) {
                from = null;
            }
        }

    }, false);

    resetBoard(ctx);
}

function drawBox(ctx, position, piece) {
    let x;
    switch(position.letter) {
        case 'a':
            x = 0;
            break;
        case 'b':
            x = 90;
            break;
        case 'c':
            x = 180;
            break;
        case 'd':
            x = 270;
            break;
        case 'e':
            x = 360;
            break;
        case 'f':
            x = 450;
            break;
        case 'g':
            x = 540;
            break;
        case 'h':
            x = 630;
            break;
    }

    const yIndex = position.number - 1;
    const xIndex = (720 - x)/90 - 1;

    y = position.number - 1;

    ctx.clearRect(x , 630 - y * 90, 90, 90);

    if(xIndex % 2 === 1) {
        if (yIndex % 2 === 0) {
            ctx.fillStyle = "green";
            ctx.fillRect(x , 630 - y * 90, 90, 90);
            ctx.stroke(); 
        } 
    } else {
        if (y % 2 === 1) {
            ctx.fillStyle = "green";
            ctx.fillRect(x, 630 - y * 90, 90, 90);
            ctx.stroke();
        } 
    }

    if(piece !== null) {
        positions.set(position.key, piece);
        ctx.font = "60px Serif";
        ctx.fillStyle = "black";
        ctx.fillText(unicodes.get(piece.key), x + 15, 720 - (y * 90) - 20);
    } else {
        positions.delete(position.key);
    }

}

function resetBoard(ctx) {
    for(let i = 0; i < 8; i++) {
        let x;
        switch(i) {
            case 0:
                x = 'a';
                break;
            case 1:
                x = 'b';
                break;
            case 2:
                x = 'c';
                break;
            case 3:
                x = 'd';
                break;
            case 4:
                x = 'e';
                break;
            case 5:
                x = 'f';
                break;
            case 6:
                x = 'g';
                break;
            case 7:
                x = 'h';
                break;
            default:
        }

        for (let j = 0; j < 8; j++) {
            drawBox(ctx, new Position(x, j + 1), null);
        }
    }

    drawBox(ctx, new Position('a', 1), new Rook(true));
    drawBox(ctx, new Position('b', 1), new Knight(true));
    drawBox(ctx, new Position('c', 1), new Bishop(true));
    drawBox(ctx, new Position('d', 1), new Queen(true));
    drawBox(ctx, new Position('e', 1), new King(true));
    drawBox(ctx, new Position('f', 1), new Bishop(true));
    drawBox(ctx, new Position('g', 1), new Knight(true));
    drawBox(ctx, new Position('h', 1), new Rook(true));
    drawBox(ctx, new Position('a', 2), new Pawn(true));
    drawBox(ctx, new Position('b', 2), new Pawn(true));
    drawBox(ctx, new Position('c', 2), new Pawn(true));
    drawBox(ctx, new Position('d', 2), new Pawn(true));
    drawBox(ctx, new Position('e', 2), new Pawn(true));
    drawBox(ctx, new Position('f', 2), new Pawn(true));
    drawBox(ctx, new Position('g', 2), new Pawn(true));
    drawBox(ctx, new Position('h', 2), new Pawn(true));

    drawBox(ctx, new Position('a', 8), new Rook(false));
    drawBox(ctx, new Position('b', 8), new Knight(false));
    drawBox(ctx, new Position('c', 8), new Bishop(false));
    drawBox(ctx, new Position('d', 8), new Queen(false));
    drawBox(ctx, new Position('e', 8), new King(false));
    drawBox(ctx, new Position('f', 8), new Bishop(false));
    drawBox(ctx, new Position('g', 8), new Knight(false));
    drawBox(ctx, new Position('h', 8), new Rook(false));
    drawBox(ctx, new Position('a', 7), new Pawn(false));
    drawBox(ctx, new Position('b', 7), new Pawn(false));
    drawBox(ctx, new Position('c', 7), new Pawn(false));
    drawBox(ctx, new Position('d', 7), new Pawn(false));
    drawBox(ctx, new Position('e', 7), new Pawn(false));
    drawBox(ctx, new Position('f', 7), new Pawn(false));
    drawBox(ctx, new Position('g', 7), new Pawn(false));
    drawBox(ctx, new Position('h', 7), new Pawn(false));
}
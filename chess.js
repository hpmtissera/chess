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

class Pawn extends Piece {
    constructor(isWhite) {
        super(isWhite, 'P');
    }

    isValidMove(from, to) {
        console.log('from', from, 'to', to);
        return true;
    }
}

class Bishop extends Piece {
    constructor(isWhite) {
        super(isWhite, 'B');
    }
}

class Knight extends Piece {
    constructor(isWhite) {
        super(isWhite, 'N');
    }
}

class Rook extends Piece {
    constructor(isWhite) {
        super(isWhite, 'R');
    }
}

class Queen extends Piece {
    constructor(isWhite) {
        super(isWhite, 'Q');
    }
}

class King extends Piece {
    constructor(isWhite) {
        super(isWhite, 'K');
    }
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

        if(from === null) {
            let position = new Position(letter, number);
            from = new PiecePosition(positions.get(letter + number), position);
            console.log('from', from);
        } else {
            console.log('to', letter + number, from.piece);
            console.log(from.position);
            // if(from.piece.isValidMove(from.position, new Position(letter, number))) {
                drawBox(ctx, from.position, null);
                drawBox(ctx, new Position(letter, number), from.piece);
                from = null;
            // }
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
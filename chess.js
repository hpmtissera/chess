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

function drawBoard() {
    const c = document.getElementById("chessBoard");
    const ctx = c.getContext("2d");

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

        console.log('click', positions.get(letter + number));

    }, false);

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
            drawBox(ctx, x, j + 1, null, null);
        }
    }

    drawBox(ctx, 'a', 1, 'WR');
    drawBox(ctx, 'b', 1, 'WN');
    drawBox(ctx, 'c', 1, 'WB');
    drawBox(ctx, 'd', 1, 'WQ');
    drawBox(ctx, 'e', 1, 'WK');
    drawBox(ctx, 'f', 1, 'WB');
    drawBox(ctx, 'g', 1, 'WN');
    drawBox(ctx, 'h', 1, 'WR');
    drawBox(ctx, 'a', 2, 'WP');
    drawBox(ctx, 'b', 2, 'WP');
    drawBox(ctx, 'c', 2, 'WP');
    drawBox(ctx, 'd', 2, 'WP');
    drawBox(ctx, 'e', 2, 'WP');
    drawBox(ctx, 'f', 2, 'WP');
    drawBox(ctx, 'g', 2, 'WP');
    drawBox(ctx, 'h', 2, 'WP');

    drawBox(ctx, 'a', 8, 'BR');
    drawBox(ctx, 'b', 8, 'BN');
    drawBox(ctx, 'c', 8, 'BB');
    drawBox(ctx, 'd', 8, 'BQ');
    drawBox(ctx, 'e', 8, 'BK');
    drawBox(ctx, 'f', 8, 'BB');
    drawBox(ctx, 'g', 8, 'BN');
    drawBox(ctx, 'h', 8, 'BR');
    drawBox(ctx, 'a', 7, 'BP');
    drawBox(ctx, 'b', 7, 'BP');
    drawBox(ctx, 'c', 7, 'BP');
    drawBox(ctx, 'd', 7, 'BP');
    drawBox(ctx, 'e', 7, 'BP');
    drawBox(ctx, 'f', 7, 'BP');
    drawBox(ctx, 'g', 7, 'BP');
    drawBox(ctx, 'h', 7, 'BP');

    console.log("filled");
}

function drawBox(ctx, letter, number, piece) {
    positions.set(letter + number, piece);
    let x;
    switch(letter) {
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

    const yIndex = number - 1;
    const xIndex = (720 - x)/90 - 1;

    y = number - 1;

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
        ctx.font = "60px Serif";
        ctx.fillStyle = "black";
        ctx.fillText(unicodes.get(piece), x + 15, 720 - (y * 90) - 20);
    }

}
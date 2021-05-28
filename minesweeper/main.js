let funny = false;

const load = () => {
    let flagCount = 0;
    let bigState = 0;
    let focus = 'none';
    let dead = false;
    let mines = new Array(30*16);
    let flags = new Array(30*16);
    let failPos = { x: 0, y: 0 };

    const canvas = document.querySelector('canvas#canvas');
    const ctx = canvas.getContext('2d');

    const mouse = {
        x: 0,
        y: 0,
        down: false
    };

    const sounds = {
        fart: new Audio(),
        unfart: new Audio(),
        doink: new Audio(),
        undoink: new Audio()
    }
    sounds.fart.src = 'https://pipe.miroware.io/5b52ba1d94357d5d623f74aa/minesweeper/sounds/fart.mp3';
    sounds.unfart.src = 'https://pipe.miroware.io/5b52ba1d94357d5d623f74aa/minesweeper/sounds/unfart.mp3';
    sounds.doink.src = 'https://pipe.miroware.io/5b52ba1d94357d5d623f74aa/minesweeper/sounds/doink.mp3';
    sounds.undoink.src = 'https://pipe.miroware.io/5b52ba1d94357d5d623f74aa/minesweeper/sounds/undoink.mp3';

    const images = {
        bg: new Image(),
        tiles: {},
        heads: {},
        numbers: {
            m: new Image()
        }
    }

    const img = (str) => {
        return './images/' + str + '.png';
    }

    // Images...
    {
        // Single loading
        images.bg.src = img('background');
        images.bg.onload = () => {
            draw();
        }

        images.numbers.m.src = img('number_minus');
        
        // Load numbers
        for (let i = 0; i <= 9; i++) {
            images.numbers[i] = new Image();
            images.numbers[i].src = img('number_'+i);
        }

        // Other tiles
        ['default', 'down', 'flag', 'mine', 'mine_flag', 'mine_hit'].forEach(item => {
            images.tiles[item] = new Image();
            images.tiles[item].src = img('tile_'+item);
        });

        // Heads
        ['default', 'down', 'fear', 'dead'].forEach(item => {
            images.heads[item] = new Image();
            images.heads[item].src = img('big_'+item);
        });
    }

    const newGame = () => {
        mines = new Array(30*16);
        flags = new Array(30*16);
        flagCount = 0;
        bigState = 0;
        dead = false;
    }

    const draw = () => {
        // Draw background
        ctx.drawImage(images.bg, 0, 0);

        let flagStr = `${99 - flagCount}`;
        while (flagStr.length < 3) {
            flagStr = '0'+flagStr;
        }

        if (flagStr.includes('-')) {
            flagStr = 'm' + flagStr.replace('-', '');
        }

        // Draw number of mines left
        // First number
        if (flagStr[0] !== '0') {
            ctx.drawImage(images.numbers.m, 36, 34);
        }
        // Second number
        ctx.drawImage(images.numbers[flagStr[flagStr.length - 2]], 62, 34);
        // Third number
        ctx.drawImage(images.numbers[flagStr[flagStr.length - 1]], 88, 34);

        /*
        ctx.fillStyle = '#f005';
        ctx.fillRect(24, 110, 960, 512);*/

        const pos = getPosition();

        if (!dead && focus === 'mines' && (pos.x >= 0 && pos.x < 30) && (pos.y >= 0 && pos.y < 16)) {
            ctx.drawImage(images.tiles.down, 24 + pos.x * 32, 110 + pos.y * 32);
        }

        switch (bigState) {
            case 0:
                ctx.drawImage(images.heads.default, 478, 30);
                break;
            case 1:
                ctx.drawImage(images.heads.down, 478, 30);
                break;
            case 2:
                ctx.drawImage(images.heads.fear, 478, 30);
                break; 
        }

        if (dead && bigState !== 1) {
            ctx.drawImage(images.heads.dead, 478, 30);
        }

        let row = -1;
        for (let i = 0; i < 30*16; i++) {
            const column = i % 30;
            if (column === 0) row++;

            if (flags[i]) {
                ctx.drawImage(images.tiles.flag, 24 + column * 32, 110 + row * 32);
            }
            
            if (dead) {
                if (mines[i]) {
                    ctx.drawImage(images.tiles.mine, 24 + column * 32, 110 + row * 32);
                }
                if (mines[i] && flags[i]) {
                    ctx.drawImage(images.tiles.mine_flag, 24 + column * 32, 110 + row * 32);
                }
            }
        }

        if (dead) {
            ctx.drawImage(images.tiles.mine_hit, 24 + failPos.x * 32, 110 + failPos.y * 32);
        }
    }

    const bigCollision = () => {
        // 480, 32 to 527, 79
        return (mouse.x >= 480 && mouse.x <= 527) && (mouse.y >= 32 && mouse.y <= 79);
    }

    const minesCollision = () => {
        // 24, 110 to 983, 621
        return (mouse.x >= 24 && mouse.x <= 983) && (mouse.y >= 110 && mouse.y <= 621);
    }

    const getPosition = () => {
        return {
            x: Math.floor((mouse.x - 24) / 32),
            y: Math.floor((mouse.y - 110) / 32)
        };
    }

    const toggleFlag = (pos) => {
        const index = pos.y * 30 + pos.x;
        flags[index] = !flags[index];
        flagCount += 1 * (flags[index]*2-1);

        if (funny) {
            if (flags[index]) {
                sounds.doink.currentTime = 0;
                sounds.doink.play();
            } else {
                sounds.undoink.currentTime = 0;
                sounds.undoink.play();
            }
        }
    }

    const DIE = (pos) => {
        dead = true;

        const index = pos.y * 30 + pos.x;
        mines[index] = 1;

        let passes = 1;

        while (passes < 99) {
            const rand = Math.floor(Math.random() * 30*16);
            if (!mines[rand]) {
                mines[rand] = 1;
                passes++;
            }
        }

        failPos = pos;

        if (funny) {
            sounds.fart.currentTime = 0;
            sounds.fart.play();
        }
    }

    canvas.addEventListener('contextmenu', evt => {
        evt.preventDefault();
        return false;
    });

    canvas.addEventListener('mousedown', evt => {
        mouse.x = evt.offsetX;
        mouse.y = evt.offsetY;
        mouse.down = evt.which === 1;

        if (evt.which === 1) {
            if (bigCollision()) {
                bigState = 1;
                focus = 'big';
            }
        }

        if (!dead) {
            if (evt.which === 1) {
                if (minesCollision()) {
                    bigState = 2;
                    focus = 'mines';
                }
            } else if (evt.which === 3) {
                if (minesCollision()) {
                    toggleFlag(getPosition());
                }
            }
        }

        draw();
    });

    canvas.addEventListener('mouseup', evt => {
        mouse.x = evt.offsetX;
        mouse.y = evt.offsetY;
        mouse.down = false;

        if (focus === 'big') {
            if (evt.which === 1 && bigCollision()) {
                newGame();
                if (funny) {
                    sounds.unfart.currentTime = 0;
                    sounds.unfart.play();
                }
            }
            focus = 'none';
        } else if (focus === 'mines') {
            if (minesCollision()) {
                if (evt.which === 1) {
                    // Check if there's a flag there
                    const pos = getPosition();
                    if (!flags[pos.y * 30 + pos.x]) {
                        // GAME OVER!!!
                        DIE(pos);
                    }
                }
            }
            focus = 'none';
        }
        bigState = 0;

        draw();
    });

    canvas.addEventListener('mousemove', evt => {
        mouse.x = evt.offsetX;
        mouse.y = evt.offsetY;

        if (focus === 'big') {
            if (bigCollision()) {
                bigState = 1;
            } else {
                bigState = 0;
            }
        } else if (mouse.down) {
            bigState = 2;
        }

        draw();
    });

    draw();
}
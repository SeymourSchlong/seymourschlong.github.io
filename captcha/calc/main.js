/* ~~ CAPTCHA CARD CALCULATOR BY seymour schlong#3669 ~~ */

'use strict';

let type;

let xorVisible = false;
let holesVisible = true;
let mouseIsDragging = false;


const captchaValues = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?!';
const cards = [...new Array(3)].map(() => new Array(48).fill(0));
const isEdited = [...new Array(2)].map(() => new Array(48).fill(false));

// Initialize up here to remove flickering.
const img = new Image();
img.src = 'https://seymourschlong.github.io/images/captchacard.png';
img.onload = () => draw();

const updateValue = (name, value) => {
    document.getElementById(name).value = value;
}

const setOperation = (a) => {
    if (type !== a) {
        type = a;
        console.log(`Calculator set to ${a}!`);
    }

    document.getElementById('submit-and').disabled = type === 'and';
    document.getElementById('submit-or').disabled = type === 'or';
    if (xorVisible) document.getElementById('submit-xor').disabled = type === 'xor';
}

const getBinary = (a) => {
    let decNum;

    for (let i = 0; i < captchaValues.length; i++) {
        if (a === captchaValues[i]) {
            decNum = i;
            break;
        }
    }

    let nums = [32, 16, 8, 4, 2, 1];
    let newBinNum = [];

    for (let i = 0; i < nums.length; i++) {
        if (decNum >= nums[i]) {
            decNum -= nums[i];
            newBinNum.push(1);
        }
        else {
            newBinNum.push(0);
        }
    }
    return newBinNum;
}

const enableXOR = () => {
    xorVisible = true;

    // Add a break
    document.getElementById('operations').appendChild(document.createElement('br'));
    // Create a new button
    // <input name="submit" type="button" id="submit-and" value="&&"/>
    let newInput = document.createElement('input');
    newInput.className = 'submit operation';
    newInput.onclick = () => setOperation('xor');
    newInput.name = 'submit';
    newInput.type = 'button';
    newInput.id = 'submit-xor';
    newInput.value = '^^';
    document.getElementById('operations').appendChild(newInput);
}

const fillRects = (canvas, card) => {
    const ctx = canvas;
    let x;
    let y;
    let columnNum = -1;
    let rowNum = 0;

    for (let i = 0; i < 48; i++) {  
        rowNum = (i % 12);
        if (rowNum === 0) columnNum++;

        x = 21 + (columnNum * 20);
        y = 38 + (rowNum * 10);

        if (cards[card][i] === 0) {
            ctx.fillStyle = 'white';

            ctx.fillRect(x, y, 16, 5);
        }
    }
}

const draw = () => {
    for (let i = 0; i < cards.length; i++) {
        const canvas = document.getElementById(`canvas-${i}`);

        if (canvas.getContext) {
            const ctx = canvas.getContext('2d');
    
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            if (!holesVisible) {
                ctx.fillStyle = 'black';
    
                ctx.fillRect(21, 38, 76, 115);
            }
    
            if (!holesVisible) fillRects(ctx, i);
            // Draw the captcha card image.
            ctx.drawImage(img, 0, 0);
    
            if (holesVisible) fillRects(ctx, i);
        }
    }
}

const calculate = () => {
    if (!type) {
        alert('Please choose a calculation type!');
        return;
    }

    cards[2] = cards[2].map(type === 'or' ? (item, i) => cards[0][i] | cards[1][i] : (type === 'and' ? (item, i) => cards[0][i] & cards[1][i] : (item, i) => cards[0][i] ^ cards[1][i]));

    // Create the new CAPTCHA code...
    let binaryString = cards[2].join('');
    let binaryCharacters = binaryString.match(new RegExp(/.{1,6}/g));
    let newCaptchaArray = [];

    for (let i = 0; i < binaryCharacters.length; i++) {
        let char = binaryCharacters[i].split('').reverse();
        let finalNum = 0;

        for (let j = 0; j < char.length; j++) {
            char[j] *= Math.pow(2, j);
            finalNum += char[j];
        }
        newCaptchaArray.push(captchaValues[finalNum]);
    }

    updateValue('captcha-2', newCaptchaArray.join(''));

    console.log(cards[2]);

    draw();
}

const toggleVisibility = () => {
    console.log(`Hole visibility is turned ${holesVisible ? 'on' : 'off'}.`);

    holesVisible = !holesVisible;

    draw();
}

const reactReleased = () => {
    mouseIsDragging = false;
    for (let i = 0; i < 2; i++) {
        isEdited[i].fill(false);
    }
}

const reactPressed = (card, a, isDragging) => {
    mouseIsDragging = isDragging;

    if (!mouseIsDragging || !isEdited[card][a]) {
        isEdited[card][a] = true;

        if (cards[card][a] === 0) cards[card][a] = 1;
        else cards[card][a] = 0;

        // Create the new CAPTCHA code...
        let binaryString = cards[card].join('');
        let binaryCharacters = binaryString.match(new RegExp(/.{1,6}/g));
        let newCaptchaArray = '';

        for (let i = 0; i < binaryCharacters.length; i++) {
            let char = binaryCharacters[i].split('').reverse();
            let finalNum = 0;

            for (let j = 0; j < char.length; j++) {
                char[j] *= Math.pow(2, j);
                finalNum += char[j];
            }
            newCaptchaArray += captchaValues[finalNum];
        }

        if (!xorVisible && newCaptchaArray.toLowerCase().includes('xyzzy')) enableXOR();

        updateValue(`captcha-${card}`, newCaptchaArray);
    }

    draw();
}

const convertCaptcha = (card) => {
    let text = document.getElementById(`captcha-${card}`).value;

    // Remove any spaces or linebreaks
    text = text.replace(/\s/g, '');

    // If there are characters missing, add 0's.
    if (text.length < 8) {
        let difference = 8 - text.length;

        text += '0'.repeat(difference);

        updateValue(`captcha-${card}`, text);
    }

    cards[card] = [];

    let charArray = text.split('');
    for (const char of charArray) {
        if (captchaValues.includes(char)) {
            let binaryNumber = getBinary(char);

            for (let i = 0; i < 6; i++) {
                cards[card].push(binaryNumber[i]);
            }
        } else {
            alert(`Invalid character: ${char}`);
            return;
        }
    }
    
    console.log(charArray);

    if (!xorVisible && text.toLowerCase().includes('xyzzy')) enableXOR();

    draw();
}

const initialize = () => {
    let column = -1;
    let row = 0;

    for (let i = 0; i < 48; i++) {
        row = (i % 12);
        if (row === 0) column++;

        let x = (column * 20);
        let y = (row * 10);

        // First card's punch holes
        let newDiv1 = document.createElement('div');
        newDiv1.className = `card-hole card-punch-${i} slot-${i}`;
        newDiv1.ondragstart = () => reactPressed(0, i, true);
        newDiv1.ondragover = () => reactPressed(0, i, true);
        newDiv1.ondragend = () => reactReleased();
        newDiv1.onclick = () => reactPressed(0, i, false);
        newDiv1.style.marginLeft = `${x + 26}px`;
        newDiv1.style.marginTop = `${y + 43}px`;
        newDiv1.draggable = false;
        document.getElementsByClassName('card-container')[0].appendChild(newDiv1);
        
        // Second card's punch holes
        let newDiv2 = document.createElement('div');
        newDiv2.className = `card-hole card-punch-${i} slot-${i}`;
        newDiv2.ondragover = () => reactPressed(1, i, true);
        newDiv2.ondragend = () => reactReleased();
        newDiv2.onclick = () => reactPressed(1, i, false);
        newDiv2.style.marginLeft = `${x + 26}px`;
        newDiv2.style.marginTop = `${y + 43}px`;
        newDiv2.draggable = false;
        document.getElementsByClassName('card-container')[1].appendChild(newDiv2);
    }
    
    for (let i = 0; i < 2; i++) {
        document.querySelector(`#captcha-${i}`).addEventListener('keydown', evt => {
            if (evt.keyCode === 13) {
                evt.preventDefault();
                convertCaptcha(i);
            } else if (evt.keyCode === 32) {
                evt.preventDefault();
            }
        });
    }

    draw();
}

// Suck my fucking DICK, Leo!!!!
// zFVytxR2 ^^ TzdhVEyr
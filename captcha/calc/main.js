/* ~~~ CAPTCHA CARD CREATOR BY seymour schlong#3669 */

'use strict';

let xPos = 7;
let yPos = 7;

let type;

let xorVisible = false;
let holesVisible = true;

//const captchaValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '?', '!'];
const captchaValues = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?!';
const cards = [...new Array(3)].map(() => new Array(48).fill(0));

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
        const canvas = document.getElementById('canvas-' + i);

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
    if (type === undefined) {
        alert('Please choose a calculation type!');
        return;
    }

    cards[2] = type === 'or'
    ? cards[2].map((item, i) => cards[0][i] === 1 || cards[1][i] === 1 ? 1 : 0)
    : cards[2].map((item, i) => cards[0][i] === 1 && cards[1][i] === 1 ? (type === 'and' ? 1 : 0) : (type === 'and' ? 0 : 1));

    // Create the new CAPTCHA code...
    let binaryString = cards[2].join('');
    let binaryCharacters = binaryString.match(new RegExp('.{1,' + 6 + '}', 'g'));
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

const reactPressed = (card, a) => {
    if (cards[card][a] === 0) cards[card][a] = 1;
    else cards[card][a] = 0;

    // Create the new CAPTCHA code...
    let binaryString = cards[card].join('');
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

    updateValue('captcha-' + card, newCaptchaArray.join(''));

    draw();
}

const convertCaptcha = (card) => {
    let text = document.getElementById('captcha-' + card).value;

    // Remove any spaces or linebreaks
    text = text.replace(/\s/g, '');

    // If there are characters missing, add 0's.
    if (text.length < 8) {
        let difference = 8 - text.length;

        text += '0'.repeat(difference);

        updateValue('captcha-' + card, text);
    }

    cards[card] = [];

    let charArray = text.split('');
    let regex = /[a-z0-9!?]/i;
    for (const char of charArray) {
        if (regex.test(char)) {
            let binaryNumber = getBinary(char);

            for (let i = 0; i < 6; i++) {
                cards[card].push(binaryNumber[i]);
            }
        } else {
            alert('Invalid character: ' + char);
            return;
        }
    }
    
    console.log(charArray);

    if (!xorVisible && text.toLowerCase().includes('xyzzy')) enableXOR();

    draw();
}

const initialize = () => {
    enableXOR();
    let column = -1;
    let row = 0;

    for (let i = 0; i < 48; i++) {
        row = (i % 12);
        if (row === 0) column++;

        let x = (column * 20);
        let y = (row * 10);

        let newDiv1 = document.createElement('div');
        newDiv1.className = `card-hole card-punch-${i} slot-${i}`;
        newDiv1.onclick = () => reactPressed(0, i);
        newDiv1.style.marginLeft = `${xPos + 19 + x}px`;
        newDiv1.style.marginTop = `${yPos + 36 + y}px`;
        newDiv1.draggable = false;
        document.getElementsByClassName('card-container')[0].appendChild(newDiv1);
    }

    for (let i = 0; i < 48; i++) {
        row = (i % 12);
        if (row === 0) column++;

        let x = (column * 20);
        let y = (row * 10);

        let newDiv2 = document.createElement('div');
        newDiv2.className = `card-hole card-punch-${i} slot-${i}`;
        newDiv2.onclick = () => reactPressed(1, i);
        newDiv2.style.marginLeft = `${xPos + 19 + x - 80}px`;
        newDiv2.style.marginTop = `${yPos + 36 + y}px`;
        newDiv2.draggable = false;
        document.getElementsByClassName('card-container')[1].appendChild(newDiv2);
    }

    draw();
}
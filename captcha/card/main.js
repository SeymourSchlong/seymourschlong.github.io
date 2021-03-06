/* ~~~ CAPTCHA CARD CREATOR BY seymour schlong#3669 */

'use strict';

let xPos = 7;
let yPos = 7;

let holesVisible = true;

const captchaValues = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?!';
let cardValues = new Array(48).fill(0);

// Initialize up here to remove flickering.
const img = new Image();
img.src = 'https://seymourschlong.github.io/images/captchacard.png';
img.onload = () => draw();

const updateValue = (id, value) => {
    document.getElementById(id).value = value;
}

const fillRects = (canvas) => {
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

        if (cardValues[i] === 0) {
            ctx.fillStyle = 'white';

            ctx.fillRect(x, y, 16, 5);
        }
    }
}

const draw = () => {
    const canvas = document.getElementById('card');

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!holesVisible) {
            ctx.fillStyle = 'black';

            ctx.fillRect(21, 38, 76, 115);
        }

        if (!holesVisible) fillRects(ctx);
        // Draw the captcha card image.
        ctx.drawImage(img, 0, 0);

        if (holesVisible) fillRects(ctx);
    }
}

const reactPressed = (a) => {
    if (cardValues[a] === 0) cardValues[a] = 1;
    else cardValues[a] = 0;

    // Create the new CAPTCHA code...
    let binaryString = cardValues.join('');
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

    updateValue('captcha-code', newCaptchaArray.join(''));

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

        let newDiv = document.createElement('div');
        newDiv.className = 'card-hole slot-' + i;
        newDiv.onclick = () => reactPressed(i);
        newDiv.style.marginLeft = `${xPos + 19 + x}px`;
        newDiv.style.marginTop = `${yPos + 36 + y}px`;
        newDiv.style.width = '20px';
        newDiv.style.height = '10px';
        newDiv.draggable = false;
        document.getElementById('card-container').appendChild(newDiv);
    }

    draw();
}

const toggleVisibility = () => {
    console.log(`Hole visibility is turned ${holesVisible ? 'on' : 'off'}.`);

    holesVisible = !holesVisible;

    draw();
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

const convertCaptcha = () => {
    let text = document.getElementById('captcha-code').value;

    // Remove any spaces or linebreaks
    text = text.replace(/\s/g, '');

    // If there are characters missing, add 0's.
    if (text.length < 8) {
        let difference = 8 - text.length;

        text += '0'.repeat(difference);

        updateValue('captcha-code', text);
    }

    cardValues = [];

    let charArray = text.split('');
    console.log(charArray);
    for (const char of charArray) {
        if (captchaValues.includes(char)) {
            let binaryNumber = getBinary(char);

            for (let i = 0; i < 6; i++) {
                cardValues.push(binaryNumber[i]);
            }
        } else {
            alert(`Invalid character: ${char}`);
            return;
        }
    }

    console.log(cardValues);

    draw();
}
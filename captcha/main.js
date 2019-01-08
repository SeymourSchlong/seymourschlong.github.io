'use strict';

let xPos = 7;
let yPos = 7;

let holesVisible = false;

const captchaValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '?', '!'];
let cardValues = new Array(48);

for (let i = 0; i < cardValues.length; i++) cardValues[i] = 0;

function resetValues() {
    updateValue('captcha-code', '00000000');
}

function updateValue(id, value) {
    document.getElementById(id).value = value;
}

function isValidChar(str) {
    if (str.match(/[a-z]/i) || str.match(/[A-Z]/i) || str.match(/[0-9]/i) || str.match(/\!/i) || str.match(/\?/i)) return true;
    return false;
}

function initialize() {
    let column = -1;
    let row = 0;

    for (let i = 0; i < 48; i++) {
        row = (i % 12);
        if (i % 12 == 0) column++;

        let x = (column * 20);
        let y = (row * 10);

        let newDiv = document.createElement('div');
        newDiv.className = 'card-hole slot-' + i;
        newDiv.onclick = () => reactPressed(i);
        newDiv.style.marginLeft = `${xPos + 19 + x}px`;
        newDiv.style.marginTop = `${yPos + 36 + y}px`;
        newDiv.style.width = '20px';
        newDiv.style.height = '10px';
        document.getElementById('card-container').appendChild(newDiv);
    }

    resetValues();
    draw();
}

function toggleVisibility() {
    holesVisible = !holesVisible;

    console.log(`Hole visibility is turned ${holesVisible ? 'on' : 'off'}.`);

    draw();
}

function reactPressed(a) {
    if (cardValues[a] == 0) cardValues[a] = 1;
    else cardValues[a] = 0;

    // Create the new CAPTCHA code...
    let binaryString = cardValues.join('');
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

    updateValue('captcha-code', newCaptchaArray.join(''));

    draw();
}

function getBinary(a) {
    let decNum;

    for (let i = 0; i < captchaValues.length; i++) {
        if (a == captchaValues[i]) {
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

function convertCaptcha() {
    let text = document.getElementById('captcha-code').value;

    text = text.replace(/\s/g, '');

    if (text.length != 8) {
        alert(`Your CAPTCHA code is too ${8 - text.length > 0 ? 'short!\
        \nMake it longer by' : 'long! Make it shorter by'} ${Math.abs(8 - text.length)} character${Math.abs(8-text.length) === 1 ? '' : 's'}.`);
        return;
    }

    cardValues = [];

    let charArray = text.split('');
    console.log(charArray);

    for (const char of charArray) {
        if (isValidChar(char)) {
            let binaryNumber = getBinary(char);

            for (let i = 0; i < 6; i++) {
                cardValues.push(binaryNumber[i]);
            }
        } else {
            alert('Invalid character: ' + char);
            return;
        }
    }

    console.log(cardValues);

    draw();
}

function draw() {
    const canvas = document.getElementById('card');

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);  // .clearRect(x, y, w, h); -- Clears a rectangle

        // Draw the captcha card image.
        const img = new Image();

        img.src = './images/captchacard.png';

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            ctx.imageSmoothingEnabled = false;

            if (!holesVisible) fillRects(ctx);
        }

        if (holesVisible) fillRects(ctx);
    }
}

function fillRects(canvas) {
    const ctx = canvas;
    let x;
    let y;
    let columnNum = -1;
    let rowNum = 0;

    for (let i = 0; i < 48; i++) {  
        rowNum = (i % 12);
        if (i % 12 == 0) columnNum++;

        x = 21 + (columnNum * 20);
        y = 38 + (rowNum * 10);

        if (cardValues[i] == '0') {
            ctx.fillStyle = '#ffffff';      // .fillStyle = ''; -- Changes the colour. You can use (a)rgb, hex, or colour names

            ctx.fillRect(x, y, 16, 5); // .fillRect(x, y, w, h); -- Fills a rectange with a previously defined colour
        }/**/
    }
}
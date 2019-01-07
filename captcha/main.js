'use strict';

const captchaValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '?', '!'];
let cardValues = new Array(48);

for (let i = 0; i < cardValues.length; i++) cardValues[i] = 0;

function resetValues() {
    document.getElementById('decimal').textContent = 'abcdefgh';

    //document.getElementById('binary').textContent = `0000${'\n0000'.repeat(11)}`;
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

function getDecimalCode() {
    let text = document.getElementById('decimal').value;

    text = text.replace(/\s/g, '');

    if (text.length != 8) {
        alert(`Your captcha code is too ${8 - text.length > 0 ? 'short!\
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

    /*
    let binaryValues = [];

    let columnNum = -1;
    let rowNum = 0;
    
    for (let i = 0; i < 48; i++) {
        rowNum = (i % 12);
        if (i % 12 == 0) columnNum++;


    }/**/

    document.getElementById('binary').value = '';
    document.getElementById('binary').textContent = cardValues.join('');

    draw();
}

/*
function getBinaryCode() {
    let text = document.getElementById('binary').value;

    let Chars = text.split('');
    let char1, char2, char3, char4, char5, char6, char7, char8;

    for (let i = Chars.length; i > 0; i--) {
        if (Chars[i] == '\n' || Chars[i] == ' ') Chars.splice(i, 1);
    }
    
    if (Chars.length != 48) {
        alert('Something\'s not right in the binary...\nMake sure there are no missing or empty spaces!');
        return;
    }

    function bin(a) {
        let temp = '';
    
        while (a < Chars.length) {
            temp += Chars[a];
            if (temp.length == 6) break;
            a += 4;
        }
          
        console.log(temp);
        return temp;
    }
        
    function binDec(a) {
        let tempArr = a.split('');
        let binNum = tempArr.reverse();
        let decNum = 0;

        for (let i = 0; i < binNum.length; i++) {
            binNum[i] *= Math.pow(2, i);
            decNum += binNum[i];
        }
        return decNum;
    }
        
    function decCap(a) {
        return captchaValues[a];
    }
        
    char1 = decCap(binDec(bin(0)));
    char2 = decCap(binDec(bin(1)));
    char3 = decCap(binDec(bin(2)));
    char4 = decCap(binDec(bin(3)));
    char5 = decCap(binDec(bin(24)));
    char6 = decCap(binDec(bin(25)));
    char7 = decCap(binDec(bin(26)));
    char8 = decCap(binDec(bin(27)));

    let tempString = bin(0) + bin(1) + bin(2) + bin(3) + bin(4) + bin(5) + bin(6) + bin(7);

    cardValues = tempString.split('');

    document.getElementById('decimal').textContent = char1 + char2 + char3 + char4 + char5 + char6 + char7 + char8;

    draw();
}/**/

function isValidChar(str) {
    if (str.match(/[a-z]/i) || str.match(/[A-Z]/i) || str.match(/[0-9]/i) || str.match(/\!/i) || str.match(/\?/i)) return true;
    return false;
}

function copyBinary() {
    try {
        let text = document.getElementById('binary');

        text.select();

        document.execCommand('copy');

        alert('Copied to your clipboard!');
    } catch(err) {
        console.log(err);
        alert('Error copying binary...');
    }
    // Copy the binary format of the card to the user's clipboard
}

function copyDecimal() {
    try {
        let text = document.getElementById('decimal');

        text.select();

        document.execCommand('copy');

        alert('Copied to your clipboard!');
    } catch(err) {
        console.log(err);
        alert('Error copying binary...');
    }
    // Copy the binary format of the card to the user's clipboard
}

function draw() {
    const canvas = document.getElementById('card');

    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 148, 188);  // .clearRect(x, y, w, h); -- Clears a rectangle

        // Draw the captcha card image.
        const img = new Image();

        img.src = './images/captchacard.png';

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            ctx.imageSmoothingEnabled = false;

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
    }
}
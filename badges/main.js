const hexToDec = (h) => {
	h = h.replace('#', '');
	let red, green, blue, alpha;
	
	if (h.length <= 4) {
		red		= parseInt(h[0]+h[0], 16);
		green	= parseInt(h[1]+h[1], 16);
		blue	= parseInt(h[2]+h[2], 16);
		alpha	= h.length == 4 ? parseInt(h[3]+h[3], 16) : 'ff';
	} else {
		red		= parseInt(h[0]+h[1], 16);
		green	= parseInt(h[2]+h[3], 16);
		blue	= parseInt(h[4]+h[5], 16);
		alpha	= h.length == 8 ? parseInt(h[4]+h[5], 16) : 'ff';
	}

	return { r: red, g: green, b: blue, a: alpha };
}

class Gradient {
	list = [];
	border = '#ffffff';
	glow = '#000000';
	addColour(index, colour) {
		index = Math.round(index);
		this.list[index] = colour;
	}
	constructor(border, glow) {
		this.border = border;
		this.glow = glow;
	}
	fillGradient() {
		// Finds the next index with a colour entry.
		const findNextEntry = (startingFrom) => {
			for (let i = startingFrom; i < 256; i++) {
				if (this.list[i]) return i;
			}
		}

		for (let i = 0; i < 255; i++) {
			if (this.list[i]) {
				const next = findNextEntry(i+1);

				for (let j = i; j < next; j++) {
					const rightCoef = (j - i) / (next - i);
					const leftCoef  = 1 - rightCoef;

					this.list[j] = {
						r: this.list[i].r * leftCoef + this.list[next].r * rightCoef,
						g: this.list[i].g * leftCoef + this.list[next].g * rightCoef,
						b: this.list[i].b * leftCoef + this.list[next].b * rightCoef,
					};
				}
				i = next - 1;
			}
		}
	}
	get(i) {
		return this.list[i];
	}
}

const gold = new Gradient('#9d3801', '#FFFFD6');
gold.addColour(0.00 * 255,	hexToDec('551801'));
gold.addColour(0.29 * 255,	hexToDec('551801'));
gold.addColour(0.43 * 255,	hexToDec('b13600'));
gold.addColour(0.57 * 255,	hexToDec('c57100'));
gold.addColour(0.72 * 255,	hexToDec('eea604'));
gold.addColour(0.84 * 255,	hexToDec('fffd03'));
gold.addColour(1.00 * 255,	hexToDec('ffffba'));
gold.fillGradient();

const silver = new Gradient('#4b536e', '#F6FCF6');
silver.addColour(0.00 * 255,	hexToDec('2e3649'));
silver.addColour(0.27 * 255,	hexToDec('2e3649'));
silver.addColour(0.50 * 255,	hexToDec('617798'));
silver.addColour(0.66 * 255,	hexToDec('95a8bf'));
silver.addColour(0.74 * 255,	hexToDec('a8b8d0'));
silver.addColour(0.87 * 255,	hexToDec('d5f3f0'));
silver.addColour(1.00 * 255,	hexToDec('d6f6e8'));
silver.fillGradient();

const shineImageA = new Image();
const shineImageB = new Image();
shineImageA.src	= "./assets/images/shineA.png";
shineImageB.src	= "./assets/images/shineB.png";

const channels = 4;

let delay = 0;

const grayscaleHue = (gctx) => {
	const imageData = gctx.getImageData(0, 0, gctx.canvas.width, gctx.canvas.height);

	const rMult = 0.30;
	const gMult = 0.59;
	const bMult = 0.11;
	for (let i = 0; i < imageData.data.length; i += channels) {
		const r = i, g = i+1, b = i+2;
		const shade = Math.round(
			imageData.data[r] * rMult + 
			imageData.data[g] * gMult + 
			imageData.data[b] * bMult
		);

		imageData.data[r] = shade;
		imageData.data[g] = shade;
		imageData.data[b] = shade;
	}

	gctx.clearRect(0, 0, gctx.canvas.width, gctx.canvas.height);
	gctx.putImageData(imageData, 0, 0);
}
const grayscaleAverage = (gctx) => {
	const imageData = gctx.getImageData(0, 0, gctx.canvas.width, gctx.canvas.height);

	for (let i = 0; i < imageData.data.length; i += channels) {
		const r = i, g = i+1, b = i+2;
		const shade = Math.round((
			imageData.data[r] +
			imageData.data[g] +
			imageData.data[b]
		) / 3);

		imageData.data[r] = imageData.data[g] = imageData.data[b] = shade;
	}

	gctx.clearRect(0, 0, gctx.canvas.width, gctx.canvas.height);
	gctx.putImageData(imageData, 0, 0);
}
const brightenImage = (gctx, value) => {
	if (value == 1) return;

	const brightenedImage = document.createElement('canvas').getContext('2d');

	gctx.save();
	gctx.filter = `brightness(${value})`;
	brightenedImage.drawImage(gctx.canvas, 0, 0);
	gctx.filter = '';

	gctx.globalCompositeOperation = 'copy';
	gctx.drawImage(brightenedImage.canvas, 0, 0);
	gctx.restore();

	// const shade = value > 1 ? '#ffffff' : '#000000';

	// value = Math.round(Math.abs(value-1) * 255);

	// console.log(value);

	// gctx.save();
	// gctx.fillStyle = shade + value.toString(16).padStart(2, "0");

	// gctx.globalCompositeOperation = 'source-atop';
	// gctx.fillRect(0, 0, gctx.canvas.width, gctx.canvas.height);
	// gctx.globalCompositeOperation = 'source-over';
	// gctx.restore();
}
const applyGradientMap = (gctx, gradient) => {
	if (!gradient) return;

	const imageData = gctx.getImageData(0, 0, gctx.canvas.width, gctx.canvas.height);

	for (let i = 0; i < imageData.data.length; i += channels) {
		const r = i, g = i+1, b = i+2;
		const shade = imageData.data[r];

		const convertedHue = gradient.get(shade) ? gradient.get(shade) : 0;

		imageData.data[r] = convertedHue.r;
		imageData.data[g] = convertedHue.g;
		imageData.data[b] = convertedHue.b;
	}

	gctx.clearRect(0, 0, gctx.canvas.width, gctx.canvas.height);
	gctx.putImageData(imageData, 0, 0);
}
const outlineImage = (octx, colour = '#000000', size = 5, threshold = 0, softness = 1) => {
	const outCanvas = document.createElement('canvas');
	outCanvas.width = octx.canvas.width;
	outCanvas.height = octx.canvas.height;
	const outCtx = outCanvas.getContext('2d');

	outCtx.clearRect(0, 0, octx.canvas.width, octx.canvas.height);
	const outPixels = outCtx.getImageData(0, 0, outCanvas.width, outCanvas.height);
	const pixels = octx.getImageData(0, 0, octx.canvas.width, octx.canvas.height);

	const indexToCoord = (value, columns, rows = columns) => {
		return {
			x: value % columns,
			y: Math.floor(value / rows)
		}
	}
	const coordToIndex = (coord, columns) => {
		return coord.y * columns + coord.x;
	}
	const getValuesAt = (source, x, y) => {
		if (typeof x === typeof {}) {
			y = x.y;
			x = x.x;
		}

		const i = coordToIndex({ x: x, y: y }, octx.canvas.width) * channels;

		return {
			r: source.data[i],
			g: source.data[i+1],
			b: source.data[i+2],
			a: source.data[i+3]
		}
	}

	// iterate through each pixel
	for (let i = 0; i < pixels.data.length; i += channels) {
		const x = (i / channels) % octx.canvas.width;
		const y = Math.floor((i / channels) / octx.canvas.width);

		let highestValueFound = 0;

		const area = (size*2)*(size*2);

		for (let scanIndex = 0; scanIndex < area; scanIndex++) {
			if (highestValueFound === 255) break;

			const coord = indexToCoord(scanIndex, 5);
			coord.x -= 2;
			coord.y -= 2;
			const targetCoord = {
				x: coord.x + x,
				y: coord.y + y
			}
			// don't check pixels out of bounds
			if (targetCoord.x < 0 || targetCoord.x >= octx.canvas.width) continue;
			if (targetCoord.y < 0 || targetCoord.y >= octx.canvas.height) continue;

			// check only within a specific radius
			const hypotenuse = coord.x*coord.x + coord.y*coord.y;
			if (hypotenuse*hypotenuse <= size*size) {
				// get the checked value and store the highest one
				const values = getValuesAt(pixels, targetCoord.x, targetCoord.y);
				highestValueFound = Math.max(values.a, highestValueFound);
			}
		}

		if (highestValueFound > threshold) {
			for (let scanIndex = 0; scanIndex < area; scanIndex++) {
				const coord = indexToCoord(scanIndex, 5);
				coord.x -= 2;
				coord.y -= 2;
				const targetCoord = {
					x: coord.x + x,
					y: coord.y + y
				}
				if (targetCoord.x < 0 || targetCoord.x > outCanvas.width) continue;
				if (targetCoord.y < 0 || targetCoord.y > outCanvas.height) continue;

				const hypotenuse = coord.x*coord.x + coord.y*coord.y;

				if (hypotenuse*hypotenuse > size*size) continue;

				const index = coordToIndex(targetCoord, outCanvas.width) * channels;

				outPixels.data[index] = outPixels.data[index+1] = outPixels.data[index+2] = 255;
				outPixels.data[index+3] = Math.round(Math.min(outPixels.data[index+3]+ highestValueFound/softness, 255));
			}
		}
	}

	return outPixels;
}
const applyGlow = (gctx, colour = '#000000') => {
	const glowCanvas = document.createElement('canvas');
	glowCanvas.width = gctx.canvas.width;
	glowCanvas.height = gctx.canvas.height;
	const glowCtx = glowCanvas.getContext('2d');

	// draw a copy of canvas to glowcanvas

	glowCtx.drawImage(gctx.canvas, 0, 0);
	glowCtx.fillStyle = colour;

	// fill the canvas using EXCLUDE to fill everything but the image with glow colour
	glowCtx.globalCompositeOperation = 'source-out';
	glowCtx.fillRect(0, 0, glowCanvas.width, glowCanvas.height);
	glowCtx.globalCompositeOperation = 'source-over';

	// blur the image (somehow?)
	gctx.save();
	gctx.filter = 'blur(3px)';
	gctx.globalCompositeOperation = 'source-atop';
	gctx.drawImage(glowCanvas, 0, 0);
	gctx.globalCompositeOperation = 'source-over';
	gctx.filter = '';
	gctx.restore();
}

const drawWithSettings = (ctx, buffer, options) => {
	if (delay) {
		setTimeout(() => {
			delay--;
			drawWithSettings();
		}, 10);
	}

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	buffer.clearRect(0, 0, buffer.canvas.width, buffer.canvas.height);

	// Draw the original image
	// buffer.drawImage(OGimage, 20, 20, canvas.width - 40, canvas.height - 40);
	buffer.drawImage(options.image, 0, 0, ctx.canvas.width, ctx.canvas.height);

	// generate the 
	if (options.firstGeneration) {
		options.cached.colour.putImageData(outlineImage(buffer, '', 5, 0, options.softness), 0, 0);
		options.cached.white.putImageData(outlineImage(options.cached.colour, '', 5, 0, options.softness), 0, 0);
		options.firstGeneration = false;
	}

	// Apply Grayscale Filter
	if (options.gradient) {
		if (options.grayscale === 1) {
			grayscaleAverage(buffer);
		} else {
			grayscaleHue(buffer);
		}

		// Apply a slight brightness to the image (if necessary)
		brightenImage(buffer, options.brightness);
	
		// Draw the initial shine over (applied before gradient map)
		buffer.globalCompositeOperation = 'source-atop';
		buffer.drawImage(shineImageA, 0, 0);
		buffer.globalCompositeOperation = 'source-over';
		
		// Apply the supplied gradient map
		applyGradientMap(buffer, options.gradient);
		
		// Draw the second shine over (applied after gradient map)
		buffer.globalCompositeOperation = 'source-atop';
		buffer.drawImage(shineImageB, 0, 0);
		buffer.globalCompositeOperation = 'source-over';
		
		// Draw the glow effect around the image
		applyGlow(buffer, options.gradient.glow);
	}

	// Outline the image
	options.cached.colour.globalCompositeOperation = "source-in";
	options.cached.colour.fillStyle = options.gradient ? options.gradient.border : '#262626';
	options.cached.colour.fillRect(0, 0, options.cached.colour.canvas.width, options.cached.colour.canvas.height);
	options.cached.colour.globalCompositeOperation = "source-over";

	buffer.globalCompositeOperation = "destination-over";
	buffer.drawImage(options.cached.colour.canvas, 0, 0);
	buffer.drawImage(options.cached.white.canvas, 0, 0);
	buffer.globalCompositeOperation = "source-over";

	//outlineImage(buffer, options.gradient ? options.gradient.border : '#262626', 5, 0, options.softness);
	//outlineImage(buffer, '#ffffff', 5, 0, options.softness);

	ctx.drawImage(buffer.canvas, 0, 0);

	options.saveLink.href = ctx.canvas.toDataURL();
}

const load = () => {
	const mainContainer = document.querySelector('#list-of-badges');
	const uploadBox = document.querySelector('.upload-file');
	const uploadInput = document.querySelector('#upload');

	const createNewBadgeSettings = (image) => {
		const parent = document.createElement('div');
		parent.className = 'badge-container';

		const badgeCanvas = document.createElement('div');
		badgeCanvas.className = 'badge-canvas';

		const canvas = document.createElement('canvas');
		canvas.height = 128;
		canvas.width = 128;
		canvas.className = 'badge-image';

		const ctx = canvas.getContext('2d');
		
		const canvasBuffer = document.createElement('canvas');
		canvasBuffer.width = canvas.width;
		canvasBuffer.height = canvas.height;
		const ctxBuffer = canvasBuffer.getContext('2d');

		const outlineColour = document.createElement('canvas').getContext('2d');
		const outlineWhite = document.createElement('canvas').getContext('2d');

		badgeCanvas.appendChild(image);
		image.style = 'display: none';

		const badgeSettings = document.createElement('div');
		badgeSettings.className = 'badge-settings';
		
		const saveLink = document.createElement('a');
		const deleteButton = document.createElement('div');
		badgeCanvas.appendChild(saveLink);
		badgeCanvas.appendChild(deleteButton);

		parent.appendChild(badgeCanvas);
		badgeCanvas.appendChild(canvas);

		parent.appendChild(badgeSettings);

		mainContainer.appendChild(parent);

		const options = {
			image: image,
			brightness: 1,
			shine: true,
			softness: 2,
			position: { x: 0, y: 0 },
			size: { x: 128, y: 128},
			gradient: gold,
			grayscale: 0,
			saveLink: undefined,
			firstGeneration: true,
			cached: {
				colour: outlineColour,
				white: outlineWhite,
				glow: undefined
			}
		}

		// BADGE TYPE
		const typeLabel = document.createElement('label');
		typeLabel.textContent = 'Type: '
		const typeDropdown = document.createElement('select');
		typeLabel.appendChild(typeDropdown);
		badgeSettings.appendChild(typeLabel);

		['None', 'Silver', 'Gold'].forEach(entry => {
			const option = document.createElement('option');
			typeDropdown.appendChild(option);
			option.textContent = entry;
		});

		typeDropdown.selectedIndex = 2;
		

		// BRIGHTNESS SLIDER
		//const brightnessDiv = document.createElement('div');
		//brightnessDiv.textContent = 'Bright: ';
		const brightnessSlider = document.createElement('input');
		brightnessSlider.type = 'range';
		brightnessSlider.step = 1;
		brightnessSlider.min = 0;
		brightnessSlider.max = 200;
		brightnessSlider.value = 100;
		//brightnessDiv.appendChild(brightnessSlider);
		//badgeSettings.appendChild(brightnessDiv);
		badgeCanvas.appendChild(brightnessSlider);

		brightnessSlider.oninput = () => {
			options.brightness = brightnessSlider.value / 100;
			drawWithSettings(ctx, ctxBuffer, options);
		}
		

		typeDropdown.onchange = () => {
			options.gradient = [undefined, silver, gold][typeDropdown.selectedIndex];
			brightnessSlider.disabled = !typeDropdown.selectedIndex;

			drawWithSettings(ctx, ctxBuffer, options);
		}

		// SHINE APPLIED
		// const shineLabel = document.createElement('label');
		// shineLabel.textContent = 'Shine Applied: ';
		// const shineInput = document.createElement('input');
		// shineInput.type = 'checkbox';
		// shineInput.checked = true;
		// shineLabel.appendChild(shineInput);
		// badgeSettings.appendChild(shineLabel);

		// shineInput.onchange = () => {
		// 	options.shine = shineInput.checked;
		// 	drawWithSettings(ctx, ctxBuffer, options);
		// }
		
		// BORDER SOFTNESS



		// DELETE BUTTON
		deleteButton.className = 'delete-button';
		deleteButton.title = 'Delete';

		deleteButton.addEventListener('click', () => {
			parent.parentNode.removeChild(parent);
		});

		// SAVE BUTTON
		saveLink.download = 'badge.png';
		const saveButton = document.createElement('div');
		saveButton.className = 'save-button';
		saveButton.title = 'Download';
		saveLink.appendChild(saveButton);

		options.saveLink = saveLink;

		drawWithSettings(ctx, ctxBuffer, options);
	}

	const uploadFiles = () => {
		// Iterate through each new file and add an entry for each.
		Array.from(uploadInput.files).forEach(file => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const image = new Image();
				image.src = e.target.result;

				image.onload = () => {
					createNewBadgeSettings(image);
				}
			}
			reader.readAsDataURL(file);
		});
	}

	uploadBox.ondragover = function(evt) {
		evt.preventDefault();
	};
	uploadBox.ondragenter = function(evt) {
		evt.preventDefault();
	};

	uploadBox.ondrop = function(evt) {
		uploadInput.files = evt.dataTransfer.files;
		uploadFiles();
		evt.preventDefault();
	};

	uploadInput.addEventListener('change', () => {
		uploadFiles();
	});
	
}
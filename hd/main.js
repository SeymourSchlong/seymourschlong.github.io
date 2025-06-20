const load = () => {
	const cb = Math.floor(Math.random()*99999);

	const loadQueue = [];

	const banners = [];
	const customBanners = [];
	const badges = [];
	const customBadges = [];

	const assetIDs = {lang: {}, banners: [], badges: []};

	const languageTags = ["USen","USes","EUes","EUfr","USfr","EUnl","EUde","EUit","EUru","JPja","CNzh","KRko","TWzh"];

	window.lang = {};

	const params = new URLSearchParams(window.location.search);

	const makeClone = (data) => {
		return JSON.parse(JSON.stringify(data));
	}

	const loadedLanguage = () => {
		// Languages here include a space between the titles
		const isSpaceLang = () => {
			return ['USen','EUnl','USfr','EUfr','EUde','EUit','EUru','USes','EUes', 'KRko'].indexOf(language) !== -1;
		}

		let language = params.get("lang") || 'USen';

		if (Object.keys(lang).indexOf(language) === -1) {
			language = 'USen';
		}
		document.body.setAttribute('lang', language);

		if (['USfr','EUfr','EUit','USes','EUes'].indexOf(language) !== -1) {
			const tempTitles = lang[language].titles.first;
			lang[language].titles.first = lang[language].titles.last;
			lang[language].titles.last = tempTitles;
		}

		if (navigator.userAgent.toLowerCase().includes('chrome')) {
			document.body.classList.add('chrome');
		}
		
		const tag = {
			name: 'Player',
			title: {
				first: 7,
				last: 560,
				string: 'Splatlandian Youth'
			},
			banner: 246,
			id: lang[language].sign + '0001',
			badges: [ -1, -1, -1 ],
			colour: '#ffffff',
			bgColours: ['#ffffff', '#ff0000', '#00ff00', '#0000ff'],
			isCustom: false,
		}

		const titleToString = () => {
			const chosentitles = [];
			if (tag.isCustom) chosentitles.push(tag.title.string);
			else {
				if (tag.title.first) chosentitles.push(lang[language].titles.first[tag.title.first]);
				if (tag.title.last) chosentitles.push(lang[language].titles.last[tag.title.last]);
			}
			if (chosentitles[0])
				return chosentitles.join(isSpaceLang(language) ? (!(chosentitles[0]?.endsWith('-') || chosentitles[1]?.startsWith('-')) ? ' ' : '') : '');
			else
				return '';
		}

		const waitUntil = (fn, length) => {
			const interval = setInterval(() => {
				if (fn()) clearInterval(interval);
			}, length ? length*1000 : 500);
		}

		const canvas = document.querySelector('#splashtag');
		const ctx = canvas.getContext('2d');

		const realTagWidth = 700;
		const realTagHeight = 200;
		const scale = 2;
		const tagWidth = realTagWidth * scale;
		const tagHeight = realTagHeight * scale;

		const canvasLayer = document.createElement('canvas');
		canvasLayer.width = tagWidth;
		canvasLayer.height = tagHeight;
		const layerCtx = canvasLayer.getContext('2d');

		const compositeCanvas = document.createElement('canvas');
		compositeCanvas.width = tagWidth;
		compositeCanvas.height = tagHeight;
		const compositeCtx = compositeCanvas.getContext('2d');

		const textScale = 2;
		const textCanvas = document.createElement('canvas');
		textCanvas.width = tagWidth*textScale;
		textCanvas.height = tagHeight*textScale;
		const textCtx = textCanvas.getContext('2d');
		textCtx.scale(textScale, textScale);

		const textFontList = ['Splat-text'];
		if (lang[language].font) textFontList.push(lang[language].font[0]);
		else textFontList.push("Kurokane");

		const titleFontList = ['Splat-title'];
		if (lang[language].font) titleFontList.push(lang[language].font[1]);
		else titleFontList.push("Rowdy");

		const textFont = textFontList.join(',');
		const titleFont = titleFontList.join(',');

		let cooldown = 0;
		// prevent the canvas from redrawing too quickly
		setInterval(() => {
			if (cooldown) cooldown--;
		});

		const getXScale = (width, max) => {
			return width > max ? (max) / width : 1;
		}

		const customImages = {
			banner: new Image(),
			badges: [
				new Image(),
				new Image(),
				new Image()
			]
		}

		const customBgInput = document.querySelector('#custom-bg');
		const customBadgeInput = [...document.querySelectorAll('[id*="custom-badge"]')];

		[customBgInput, ...customBadgeInput].forEach((uploadElement, i) => {
			uploadElement.addEventListener('change', () => {
				const file = Array.from(uploadElement.files)[0]

				const reader = new FileReader();
				reader.onload = (e) => {
					const image = new Image();
					image.src = e.target.result;
					//const index = group.findIndex(b => b.file === image.src);

					if (!i) customImages.banner = image;
					else customImages.badges[i-1] = image;

					//if (index === -1) {
						setTimeout(() => {
							renderSplashtag();
						}, 1);
					//}
				}
				reader.readAsDataURL(file);
			});
		});
		
		const renderSplashtag = () => {
			textCtx.clearRect(0, 0, tagWidth, tagHeight);
			ctx.clearRect(0, 0, tagWidth, tagHeight);

			if (tag.banner < 0 || tag.banner >= assetIDs.banners.length) {
				// do nothing lol
			} else if (customBgInput.files[0]) {
				ctx.drawImage(customImages.banner, 0, 0, tagWidth, tagHeight);
			} else if (!banners[tag.banner].layers) {
				// If not one of the special "pick your own colour" banners, just draw it
				ctx.drawImage(banners[tag.banner].image, 0, 0, tagWidth, tagHeight);
			} else {
				// Special custom colour banners draw each layer then are added
				const imageLayers = banners[tag.banner].layerImages;
				for (let i = 0; i < imageLayers.length; i++) {
					compositeCtx.clearRect(0, 0, tagWidth, tagHeight);
					compositeCtx.save();
					compositeCtx.fillStyle = tag.bgColours[!i ? i : imageLayers.length - i];
					compositeCtx.drawImage(imageLayers[i], 0, 0, tagWidth, tagHeight);
					compositeCtx.globalCompositeOperation = 'difference';
					compositeCtx.fillRect(0, 0, tagWidth, tagHeight);
					compositeCtx.restore();

					layerCtx.save();
					layerCtx.drawImage(imageLayers[i], 0, 0, tagWidth, tagHeight);
					layerCtx.globalCompositeOperation = 'source-in';
					layerCtx.drawImage(compositeCanvas, 0, 0, tagWidth, tagHeight);
					layerCtx.restore();
					ctx.drawImage(canvasLayer, 0, 0);
					layerCtx.clearRect(0, 0, tagWidth, tagHeight);
				}
			}

			// Set text colour
			textCtx.fillStyle = (tag.colour);

			// Write titles
			textCtx.textAlign = 'left';
			if (titleToString()) {
				const titleSize = 36 * scale;
				const titleSpacing = -0.3 * scale;

				textCtx.save();
				textCtx.font = `${titleSize}px ${textFont}`;
				textCtx.letterSpacing = `${titleSpacing}px`;
				const textWidth = textCtx.measureText(titleToString()).width;
				const xScale = getXScale(textWidth, scale*(realTagWidth-32));

				// in game italic value is 0.12
				textCtx.transform(1, 0, -7.5/100, 1, 0, 0);
				textCtx.scale(xScale, 1);
				textCtx.fillText(titleToString(), 18*scale / xScale, 42*scale);
				textCtx.restore();
				textCtx.letterSpacing = "0px";
			}

			// Write tag text (if not empty)
			if (tag.id.length) {
				textCtx.save();
				const idSize = 24 * scale;
				const idSpacing = 0.2 * scale;
				textCtx.font = `${idSize}px ${textFont}`;
				textCtx.letterSpacing = `${idSpacing}px`;

				// tag text should adjust to the leftmost badge position.
				const leftBadge = tag.badges.indexOf(tag.badges.find(b => b !== -1));
				const maxX = scale * ((leftBadge === -1 ? realTagWidth : (480 + 74*leftBadge)) - 48);
				const textWidth = textCtx.measureText(tag.id).width;
				const xScale = getXScale(textWidth, maxX);

				textCtx.scale(xScale, 1);
				textCtx.fillText('' + tag.id, scale * 24 / xScale, scale*185);
				textCtx.restore();
			}

			// Write player name
			if (tag.name.length) {
				textCtx.save();
				const nameSize = 66 * scale;
				const nameSpacing = -0.4 * scale;
				textCtx.font = `${nameSize}px ${titleFont}`;
				textCtx.letterSpacing = `${nameSpacing}px`;
				const textWidth = textCtx.measureText(tag.name).width;
				const xScale = getXScale(textWidth, scale*(realTagWidth-32));

				textCtx.textAlign = 'center';
				textCtx.scale(xScale, 1);
				textCtx.fillText(tag.name, scale*(realTagWidth/2-1.5) / xScale, scale*119);

				textCtx.restore();
			}
			
			ctx.drawImage(textCanvas, 0, 0, tagWidth, tagHeight);
			textCtx.clearRect(0, 0, tagWidth, tagHeight);

			// Draw each badge on the banner
			for (let i = 0; i < 3; i++) {
				if (tag.badges[i] !== -1 || customBadgeInput[i].files[0]) {
					const badgeSize = scale * 70;
					const x = scale * (480 + 74*i);

					// Below used to resize custom badges to retain their scale.
					if (customBadgeInput[i].files[0]) {
						const image = customImages.badges[i];
						const cw = image.naturalWidth;
						const ch = image.naturalHeight;
						const landscape = cw > ch;
						const ratio = !landscape ? (cw / ch) : (ch / cw);
						const width = landscape ? badgeSize : badgeSize*ratio;
						const height = !landscape ? badgeSize : badgeSize*ratio;
						ctx.drawImage(image, x + (badgeSize/2 - width/2), scale*128 + (badgeSize/2 - height/2), width, height);
					} else {
						ctx.drawImage(badges[tag.badges[i]].image, x, scale*128, badgeSize, badgeSize);
					}
				}
			}

			ctx.save();
			ctx.globalAlpha = 0.2;
			ctx.drawImage(textCanvas, 0, 0, tagWidth, tagHeight);
			ctx.restore();
		}

		canvas.addEventListener('click', () => {
			renderSplashtag();
		});

		window.renderSplashtag = renderSplashtag;
		window.tag = tag;

		customBanners.forEach(item => {
			banners.push(item);
		});
		customBadges.forEach(item => {
			badges.push(item);
		});

		// Sort the titles, and insert the "No Title" option at the start
		lang[language].titles.first.sort();
		lang[language].titles.last.sort();

		lang[language].titles.first.unshift(lang[language].titles.empty);
		lang[language].titles.last.unshift(lang[language].titles.empty);

		const loadAsset = (item) => {
			console.log(item);

			const img = new Image();
			img.src = item.file + '.png';
			loadQueue.push(1);

			console.log(img);

			img.onload = () => {
				loadQueue.pop();
			}

			if (item.layers) {
				item.layerImages = [];
				for (let i = 0; i < item.layers; i++) {
					const layer = new Image();
					layer.src = item.file.replace('preview', i+1) + '.png';
					
					loadQueue.push(1);

					img.onload = () => {
						loadQueue.pop();
						console.log('loaded!');
					}

					item.layerImages.push(layer);
				}
			}

			item.image = img;
		}

		window.banners = banners;
		window.badges = badges;

		// Loading in tags from param info.
		// Name
		if (params.get("n") !== null) {
			tag.name = decodeURIComponent(params.get("n"));
		}
		// ID
		if (params.get("i") !== null) {
			tag.id = decodeURIComponent(params.get("i"));
		}
		// Title
		if (params.get("t") !== null) {
			if (params.get("l")) {
				const indexes = decodeURIComponent(params.get("t")).split(',');
				const langTag = languageTags[params.get("l")];
				tag.title.first = lang[langTag].titles.first.indexOf(assetIDs.lang[langTag].titles.first[indexes[0]]);
				tag.title.last  = lang[langTag].titles.last.indexOf(assetIDs.lang[langTag].titles.last[indexes[1]]);
			} else {
				tag.isCustom = true;
				//customcheck.click();
				tag.title.string = decodeURIComponent(params.get("t"));
			}
		}
		// Banners
		if (params.get("p")) {
			tag.banner = banners.findIndex(b => b.file.endsWith(assetIDs.banners[params.get("p")]));
			
			if (+params.get('p') < 0 || +params.get('p') >= assetIDs.banners.length)
				tag.banner = -1;

			if (tag.banner >= 0) loadAsset(banners[tag.banner]);
		} else {
			loadAsset(banners[tag.banner]);
		}
		// Plate colours
		if (params.get("pc")) {
			const bgColours = params.get("pc").match(/.{1,6}/g);
			bgColours.forEach((c, i) => {
				tag.bgColours[i] = '#'+c;
				//bannercolourpickers[i].value = tag.bgColours[i];
			});
		} else {
			tag.colour = '#' + banners[tag.banner]?.colour;
		}
		// Name colour
		if (params.get("nc")) {
			tag.colour = '#' + params.get("nc");
			//customcolour.value = tag.colour;
		}
		// Badges
		if (params.get("b")) {
			const indexes = decodeURIComponent(params.get("b")).split(',');
			if (indexes.length === 3) {
				indexes.forEach((badge, i) => {
					if (badge >= 0) {
						tag.badges[i] = badges.findIndex(b => b.file && b.file.endsWith(assetIDs.badges[badge]));
						loadAsset(badges[tag.badges[i]]);
					}
				});
			}
		}

		waitUntil(() => {
			if (!loadQueue.length) {
				renderSplashtag();
				return true;
			}
		});
	}

	fetch(`https://splashtagmaker.com/assets.json?cb=${cb}`).then(res => {
		return res.json();
	}).then(data => {
		const toBadgeObject = (arr) => {
			return arr.map(s => {
				const r = {};
				if (s.startsWith('NAME')) {
					const results = /^NAME\:(.*?)#(.*?)$/.exec(s);
					r.name = results[1];
					r.id = results[2];
				} else {
					if (s.includes('/')) r.custom = true;
					r.file = 'https://seymourschlong.github.io/hd/assets/' + (r.custom ? 'custom/':'') + 'badges/' + s;
				}
				return r;
			});
		}

		Object.assign(banners, data.banners.map(o => {
			o.file = 'https://seymourschlong.github.io/hd/assets/banners/' + o.file;
			return o;
		}));
		Object.assign(customBanners, data.customBanners.map(o => {
			o.file = 'https://seymourschlong.github.io/hd/assets/custom/banners/' + o.file;
			o.custom = true;
			return o;
		}));
		Object.assign(badges, toBadgeObject(data.badges));
		Object.assign(customBadges, toBadgeObject(data.customBadges));

		Object.assign(assetIDs, data.ids);

		for (let i = 0; i < badges.length; i++) {
			let item = badges[i].file;

			if (item) {
				if (item.startsWith("https://seymourschlong.github.io/hd/assets/badges/Badge_WeaponLevel_")) {
					for (let L = 1; L <= 6; L++) {
						i++;
						let weaponLevel = {file: item};
						weaponLevel.file = item.replace(/.$/, L);
						badges.splice(i, 0, weaponLevel);
					}
				}
			}
		}

		fetch(`https://splashtagmaker.com/lang.json`).then(res => {
			return res.json();
		}).then(data => {
			Object.assign(lang, data);
			Object.assign(assetIDs.lang, makeClone(data));
			loadedLanguage();
		}).catch(err => {
			alert(`Something went wrong when loading...\n\nIf this problem keeps occurring, contact @spaghettitron on Twitter!\n\n${err.stack}`);
			console.log(err);
		});
	});
}

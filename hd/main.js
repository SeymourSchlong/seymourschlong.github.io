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

		const canvasLayer = document.createElement('canvas');
		canvasLayer.width = 1400;
		canvasLayer.height = 400;
		const layerCtx = canvasLayer.getContext('2d');

		const compositeCanvas = document.createElement('canvas');
		compositeCanvas.width = 1400;
		compositeCanvas.height = 400;
		const compositeCtx = compositeCanvas.getContext('2d');

		const textScale = 2;
		const textCanvas = document.createElement('canvas');
		textCanvas.width = 1400*textScale;
		textCanvas.height = 400*textScale;
		const textCtx = textCanvas.getContext('2d');
		textCtx.scale(textScale, textScale);

		const textFontList = ['Splat-text'];
		if (lang[language].font) textFontList.push(lang[language].font[0]);
		const titleFontList = ['Splat-title'];
		if (lang[language].font) titleFontList.push(lang[language].font[1]);
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
		
		const renderSplashtag = () => {
			textCtx.clearRect(0, 0, 1400, 400);
			ctx.clearRect(0, 0, 1400, 400);

			if (tag.banner < 0 || tag.banner >= assetIDs.banners.length) {

			} else if (!banners[tag.banner].layers) {
				// If not one of the special "pick your own colour" banners, just draw it
				ctx.drawImage(banners[tag.banner].image, 0, 0, 1400, 400);
			} else {
				// Special custom colour banners draw each layer then are added
				const imageLayers = banners[tag.banner].layerImages;
				for (let i = 0; i < imageLayers.length; i++) {
					compositeCtx.clearRect(0, 0, 1400, 400);
					compositeCtx.save();
					compositeCtx.fillStyle = tag.bgColours[!i ? i : imageLayers.length - i];
					compositeCtx.drawImage(imageLayers[i], 0, 0, 1400, 400);
					compositeCtx.globalCompositeOperation = 'difference';
					compositeCtx.fillRect(0, 0, 1400, 400);
					compositeCtx.restore();

					layerCtx.save();
					layerCtx.drawImage(imageLayers[i], 0, 0, 1400, 400);
					layerCtx.globalCompositeOperation = 'source-in';
					layerCtx.drawImage(compositeCanvas, 0, 0, 1400, 400);
					layerCtx.restore();
					ctx.drawImage(canvasLayer, 0, 0);
					layerCtx.clearRect(0, 0, 1400, 400);
				}
			}

			// Set text colour
			textCtx.fillStyle = (tag.colour);

			// Write titles
			textCtx.textAlign = 'left';
			if (titleToString()) {
				textCtx.save();
				textCtx.font = `72px ${textFont}`;
				//textCtx.font = `36px ${textFont}`;
				textCtx.letterSpacing = "-0.6px";
				//textCtx.letterSpacing = "-0.3px";
				const textWidth = textCtx.measureText(titleToString()).width;
				const xScale = getXScale(textWidth, 2*(700-32));
				//const xScale = getXScale(textWidth, 700-32);

				// in game italic value is 0.12
				textCtx.transform(1, 0, -7.5/100, 1, 0, 0);
				textCtx.scale(xScale, 1);
				textCtx.fillText(titleToString(), 18*2 / xScale, 42*2);
				textCtx.restore();
				textCtx.letterSpacing = "0px";
			}

			// Write tag text (if not empty)
			if (tag.id.length) {
				textCtx.save();
				// textCtx.font = `24px ${textFont}`;
				// textCtx.letterSpacing = "0.2px";
				textCtx.font = `48px ${textFont}`;
				textCtx.letterSpacing = "0.4px";

				// tag text should adjust to the leftmost badge position.
				const leftBadge = tag.badges.indexOf(tag.badges.find(b => b !== -1));
				const maxX = (leftBadge === -1 ? 2*700 : 2*(480 + 74*leftBadge) - 48);
				//const maxX = (leftBadge === -1 ? 700 : 480 + 74*leftBadge) - 48;
				const textWidth = textCtx.measureText(tag.id).width;
				const xScale = getXScale(textWidth, maxX);

				textCtx.scale(xScale, 1);
				textCtx.fillText('' + tag.id, 2 * 24 / xScale, 2*185);
				textCtx.restore();
			}

			// Write player name
			if (tag.name.length) {
				textCtx.save();
				// textCtx.font = `66px ${titleFont}`;
				// textCtx.letterSpacing = "-0.4px";
				textCtx.font = `132px ${titleFont}`;
				textCtx.letterSpacing = "-0.8px";
				const textWidth = textCtx.measureText(tag.name).width;
				//const xScale = getXScale(textWidth, 700-32);
				const xScale = getXScale(textWidth, 2*(700-32));

				textCtx.textAlign = 'center';
				textCtx.scale(xScale, 1);
				textCtx.fillText(tag.name, 2*(700/2-1.5) / xScale, 2*119);
				//textCtx.fillText(tag.name, (700/2-1.5) / xScale, 119);

				textCtx.restore();
			}
			
			ctx.drawImage(textCanvas, 0, 0, 1400, 400);
			textCtx.clearRect(0, 0, 1400, 400);

			// If the banner name or badge has either "custom" or "data" it is definitely a custom resource
			let customed = banners[tag.banner]?.custom || false;

			// Draw each badge on the banner
			for (let i = 0; i < 3; i++) {
				if (tag.badges[i] !== -1) {
					const x = 2*(480 + 74*i);

					// Below used to resize custom badges to retain their scale.
					if (badges[tag.badges[i]].custom) {
						customed = true;
						const cw = badges[tag.badges[i]].image.naturalWidth;
						const ch = badges[tag.badges[i]].image.naturalHeight;
						const landscape = cw > ch;
						const ratio = !landscape ? (cw / ch) : (ch / cw);
						const width = landscape ? 70 : 70*ratio;
						width *= 2;
						const height = !landscape ? 70 : 70*ratio;
						height *= 2;
						ctx.drawImage(badges[tag.badges[i]].image, x + 2*(70 / 2 - width / 2), 2*128 + 2*(70 / 2 - height / 2), width, height);
					} else {
						ctx.drawImage(badges[tag.badges[i]].image, x, 2*128, 2*70, 2*70);
					}
				}
			}

			ctx.save();
			ctx.globalAlpha = 0.2;
			ctx.drawImage(textCanvas, 0, 0, 1400, 400);
			ctx.restore();
		}

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


		// Loading in tags from param info.
		// Name
		if (params.get("n")) {
			tag.name = decodeURIComponent(params.get("n"));
		}
		// ID
		if (params.get("i")) {
			tag.id = decodeURIComponent(params.get("i"));
		}
		// Title
		if (params.get("t")) {
			if (params.get("l")) {
				const indexes = decodeURIComponent(params.get("t")).split(',');
				const langTag = languageTags[params.get("l")];
				tag.title.first = lang[langTag].titles.first.indexOf(assetIDs.lang[langTag].titles.first[indexes[0]]);
				tag.title.last  = lang[langTag].titles.last.indexOf(assetIDs.lang[langTag].titles.last[indexes[1]]);
			} else {
				tag.isCustom = true;
				customcheck.click();
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

	fetch(`https://seymourschlong.github.io/splashtags/assets.json?cb=${cb}`).then(res => {
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

		fetch(`https://seymourschlong.github.io/splashtags/lang.json`).then(res => {
			return res.json();
		}).then(data => {
			Object.assign(lang, data);
			Object.assign(assetIDs.lang, structuredClone(data));
			loadedLanguage();
		}).catch(err => {
			alert(`Something went wrong when loading...\n\nIf this problem keeps occurring, contact @spaghettitron on Twitter!\n\n${err.stack}`);
			console.log(err);
		});
	});
}

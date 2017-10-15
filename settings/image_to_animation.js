var 	imgImport = null,
	imgImportFile = null,
	imgImportSource = null,
	imgImportURL = null,
	imgImportData = [],
	scanAspect = 0, // 0 = Left-Right, 1 = Up-Down
	imgImportClick = {
		layerX:0,
		layerY:0,
		centerX:0,
		centerY:0
	},
	tableEditor = document.getElementById('editor'),
	prevSize = editorWidth - 4,
	previewL = 0, previewT = 0, previewW = prevSize, previewH = prevSize,
	imgSelectW = 0, imgSelectH = 0, imgSelectL = 0, imgSelectT = 0,
	imgSelectImportL = 0, imgSelectImportT = 0, imgSelectImportW = 0, imgSelectImportH = 0,
	importL = 0, importT = 0, importW = 0, importH = 0;



canvImage.style.left = '446px';
canvImage.style.top = 0 + 'px';


function drawImport(ev) {
	showMessage('open_image');
	if(document.getElementById('uploadimage').files[0] == undefined){//canceled
		// set data from previous image
		f = imgImportFile;
		url = imgImportURL;
		src = imgImportSource;
		showMessage('');
		return;
	}

	var	f = document.getElementById('uploadimage').files[0],
		url = window.URL || window.webkitURL,
		src = url.createObjectURL(f);


	sliderLightness.value = -0.125;
	sliderLightnessVal.innerHTML = -25;

	imgImport = new Image();
	imgImport.onload = function(){
		imgImport.onload = null;

		// create new image.src from original to overcome [ canvas has been tainted by cross-origin data ]
		var canvRawImage = document.createElement('canvas');
		canvRawImage.width = imgImport.width;
		canvRawImage.height = imgImport.height;
		var ctxRawImage = canvRawImage.getContext('2d');
		ctxRawImage.drawImage(imgImport, 0, 0);

		imgImport.onload = function(){ // new image.src created
			imgImportFile = f;
			imgImportURL = url;
			imgImportSource = imgImport.src;

			sliderZoom.value = 0;

			imgImportClick = {
				layerX:0,
				layerY:0,
				centerX:Math.round(imgImport.width/2),
				centerY:Math.round(imgImport.height/2)
			}
			importL = 0; importT = 0; importW = 0; importH = 0;

			url.revokeObjectURL(imgImport.src);
			setupImportArea();
			refreshButtons();
			refreshImageData();
			showMessage('');
			return;
		}
		imgImport.src = canvRawImage.toDataURL("image/png");
		return;
	}
	imgImport.src = src;
}

document.getElementById("uploadimage").addEventListener("change", drawImport, false);


function setupImportArea(){
	var	imgImportW = imgImport.width,
		imgImportH = imgImport.height,
		ctx = canvImport.getContext('2d'),
		ctx2 = canvImage.getContext('2d'),
		f = imgImportFile,
		url = imgImportURL,
		src = imgImportSource;


	refreshButtons();
	// setup preview
	var zoomFactor = 1 - sliderZoom.value;

	imgSelectW = Math.round(imgImportW * zoomFactor);
	imgSelectH = Math.round(imgImportH * zoomFactor);


	// adapt preview selection to zoom
	if(imgSelectW > imgSelectH){
		if(imgSelectH < imgImportH){
			imgSelectH = imgImportH;
		}
		if(imgSelectH > imgSelectW){imgSelectH = imgSelectW;}
	} else {
		if(imgSelectW < imgImportW){
			imgSelectW = imgImportW;
		}
		if(imgSelectW > imgSelectH){imgSelectW = imgSelectH;}
	}
	imgSelectL = Math.round(imgImportW / 2 - imgSelectW / 2);
	imgSelectT = Math.round(imgImportH / 2 - imgSelectH / 2);

	if(imgSelectW > imgSelectH){
		previewL = 0;
		previewW = prevSize;
		previewH = Math.round(prevSize / imgSelectW * imgSelectH);
		previewT = Math.round((prevSize - previewH) / 2);
	} else {
		previewT = 0;
		previewH = prevSize;
		previewW = Math.round(prevSize / imgSelectH * imgSelectW);
		previewL = Math.round((prevSize - previewW) / 2);
	}

	var	xCenter = imgImportClick.centerX,
		yCenter = imgImportClick.centerY;

	imgSelectL = Math.round(xCenter - imgSelectW / 2);
	if(imgSelectL < 0){imgSelectL = 0;}
	if(imgSelectL + imgSelectW > imgImportW){imgSelectL = imgImportW - imgSelectW;}

	imgSelectT = Math.round(yCenter - imgSelectH / 2);
	if(imgSelectT < 0){imgSelectT = 0;}
	if(imgSelectT + imgSelectH > imgImportH){imgSelectT = imgImportH - imgSelectH;}

	ctx2.fillStyle = '#ffffff';
	ctx2.strokeStyle = '#404040';
	ctx2.fillRect(0, 0, prevSize, prevSize);
	ctx2.strokeRect(0, 0, prevSize, prevSize);
	ctx2.drawImage(imgImport, imgSelectL, imgSelectT, imgSelectW, imgSelectH, previewL, previewT, previewW, previewH);


	switch(scanAspect){
		case 0: // l-r
			importL = 0;
			importW = previewW;
			importH = Math.round(importW * 0.12);

			canvImport.width = inFrames.value;
			canvImport.height = 24;
			break;

		case 1: // u-d
			importT = 0;
			importH = previewH;
			importW = Math.round(importH * 0.12);

			canvImport.width = 24;
			canvImport.height = inFrames.value;
			break;
	}

	// *** replace select area ***
	imgImportClick.layerX = Math.round((xCenter - imgSelectL) / (imgSelectW / previewW) + previewL);
	imgImportClick.layerY = Math.round((yCenter - imgSelectT) / (imgSelectH / previewH) + previewT);

	importArea.style.left = (canvImage.offsetLeft + previewL - 2) + 'px';
	importArea.style.top = (canvImage.offsetTop + previewT -2) + 'px';
	importArea.style.width = importW + 'px';
	importArea.style.height = importH + 'px';

	canvImportV.width = importW;
	canvImportV.height = importH;
	canvImportV.style.width = importArea.style.width;
	canvImportV.style.height = importArea.style.height;

	// draw pixels
	importImageArea();

	switch(scanAspect){
		case 0: imgImportData = ctx.getImageData(0,0,inFrames.value,24); break;
		case 1: imgImportData = ctx.getImageData(0,0,24,inFrames.value); break;
	}
	imgImportTrim();

	// draw led matrix
	importImageToMatrix();
}


function changeScanAspect(){
	scanAspect ++; if(scanAspect == 2){scanAspect = 0;}
	var butScandir = document.getElementById("but_scan_direction");
	switch(scanAspect){
		case 0: bAspect = 'scan_right'; break;
		case 1: bAspect = 'scan_down'; break;
	}
	butScandir.innerHTML = '<img src="../assets/images/' + bAspect + '.png" height="30" width="30" style="float: center;">';
	setupImportArea();
	refreshImageData();
}

function importImageArea(){
	switch(scanAspect){
		case 0: // l-r
			imgSelectImportL = imgSelectL;
			imgSelectImportW = imgSelectW;
			imgSelectImportH = imgSelectW * 0.12;
			imgSelectImportT = imgSelectH / previewH * (importT - previewT) + imgSelectT;
			var	cnvW = inFrames.value,
				cnvH = 24;
			break;

		case 1: // u-d
			imgSelectImportT = imgSelectT;
			imgSelectImportH = imgSelectH;
			imgSelectImportW = imgSelectH * 0.12;
			imgSelectImportL = imgSelectW / previewW * (importL - previewL) + imgSelectL;
			var	cnvW = 24,
				cnvH = inFrames.value;
			break;
	}
	var ctx = document.getElementById('canvImport').getContext('2d');
	ctx.drawImage(imgImport, imgSelectImportL, imgSelectImportT, imgSelectImportW, imgSelectImportH, 0, 0, cnvW, cnvH);
}

timeOutImageToMatrix = null;
function importImageToMatrix(){
	// copy imgImportData to preview area and delayed to LED-matrix area

	if(imgImport == null){return;}
	importImageToPreview();

	if(timeOutImageToMatrix != null){ clearTimeout( timeOutImageToMatrix ); timeOutImageToMatrix = null;}
	timeOutImageToMatrix = setTimeout(function(){

		var	ctx3 = canvImportedFrames.getContext('2d'),
			colorW = Math.floor(canvImportedFrames.width/24),
			colorH = 10,
			vSpace = 5,
			colorL = Math.round((canvImportedFrames.width - 24 * colorW) / 2);

		canvImportedFrames.height = inFrames.value * (colorH + vSpace) + vSpace;

		ctx3.clearRect(0, 0, canvImportedFrames.width, canvImportedFrames.height);

		switch(scanAspect){
			case 0: // l-r
				var	pixelSizeW = previewW / inFrames.value,
					pixelSizeH = previewW * 0.12 /24;
				for(var x = 0; x < inFrames.value; x++){

					if(importViewType == 2){
						var	pos = [],	//{x:0, y:0}
							ledArray = [],	//{r:0, g:0, b:0}
							yPos = x * (colorH + vSpace) + vSpace + colorH/2;
					}

					for(var y = 0; y < 24; y++){
						var	pixelIndex = (y * inFrames.value + x) * 4,
							lCol = adjustColor({r:imgImportData.data[pixelIndex], g:imgImportData.data[pixelIndex + 1], b:imgImportData.data[pixelIndex + 2]});

						switch(importViewType){
						case 0:
							drawColorRect(colorL + (23 - y) * colorW, x * (colorH + vSpace) + vSpace, colorW, colorH, lCol, canvImportedFrames, '#7f7f7f');
							break;

						case 1:
							drawLedRect(colorL + (23 - y) * colorW, x * (colorH + vSpace) + vSpace, colorW, colorH, lCol, canvImportedFrames);
							break;

						case 2:
							var xPos = colorL + (23 - y) * colorW + colorW/2;
							pos.push({x:xPos, y:yPos});
							ledArray.push(lCol)
							break;
						}
					}
					if(importViewType == 2){
						drawLedGroup(canvImportedFrames, pos, ledArray, colorW, colorL, x * (colorH + vSpace) + vSpace, colorW * 24, colorH);
					}


					ctx3.fillStyle='#7f7f7f';
					ctx3.fillRect(colorL + 11 * colorW + colorW/2 - 1, x * (colorH + vSpace), 2, vSpace);
				}
				break;

			case 1: // u-d
				var	pixelSizeH = previewH / inFrames.value,
					pixelSizeW = previewH * 0.12 / 24;

				for(var y = 0; y < inFrames.value; y++){

					if(importViewType == 2){
						var	pos = [],	//{x:0, y:0}
							ledArray = [],	//{r:0, g:0, b:0}
							yPos = y * (colorH + vSpace) + vSpace + colorH/2;
					}

					for(var x = 0; x < 24; x++){
						var	pixelIndex = (y * 24 + x) * 4,
							lCol = adjustColor({r:imgImportData.data[pixelIndex], g:imgImportData.data[pixelIndex + 1], b:imgImportData.data[pixelIndex + 2]});

						switch(importViewType){
						case 0:
							drawColorRect(colorL + x * colorW, y * (colorH + vSpace) + vSpace, colorW, colorH, lCol, canvImportedFrames, '#7f7f7f');
							break;

						case 1:
							drawLedRect(colorL + x * colorW, y * (colorH + vSpace) + vSpace, colorW, colorH, lCol, canvImportedFrames);
							break;

						case 2:
							var xPos = colorL + x * colorW + colorW/2;
							pos.push({x:xPos, y:yPos});
							ledArray.push(lCol)
							break;

						}
						if(x == 0){
							ctx3.fillStyle='#7f7f7f';
							ctx3.fillRect(colorL + 11 * colorW + colorW/2 - 1, y * (colorH + vSpace), 2, vSpace);
						}
					}
					if(importViewType == 2){
						drawLedGroup(canvImportedFrames, pos, ledArray, colorW, colorL, y * (colorH + vSpace) + vSpace, colorW * 24, colorH);
					}

				}





/*
				for(var x = 0; x < 24; x++){
					for(var y = 0; y < inFrames.value; y++){
						var	pixelIndex = (y * 24 + x) * 4,
							lCol = adjustColor({r:imgImportData.data[pixelIndex], g:imgImportData.data[pixelIndex + 1], b:imgImportData.data[pixelIndex + 2]}),
							vCol = getViewColor(lCol);

						drawLedRect(colorL + x * colorW, y * (colorH + vSpace) + vSpace, colorW, colorH, lCol, canvImportedFrames);
						if(x == 0){
							ctx3.fillStyle='#7f7f7f';
							ctx3.fillRect(colorL + 11 * colorW + colorW/2 - 1, y * (colorH + vSpace), 2, vSpace);
						}
					}
				}
*/
				break;
		}
		ctx3.globalCompositeOperation='destination-over';
		ctx3.fillStyle = '#000000';
		ctx3.fillRect(0, 0, canvImportedFrames.width, canvImportedFrames.height);
		timeOutImageToMatrix = null;
	}, 200);
}

function importImageToPreview(){
	// copy imgImportData to preview area

		if(imgImport == null){return;}
		var	ctxV = canvImportV.getContext('2d'), // view-canvas inside selected area
			colorW = Math.floor(canvImportedFrames.width/24),
			colorH = 10,
			vSpace = 5,
			colorL = Math.round((canvImportedFrames.width - 24 * colorW) / 2);

		ctxV.fillStyle = '#000000';
		ctxV.fillRect(0,0,canvImportV.width, canvImportV.height);

		switch(scanAspect){
			case 0: // l-r
				var	pixelSizeW = previewW / inFrames.value,
					pixelSizeH = previewW * 0.12 /24;
				for(var x = 0; x < inFrames.value; x++){

					for(var y = 0; y < 24; y++){
						var	pixelIndex = (y * inFrames.value + x) * 4,
							lCol = adjustColor({r:imgImportData.data[pixelIndex], g:imgImportData.data[pixelIndex + 1], b:imgImportData.data[pixelIndex + 2]}),
							vCol = getViewColor(lCol);

						ctxV.fillStyle='rgba(' + vCol.r + ', ' + vCol.g + ', ' + vCol.b + ',1)';
						ctxV.fillRect(Math.round(x * pixelSizeW), Math.round(y * pixelSizeH), Math.ceil(pixelSizeW), Math.ceil(pixelSizeH));
					}
				}
				break;

			case 1: // u-d
				var	pixelSizeH = previewH / inFrames.value,
					pixelSizeW = previewH * 0.12 / 24;

				for(var x = 0; x < 24; x++){
					for(var y = 0; y < inFrames.value; y++){
						var	pixelIndex = (y * 24 + x) * 4,
							lCol = adjustColor({r:imgImportData.data[pixelIndex], g:imgImportData.data[pixelIndex + 1], b:imgImportData.data[pixelIndex + 2]}),
							vCol = getViewColor(lCol);

						ctxV.fillStyle='rgba(' + vCol.r + ', ' + vCol.g + ', ' + vCol.b + ',1)';
						ctxV.fillRect(Math.round(x * pixelSizeW), Math.round(y * pixelSizeH), Math.ceil(pixelSizeW), Math.ceil(pixelSizeH));
					}
				}
				break;
		}
}

function importImageToFrames(){
	// copy imgImportData to frames
	switch(scanAspect){
		case 0: // l-r
			var frames = [];
			for(var x = 0; x < inFrames.value; x++){
				var frame = [];
				for(var y = 0; y < 24; y++){
					var	pixelIndex = (y * inFrames.value + x) * 4,
						lCol = adjustColor({r:imgImportData.data[pixelIndex], g:imgImportData.data[pixelIndex + 1], b:imgImportData.data[pixelIndex + 2]}),
						vCol = lCol,
						ledNr = y + 9;

					if(ledNr < 0){ledNr +=24;} else if(ledNr > 23){ledNr -=24;}
					frame[ledNr] = {r:vCol.r, g:vCol.g, b:vCol.b};
				}
				frames.push(frame);
			}
			break;

		case 1: // u-d
			var frames = [];
			for(var y = 0; y < inFrames.value; y++){
				var frame = [];
				for(var x = 0; x < 24; x++){
					var	pixelIndex = (y * 24 + x) * 4,
						lCol = adjustColor({r:imgImportData.data[pixelIndex], g:imgImportData.data[pixelIndex + 1], b:imgImportData.data[pixelIndex + 2]}),
						vCol = lCol,
						ledNr = 23 - x + 9;

					if(ledNr < 0){ledNr +=24;} else if(ledNr > 23){ledNr -=24;}
					frame[ledNr] = {r:vCol.r, g:vCol.g, b:vCol.b};
				}
				frames.push(frame);
			}
			break;
	}

	ledFrame = frame;
	ledFrames = frames.slice(0);

	inRPM.value = 0; inFPS.value = 10; inTFPS.value = 60;
	refreshFramesList();
	refreshLedMarkers();
	drawLedRing();
	drawAllFramePreviews();

	saveAnimation();
	animationIndex[selectedAnimation].name = imgImportFile.name;

	refreshCounter();
	refreshCounter(ledFrames.length);
	actionUndo();
	showAnimationTime();
}

function adjustColor(col){// col = {r:, g:, b:}
	var	cR = col.r,
		cG = col.g,
		cB = col.b,
		brightVal = Number(sliderDimmer.value);

	if(brightVal < 0){
		cR = cR * (1 + brightVal);
		cG = cG * (1 + brightVal);
		cB = cB * (1 + brightVal);
	} else {
		cR = 255 - ((255-cR) * (1 - brightVal));
		cG = 255 - ((255-cG) * (1 - brightVal));
		cB = 255 - ((255-cB) * (1 - brightVal));
	}
	colHSL = rgbToHsl(cR, cG, cB);

	colHSL[0] += Number(sliderHue.value);
	colHSL[1] += Number(sliderSaturation.value);
	colHSL[2] += Number(sliderLightness.value);
	if(colHSL[0] > 1){colHSL[0] = colHSL[0] - 1;} else if(colHSL[0] < 0){colHSL[0] + 1;}
	if(colHSL[1] > 1){colHSL[1] = 1;} else if(colHSL[1] < 0){colHSL[1] = 0;}
	if(colHSL[2] > 1){colHSL[2] = 1;} else if(colHSL[2] < 0){colHSL[2] = 0;}

	var col = hslToRgb(colHSL[0], colHSL[1], colHSL[2]);
	var colHsv = rgbToHsv(col[0], col[1], col[2]);
	if(colHsv[2] < 0.005){col = [0,0,0];}
	return {r:col[0], g:col[1], b:col[2]};
}

function imageMouseDown(obj, objEvent){
	if(imgImport == null){return;}
	switch(obj.id){
	case 'canvImage':
		imgImportClick.layerX = objEvent.layerX;
		imgImportClick.layerY = objEvent.layerY;
		var	x = imgImportClick.layerX,
			y = imgImportClick.layerY;
		break;

	case 'importArea':
		imgImportClick.layerX = objEvent.layerX + importArea.offsetLeft - canvImage.offsetLeft + 2;
		imgImportClick.layerY = objEvent.layerY + importArea.offsetTop - canvImage.offsetTop + 2;
		var	x = imgImportClick.layerX,
			y = imgImportClick.layerY;
		break;
	}
	imgImportClick.centerX = Math.round((imgImportClick.layerX - previewL) * (imgSelectW / previewW) + imgSelectL);
	imgImportClick.centerY = Math.round((imgImportClick.layerY - previewT) * (imgSelectH / previewH) + imgSelectT);
	sliderImportActivate(sliderZoom);
	refreshImageData();
}

function refreshImageData(){
	var ctx = document.getElementById('canvImport').getContext('2d');
	switch(scanAspect){
		case 0:
			divImageFrames.scrollTop = (inFrames.value / previewW) * (imgImportClick.layerX - (prevSize - previewW) / 2) * 15 - divImageFrames.offsetHeight / 2;

			importT = (imgImportClick.layerY - Math.round(importH / 2));
			if(importT < previewT){
				importT = previewT;
			} else if(importT > previewT + previewH - importH){
				importT = previewT + previewH - importH;
			}
			importArea.style.top = (importT - 2) + 'px';
			importImageArea();
			imgImportData = ctx.getImageData(0,0,inFrames.value,24);
			break;

		case 1:
			divImageFrames.scrollTop = (inFrames.value / previewH) * (imgImportClick.layerY - (prevSize - previewH) / 2) * 15 - divImageFrames.offsetHeight / 2;

			importL = (imgImportClick.layerX - Math.round(importW / 2));
			if(importL < previewL){
				importL = previewL;
			} else if(importL > previewL + previewW - importW){
				importL = previewL + previewW - importW;
			}
			importArea.style.left = (importL + canvImage.offsetLeft -2) + 'px';
			importImageArea();
			imgImportData = ctx.getImageData(0,0,24,inFrames.value);
			break;
	}
	canvImportV.style.width = importArea.style.width;
	canvImportV.style.height = importArea.style.height;
	imgImportTrim();
	importImageToMatrix();

	canvImage.title =	'File: ' + imgImportFile.name +
				'\nSize: ' + imgImport.width + ' x ' + imgImport.height +
				'\nZoom: ' + imgSelectW + ' x ' + imgSelectH +
				'\nArea: ' + Math.round(imgSelectImportW) + ' x ' + Math.round(imgSelectImportH);
	canvImportV.title = canvImage.title;


}

function imgImportTrim(){
	for(var i = 0; i < imgImportData.data.length; i += 4){
		var colHsv = rgbToHsv( imgImportData.data[i], imgImportData.data[i + 1], imgImportData.data[i + 2] );
		if( colHsv[2] > 0 && colHsv[2] < 0.005 ){
			imgImportData.data[i] = 0;
			imgImportData.data[i+1] = 0;
			imgImportData.data[i+2] = 0;
		}
	}
}

function imageMouseMove(objEvent){
	if(imgImport == null){return;}
	switch(scanAspect){
		case 0: var sTop = inFrames.value / previewW * objEvent.layerX; break;
		case 1: var sTop = inFrames.value / previewH * objEvent.layerY; break;
	}
	divImageFrames.scrollTop = sTop * 15 - divImageFrames.offsetHeight / 2;
}

function sliderImportInput(obj){
	if(imgImport == null){obj.value = 0; return;}
	sliderImportActivate(obj);
}

function sliderImportWheel(obj, event){
	if(imgImport == null){obj.value = 0; return;}
	if(event.deltaY < 0){
		obj.stepUp(1);
	} else if(event.deltaY > 0){
		obj.stepDown(1);
	}
	sliderImportActivate(obj);
}

function sliderImportDouble(obj){
	if(imgImport == null){obj.value = 0; return;}
	obj.value = 0;
	sliderImportActivate(obj);
}

function sliderImportActivate(obj){
	switch(obj.id){
		case 'sliderDimmer': var xVal = Math.round(obj.value * 100); break;
		case 'sliderHue': var xVal = Math.round(obj.value * 360) + '&deg;'; break;
		case 'sliderSaturation': var xVal = Math.round(obj.value * 100); break;
		case 'sliderLightness': var xVal = Math.round(obj.value * 200); break;
		case 'sliderZoom': var xVal = (Math.round((100 - obj.value * 100) * 100) / 100) + '%'; break;
	}

	switch(obj.id){
		case 'sliderZoom':
			setupImportArea();
			refreshImageData();

		case 'sliderDimmer': case 'sliderHue': case 'sliderSaturation': case 'sliderLightness':
			document.getElementById(obj.id + 'Val').innerHTML = xVal;
			importImageToMatrix();
			break;
	}
}

function closeImport(obj){
	switch(obj.id){
		case 'but_import_accept':
			importImageToFrames();
			showAnimationTime();
			break;
	}
	document.getElementById('imageImporter').style.visibility = 'hidden';
	document.getElementById('editor').style.visibility = 'visible';
	clearInterval(blinkInterval);
}

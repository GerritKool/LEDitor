var	editorWidth = 400,				// display canvas width/height
	editorHalfWidth = editorWidth/2,
	ledEditWidth = Math.floor(editorWidth/16),	// size of led-color indicators/selectors
	caseRadius = editorWidth * 0.43,
	ledW = editorWidth;				// max. radiation radius for leds


function initTopColor(){
	var tCol = getTopColor();
	drawTop();
	animationInfoBar.style.color = tCol.t;
	animationInfoBar.style.backgroundColor = tCol.b;
	inFPS.style.color = tCol.t;
	inFPS.style.backgroundColor = tCol.b;
	inTFPS.style.color = tCol.t;
	inTFPS.style.backgroundColor = tCol.b;
	inRPM.style.color = tCol.t;
	inRPM.style.backgroundColor = tCol.b;
	inRepeat.style.color = tCol.t;
	inRepeat.style.backgroundColor = tCol.b;
	colorDirectSelectInfo.style.color = tCol.t;
	refreshFramesList();
	if( colorSelectionOn ){ initColorSelection(); }
	butTopColor.style.transform = 'rotate(' + (topColor * 90) + 'deg)';

	divFrameScroll.style.scrollbarBaseColor = tCol.b;
}

function drawTop(){
	var	xCol = getTopColor(),
		cR = parseInt(xCol.b.substr(1,2), 16),
		cG = parseInt(xCol.b.substr(3,2), 16),
		cB = parseInt(xCol.b.substr(5,2), 16);

	txtLedRing.style.color = xCol.t;
	frameNumber.style.color = xCol.t;

	colDim =  Math.round(191 + (cR + 1) / 4);
	colDim2 =  Math.round(colDim * 0.533);
	colDim3 =  Math.round(colDim * 0.5);
	ctxTop.clearRect(0,0,editorWidth,editorWidth);
	// draw case
	var grd = ctxTop.createRadialGradient(editorHalfWidth, editorHalfWidth, 0, editorHalfWidth, editorHalfWidth, caseRadius);
	grd.addColorStop(0 , 'rgba(' + colDim + ',' + colDim + ',' + colDim + ', 1)');
	grd.addColorStop(0.9, 'rgba(' + colDim2 + ',' + colDim2 + ',' + colDim2 + ', 1)');
	grd.addColorStop(1 , 'rgba(' + colDim3 + ',' + colDim3 + ',' + colDim3 + ', 1)');
	ctxTop.fillStyle = grd;
	ctxTop.beginPath();
	ctxTop.arc(editorHalfWidth, editorHalfWidth, caseRadius, 0, 2 * Math.PI);
	ctxTop.fill();

	// cut ring
	grd = ctxTop.createRadialGradient(editorHalfWidth, editorHalfWidth, 1, editorHalfWidth, editorHalfWidth, editorHalfWidth);
	grd.addColorStop(0 , 'rgba(' + cR + ', ' + cG + ', ' + cB + ', 0)');
	grd.addColorStop(0.94 , 'rgba(' + cR + ', ' + cG + ', ' + cB + ', 0)');
	grd.addColorStop(0.943 , 'rgba(' + cR + ', ' + cG + ', ' + cB + ', 1)');
	grd.addColorStop(1 , 'rgba(' + cR + ', ' + cG + ', ' + cB + ', 1)');
	ctxTop.fillStyle = grd;
	ctxTop.fillRect(0,0,editorWidth,editorWidth);
}



function drawColorRect(x, y, w, h, colRGB, canv, colBorder){
// colRGB = { r:<int>,g:<int>, b:<int> }
// canv = target canvas
	var	colHsv = rgbToHsv(colRGB.r, colRGB.g, colRGB.b),
		colView = getViewColor(colRGB),
		ctx = canv.getContext("2d");

	if(colBorder == undefined){ colBorder = 'rgba(' + (255 - colView.r) + ',' + (255 - colView.g) + ',' + (255 - colView.b) + ',1' + ')';}

	ctx.globalCompositeOperation = 'source-over';
	if(colHsv[2] > 0){
		ctx.fillStyle = 'rgba(' + colView.r + ', ' + colView.g + ', ' + colView.b + ', 1)';
		ctx.fillRect(x, y, w-1, h);
		ctx.strokeStyle = colBorder;
		ctx.strokeRect(x, y, w-1, h);
	}
}

function drawLedRect(x, y, w, h, colRGB, canv){
// colRGB = { r:<int>,g:<int>, b:<int> }
// canv = target canvas

	var	colHsv = rgbToHsv(colRGB.r, colRGB.g, colRGB.b),
		colMainRgb = hsvToRgb(colHsv[0], colHsv[1], 1),
		colMain = {r:colMainRgb[0], g:colMainRgb[1], b:colMainRgb[2]},
		ctx = canv.getContext("2d");

	if(w > h){ var ledSize = w ; } else { var ledSize = h; }

	ctx.globalCompositeOperation = 'source-over';

	if(colHsv[2] > 0){
		var	pX = x + w / 2,
			pY = y + h / 2,
			lSize = ledSize * (colHsv[2] * 0.7 + 0.1),
			alpha1 = (colHsv[2] * 0.5 + 0.5),
			alpha2 = (colHsv[2] * 0.8 + 0.2);

		createLedGlow( colMain, pX, pY, canv, ledSize, alpha2)
		ctx.fillRect(x, y, w, h);

		createLedFill( colMain, pX, pY, canv, lSize * 0.9, alpha1)
		ctx.fillRect(x, y, w, h);
	}
}

function drawLedRound(x, y, r, colRGB, canv){
// colRGB = { r:<int>,g:<int>, b:<int> }
// canv = target canvas

	var	colHsv = rgbToHsv(colRGB.r, colRGB.g, colRGB.b),
		colMainRgb = hsvToRgb(colHsv[0], colHsv[1], 1),
		colMain = {r:colMainRgb[0], g:colMainRgb[1], b:colMainRgb[2]},
		ctx = canv.getContext("2d");

	var ledSize = r * 2;

	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = '#000000';
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI);
	ctx.fill();

	if(colHsv[2] > 0){
		var	lSize = ledSize * (colHsv[2] * 0.6 + 0.2),
			alpha1 = (colHsv[2]*0.5 + 0.5),
			alpha2 = (colHsv[2] * 0.3 + 0.2);

		createLedGlow( colMain, x, y, canv, ledSize, alpha2)
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2*Math.PI);
		ctx.fill();

		createLedFill( colMain, x, y, canv, lSize, alpha1)
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2*Math.PI);
		ctx.fill();

	}
}

function drawLedRing(){
	ctx = canvRing.getContext("2d");
	ctx.globalCompositeOperation='source-over';
	ctx.shadowBlur = 0;
	ctx.clearRect(0, 0, editorWidth, editorWidth);

	var	ringRadius = caseRadius * 1.05,
		ledSize = 2 * Math.PI * ringRadius / 24, // (2 * PI * r) / number of leds
		ledFactor = ledSize / ledW,
		alpha = 0;

	// calc led positions
	var pos = []; //{x:0, y:0};
	for(var i=0; i<24; i++){
		var	angle = (i+9) * 2 * Math.PI / 24,
			xPos = editorHalfWidth + ringRadius * Math.cos(angle),
			yPos = editorHalfWidth + ringRadius * Math.sin(angle);
		pos[i] = {x:xPos, y:yPos}
	}

	drawLedGroup(canvRing, pos, ledFrame, ledSize);

	// background
	ctx.globalCompositeOperation='destination-over';
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, editorWidth, editorWidth);
}

function drawLedGroup(canv, arrayPos, arrayLedFrame, ledSize, areaX, areaY, areaW, areaH, generalAlpha){

	if(areaX == undefined){ areaX = 0;}
	if(areaY == undefined){ areaY = 0;}
	if(areaW == undefined){ areaW = canv.width;}
	if(areaH == undefined){ areaH = canv.height;}
	if(generalAlpha == undefined){ generalAlpha = 1;}

	var ctx = canv.getContext("2d");
	ctx.clearRect(areaX, areaY, areaW, areaH);
	ctx.shadowBlur = 0;



	// led center
	ctx.globalCompositeOperation='lighter';
	arrayLedFrame.forEach(function(item, index){
		createLedFill( item, arrayPos[index].x, arrayPos[index].y, canv, ledSize, generalAlpha);
		ctx.fillRect(areaX, areaY, areaW, areaH);
	});
	canvasDarknessToAlpha(canv, areaX, areaY, areaW, areaH);

	// led glow
	ctx.globalCompositeOperation='destination-over';
	arrayLedFrame.forEach(function(item, index){
		createLedGlow( item, arrayPos[index].x, arrayPos[index].y, canv, ledSize, generalAlpha);
		ctx.fillRect(areaX, areaY, areaW, areaH);
	});




	// ring glow
	ctx.globalCompositeOperation='source-over';
	var colR = 0, colG = 0, colB = 0, valTot = 0, valCount = 0;
	arrayLedFrame.forEach(function(item, index){
		if(arrayLedFrame.length < 25 || (arrayLedFrame.length == 25 && index > 0) ){
			var colView = getViewColor(item);
			valTot += rgbToHsv(colView.r, colView.g, colView.b)[2];
			valCount ++;
			colR += Number(colView.r);
			colG += Number(colView.g);
			colB += Number(colView.b);
		}
	});
	var alphaRing = 1, maxGlow = 255;
	if(colR > colG && colR > colB && colR > maxGlow){
		alphaRing = colR / maxGlow;
	} else if(colG > colR && colG > colB && colG > maxGlow){
		alphaRing = colG / maxGlow;
	} else if(colB > maxGlow){
		alphaRing = colB / maxGlow;
	}
	colR /= alphaRing;
	colG /= alphaRing;
	colB /= alphaRing;

	ctx.fillStyle = 'rgba(' + Math.round(colR) + ',' + Math.round(colG) + ',' + Math.round(colB) + ', ' + 0.15 + ')';
	ctx.fillRect(areaX, areaY, areaW, areaH);
}

function canvasDarknessToAlpha(canvasConvert, areaX, areaY, areaW, areaH){
	if(areaX == undefined){ areaX = 0;}
	if(areaY == undefined){ areaY = 0;}
	if(areaW == undefined){ areaW = canvasConvert.width;}
	if(areaH == undefined){ areaH = canvasConvert.height;}

	var	ctx = canvasConvert.getContext("2d"),
		imgData=ctx.getImageData(areaX, areaY, areaW, areaH);

	for (var i=0;i<imgData.data.length;i+=4) {
		var	colHSV = rgbToHsv(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2]),
			newRGB = hsvToRgb(colHSV[0], colHSV[1], 1);

		if(colHSV[2] < 1){
			imgData.data[i] = newRGB[0];
			imgData.data[i + 1] = newRGB[1];
			imgData.data[i + 2] = newRGB[2];
			imgData.data[i + 3] = Math.round( imgData.data[i + 3] * colHSV[2] );
		}
	}
	ctx.putImageData(imgData,areaX, areaY);
}


function createLedFill( codeRGB, posX, posY, canv, ledSize, generalAlpha){
// codeRGB = rgb color object; { r:<int>, g:<int>, b:<int> }

	var	ctx = canv.getContext("2d"),
		colRGB = getViewColor(codeRGB),
		colHSV = rgbToHsv( colRGB.r, colRGB.g, colRGB.b);

	if(generalAlpha == undefined){ generalAlpha = 1;}

	if(colHSV[2] > 0){
		var	alpha = colHSV[2] * 0.8 + 0.2,
			viewRgb = hsvToRgb(colHSV[0], colHSV[1], 1),
			grdRgb = Math.round(viewRgb[0]) + ',' + Math.round(viewRgb[1]) + ',' + Math.round(viewRgb[2]),
			lWidth = 0.4,						// fysical led size = 0.4 @ ledSize = 1
			grd = ctx.createRadialGradient(posX, posY, 0, posX, posY, ledSize);

		var	satC = colHSV[1],
			satC2 = colHSV[1];

		if(colHSV[1] >= 0.80){
			satC -= ((colHSV[1] - 0.80));
			satC2 = satC + (colHSV[1] - satC) * 0.5;
			if( satC < 0 ){satC = 0;}
		}

		var	viewRgbC = hsvToRgb(colHSV[0], satC, 1),
			grdRgbC = Math.round(viewRgbC[0]) + ',' + Math.round(viewRgbC[1]) + ',' + Math.round(viewRgbC[2]),
			viewRgbC2 = hsvToRgb(colHSV[0], satC2, 1),
			grdRgbC2 = Math.round(viewRgbC2[0]) + ',' + Math.round(viewRgbC2[1]) + ',' + Math.round(viewRgbC2[2]);

		grd.addColorStop( 0 , 'rgba(' + grdRgbC + ',' + (generalAlpha * alpha) + ')' );
		grd.addColorStop( lWidth / 2 , 'rgba(' + grdRgbC2 + ',' + (generalAlpha * alpha)  + ')' );
		grd.addColorStop( 1 - lWidth / 2, 'rgba(' + grdRgb + ',' + 0 + ')' );
		grd.addColorStop( 1, 'rgba(' + grdRgb + ',0)' );
		ctx.fillStyle = grd;
	}else{
		ctx.fillStyle = 'rgba(255,255,255,0)';
	}
}

function createLedGlow( codeRGB, posX, posY, canv, ledSize, generalAlpha){
// on-screen LED, glow/bottom
// codeRGB = rgb color object; { r:<int>, g:<int>, b:<int> }
	var	ctx = canv.getContext("2d"),
		colRGB = getViewColor(codeRGB),
		colHSV = rgbToHsv( colRGB.r, colRGB.g, colRGB.b),
		defaultRadiation = 0.5;

	if(generalAlpha == undefined){ generalAlpha = 1;}

	if(colHSV[2] > 0){
		var	alpha = colHSV[2] * 0.9 + 0.1,
			viewRgb = hsvToRgb(colHSV[0], colHSV[1], 1),
			grdRgb = Math.round(viewRgb[0]) + ',' + Math.round(viewRgb[1]) + ',' + Math.round(viewRgb[2]),
			lWidth = 0.4,						// fysical led size = 0.4 @ ledSize = 1
			grd = ctx.createRadialGradient(posX, posY, 0, posX, posY, ledSize * 2);

		grd.addColorStop( 0 , 'rgba(' + grdRgb + ',' + (generalAlpha * alpha) + ')' );
		grd.addColorStop( 1 , 'rgba(' + grdRgb + ',0)' );
		ctx.fillStyle = grd;
	}else{
		ctx.fillStyle = 'rgba(255,255,255,0)';
	}
}



/* Ledring DOC for createLedFill(...), createLedGlow(...)
         LED 0                LED 1                LED 2             ... LED 23
|      ========      |      ========      |      ========      |     ... etc

| glow |-led--| glow | glow |-led--| glow | glow |-led--| glow |     ...
| 0.3    0.4     0.3 | 0.3    0.4     0.3 | 0.3    0.4     0.3 |     ...
|<-----ledSize ----->|<-----ledSize ----->|<-----ledSize ----->|     ...
          /\ posX,Y            /\ posX,Y            /\ posX,Y        ...


*/

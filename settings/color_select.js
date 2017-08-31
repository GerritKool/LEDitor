var 	colPal = [],				// palette
	stepColBright = 12,			// number of dark/light steps for palette
	colBase = [				// color base for palette
		{r:127, g:127, b:127},
		{r:255, g:  0, b:  0},
		{r:255, g: 85, b:  0},
		{r:255, g:170, b:  0},
		{r:255, g:255, b:  0},
		{r:170, g:255, b:  0},
		{r: 85, g:255, b:  0},
		{r:  0, g:255, b:  0},
		{r:  0, g:255, b: 85},
		{r:  0, g:255, b:170},
		{r:  0, g:255, b:255},
		{r:  0, g:170, b:255},
		{r:  0, g: 85, b:255},
		{r:  0, g:  0, b:255},
		{r: 85, g:  0, b:255},
		{r:170, g:  0, b:255},
		{r:255, g:  0, b:255},
		{r:255, g:  0, b:170},
		{r:255, g:  0, b: 85}
	],

	selectedColor = 0, 			// palette selection
	selectedColorRGB = {r:0, g:0, b:0},	// editor color

	colorSelectionOn = false,		// color selection activated?
	colorPickerOn = false,			// color pick mode activated?
	saveUserColorOn = false;		// 'store user color' activated?

function createPaletteData(){
// create color palette colPal[{r,g,b}, {r,g,b}, ...]
	var cStep = stepColBright*2;
	for(var j = 0; j <= cStep ; j ++){
		for(var i=0; i<colBase.length; i++){
			colHSL = rgbToHsl(Number(colBase[i].r), Number(colBase[i].g), Number(colBase[i].b));
			if(i == 0){
				var	stepL = 1/cStep,
					newL = 1 - (stepL * j);
			} else {
				var	maxL = 0.9,
					stepL = maxL/(cStep+1),
					xx1 = Math.floor( 0.5 / stepL ) * stepL;
					newL = 0.5 - xx1 + Math.floor((maxL/stepL)) * stepL - (stepL * j);
			}
			colRGB = hslToRgb(colHSL[0], colHSL[1], newL );
			colPal[colBase.length * j + i] = {r:Math.round(colRGB[0]), g:Math.round(colRGB[1]), b:Math.round(colRGB[2])}
		}
	}
}

function setupAdvancedPresets(){
// setup advanced color presets (off, red, yellow, green, cyan, blue, magenta, white)
	var	h = 0, s = 0, v = 0,
		butWidth = Math.floor((400 - 2 * 20) / 8),
		butHeight = butWidth / 3;

	for(var i = 0; i < 8; i ++){
		var xObj = document.getElementById('colPreset'+i);
		xObj.style.position = 'absolute';
		xObj.style.left = (i*45+20)+ 'px';
		xObj.style.top='325px';
		xObj.style.width = butWidth + 'px';
		xObj.style.height = butHeight + 'px';
		xObj.style.backgroundColor = 'rgba(0,0,0,0)';
		xObj.style.borderColor = '#3f3f3f';

		switch(i){
		case 0: h = 0; s = 0; v = 0; break;
		case 7: h = 0; s = 0; v = 1; break;
		default: h = (i - 1) /6; s = 1; v = 1;
		}

		var	arrayRgb = hsvToRgb(h,s,v),
			objRgb = {r:arrayRgb[0], g:arrayRgb[1], b:arrayRgb[2] },
			xVal = contrastBlackOrWhite( objRgb );

		var	ctx = canvColorSet.getContext("2d");
		ctx.fillStyle='#000000';
		ctx.fillRect(i*butWidth+20 + 1, 325 + 1, butWidth-2, butHeight-2);
		drawLedRect(i*butWidth+20 + 1, 325 + 1, butWidth-2, butHeight-2, objRgb, canvColorSet);
		xObj.style.color = 'rgb(' + xVal.r + ',' + xVal.g + ',' + xVal.b + ')';
	}
}
createPaletteData();
setupAdvancedPresets();


function redrawPalette(){
	var	ctx = canvColorSet.getContext("2d"),
		bWidth = Number(colSet0.style.borderWidth.substr(0, colSet0.style.borderWidth.length - 2) ),
		xWidth = colSet0.offsetWidth,
		xHeight = colSet0.offsetHeight,
		cWidth = xWidth - bWidth * 2,
		cHeight = xHeight - bWidth * 2,
		yTop = (4 + editW2 - divColorPal.offsetHeight/2);

	ctx.clearRect(0, 0, canvColorSet.width, canvColorSet.height);
	ctx.globalCompositeOperation = 'source-over';
	for(var j=0; j< stepColBright*2+1 ; j++){
		for(var i=0; i<colBase.length; i++){
			var	colRGB = colPal[colBase.length * j + i],
				x1 = i * xWidth,
				y1 = j * xHeight;

			ctx.fillStyle = '#000000';
			ctx.fillRect( x1, yTop + y1, xWidth, xHeight -1);
			drawLedRect( x1, yTop + y1, xWidth, xHeight -1, colRGB, canvColorSet);

			if(colRGB.r == '0' && colRGB.g == '0' && colRGB.b == '0'){
				var	x2 = x1 + xWidth,
					y2 = y1 + xHeight - 1;
				// draw cross for led-off
				ctx.strokeStyle = '#ffffff';
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(x1, yTop + y1);
				ctx.lineTo(x2, yTop + y2);
				ctx.moveTo(x2, yTop + y1);
				ctx.lineTo(x1, yTop + y2);
				ctx.stroke();
				ctx.lineWidth = 1;
			}
			document.getElementById('colSet'+(colBase.length * j + i)).style.borderColor = getTopColor().b;
		}
	}

	ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle = getTopColor().b;
	ctx.fillRect(0, 0, canvColorSet.width, canvColorSet.height);
	ctx.globalCompositeOperation = 'source-over';
	ctx.clearRect(50, 5, canvColorSet.width - 55, 20);
}

function redrawSliders(){
	var	ctx = canvColorSet.getContext("2d"),
		h = sliderColorHue.value,
		s = sliderColorSat.value,
		v = sliderColorVal.value,
		sliderL = sliderColorHue.offsetLeft,
		sliderW = sliderColorHue.offsetWidth,
		sliderH = sliderColorHue.offsetHeight,
		sliderT = [ sliderColorHue.offsetTop, sliderColorSat.offsetTop, sliderColorVal.offsetTop ],
		trackWidth = sliderW-11,
		slideGraphStep = 1/trackWidth,
		yDivis = 1/canvColorSet.height;

	ctx.shadowBlur = 0;
	redrawColorSurface();

	sliderColorHueInfo.style.color = getTopColor().t;
	sliderColorSatInfo.style.color = getTopColor().t;
	sliderColorValInfo.style.color = getTopColor().t;
	sliderColorHueValue.style.color = getTopColor().t;
	sliderColorSatValue.style.color = getTopColor().t;
	sliderColorValValue.style.color = getTopColor().t;

	// draw slider indicator graphics
	for(var i = 0; i <= trackWidth; i ++){
		var posL = 5 + sliderL + i;

		// hue
		var colRgb = hsvToRgb(i * slideGraphStep, 1, 1);
		var objRgb = adjustRgbGamma({r:colRgb[0], g:colRgb[1], b:colRgb[2]})
		ctx.fillStyle = 'rgba(' + Math.round(objRgb.r) + ', ' + Math.round(objRgb.g) + ', ' + Math.round(objRgb.b) +',1 )';
		ctx.fillRect( posL, sliderT[0]-2, 1, sliderH + 4 );

		// saturation
		var colRgb = hsvToRgb( h, i * slideGraphStep, 1);
		var objRgb = adjustRgbGamma({r:colRgb[0], g:colRgb[1], b:colRgb[2]})
		ctx.fillStyle = 'rgba(' + Math.round(objRgb.r) + ', ' + Math.round(objRgb.g) + ', ' + Math.round(objRgb.b) +',1 )';
		ctx.fillRect( 5 + sliderL + i, sliderT[1]-2, 1, sliderH + 4 );

		// brightness
		var colRgb = hsvToRgb( h, s, i * slideGraphStep);
		var objRgb = adjustRgbGamma({r:colRgb[0], g:colRgb[1], b:colRgb[2]})
		ctx.fillStyle = 'rgba(' + Math.round(objRgb.r) + ', ' + Math.round(objRgb.g) + ', ' + Math.round(objRgb.b) +',1 )';
		ctx.fillRect( 5 + sliderL + i, sliderT[2]-2, 1, sliderH + 4 );
	}
	// slider border
	ctx.shadowBlur = 0;
	ctx.lineWidth = 0.4;
	ctx.strokeStyle = getTopColor().t;
	for(var i = 0; i < 3; i ++){
		ctx.strokeRect( 3 + sliderL, sliderT[i]-4, sliderW-6, sliderH + 8 );
	}
	ctx.lineWidth = 1;

	// slider values
	sliderColorHueValue.innerHTML = Math.round(sliderColorHue.value * 360) + '&deg;';
	sliderColorSatValue.innerHTML = (Math.round(sliderColorSat.value * 200)/2).toFixed(1) + '%';
	sliderColorValValue.innerHTML = (Math.round(sliderColorVal.value * 200)/2).toFixed(1) + '%';

	// track markers
	for(i = 30; i < 360; i +=30){
		var posL = 5 + sliderL + trackWidth / 360 * i;
		ctx.strokeStyle = getTopColor().b;
		ctx.strokeRect( posL-1, sliderT[0] + sliderH - 2, 3, 7 );
		ctx.strokeStyle = getTopColor().t;
		ctx.strokeRect( posL, sliderT[0] + sliderH - 1, 1, 5 );
	}
	for(i = 10; i < 100; i +=10){
		var posL = 5 + sliderL + trackWidth / 100 * i;
		ctx.strokeStyle = getTopColor().b;
		ctx.strokeRect( posL-1, sliderT[1] + sliderH - 2, 3, 7 );
		ctx.strokeRect( posL-1, sliderT[2] + sliderH - 2, 3, 7 );
		ctx.strokeStyle = getTopColor().t;
		ctx.strokeRect( posL, sliderT[1] + sliderH - 1, 1, 5 );
		ctx.strokeRect( posL, sliderT[2] + sliderH - 1, 1, 5 );
	}

	drawLedColorSelection();
	colRGB = hsvToRgb(h, s, v);
	refreshAdvancedUserPresets({r:colRGB[0], g:colRGB[1], b:colRGB[2]});
	setupAdvancedPresets();
}

function redrawColorSurface(){
// draw palette/slider surface + ring hole
	var	ctx = canvColorSet.getContext("2d");

	ctx.fillStyle = getTopColor().b;
	ctx.fillRect(0, 0, canvColorSet.width, canvColorSet.height);
	ctx.clearRect(50, 5, canvColorSet.width - 55, 20);
}

function refreshAdvancedUserPresets(colCompare){ // colCompare = rgbObject
// setup advanced color presets
	if(colCompare == undefined){ colCompare = '';}

	var	butBorder = 1,
		butWidth = Math.floor((400 - 2 * 20) / 8),
		butHeight = butWidth / 3,
		butLeft = Math.round((400 - 8 * butWidth) / 2),
		butTop = 250;

	but_set_user_color.style.left = butLeft + 'px';
	but_set_user_color.style.top = butTop + 'px';
	but_set_user_color.style.width = (butWidth * 3) + 'px';
	but_set_user_color.style.height = butHeight + 'px';
	but_set_user_color.style.color = getTopColor().t;
	but_set_user_color.style.backgroundColor = getTopColor().b;

	ctx = canvColorSet.getContext("2d");
	ctx.shadowBlur = 0;
	for(var i = 0; i < 8; i ++){
		for(var j = 0; j < 3; j ++){
			var userRGB = userColor[j * 8 + i];
			var colBack = getViewColor(userRGB);
			var colText = contrastBlackOrWhite(colBack);
			var xObj = document.getElementById('colUser'+ (j * 8 + i));
			xObj.style.backgroundColor = 'rgba(' + colBack.r + ',' + colBack.g + ',' + colBack.b + ',0)';
			xObj.style.color = 'rgb(' + colText.r + ',' + colText.g + ',' + colText.b + ')';
			xObj.style.position = 'absolute';
			xObj.style.width = butWidth + 'px';
			xObj.style.height = butHeight + 'px';
			xObj.style.left = (i * butWidth + butLeft)+ 'px';
			xObj.style.top= (butTop + (j+1) * (butHeight +1) ) + 'px';
			xObj.style.border = butBorder +'px solid ' + '#3f3f3f';
			if(colCompare != ''){
				if(userRGB.r == colCompare.r && userRGB.g == colCompare.g && userRGB.b == colCompare.b){
					xObj.innerHTML = '*';
				} else {
					xObj.innerHTML = '';
				}
			} else {
				xObj.innerHTML = '';
			}

			var xNum = j * 8 + i + 1;
			var	ctx = canvColorSet.getContext("2d");
			ctx.fillStyle='#000000';
			ctx.fillRect(i * butWidth + butLeft + 1, butTop + (j+1) * (butHeight + 1) + 1, butWidth - 2, butHeight - 2);
			drawLedRect(i * butWidth + butLeft + 1, butTop + (j+1) * (butHeight + 1) + 1, butWidth - 2, butHeight - 2, userColor[j * 8 + i], canvColorSet);
			ctx.fillStyle = '#ffffff';
			ctx.shadowColor = '#000000';
			ctx.shadowBlur = 2;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'hanging';
			ctx.fillText(xNum, i * butWidth + butLeft + 3, butTop + (j+1) * (butHeight + 1) + 3);
			ctx.fillText(xNum, i * butWidth + butLeft + 3, butTop + (j+1) * (butHeight + 1) + 3);
			ctx.shadowBlur = 0;
		}
	}
}

function drawLedColorSelection(){
	var arrayRgb = hsvToRgb(Number(sliderColorHue.value), Number(sliderColorSat.value), Number(sliderColorVal.value));
	var hInv = Number(sliderColorHue.value) - 0.5; if(hInv < 0){hInv += 1;}
	var arrayInv = hsvToRgb(hInv, Number(sliderColorSat.value), Number(sliderColorVal.value));

	var	colRGB = {r:Math.round(arrayRgb[0]), g:Math.round(arrayRgb[1]), b:Math.round(arrayRgb[2]) },
		invRGB = {r:Math.round(arrayInv[0]), g:Math.round(arrayInv[1]), b:Math.round(arrayInv[2]) },
		ctx = canvColorLed.getContext("2d"),
		arrPos = [],
		arrLed = [],
		xStep = canvColorLed.width / 5;

	for(var i = 0; i < 5; i++){
		var xLed = i; if(i < 3){ xLed += 1; }
		if( i != 2 ){
			var objPrev = document.getElementById('ledPrev' + xLed);
			var objVal = objPrev.value;
			switch(objVal){
				case 'off': objPrev.innerHTML = thisApp.text.off; break;
				case 'same': objPrev.innerHTML = thisApp.text.same; break;
				case 'inv': objPrev.innerHTML = thisApp.text.inverted; break;
			}

			objPrev.style.left = (i * xStep + canvColorLed.offsetLeft) + 'px';
			objPrev.style.width = xStep + 'px';

		} else {
			var objVal = 'same';
		}

		switch(objVal){
			case'same':
				arrLed.push({r:colRGB.r, g:colRGB.g, b:colRGB.b});
				arrPos.push({x:xStep/2 + i * xStep, y:15});
				break;
			case'inv':
				arrLed.push({r:invRGB.r, g:invRGB.g, b:invRGB.b});
				arrPos.push({x:xStep/2 + i * xStep, y:15});
				break;
		}
	}
	drawLedGroup(canvColorLed, arrPos, arrLed, xStep)

	showOnRing( {r: colRGB.r, g: colRGB.g, b: colRGB.b} );
}




function initColorPreset(obj){
// button: preset/user color at advanced color selection.
// get or store user color, get preset color
	if(obj.id.substr(0,7) == 'colUser'){ // user color
		var	xCol = Number(obj.id.substr(7));
		if(saveUserColorOn){ // store preffered user color
			var colRGB = hsvToRgb(sliderColorHue.value, sliderColorSat.value, sliderColorVal.value);
			userColor[xCol] = { r:Math.round(colRGB[0]), g:Math.round(colRGB[1]), b:Math.round(colRGB[2]) };
			refreshAdvancedUserPresets();
			setSettingUserColor();
			but_set_user_color.click();
			return;

		} else { // get user color
			var colHSV = rgbToHsv( userColor[xCol].r, userColor[xCol].g, userColor[xCol].b );
		}
	} else { // get preset color

		var	pCol =[ {r:0,g:0,b:0}, {r:255,g:0,b:0}, {r:255,g:255,b:0}, {r:0,g:255,b:0}, {r:0,g:255,b:255}, {r:0,g:0,b:255}, {r:255,g:0,b:255}, {r:255,g:255,b:255} ],
			xCol = Number(obj.id.substr(obj.id.length - 1)),
			colHSV = rgbToHsv( pCol[xCol].r, pCol[xCol].g, pCol[xCol].b );
	}
	if( !saveUserColorOn ){
		sliderColorHue.value = colHSV[0];
		sliderColorSat.value = colHSV[1];
		sliderColorVal.value = colHSV[2];
		sliderActivate(sliderColorHue);
	}
}

function initColorSelectType(){
// button: palette or advanced (colorSelectType: 0 or 1)
	colorSelectType ++; if(colorSelectType == 2){ colorSelectType = 0; }
	initColorSelection();
	setSettingColorSelectType();
}

function initColorSelection(showSelector, acceptColor){
// button: edit color or generator color 1...3 (choose color)
// show or hide color selector (showSelector = true/undefined or false)
// accept color selection (acceptColor = true and showSelector = false)

	if(showSelector == undefined){ showSelector = true;}
	if(acceptColor == undefined){ acceptColor = false;}

	if(showSelector){
		selectLedColor.style.visibility = 'visible';
		selectLedColor.style.backgroundColor= getTopColor().b;
		but_color_select_type.style.backgroundColor= getTopColor().b;
		but_color_select_cancel.style.backgroundColor= getTopColor().b;
		but_color_select_cancel.style.color= getTopColor().t;
		but_color_select_accept.style.backgroundColor= getTopColor().b;

		for(var i = 1; i <5; i ++){
			document.getElementById('ledPrev' + i).style.backgroundColor= getTopColor().b;
			document.getElementById('ledPrev' + i).style.color= getTopColor().t;
		}


		if(!colorSelectionOn){
			switch(colorSelector){
				case 0:
					var colHSV = rgbToHsv( selectedColorRGB.r, selectedColorRGB.g, selectedColorRGB.b );
					break;

				case 1: case 2: case 3:
					var colHSV = rgbToHsv( generatorColor[colorSelector-1][0], generatorColor[colorSelector-1][1], generatorColor[colorSelector-1][2] );
					break;
			}
			sliderColorHue.value = colHSV[0];
			sliderColorSat.value = colHSV[1];
			sliderColorVal.value = colHSV[2];
			drawLedColorSelection();
		}

		switch(colorSelectType){
		case 0:
			redrawPalette();
			divColorPal.style.visibility = 'visible';
			fullColSelect.style.visibility = 'hidden';
			but_color_select_type.innerHTML = '<img src="../assets/images/color_control.png" height="30" width="30" style="float: center;">';
			break;

		case 1:
			redrawSliders();
			divColorPal.style.visibility = 'hidden';
			fullColSelect.style.visibility = 'visible';
			but_color_select_type.innerHTML = '<img src="../assets/images/color_palette.png" height="30" width="30" style="float: center;">';
			break;

		}
		colorSelectionOn = true;
		refreshButtons(false);
	} else {
		divColorPal.style.visibility = 'hidden';
		fullColSelect.style.visibility = 'hidden';
		selectLedColor.style.visibility = 'hidden';
		colorSelectionOn = false;
		refreshButtons();
		if(acceptColor){
			var arrayRgb = hsvToRgb( Number(sliderColorHue.value), Number(sliderColorSat.value), Number(sliderColorVal.value));
			var objRgb = {r:Math.round(arrayRgb[0]), g:Math.round(arrayRgb[1]), b:Math.round(arrayRgb[2]) };
			assignColorSelection( objRgb );

		}
	}
	if(saveUserColorOn){ but_set_user_color.click(); }
}

function assignColorSelection(objColorRGB){
// assign color setting to editor color / generator color
	switch(colorSelector){
		case 0: // edit color
			selectedColorRGB = objColorRGB;
			refreshLedMarkers();
			ledSelectPreview(objColorRGB);
			break;

		case 1: // color generator 1
			if(Number(objColorRGB.r) + Number(objColorRGB.g) + Number(objColorRGB.b) != 0){
				generatorColor[0][0] = objColorRGB.r;
				generatorColor[0][1] = objColorRGB.g;
				generatorColor[0][2] = objColorRGB.b;
				ledSelectPreview(objColorRGB);
			}
			break;

		case 2: case 3: // color generator 2 & 3
			generatorColor[colorSelector-1][0] = objColorRGB.r;
			generatorColor[colorSelector-1][1] = objColorRGB.g;
			generatorColor[colorSelector-1][2] = objColorRGB.b;
			ledSelectPreview(objColorRGB);
			break;
	}
}

function clickLedPreview( obj ){
	switch( obj.value ){
	case 'off':
		obj.value = 'same';
		break;
	case 'same':
		obj.value = 'inv';
		break;
	case 'inv':
		obj.value = 'off';
		break;
	}
	drawLedColorSelection();
}


function clickColorPalette(obj){
	var	colorN = Number(obj.id.substr(6)), // colSet-id
		vColor = getViewColor(colPal[colorN]),
		viewCol = vColor.r + ',' + vColor.g + ',' + vColor.b;

	if(colorSelector == 0){ selectedColor = colorN; }


	// set color sliders to color selection
	var colHSV = rgbToHsv(colPal[colorN].r, colPal[colorN].g, colPal[colorN].b);
	sliderColorHue.value = colHSV[0];
	sliderColorSat.value = colHSV[1];
	sliderColorVal.value = colHSV[2];
	drawLedColorSelection();
}

function ledSelectPreview(ledCol, ledText){
	var	ctxCol = colPreview.getContext("2d");

	if(ledCol == ''){ledCol = selectedColorRGB;}
	if(ledText == undefined){ledText = '';}

	if(dropFillType.value == 'type_3' && colorSelector == 0){
		setColPreviewFill('');
	} else {
		setColPreviewFill(ledCol);
	}
}

function setColPreviewFill(col1, col2, nStep){
	// col1 = undefined, col2 = undefined	: selectedColor
	// col1 = '', col2 = undefined		: b/w gradient
	// col1 = rgbObj, col2 = undefined	: col1
	// col1 = rgbObj, col2 = rgbObj		: gradient col1 -> col2

	var colName = '';
	switch(colorSelector){ // editor = 0, generator = 1...3
	case 0:
		var	ctxCol = colPreview.getContext("2d");
		ctxCol.globalCompositeOperation = 'source-over';
		ctxCol.fillStyle='#000000';
		ctxCol.fillRect(0, 0, colPreview.width, colPreview.height);
		if(nStep == 0){nStep = 1;}

		if(col1 == undefined && col2 == undefined){
			drawLedRect( 0, 0, colPreview.width, colPreview.height, selectedColorRGB, colPreview);
			var colName = getColorName(selectedColorRGB);

		} else if(col2 == undefined){
			if(col1 != ''){
				drawLedRect( 0, 0, colPreview.width, colPreview.height, col1, colPreview);
				var colName = getColorName(col1);


			} else {
				var grd=ctxCol.createLinearGradient(0, 0, colPreview.width, 0);
				grd.addColorStop(0, "#000000");
				grd.addColorStop(1, "#ffffff");
				ctxCol.fillStyle = grd;
				ctxCol.fillRect(0, 0, colPreview.width, colPreview.height);
				var colName = thisApp.text.drop_type[2];
			}

		} else {
			if((col1.r + col1.g + col1.b > 0) && (col2.r + col2.g + col2.b > 0)){
				if(nStep < 2){
					nStep = 25 - nStep;
				}

				var	arrayCol = createColorFlow(col1, col2, nStep, dropFillRange.value),
					stepGr = 1 / (nStep-1);

				arrayCol.forEach(function(item, index){
					drawLedRect( colPreview.width * stepGr * (index-1), 0, colPreview.width * stepGr, colPreview.height, item, colPreview);
				});
				var colName = '';


			}
		}
		break;

	case 1: case 2: case 3:
		var colPreviewGen = document.getElementById('canvColGenerator'+ colorSelector);
		var	ctxCol = colPreviewGen.getContext("2d");
		ctxCol.globalCompositeOperation = 'source-over';
		ctxCol.fillStyle='#000000';
		ctxCol.fillRect(0, 0, colPreviewGen.width, colPreviewGen.height);
		drawLedRect( 0, 0, colPreviewGen.width, colPreviewGen.height, {r:col1.r, g:col1.g, b:col1.b}, colPreviewGen);
		colName = getColorName(col1);
		runGenerator(dropGenerator.value);
		actionUndo();
		break;
	}

	ctxCol.textBaseline = 'hanging';
	ctxCol.textAlign = 'left';
	ctxCol.fillStyle = '#ffffff';
	ctxCol.shadowColor = '#000000';
	ctxCol.shadowBlur = 2;
	ctxCol.font = '10px helvetica-neue, sans-serif';
	ctxCol.fillText(colName,2,2);
	ctxCol.fillText(colName,2,2);
}

function previewColorPicker(obj){
	var id = obj.id.substr(9);
	setColPreviewFill(ledFrames[selectedFrame][id]);
}

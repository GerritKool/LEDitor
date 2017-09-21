var 	ctxRing = canvRing.getContext("2d"),				// ring colors
	ctxRing2 = canvRing2.getContext("2d"),				// ring colors 2
	ctxTop = canvTop.getContext("2d"),				// Homey's case
	blinkInterval = 0,
	valFillType = '',
	valFillRange = '',
	valGenFlowType = '',
	fileListEmpty = null;


function setupUI(){
	createPaletteData();
	setupAdvancedPresets();

	parentRing.style.width = editW + 'px';
	parentRing.style.height = editW + 'px';
	divRing.style.width = editW + 'px';
	divRing.style.height = editW + 'px';
	canvRing.width = editW;
	canvRing.height = editW;
	canvRing.style.width = editW + 'px';
	canvRing.style.height = editW + 'px';
	canvRing2.width = editW;
	canvRing2.height = editW;
	canvRing2.style.width = editW + 'px';
	canvRing2.style.height = editW + 'px';
	canvTop.width = editW;
	canvTop.height = editW;
	canvTop.style.width = editW + 'px';
	canvTop.style.height = editW + 'px';
	but_rename_ani.style.backgroundColor = butColorDef;
	but_copy_ani.style.backgroundColor = butColorDef;
	dropAnimation.style.backgroundColor = butColorDef;
	butPlay.style.backgroundColor = butColorDef;
	butPreview.style.backgroundColor = butColorDef;
	dropFillType.style.backgroundColor = butColorDef;
	dropFillRange.style.backgroundColor = butColorDef;
	but_color_acquire.style.backgroundColor = butColorDef;
	but_edit_undo.style.backgroundColor = butColorDefOnWhite ;
	but_edit_redo.style.backgroundColor = butColorDefOnWhite

	canvRing.style.filter = 'blur(7px)';
	canvRing2.style.filter = 'blur(7px)';
	canvColorLed.style.filter = 'blur(8px)';

	// color fill selectors
	var tHSV = thisApp.text.hue.substr(0, 1).toUpperCase() + thisApp.text.saturation.substr(0, 1).toUpperCase() + thisApp.text.brightness.substr(0, 1).toUpperCase();
	var xDoc = '<option value="hsv1">' + tHSV + ' 1</option>';
	xDoc += '<option value="hsv2">' + tHSV + ' 2</option>';
	xDoc += '<option value="rgb">RGB</option>';
	dropAniFlowType.innerHTML = xDoc;
	dropAniConnectType.innerHTML = xDoc;
	dropFlowType.innerHTML = xDoc;
	dropGenFlowType.innerHTML = xDoc;

	// setup color selection palette.
	// color selectors
	tempCode = '';
	for(var j=0; j< stepColBright*2+1 ; j++){
		for(var i=0; i<colBase.length; i++){
			tempCode += ('<div id="colSet' + (colBase.length * j + i) + '" style="position:absolute; left:0px; top:0px; width:13px; height:13px; cursor:pointer;" onclick="clickColorPalette(this);" title=""></div>');
		}
	}
	divColorPal.innerHTML = tempCode;

	var	bWidth = 1,
		cWidth = Math.floor(400 / colBase.length) - bWidth * 2,
		cHeight = Math.floor(320 / (colPal.length / colBase.length)) - bWidth * 2,
		xWidth = cWidth + bWidth * 2,
		xHeight = cHeight + bWidth * 2;

	for(var j=0; j< stepColBright*2+1 ; j++){
		for(var i=0; i<colBase.length; i++){
			xColSet = document.getElementById('colSet' + (colBase.length * j + i));
			xColSet.style.width = cWidth + 'px';
			xColSet.style.height = cHeight + 'px';
			xColSet.style.left = (i * xWidth) + 'px';
			xColSet.style.top = (j * xHeight) + 'px';
			xColSet.style.borderWidth = bWidth + 'px';
			xColSet.style.borderStyle = 'solid';
			xColSet.style.color = '#ffffff';
			xColSet.style.textAlign = 'center';
			var	strCol = colPal[colBase.length * j + i].r + ',' + colPal[colBase.length * j + i].g + ',' + colPal[colBase.length * j + i].b,
				vColor = getViewColor(colPal[colBase.length * j + i]),
				viewCol = vColor.r + ',' + vColor.g + ',' + vColor.b;

			switch(strCol){
			case '0,0,0'	: xColSet.innerHTML = ''; xColSet.style.color = '#ffffff'; xColSet.title = thisApp.text.select + ': ' + thisApp.text.no_color; break;
			case '255,0,0'	: xColSet.innerHTML = '*'; xColSet.style.color = '#ffffff'; xColSet.title = thisApp.text.select + ': ' + thisApp.text.pure_red; break;
			case '0,255,0'	: xColSet.innerHTML = '*'; xColSet.style.color = '#000000'; xColSet.title = thisApp.text.select + ': ' + thisApp.text.pure_green; break;
			case '0,0,255'	: xColSet.innerHTML = '*'; xColSet.style.color = '#ffffff'; xColSet.title = thisApp.text.select + ': ' + thisApp.text.pure_blue; break;
			case '255,255,0': xColSet.innerHTML = '*'; xColSet.style.color = '#000000'; xColSet.title = thisApp.text.select + ': ' + thisApp.text.pure_yellow; break;
			case '255,0,255': xColSet.innerHTML = '*'; xColSet.style.color = '#ffffff'; xColSet.title = thisApp.text.select + ': ' + thisApp.text.pure_magenta; break;
			case '0,255,255': xColSet.innerHTML = '*'; xColSet.style.color = '#000000'; xColSet.title = thisApp.text.select + ': ' + thisApp.text.pure_cyan; break;
			case '255,255,255': xColSet.innerHTML = ''; xColSet.style.color = '#000000'; xColSet.title = thisApp.text.select + ': ' + thisApp.text.bright_white; break;
			}
		}
	}
	divColorPal.style.width = (colBase.length * xWidth + 1) + 'px';
	divColorPal.style.height = ((stepColBright*2+1) * xHeight + 1) + 'px';
	divColorPal.style.left = (editW2 - divColorPal.offsetWidth/2) + 'px';
	divColorPal.style.top = (3 + editW2 - divColorPal.offsetHeight/2) + 'px';

	colPreset0.innerHTML = getColorName({ r:0, g:0, b:0});
	colPreset1.innerHTML = getColorName({ r:255, g:0, b:0});
	colPreset2.innerHTML = getColorName({ r:255, g:255, b:0});
	colPreset3.innerHTML = getColorName({ r:0, g:255, b:0});
	colPreset4.innerHTML = getColorName({ r:0, g:255, b:255});
	colPreset5.innerHTML = getColorName({ r:0, g:0, b:255});
	colPreset6.innerHTML = getColorName({ r:255, g:0, b:255});
	colPreset7.innerHTML = getColorName({ r:255, g:255, b:255});

	var xDoc = '<button id="but_set_user_color" style="position:absolute;" class="buttonColPreset" onclick="clickControl(this);" onmouseover="showHelp(this, event)" onmouseout="showHelp(this, event)">' + __('settings.txt_set_user_color') + '</button>';
	for(var i = 0; i < 24; i ++){
		xDoc = xDoc + '<button id="colUser' + i + '" class="buttonColPreset" onclick="initColorPreset(this);" onmouseover="showHelp(this, event)" onmouseout="showHelp(this, event)"></button>';
	}
	userColors.innerHTML = xDoc;

	ledSelectPreview({r:0, b:0, g:0});

	initColorSelection();
	initColorSelection(false);

	// setup led color markers
	tempCode = '';
	for(var i=0; i<24; i++){
		var colNr = i+4; if(colNr>24){colNr -=24;}
		tempCode += ('<div id="ledMarker' + i + '" class="markerLed" onclick="ledMarkerClick(this);" onmouseover="ledMarkerMouseOver(this); showHelp(this, event)" onmouseout="ledMarkerMouseOut(); showHelp(this, event);">' + colNr + '</div>');
	}
	ledMarkers.innerHTML = tempCode; tempCode = null;

	selectEdit({id:'dropFillType', value:'type_1'});

	var ctxImp = canvImportedFrames.getContext("2d");
	ctxImp.font = '20px sans-serif';
	ctxImp.lineWidth = '1px';
	ctxImp.fillStyle = '#800000';
	ctxImp.fillRect(19, 330, 2, 60);
	ctxImp.fillText(__('settings.txt_import_start'), 2, 320);

	fileListEmpty = openLeditor.files;

	refreshButtons(false); // disable buttons
}


// ********** Number controls **********

function changeNumberSetting(obj){
	var 	xVal = Number(obj.value),
		vMin = Number(obj.min),
		vMax = Number(obj.max);

	if(xVal < vMin){xVal = vMin;} else if(xVal > vMax){xVal = vMax;}
	switch(obj.id){

		// ********** Top bar, animation
		case'inFPS':
			if(xVal > inTFPS.value){
				xVal = inTFPS.value;
			}
			inFPS.value = xVal;
			saveAnimation();
			showAnimationTime();
			prevFramePulse = 0;
			opacMs = 1 / (1000 / xVal);
			actionUndo('delayed');
			break;

		case'inTFPS':
			if(xVal < inFPS.value){
				xVal = inFPS.value;
			}
			inTFPS.value = xVal;
			saveAnimation();
			actionUndo('delayed');
			break;

		case'inRPM':
			saveAnimation();
			rotateMs = xVal * 360 / 60000;
			actionUndo('delayed');
			break;

		case'inRepeat':
			showAnimationTime();
			break;

		case'inFrames': // @ image import
			obj.value = xVal;
			if(imgImport != null){
				setupImportArea();
				refreshImageData();
			}
			break;

		// ********** generator
		case'inGenFrame':
			obj.value = xVal;
			runGenerator(dropGenerator.value);
			actionUndo();
			break;

		// ********** settings
		case'settingGammaB':
			if(settingGammaLink.checked){ return; }
		case'settingGammaG':
			if(settingGammaLink.checked){ return; }
		case'settingGammaR':
			obj.value = xVal;
			if(settingGammaLink.checked){
				if(settingGammaG.value != settingGammaR.value){ settingGammaG.value = settingGammaR.value; }
				if(settingGammaB.value != settingGammaR.value){ settingGammaB.value = settingGammaR.value; }
			}
			if(colorSelectionOn){
				switch(colorSelectType){
					case 0: redrawPalette(); break;
					case 1: redrawSliders(); break;
				}
			}
			drawLedColorSelection();
			refreshLedMarkers();
			drawLedRing();
			drawAllFramePreviews();
			setSettingScreenGamma();
			break;

		case'settingShowHomeyTime':
			setSettingShowOnHomeyTime();
			break;
	}
}

// ********** Select / dropdown controls **********
function selectEdit(obj){
	if(colorPickerOn){ but_color_acquire.click(); }

	var xVal = obj.value;
	switch(obj.id){

	// ********** frame edit
	case 'dropFillType':
		if(xVal != valFillType){
			valFillType = xVal;
			switch(valFillType){
				case 'type_1':
					var dropRange = '<option value="range_24">';
					dropRange += thisApp.text.drop_range[0].replace('###', thisApp.text.count[0]);
					for(var i = 1; i < 24; i++){
						dropRange += '<option value="range_' + i + '">';
						if(i == 24){var xCount = thisApp.text.count[0];} else {var xCount = i;}

						dropRange += thisApp.text.drop_range[0].replace('###', xCount);
						if(i > 1 && i < 24){dropRange += thisApp.text.plural_s;}
						dropRange += '</option>';
					}
					document.getElementById('dropFillRange').innerHTML = dropRange;
					refreshButtons();
					ledSelectPreview('');
					dropFillRange.value = 'range_1';
					break;

				case 'type_2':
					var dropRange = '';
					for(var i = 2; i < 13; i++){
						if(Math.floor(24 / i) * i == 24){
							var txtOption = thisApp.text.drop_range[1].replace('###', thisApp.text.count[i]);
							dropRange += '<option value="range_' + i + '">' + txtOption + '</option>';
						}
					}
					document.getElementById('dropFillRange').innerHTML = dropRange;
					refreshButtons();
					ledSelectPreview('');
					break;

				case 'type_3':
					dropFillRange.innerHTML = dropFlowType.innerHTML;
					refreshButtons();
					ledSelectPreview('');
					break;
			}
			refreshLedMarkerTitles();
		}
		break;

	case 'dropFillRange':
		if(xVal != valFillRange){
			valFillRange = xVal;
		}
		break;


	// ********** generator
	case 'dropGenerator':
		if(xVal != valGenType){
			valGenType = xVal;
			runGenerator(xVal);
			actionUndo();
		}
		break;

	case 'dropGenFlowType':
		if(xVal != valGenFlowType){
			valGenFlowType = xVal;
			runGenerator('gen_' + (selectedGenerator + 1));
			actionUndo();
		}
		break;
	}
}

// ********** Click controls **********
function clickControl(obj){
	if(obj.id != 'but_color_acquire' && colorPickerOn){ but_color_acquire.click(); }

	switch(obj.id){

	// ********** animation / frames
	case 'but_ani_open':
		but_generator_close.click();
		openLeditor.click();
		break;

	case 'but_ani_store':
		storeLeditor();
		break;

	case 'but_frame_add': // continue at 'but_frame_copy'
	case 'but_frame_copy':
		but_generator_close.click();
		switch(obj.id){
			case 'but_frame_add':
				var newFrame = emptyFrame.slice(0);
				ledFrames.splice(selectedFrame + 1, 0, newFrame);
				break;
			case 'but_frame_copy':
				var newFrame = ledFrames[selectedFrame].slice(0);
				ledFrames.splice(selectedFrame + 1, 0, newFrame);
				break;
		}
		refreshCounter(1);
		selectedFrame += 1;
		refreshFramesList();
		actionUndo();
		divFrameScroll.scrollTop += document.getElementById('frameLine0').offsetHeight ;
		break;

	case 'but_ani_fill_flow':
		but_generator_close.click();
		aniFill('flow');
		refreshFramesList();
		actionUndo();
		break;

	case 'but_ani_fill_connect':
		but_generator_close.click();
		aniFill('connect');
		refreshFramesList();
		actionUndo();
		break;

	case 'but_ani_delete':
		ledFrames = [emptyFrame];
		refreshFramesList();
		animationIndex[selectedAnimation].name = thisApp.text.empty_preset + ' ' + (selectedAnimation + 1);
		actionUndo();

		break;

	// ********** frame edit
	case 'colPreview':
		colorSelector = 0;
		if(dropFillType.value != 'type_3'){
			initColorSelection();
		}
		break;

	case 'but_color_acquire':
		colorPickerOn = !colorPickerOn;
		if(colorPickerOn){
			but_color_acquire.style.backgroundColor = 'rgb(255,200,127)';
			showActiveLeds(ledMarker0);
		} else {
				but_color_acquire.style.backgroundColor = butColorDef;
			resetShowActive();
		}
		break;

	case 'but_frame_clock':
		but_generator_close.click();
		if(checkAllFrames.checked){
			for(var i = 0; i < ledFrames.length; i++){
				frameRotateClock(i);
			}
			drawAllFramePreviews();
		} else {
			frameRotateClock(selectedFrame);
			drawFramePreview(selectedFrame);
		}
		activateSelect();
		actionUndo();
		break;

	case 'but_frame_counterclock':
		but_generator_close.click();
		if(checkAllFrames.checked){
			for(var i = 0; i < ledFrames.length; i++){
				frameRotateCounterclock(i);
			}
			drawAllFramePreviews();
		} else {
			frameRotateCounterclock(selectedFrame);
			drawFramePreview(selectedFrame);
		}
		activateSelect();
		actionUndo();
		break;

	case 'but_frame_push':
		but_generator_close.click();
		if(checkAllFrames.checked){
			for(var i = 0; i < ledFrames.length; i++){
				framePush(i);
			}
			drawAllFramePreviews();
		} else {
			framePush(selectedFrame);
			drawFramePreview(selectedFrame);
		}
		activateSelect();
		actionUndo();
		break;

	case 'but_frame_pull':
		but_generator_close.click();
		if(checkAllFrames.checked){
			for(var i = 0; i < ledFrames.length; i++){
				framePull(i);
			}
			drawAllFramePreviews();
		} else {
			framePull(selectedFrame);
			drawFramePreview(selectedFrame);
		}
		activateSelect();
		actionUndo();
		break;

	case 'but_edit_fill':
		but_generator_close.click();
		if(checkAllFrames.checked){
			for(var i = 0; i < ledFrames.length; i++){
				frameFill(i);
			}
			drawAllFramePreviews();
		} else {
			frameFill(selectedFrame);
			drawFramePreview(selectedFrame);
		}
		refreshButtons();
		activateSelect();
		actionUndo();
		break;

	case 'but_edit_flow':
		but_generator_close.click();
		if(checkAllFrames.checked){
			for(var i = 0; i < ledFrames.length; i++){
				frameFlow(i);
			}
			drawAllFramePreviews();
		} else {
			frameFlow(selectedFrame);
			drawFramePreview(selectedFrame);
		}
		refreshButtons();
		activateSelect();
		actionUndo();
		break;

	case 'checkAllFrames':
		if(checkAllFrames.checked){ var dArray = '2, 0'; } else { var dArray = '1, 3'; }
		for(var i = 0; i < 8; i ++){
			xLine = document.getElementById('lineFrameAccess' + i);
			xLine.setAttribute('stroke-dasharray', dArray);
		}
		refreshButtons();
		break;

	case 'but_edit_undo':
		actionUndo('undo');
		break;

	case 'but_edit_redo':
		actionUndo('redo');
		break;

	// ********** color select
	case 'but_set_user_color':
		saveUserColorOn = !saveUserColorOn;
		if(saveUserColorOn){
			var colRGB = hsvToRgb(sliderColorHue.value, sliderColorSat.value, sliderColorVal.value);
			var colB = getViewColor({r:colRGB[0], g:colRGB[1], b:colRGB[2]});

			but_set_user_color.style.backgroundColor = 'rgb(' + colB.r + ',' + colB.g + ',' + colB.b + ')';
			var colT = contrastBlackOrWhite(colB);
			but_set_user_color.style.color = 'rgb(' + colT.r + ',' + colT.g + ',' + colT.b + ')';
			blinkInterval = setInterval(function(){
				var xT = Math.floor(new Date().getMilliseconds() / 500);
				switch(xT){
					case 0: case 2: var bCol = "#000000"; break;
					case 1: case 3: var bCol = "#ffffff"; break;
				}
				for(var i=0; i<24; i++){
					document.getElementById('colUser'+i).style.borderColor = bCol;
				}
			}, 250);

		} else {
			but_set_user_color.style.color = getTopColor().t;
			but_set_user_color.style.backgroundColor = getTopColor().b;
			clearInterval(blinkInterval);
			for(var i=0; i<24; i++){
				document.getElementById('colUser'+i).style.borderColor = '#3f3f3f';
			}
		}
		break;

	case 'colorDirectSelect':
		setSettingDirectSelect();
		break;

	// ********** image import
	case 'but_image_import':
		document.getElementById('imageImporter').style.visibility = 'visible';
		document.getElementById('editor').style.visibility = 'hidden';
		blinkInterval = setInterval(function(){
			var xT = Math.floor(new Date().getMilliseconds() / 500);
			switch(xT){
				case 0: importArea.style.borderColor = "#ffffff"; break;
				case 1: importArea.style.borderColor = "#000000"; break;
			}
		}, 500);
		break;


	// ********** generator
	case 'but_ani_generator':
		generatorOn = true;
		refreshButtons();

		for(var i=1; i< 4; i ++){
			var	colPreviewGen = document.getElementById('canvColGenerator'+ i),
				ctxCol = colPreviewGen.getContext("2d");
			ctxCol.globalCompositeOperation = 'source-over';
			ctxCol.fillStyle='#000000';
			ctxCol.fillRect(0, 0, colPreviewGen.width, colPreviewGen.height);
			drawLedRect( 0, 0, colPreviewGen.width, colPreviewGen.height, {r:generatorColor[i-1][0], g:generatorColor[i-1][1], b:generatorColor[i-1][2]}, colPreviewGen);
		}
		divEdit.style.visibility = 'hidden';
		generatePattern.style.visibility = 'visible';
		but_ani_generator.style.visibility = 'hidden';
		break;

	case 'but_generator_close':
		colorSelector = 0;
		generatorOn = false;
		refreshButtons();
		divEdit.style.visibility = 'visible';
		generatePattern.style.visibility = 'hidden';
		but_ani_generator.style.visibility = 'visible';
		break;

	case 'generatorCol1':
		colorSelector = 1;
		initColorSelection();
		break;

	case 'generatorCol2':
		colorSelector = 2;
		initColorSelection();
		break;

	case 'generatorCol3':
		colorSelector = 3;
		initColorSelection();
		break;

	case 'checkRandomColors':
		checkFullFlow.checked = false;
		runGenerator(dropGenerator.value);
		actionUndo();
		break;

	case 'checkFullFlow':
		checkRandomColors.checked = false;
		runGenerator(dropGenerator.value);
		actionUndo();
		break;

	// ********** settings
	case 'but_settings':
		settingsWindow.style.visibility = 'visible';
		settingsOn = true;
		refreshButtons(false);
		break;

	case 'but_settings_cancel':
		settingsWindow.style.visibility = 'hidden';
		settingsOn = false;
		refreshButtons();
		break;

	case 'settingGammaLink':
		settingGammaG.disabled = settingGammaLink.checked;
		settingGammaB.disabled = settingGammaLink.checked;
		setSettingGammaLink();
		break;

	case 'settingControlInfo':
		setSettingControlInfo();
		break;

	case 'settingShowHomey':
		setSettingShowOnHomey();
		settingShowHomeyTime.disabled = !settingShowHomey.checked;
		break;

	case 'butTopColor':
		topColor ++;
		if(topColor > 3){topColor = 0;}
		setSettingTopColor();
		initTopColor();
		break;

	}
	refreshButtons();
	refreshLedMarkers();
	drawLedRing();
	drawFramePreview(selectedFrame);
}

// ********** Color slider control **********
function sliderInput(obj){
	sliderActivate(obj);
}

function sliderWheel(obj, event){
	if(event.deltaY < 0){
		obj.stepUp(1);
	} else if(event.deltaY > 0){
		obj.stepDown(1);
	}
	sliderActivate(obj);
}

function sliderDouble(obj){
	switch(obj.id){
		case 'sliderColorHue':
			var xVal = Number(obj.value) + (1/12);
			if(xVal > 1){ xVal -= 1; }
			obj.value = xVal;
			break;

		case 'sliderColorSat':
			obj.value = 1;
			break;

		case 'sliderColorVal':
			obj.value = 1;
			break;
	}
	sliderActivate(obj);
}

function sliderActivate(obj){
	switch(obj.id){
		case 'sliderColorHue':
		case 'sliderColorSat':
		case 'sliderColorVal':
			drawLedColorSelection();
			redrawSliders();
			break;
	}
	if(saveUserColorOn){ but_set_user_color.click(); }
}



// ********** enable / disable buttons
function refreshButtons(butOn){
	if(butOn == undefined){butOn = true;}

	// check for active leds in frame
	var	ledOnCount = 0,
		ledColCount = 0,
		ledCol = null;

	for(var i=0; i<24; i++){
		var codeRGB = ledFrame[i].r + ',' + ledFrame[i].g + ',' + ledFrame[i].b;
		if(!(codeRGB == '0,0,0')){
			ledOnCount ++;
			if(codeRGB != ledCol){
				ledColCount ++;
				ledCol = codeRGB;
			}
		}
	}

	// check for inactive frames and frames with inactive leds in animation
	var frameOffCount = 0;
	var frameFillCount = 0;
	for(var i=0; i<ledFrames.length; i++){
		var colFrame = 0;
		var ledOffCount = 0;
		for(var j=0; j < ledFrames[i].length; j++){
			var	cR = Number(ledFrames[i][j].r),
				cG = Number(ledFrames[i][j].g),
				cB = Number(ledFrames[i][j].b);

			colFrame += (cR + cG + cB);
			if(cR + cG + cB == 0){ledOffCount ++;}
		}
		if(ledOffCount > 0){frameFillCount ++;}
		if(colFrame == 0){frameOffCount ++;}
	}

	but_copy_ani.disabled = true;
	but_rename_ani.disabled = true;
	dropAnimation.disabled = true;
	butPlay.disabled = true;

	but_edit_fill.disabled = true;
	but_edit_flow.disabled = true;

	dropFillType.disabled = true;
	dropFillRange.disabled = true;
	but_color_acquire.disabled = true;

	but_edit_undo.disabled = true;
	but_edit_redo.disabled = true;

	but_ani_open.disabled = true;
	but_ani_store.disabled = true;
	but_image_import.disabled = true;
	but_ani_generator.disabled = true;
	but_generator_close.disabled = true;
	but_frame_add.disabled = true;
	but_frame_copy.disabled = true;
	but_ani_fill_flow.disabled = true;
	but_ani_fill_connect.disabled = true;
	but_ani_delete.disabled = true;

	but_frame_clock.disabled = true;
	but_frame_counterclock.disabled = true;
	but_frame_push.disabled = true;
	but_frame_pull.disabled = true;

	but_open_image.disabled = true;
	but_import_accept.disabled = true;
	but_import_cancel.disabled = true;
	but_scan_direction.disabled = true;

	if(!storeLeditorOn && !colorSelectionOn && !settingsOn) {
		butPlay.disabled = false;
	}

	if(butOn && !playMode && !storeLeditorOn && !colorSelectionOn && !settingsOn) {
		but_copy_ani.disabled = false;
		but_rename_ani.disabled = false;
		dropAnimation.disabled = false;


		but_ani_store.disabled = false;
		but_ani_open.disabled = false;
		but_image_import.disabled = false;
		if(count_frames < max_fields){
			but_frame_add.disabled = false;
			but_frame_copy.disabled = false;
		}
		if(frameOffCount > 0 && frameOffCount < ledFrames.length){
			but_ani_fill_flow.disabled = false;
			but_ani_fill_connect.disabled = false;
		}
		but_ani_delete.disabled = false;

		but_generator_close.disabled = false;
		but_ani_generator.disabled = false;
		if(!generatorOn){
			but_ani_generator.style.visibility = 'visible';
			but_generator_close.style.visibility = 'hidden';
		} else {
			but_ani_generator.style.visibility = 'hidden';
			but_generator_close.style.visibility = 'visible';
		}

		if(ledOnCount > 0){
			but_frame_clock.disabled = false;
			but_frame_counterclock.disabled = false;
			but_frame_push.disabled = false;
			but_frame_pull.disabled = false;
			if(ledOnCount < 24 || (checkAllFrames.checked && frameFillCount > 0)){
				but_edit_fill.disabled = false;
				but_edit_flow.disabled = false;
			}
		}

		but_open_image.disabled = false;
		but_import_cancel.disabled = false;
		if(imgImport != null){
			but_import_accept.disabled = false;
			but_scan_direction.disabled = false;
		}
		dropFillType.disabled = false;
		dropFillRange.disabled = false;
		if(dropFillType.value != 'type_3'){
			but_color_acquire.disabled = false;
		}

		if(undoPointer > 0){but_edit_undo.disabled = false;}
		if(undoPointer < undoList.length-1){but_edit_redo.disabled = false;}
	}
}

// ********** undo/redo
var timeoutDelayedUndo = null;
function actionUndo(action){
	if(action == undefined){action = 'store';}

	switch(action){
	case 'init':
		undoPointer = 0;
		undoList = [{
			frames:ledFrames.slice(0),
			options:{
				fps:inFPS.value,
				tfps:inTFPS.value,
				rpm:inRPM.value,
				name:animationIndex[selectedAnimation].name
			}
		}];
		showNumberUndoRedo();
		break;

	case 'delayed': // like 'store' but with prevention for machine-gun storage.
			clearTimeout( timeoutDelayedUndo );
			timeoutDelayedUndo = setTimeout(function(){
				actionUndo('store');
			}, 1000);
		break;

	case 'store':
		var changeDetected = false;

		// check for changes in animation
		var chkAni = {
			frames:ledFrames.slice(0),
			options:{
				fps:Number(inFPS.value),
				tfps:Number(inTFPS.value),
				rpm:Number(inRPM.value),
				name:animationIndex[selectedAnimation].name
			}
		};
		var changeDetected = checkAnimationForChanges(chkAni, undoList[undoPointer]);

		// if change detected, add animation to undoList
		if(changeDetected.frames || changeDetected.options){
			undoPointer ++;
			undoList[undoPointer] = {frames:[], options:{fps:1, tfps:60, rpm:0}};
			undoList[undoPointer].frames = ledFrames.slice(0);
			undoList[undoPointer].options = {
				fps:inFPS.value,
				tfps:inTFPS.value,
				rpm:inRPM.value,
				name:animationIndex[selectedAnimation].name
			}

			if(undoPointer < undoList.length - 1){
				undoList.splice(undoPointer+1, undoList.length - undoPointer-1);
			}
			saveAnimation();
			refreshAnimationSelection();
			setSettingAnimationIndex();
		}
		showNumberUndoRedo();
		break;

	case 'undo':
		if(undoPointer > 0){
			undoPointer --;
			var chkAni = {
				frames:ledFrames,
				options:{
					fps:Number(inFPS.value),
					tfps:Number(inTFPS.value),
					rpm:Number(inRPM.value),
					name:animationIndex[selectedAnimation].name
				}
			};
			var changeDetected = checkAnimationForChanges(chkAni, undoList[undoPointer]);

			if(changeDetected.options){
				inFPS.value = Number(undoList[undoPointer].options.fps);
				inTFPS.value = Number(undoList[undoPointer].options.tfps);
				inRPM.value = Number(undoList[undoPointer].options.rpm);
				animationIndex[selectedAnimation].name = undoList[undoPointer].options.name;
				refreshAnimationSelection();
				setSettingAnimationIndex();
			}
			if(changeDetected.frames){
				ledFrames = undoList[undoPointer].frames.slice(0);
				if(selectedFrame >= ledFrames.length){selectedFrame = ledFrames.length - 1;}
				ledFrame = ledFrames[selectedFrame].slice(0);
				refreshFramesList();
			}
			refreshCounter();
			refreshCounter(ledFrames.length);
		}
		showNumberUndoRedo();
		saveAnimation();
		break;

	case 'redo':
		if(undoList.length > 0 && undoPointer < undoList.length-1){
			undoPointer ++;
			var chkAni = {
				frames:ledFrames,
				options:{
					fps:Number(inFPS.value),
					tfps:Number(inTFPS.value),
					rpm:Number(inRPM.value),
					name:animationIndex[selectedAnimation].name
				}
			};
			var changeDetected = checkAnimationForChanges(chkAni, undoList[undoPointer]);

			if(changeDetected.options){
				inFPS.value = Number(undoList[undoPointer].options.fps);
				inTFPS.value = Number(undoList[undoPointer].options.tfps);
				inRPM.value = Number(undoList[undoPointer].options.rpm);
				animationIndex[selectedAnimation].name = undoList[undoPointer].options.name;
				refreshAnimationSelection();
				setSettingAnimationIndex();
			}
			if(changeDetected.frames){
				ledFrames = undoList[undoPointer].frames.slice(0);
				if(selectedFrame >= ledFrames.length){selectedFrame = ledFrames.length - 1;}
				ledFrame = ledFrames[selectedFrame].slice(0);
				refreshFramesList();
			}
			refreshCounter();
			refreshCounter(ledFrames.length);
		}
		showNumberUndoRedo();
		saveAnimation();
		break;
	}
	showOnHomey(ledFrames[selectedFrame]);
	refreshButtons();
}

function showNumberUndoRedo(){
	nUndo = undoPointer; if(nUndo == 0){nUndo = ''; }
	nRedo = undoList.length - undoPointer - 1; if(nRedo == 0){nRedo = ''; }
	numberUndo.innerHTML = '&nbsp;' + nUndo;
	numberRedo.innerHTML = nRedo + '&nbsp;';
}

function checkAnimationForChanges(animation_Check, animation_Compare){
// check if there are changes/differences between animation_Check and animation_Compare
// animations = {frames:[], options:{fps, tfps, rpm, name} }
// return = {frames:<bool>, options:<bool>}

	var 	frameChangeDetected = false,
		optionChangeDetected = false;

	if(animation_Check.options !== undefined && animation_Compare.options !== undefined){
		if(	Number(animation_Check.options.fps) != Number(animation_Compare.options.fps) ||
			Number(animation_Check.options.tfps) != Number(animation_Compare.options.tfps) ||
			Number(animation_Check.options.rpm) != Number(animation_Compare.options.rpm) ||
			animation_Check.options.name != animation_Compare.options.name
			){
			optionChangeDetected = true;
		}
	}

	if(animation_Check.frames !== undefined && animation_Compare.frames !== undefined){
		if( animation_Check.frames.length != animation_Compare.frames.length ){
			frameChangeDetected = true;
		} else {
			animation_Check.frames.forEach(function(item, index){
				for(var i=0; i < 24; i ++){
					if(	animation_Check.frames[index][i].r != animation_Compare.frames[index][i].r ||
						animation_Check.frames[index][i].g != animation_Compare.frames[index][i].g ||
						animation_Check.frames[index][i].b != animation_Compare.frames[index][i].b
						){
						frameChangeDetected = true;
					}
				}
			});
		}
	}
	return { frames:frameChangeDetected, options:optionChangeDetected };
}

function showMessage( idMessage ){
	switch(idMessage){
	case '':
		infoMessage.style.visibility = 'hidden';
		break;

	default:
		infoMessage.style.left = (editor.offsetLeft + 230) + 'px';
		infoMessage.style.visibility = 'visible';
		infoMessage.innerHTML = thisApp.message[idMessage];
	}
}


var timeoutShowOnHomey = null;
function showOnHomey(frame){
	if(!settingShowHomey.checked){return;}

	clearTimeout( timeoutShowOnHomey );
	timeoutShowOnHomey = setTimeout(function(){
		var	saveAni = {
				options: { fps: 1, tfps: 60, rpm: 0 },
				frames	: [frame],
				priority: 'INFORMATIVE',
				duration: (settingShowHomeyTime.value * 1000)
			};
		setSettingAnimation('leditor_edit', saveAni);
	}, 500);
}

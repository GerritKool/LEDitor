
var borderMarkerW = 2;
function refreshLedMarkers(){
	var	ctx = canvLedMarkers.getContext("2d");

	ctx.clearRect(0,0,canvLedMarkers.width,canvLedMarkers.height);
	for(var i=0; i<24; i++){

		var	angle = (i+9) * 2 * Math.PI / 24,
			rgbLED = ledFrame[i].r + ', ' + ledFrame[i].g + ', ' + ledFrame[i].b,
			hsvLED = rgbToHsv(ledFrame[i].r, ledFrame[i].g, ledFrame[i].b);
			colX = document.getElementById('ledMarker'+i),
			xPos = editW2 + (caseRadius - ledEditW * 0.9 ) * Math.cos(angle),
			yPos = editW2 + (caseRadius - ledEditW * 0.9 ) * Math.sin(angle);

		drawLedRound(xPos, yPos, ledEditW*0.57, ledFrame[i], canvLedMarkers);

		colX.style.left = Math.round(xPos - ledEditW/2 - borderMarkerW) + 'px';
		colX.style.top = Math.round(yPos - ledEditW/2 - borderMarkerW) + 'px';
		colX.style.width = ledEditW + 'px';
		colX.style.height = ledEditW + 'px';
		if(rgbLED == '0, 0, 0'){
			colX.style.color = 'rgba( 255, 127, 127, 1)';
		} else {
			colX.style.color = 'rgba( 255, 255, 255, 1)';
		}
	}
	ctx.globalCompositeOperation = 'source-over';
	refreshLedMarkerTitles();
}

function refreshLedMarkerTitles(){
// set ledMarker title attributes + cursor
	for(var i=0; i<24; i++){

		var	rgbLED = ledFrame[i].r + ', ' + ledFrame[i].g + ', ' + ledFrame[i].b,
			hsvLED = rgbToHsv(ledFrame[i].r, ledFrame[i].g, ledFrame[i].b);
			colX = document.getElementById('ledMarker'+i);


		// set title attribute
		var ledNr = i + 4; if(ledNr > 24){ ledNr -= 24; }
		colX.title = 'LED ' + ledNr + ': ';
		switch(dropFillType.value){
		case'type_1':
		case'type_2':
			if(rgbLED == '0, 0, 0'){
				colX.title = colX.title + thisApp.text.off;
			} else {
				var abrevCol = thisApp.text.hue.substr(0,1).toUpperCase() + ', ' + thisApp.text.saturation.substr(0,1).toUpperCase() + ', ' + thisApp.text.brightness.substr(0,1).toUpperCase();
				colX.title = colX.title + '\n' + abrevCol + ' = ' + (hsvLED[0] * 360).toFixed() + '\260, ' + (Math.round(hsvLED[1] * 200)/2).toFixed(1) + '%, ' + (Math.round(hsvLED[2] * 200)/2).toFixed(1) + '%';
				colX.title = colX.title + '\nR, G, B = ' + rgbLED;
				colX.style.cursor = 'pointer';
			}
			break;

		case'type_3':
			if(rgbLED == '0, 0, 0'){
				colX.title = but_edit_flow.title;
				colX.style.cursor = 'pointer';
			} else {
				colX.title = '';
				colX.style.cursor = 'not-allowed';
			}
			break;
		}
	}
}

function showActiveLeds(obj){ // blink led markers
	var xActive = false;
	blinkInterval = setInterval(function(){
		var xT = Math.floor(new Date().getMilliseconds() / 500);
		switch(xT){
			case 0: case 2:
				var bCol = "#ffffff";
				break;
			case 1: case 3:
				var bCol = "#000000";
				break;
		}
		for(var i=0; i<24; i++){
			var bStyle = document.getElementById('ledMarker'+i).style.borderStyle;
			if(bStyle != 'solid'){
				document.getElementById('ledMarker'+i).style.borderColor = bCol;
				xActive = true;
			}
		}
		if(xActive && !colorPickerOn){
			lPointer.style.stroke = bCol;
			lPointer.style.visibility = 'visible';
		}
	}, 250);

	lPointer.setAttribute('x1', colPreview.offsetLeft + colPreview.offsetWidth/2);
	lPointer.setAttribute('y1', colPreview.offsetTop + colPreview.offsetHeight/2);
	lPointer.setAttribute('x2', obj.offsetLeft + obj.offsetWidth/2);
	lPointer.setAttribute('y2', obj.offsetTop + obj.offsetHeight/2);

	if(colorPickerOn){ // pick color
		for(var i = 0; i < 24; i ++){
			document.getElementById('ledMarker' + i).style.borderStyle = 'dotted';
			document.getElementById('ledMarker' + i).style.borderColor = '#ffffff';
		}
		return;
	} else { // edit mode
		var id = Number(obj.id.substr(9));
		switch(dropFillType.value){
		case 'type_1': // one or more
			var rangeVal = Number(dropFillRange.value.substr(6));
			for(var i = 1; i <= rangeVal; i++){
				document.getElementById('ledMarker'+id).style.borderColor = '#ffffff';
				document.getElementById('ledMarker'+id).style.borderStyle = 'dotted';
				id ++; if(id > 23){id -= 24;}
			}
			break;

		case 'type_2': // skip
			var	rangeVal = Number(dropFillRange.value.substr(6)),
				xStart = id;

			document.getElementById('ledMarker'+id).style.borderColor = '#ffffff';
			document.getElementById('ledMarker'+id).style.borderStyle = 'dotted';
			id += rangeVal; if(id > 23){id -= 24;}
			while(id != xStart){
				document.getElementById('ledMarker'+id).style.borderColor = '#ffffff';
				document.getElementById('ledMarker'+id).style.borderStyle = 'dotted';
				id += rangeVal; if(id > 23){id -= 24;}
			}
			break;

		case 'type_3': // fill (range of) inactive leds
			var	xLed = id,
				ledData = [{led:id, r:0, g:0, b:0}, {led:id, r:0, g:0, b:0}]; // = [0=first led, 1=second led]

			if(ledFrame[xLed].r == 0 && ledFrame[xLed].g == 0 && ledFrame[xLed].b == 0){
				xLed --; if(xLed == -1){xLed = 23;}
				while(xLed != id && ledFrame[xLed].r == 0 && ledFrame[xLed].g == 0 && ledFrame[xLed].b == 0){
					xLed --; if(xLed == -1){xLed = 23;}
				}

				if(xLed != id){
					ledData[0] = {led:xLed, r:ledFrame[xLed].r, g:ledFrame[xLed].g, b:ledFrame[xLed].b}
					xLed = id+1; if(xLed == 24){xLed = 0;}
					while(xLed != id && ledFrame[xLed].r == 0 && ledFrame[xLed].g == 0 && ledFrame[xLed].b == 0){
						xLed ++; if(xLed == 24){xLed = 0;}
					}
					ledData[1] = {led:xLed, r:ledFrame[xLed].r, g:ledFrame[xLed].g, b:ledFrame[xLed].b}
				}

				if(ledData[0].led != id){
					var	lStart = ledData[0].led +1,
						lEnd = ledData[1].led -1;

					if(lStart == 24){lStart = 0;}
					if(lEnd == -1){lEnd = 23;}
					xLed = lStart;
					document.getElementById('ledMarker'+ xLed).style.borderColor = '#ffffff';
					document.getElementById('ledMarker'+ xLed).style.borderStyle = 'dotted';
					while(xLed != lEnd){
						xLed ++; if(xLed == 24){xLed = 0;}
						document.getElementById('ledMarker'+ xLed).style.borderColor = '#ffffff';
						document.getElementById('ledMarker'+ xLed).style.borderStyle = 'dotted';
					}
				}
			}
			var nStep = ledData[1].led - ledData[0].led;
			if(nStep <0){nStep += 24;}
			setColPreviewFill(ledData[0], ledData[1], nStep);
			break;
		}
	}

}

function resetShowActive(){
	lPointer.style.visibility = 'hidden';
	if(!colorPickerOn){
		clearInterval(blinkInterval);
		for(var i = 0; i < 24; i++){
			document.getElementById('ledMarker'+i).style.borderStyle = 'solid';
			document.getElementById('ledMarker'+i).style.borderColor = 'rgba(127,127,127,0)';
		}
		if(dropFillType.value == 'type_3'){setColPreviewFill('');}
	}
}

function ledMarkerClick(obj){
	if(colorPickerOn){
		var id = obj.id.substr(9);
		selectedColorRGB = ledFrames[selectedFrame][id];
		but_color_acquire.click();
	} else {
		setLedMarker(obj);
	}
}

function ledMarkerMouseOver(obj){
	if(colorPickerOn){
		previewColorPicker(obj);
		obj.style.cursor = 'url(../assets/images/mouse_pick.png), auto';

	} else {
		showActiveLeds(obj);
	}
}

function ledMarkerMouseOut(obj){
	if(colorPickerOn){
		setColPreviewFill(selectedColorRGB);
	} else {
		resetShowActive();
	}
}

function setLedMarker(obj){
	var id = Number(obj.id.substr(9));

	switch(dropFillType.value){
	case 'type_1':
		var rangeVal = Number(dropFillRange.value.substr(6));
		for(var i = 1; i <= rangeVal; i++){
			ledFrame[id] = selectedColorRGB;
			id ++; if(id > 23){id -= 24;}
		}
		ledFrames[selectedFrame] = ledFrame.slice(0);
		actionUndo();
		break;

	case 'type_2':
		var	rangeVal = Number(dropFillRange.value.substr(6)),
			xStart = id;

		ledFrame[id] = selectedColorRGB;
		id += rangeVal; if(id > 23){id -= 24;}
		while(id != xStart){
			ledFrame[id] = selectedColorRGB;
			id += rangeVal; if(id > 23){id -= 24;}
		}
		ledFrames[selectedFrame] = ledFrame.slice(0);
		actionUndo();
		break;

	case 'type_3':
		var	xLed = id,
			ledData = [{led:id, r:0, g:0, b:0}, {led:id, r:0, g:0, b:0}]; // = [0=first led, 1=second led]

		if(ledFrame[xLed].r == 0 && ledFrame[xLed].g == 0 && ledFrame[xLed].b == 0){
			xLed --; if(xLed == -1){xLed = 23;}

			while(xLed != id && ledFrame[xLed].r == 0 && ledFrame[xLed].g == 0 && ledFrame[xLed].b == 0){
				xLed --; if(xLed == -1){xLed = 23;}
			}

			if(xLed != id){
				ledData[0] = {led:xLed, r:ledFrame[xLed].r, g:ledFrame[xLed].g, b:ledFrame[xLed].b}
				xLed = id+1; if(xLed == 24){xLed = 0;}
				while(xLed != id && ledFrame[xLed].r == 0 && ledFrame[xLed].g == 0 && ledFrame[xLed].b == 0){
					xLed ++; if(xLed == 24){xLed = 0;}
				}
				ledData[1] = {led:xLed, r:ledFrame[xLed].r, g:ledFrame[xLed].g, b:ledFrame[xLed].b}
			}

			if(ledData[0].led != id){
				var	lStart = ledData[0].led +1,
					lEnd = ledData[1].led -1;

				if(lStart == 24){lStart = 0;}
				if(lEnd == -1){lEnd = 23;}
				if(ledData[0].led< ledData[1].led){
					stepN = ledData[1].led - ledData[0].led;
				} else {
					stepN = ledData[1].led - ledData[0].led +24;
				}

				var arrayCol = createColorFlow(ledData[0], ledData[1], stepN, dropFillRange.value);
				arrayCol.forEach(function(item, index){
					if(index > 0 && index < arrayCol.length - 1){
					xLed = lStart + index - 1;
					if(xLed > 23){xLed -= 24;}
					ledFrame[xLed] = {r:item.r, g:item.g, b:item.b};
					}
				});
			}
		}
		ledFrames[selectedFrame] = ledFrame.slice(0);
		actionUndo();
		break;
	}
	refreshLedMarkers();
	drawLedRing();
	drawFramePreview(selectedFrame);
	refreshButtons();
}


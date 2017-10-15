// ******************** Save LEDitor data-image ********************
var storeLeditorOn = false;

function storeLeditor() {
	if( animationIndex[selectedAnimation] == undefined ){return;}

	storeLeditorOn = true;
	var	ctxExport = canvImageExport.getContext("2d"),
		stepW = 1,
		imgInfo = [],
		idInfo = 'LEDitor',
		dataCol = [],
		dataPointer = 0;

	document.getElementById('imageExporter').style.visibility = 'visible';
	canvImageExport.width = 200;
	canvImageExport.height = 25;
	ctxExport.fillStyle = '#000000';
	ctxExport.fillRect(0, 0, canvImageExport.width, canvImageExport.height);
	for(var x = 0; x < ledFrames.length; x ++){
		for(var y = 0; y < 24; y ++){
			ctxExport.fillStyle = 'rgba(' + ledFrames[x][y].r + ',' + ledFrames[x][y].g + ',' + ledFrames[x][y].b + ',' + ' 1)';
			var yLed = y - 9; if(yLed < 0){yLed +=24;}
			ctxExport.fillRect(x * stepW, yLed + 1, stepW, 1);
		}
	}

	while(idInfo.length <15){idInfo += ' ';}
	for(var i = 0; i < idInfo.length; i++){
		imgInfo.push(idInfo.charCodeAt(i));
	};

	imgInfo.push(thisApp.versionMajor);
	imgInfo.push(thisApp.versionMinor);
	imgInfo.push(thisApp.versionRevision);
	imgInfo.push(ledFrames.length);
	imgInfo.push(inFPS.value);
	imgInfo.push(inTFPS.value);
	imgInfo.push(inRPM.value);

	var aniName = animationIndex[selectedAnimation].name;
	while(aniName.length <100){aniName += ' ';}
	for(var i = 0; i < aniName.length; i++){
		imgInfo.push(aniName.charCodeAt(i));
	};

	while(Math.floor(imgInfo.length / 3) *3 != imgInfo.length){
		imgInfo.push(0);
	}

	for(var i=0; i< imgInfo.length; i++){
		dataCol.push(imgInfo[i]);
		if(dataCol.length == 3){
			ctxExport.fillStyle = 'rgba(' + dataCol[0] + ',' + dataCol[1] + ',' + dataCol[2] + ',1)';
			ctxExport.fillRect(dataPointer * stepW, 0, stepW, 1);
			dataPointer ++;
			dataCol = [];
		}
	}

	var dataURL = canvImageExport.toDataURL();

	document.getElementById('imageExport').download = 'LEDitor - ' + animationIndex[selectedAnimation].name;
	document.getElementById('imageExport').href = dataURL;
	refreshButtons(false);
}

function closeExport(obj){
	storeLeditorOn = false;
	document.getElementById('imageExporter').style.visibility = 'hidden';
	refreshButtons();
}


// ******************** Load saved LEDitor data-image ********************
function loadLeditor(ev) {
	if(document.getElementById("openLeditor").files[0] == undefined){//canceled
		return;
	}

	var	f = document.getElementById("openLeditor").files[0],
		url = window.URL || window.webkitURL,
		src = url.createObjectURL(f),
		imgLeditor = new Image();

	imgLeditor.onload = function(){
		var dataImage = false;

		if(imgLeditor.width == 200 && imgLeditor.height == 25){
			var ctxInfo = canvImgAni.getContext('2d');
			ctxInfo.drawImage(imgLeditor, 0, 0);
			var	imgData = ctxInfo.getImageData(0,0,200,1),
				infoData = [],
				appId = '';

			for(var i = 0; i < imgData.data.length; i+=4){
				infoData.push(imgData.data[i]);
				infoData.push(imgData.data[i+1]);
				infoData.push(imgData.data[i+2]);
			}

			for(i = 0; i < 15; i++){
				appId += String.fromCharCode(infoData[i]);
			}
			appId = appId.trim();
			if(appId == 'LEDitor'){
				var	versionMajor = infoData[15],
					versionMinor = infoData[16],
					versionRevision = infoData[17],
					nFrames = infoData[18];

				imgData = ctxInfo.getImageData(0,1,200,24);
				ledFrames = [];
				for(var x = 0; x < nFrames; x ++){
					ledFrame = [];
					for(var y = 0; y < 24; y ++){
						var ledNr = y - 9; if(ledNr < 0){ledNr +=24;}
						var pixPos = ledNr * 800 + x * 4;
						var cR = imgData.data[pixPos];
						var cG = imgData.data[pixPos + 1];
						var cB = imgData.data[pixPos + 2];
						var xCol = {r:cR, g:cG, b:cB};
						ledFrame.push(xCol);
					}
					ledFrames.push(ledFrame);
				}
				dataImage = true;

				inFPS.value = 1;
				inTFPS.value = 60;
				inFPS.value = infoData[19];
				inTFPS.value = infoData[20];
				inRPM.value = infoData[21];

				var aniName = '';
				for(i = 0; i < 100; i ++){
					aniName += String.fromCharCode(infoData[22 + i]);
				}
				aniName = aniName.trim();
				animationIndex[selectedAnimation].name = aniName;
				setSettingAnimationIndex();
				refreshAnimationSelection();

				refreshFramesList();
				refreshLedMarkers();
				drawLedRing();
				drawAllFramePreviews();
				saveAnimation();

				refreshCounter();
				refreshCounter(ledFrames.length);
				actionUndo();
				showAnimationTime();

				closeImport({id:''});

			}
		}

		if(!dataImage){// not a valid data image
			alert('\n' + f.name + '\n\n' + thisApp.text.wrong_image);
		}
		openLeditor.files = fileListEmpty;
		return;
	}
	imgLeditor.src = src;
}
document.getElementById("openLeditor").addEventListener("change", loadLeditor, false);

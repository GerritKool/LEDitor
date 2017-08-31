var	topColor = 0,			// editor surface color: 0...3 (black, 33% grey, 67% grey, white)
	colorSelectType = 0,		// 0 = palette, 1 = advanced
	aniIndex = [],			// animation index, [{ name: <animation name 1> }, { name: <animation name 2> }, ... ]
	userColor = [],			// advanced color, user presets
	maxAnimationNumber = 100,	// maximum number of available animations
	
	// timeout controls to prevent for 'machine gun' saving
	preventRepeatTime = 400,
	timeoutSetGamma = null,
	timeoutSetShowTime = null,
	timeoutSaveAnimation = [];

while( timeoutSaveAnimation.length < maxAnimationNumber ){ timeoutSaveAnimation.push(null); }

// *************************
// ********** SET **********
// *************************

function setSettingScreenGamma(){
	clearTimeout( timeoutSetGamma );
	var sGamma = [Number(settingGammaR.value), Number(settingGammaG.value), Number(settingGammaB.value)];
	timeoutSetGamma = setTimeout(function(){
		Homey.set('screengamma', sGamma, function(err){
			if(err) return console.error('Could not set screengamma', err);
		});
	}, preventRepeatTime);
}

function setSettingGammaLink(){
	var lGamma = settingGammaLink.checked;
	Homey.set('gammaLink', lGamma, function(err, lGamma){
		if(err) return console.error('Could not set settingGammaLink');
	});
}

function setSettingControlInfo(){
	var xCheck = settingControlInfo.checked;
	Homey.set('controlInfo', xCheck, function(err, xCheck){
		if(err) return console.error('Could not set settingControlInfo');
	});
}

function setSettingShowHomey(){
	var xCheck = settingShowHomey.checked;
	Homey.set('showHomey', xCheck, function(err, xCheck){
		if(err) return console.error('Could not set settingShowHomey');
	});
}

function setSettingShowHomeyTime(){
	clearTimeout( timeoutSetShowTime );
	var xTime = settingShowHomeyTime.value;
	timeoutSetShowTime = setTimeout(function(){
		Homey.set('showHomeyTime', xTime, function(err, xTime){
			if(err) return console.error('Could not set settingShowHomeyTime');
		});
	}, preventRepeatTime);
}

function setSettingAnimationIndex(){
	Homey.set('aniIndex', aniIndex, function(err, aniIndex){
		if(err) return console.error('Could not set ' + aniIndex, err);
	});
}

function setSettingAnimation(aniId, aniData){
	if(aniId.substr(0,9) == 'animation' && aniId != 'animation'){
		var aniIndex = Number(aniId.substr(9));
		if(timeoutSaveAnimation[aniIndex] != null){
			clearTimeout( timeoutSaveAnimation[aniIndex] );
		}
		timeoutSaveAnimation[aniIndex] = setTimeout(function(){
			Homey.set(aniId, aniData, function(err, aniId){
				if(err) return console.error('Could not set ' + aniId, err);
			});
			timeoutSaveAnimation[aniIndex] = null
		}, 1000);
	} else {
		Homey.set(aniId, aniData, function(err, aniId){
			if(err) return console.error('Could not set ' + aniId, err);
		});
	}
}

function setSettingUserColor(){
	Homey.set('userColor', userColor, function(err, userColor){
		if(err) return console.error('Could not set ' + userColor, err);
	});
}

function setSettingColorSelectType(){
	Homey.set('colorSelectType', colorSelectType, function(err, colorSelectType){
		if(err) return console.error('Could not set colorSelectType');
	});
}

function setSettingTopColor(){
	Homey.set('topColor', topColor, function(err, topColor){
		if(err) return console.error('Could not set topColor');
	});
}


// *************************
// ********** GET **********
// *************************

function getSettingVersion(){
	Homey.get('version', function(err, version){
		if (version == undefined){ version = '0.0.0'; }
		xV = version;
		var	p1 = xV.indexOf('.'),
			p2 = xV.lastIndexOf('.');

		thisApp.versionMajor = xV.substr(0, p1);
		thisApp.versionMinor = xV.substr(p1 + 1, p2 - p1 - 1);
		thisApp.versionRevision = xV.substr(p2 + 1);
		versionNr.innerHTML = 'v' + thisApp.versionMajor + '.' + thisApp.versionMinor + '.' + thisApp.versionRevision;
	});
}

function getSettingScreenGamma(){
	Homey.get('screengamma', function(err, sGamma){
		if (sGamma == undefined){
			sGamma = [2.3, 2.3, 2.3];
		}
		settingGammaR.value = sGamma[0];
		settingGammaG.value = sGamma[1];
		settingGammaB.value = sGamma[2];
	});
}

function getSettingGammaLink(){
	Homey.get('gammaLink', function(err, lGamma){
		if (lGamma == undefined){
			lGamma = true;
		}
		settingGammaLink.checked = lGamma;
		settingGammaG.disabled = lGamma;
		settingGammaB.disabled = lGamma;
	});
}

function getSettingControlInfo(){
	Homey.get('controlInfo', function(err, xCheck){
		if (xCheck == undefined){
			xCheck = true;
		}
		settingControlInfo.checked = xCheck;
	});
}

function getSettingShowHomey(){
	Homey.get('showHomey', function(err, xCheck){
		if (xCheck == undefined){
			xCheck = true;
		}
		settingShowHomey.checked = xCheck;
	});
}

function getSettingShowHomeyTime(){
	Homey.get('showHomeyTime', function(err, xTime){
		if (xTime == undefined){
			xTime = 5;
		}
		settingShowHomeyTime.value = xTime;
	});
}

function getSettingTopColor(){
	Homey.get('topColor', function(err, tColor){
		if (tColor == undefined){
			tColor = 0;
		}
		topColor = tColor;
		initTopColor();
	});
}

function getSettingColorSelectType(){
	Homey.get('colorSelectType', function(err, cSelectType){
		if (cSelectType == undefined){
			cSelectType = 0;
		}
		colorSelectType = cSelectType;
	});
}

function getSettingAnimationIndex(){ // availability check --> done at app.js
	aniIndex = [];
	Homey.get('aniIndex', function(err, aIndex){
		aniIndex = aIndex.slice(0);
		// transfer names to options in drop-down selection
		var xOptions = '';
		aniIndex.forEach(function(item,index){
			xOptions += '<option value="ani_' + index + '">' + (index+1) + ': ' + aniIndex[index].name + '</option>';
		});

		dropAnimation.innerHTML = xOptions;
		dropAnimation.selectedIndex = selectedAnimation;
	});
}

function getSettingAnimation(aniId){
	Homey.get(aniId, function(err, ani){
		if (ani == undefined){
			var	newFrame = [],
				newFrames = [];

			for(var i=0; i<24; i++){
				newFrame.push({r:0, g:0, b:0});
			}
			newFrames.push(newFrame);
			ani = {
				frames: newFrames,
				options: { fps: 1, tfps: 60, rpm: 0 }
			}
		}
		ledFrames = ani.frames.slice(0);
		inFPS.value = ani.options.fps;
		inTFPS.value = ani.options.tfps;
		inRPM.value = ani.options.rpm;

		// prepare U.I.
		refreshCounter(); // reset frame counter
		refreshCounter(ledFrames.length);
		if (count_frames == 0) {addNewFrame();} // Always add at least one frame
		selectedFrame = 0;
		ledFrame = ledFrames[selectedFrame].slice(0);

		refreshFramesList();
		refreshLedMarkers();
		drawLedRing();
		showAnimationTime();

		if(enableAniCopy){
			saveAnimation(selectedAnimation);
			dropAnimation.value = 'ani_'+selectedAnimation;
			clickAniCopy();
			actionUndo();
		} else {
			actionUndo('init');
		}
		refreshButtons();
	});
}

function getSettingUserColor(){
	Homey.get('userColor', function(err, userCol){
		if(userCol == undefined){
			var userCol = [];
			var hStep = 12;
			var hVal = 0;
			for(var i = 0; i < 24; i ++){
				if(Math.round(hVal) % 60 == 0){ hVal += hStep; }
				var colRGB = hsvToRgb(hVal / 360, 1, 1);
				userCol.push({r:Math.round(colRGB[0]), g:Math.round(colRGB[1]), b:Math.round(colRGB[2]) });
				hVal += hStep;
			}
			userColor = userCol.slice(0);
		} else {
			userColor = userCol.slice(0);
		}
		refreshAdvancedUserPresets();
	});
}
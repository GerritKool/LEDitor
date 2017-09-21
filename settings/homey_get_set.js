var	topColor = 0,			// editor surface color: 0...3 (black, 33% grey, 67% grey, white)
	colorSelectType = 0,		// 0 = palette, 1 = advanced
	animationIndex = [],			// animation index, [{ name: <animation name 1> }, { name: <animation name 2> }, ... ]
	userColor = [],			// advanced color, user presets
	maxAnimationNumber = 100,	// maximum number of available animations
	
	// timeout controls to prevent for 'machine gun' saving
	preventRepeatTime = 500,
	timeoutSetGamma = null,
	timeoutSetShowTime = null,
	timeoutSaveAnimationIndex = null,
	timeoutSaveAnimation = [];

while( timeoutSaveAnimation.length < maxAnimationNumber ){ timeoutSaveAnimation.push(null); }

// *************************
// ********* LISTEN ********
// *************************

function activateSettingListener(){
	instanceHomey.on( 'settings.set', function(setting){
		if(!settingListenerAvailable){
			settingListenerAvailable = true;
			console.log('setting.set listener available');
		}

		switch(setting){
		case 'status_leditor_preview':
			instanceHomey.get(setting, function(err, sVal){
				switch(sVal){
				case'started':
					playPrevMode = true;
					butPreview.innerHTML = '<img src="../assets/images/homey_stop.png" height="30" width="30" style="float: center;">';
					showMessage('');
					break;

				case'stopped':
					playPrevMode = false;
					butPreview.innerHTML = '<img src="../assets/images/homey_play.png" height="30" width="30" style="float: center;">';
					break;

				}
			});
			break;
		}
	});
}


// *************************
// ********** SET **********
// *************************

function setSettingScreenGamma(){
	clearTimeout( timeoutSetGamma );
	var sGamma = [Number(settingGammaR.value), Number(settingGammaG.value), Number(settingGammaB.value)];
	timeoutSetGamma = setTimeout(function(){
		instanceHomey.set('screengamma', sGamma, function(err){
			if(err) return console.error('Could not set screengamma', err);
		});
	}, preventRepeatTime);
}

function setSettingGammaLink(){
	var lGamma = settingGammaLink.checked;
	instanceHomey.set('gammaLink', lGamma, function(err, lGamma){
		if(err) return console.error('Could not set setting GammaLink');
	});
}

function setSettingControlInfo(){
	var xCheck = settingControlInfo.checked;
	instanceHomey.set('controlInfo', xCheck, function(err, xCheck){
		if(err) return console.error('Could not set setting ControlInfo');
	});
}

function setSettingDirectSelect(){
	var xCheck = colorDirectSelect.checked;
	instanceHomey.set('colorDirectSelect', xCheck, function(err, xCheck){
		if(err) return console.error('Could not set setting colorDirectSelect');
	});
}

function setSettingShowOnHomey(){
	var xCheck = settingShowHomey.checked;
	instanceHomey.set('showHomey', xCheck, function(err, xCheck){
		if(err) return console.error('Could not set setting ShowHomey');
	});
}

function setSettingShowOnHomeyTime(){
	clearTimeout( timeoutSetShowTime );
	var xTime = settingShowHomeyTime.value;
	timeoutSetShowTime = setTimeout(function(){
		instanceHomey.set('showHomeyTime', xTime, function(err, xTime){
			if(err) return console.error('Could not set setting ShowHomeyTime');
		});
	}, preventRepeatTime);
}

function setSettingAnimationIndex(){
	if(timeoutSaveAnimationIndex != null){ clearTimeout( timeoutSaveAnimationIndex ); timeoutSaveAnimationIndex = null;}
	timeoutSaveAnimationIndex = setTimeout(function(){
		instanceHomey.set('aniIndex', animationIndex, function(err, animationIndex){
			if(err) return console.error('Could not set ' + animationIndex, err);
		});
		timeoutSaveAnimationIndex = null;
	}, 500);
}

function setSettingAnimation(aniId, aniData){
	//console.log(aniId);
	switch(aniId){
	case 'leditor_preview': case 'leditor_edit': // set preview animation
		instanceHomey.set(aniId, aniData, function(err, aniId){
			if(err) return console.error('Could not set preview ' + aniId, err);
			
		});
		break;

	default: // set selected animation
		var aniIndex = Number(aniId.substr(9));
		if(timeoutSaveAnimation[aniIndex] != null){ clearTimeout( timeoutSaveAnimation[aniIndex] ); timeoutSaveAnimation[aniIndex] = null;}
		timeoutSaveAnimation[aniIndex] = setTimeout(function(){
			instanceHomey.set(aniId, aniData, function(err, aniId){
				if(err) return console.error('Could not set animation ' + aniId, err);
			});
			timeoutSaveAnimation[aniIndex] = null
		}, 1000);
	}
}

function setSettingUserColor(){
	instanceHomey.set('userColor', userColor, function(err, userColor){
		if(err) return console.error('Could not set ' + userColor, err);
	});
}

function setSettingColorSelectType(){
	instanceHomey.set('colorSelectType', colorSelectType, function(err, colorSelectType){
		if(err) return console.error('Could not set colorSelectType');
	});
}

function setSettingTopColor(){
	instanceHomey.set('topColor', topColor, function(err, topColor){
		if(err) return console.error('Could not set topColor');
	});
}


// *************************
// ********** GET **********
// *************************

function getSettingVersion(){
	instanceHomey.get('version', function(err, version){
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
	instanceHomey.get('screengamma', function(err, sGamma){
		if (sGamma == undefined){
			sGamma = [2.3, 2.3, 2.3];
		}
		settingGammaR.value = sGamma[0];
		settingGammaG.value = sGamma[1];
		settingGammaB.value = sGamma[2];
	});
}

function getSettingGammaLink(){
	instanceHomey.get('gammaLink', function(err, lGamma){
		if (lGamma == undefined){
			lGamma = true;
		}
		settingGammaLink.checked = lGamma;
		settingGammaG.disabled = lGamma;
		settingGammaB.disabled = lGamma;
	});
}

function getSettingControlInfo(){
	instanceHomey.get('controlInfo', function(err, xCheck){
		if (xCheck == undefined){
			xCheck = true;
		}
		settingControlInfo.checked = xCheck;
	});
}

function getSettingDirectSelect(){
	instanceHomey.get('colorDirectSelect', function(err, xCheck){
		if (xCheck == undefined){
			xCheck = false;
		}
		colorDirectSelect.checked = xCheck;
	});

	var xCheck = colorDirectSelect.checked;
	instanceHomey.set('colorDirectSelect', xCheck, function(err, xCheck){
		if(err) return console.error('Could not set setting colorDirectSelect');
	});
}

function getSettingShowOnHomey(){
	instanceHomey.get('showHomey', function(err, xCheck){
		if (xCheck == undefined){
			xCheck = true;
		}
		settingShowHomey.checked = xCheck;
	});
}

function getSettingShowOnHomeyTime(){
	instanceHomey.get('showHomeyTime', function(err, xTime){
		if (xTime == undefined){
			xTime = 5;
		}
		settingShowHomeyTime.value = xTime;
	});
}

function getSettingTopColor(){
	instanceHomey.get('topColor', function(err, tColor){
		if (tColor == undefined){
			tColor = 0;
		}
		topColor = tColor;
		initTopColor();
	});
}

function getSettingColorSelectType(){
	instanceHomey.get('colorSelectType', function(err, cSelectType){
		if (cSelectType == undefined){
			cSelectType = 0;
		}
		colorSelectType = cSelectType;
	});
}

function getSettingAnimationIndex(){ // availability check --> done at app.js
	animationIndex = [];
	instanceHomey.get('aniIndex', function(err, aIndex){
		animationIndex = aIndex.slice(0);
		refreshAnimationSelection();
	});
}

function getSettingAnimation(aniId){
	instanceHomey.get(aniId, function(err, ani){
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
	instanceHomey.get('userColor', function(err, userCol){
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

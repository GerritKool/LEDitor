// ************** SCREEN ANIMATION ENGINE **************
var	frameOnScreenID = 0,
	playFrame = 0,
	animationFilm = [],
	prevFramePulse = 0,
	opacMs = 1,
	opacStartTime = 0,
	rotateMs = 0,
	rotateStartTime = 0;


function clickPlay(obj){
	playMode = !playMode;
	if(playMode){
		prevFramePulse = 0;
		opacMs = 1;
		opacStartTime = 0;
		rotateMs = 0;
		rotateStartTime = 0;
		showMessage('prepare_animation');
		obj.innerHTML = '<img src="../assets/images/ani_working.png" height="30" width="30" style="float: center;">';
		var waitTime = 500;

		setTimeout(function(){
			obj.innerHTML = '<img src="../assets/images/ani_stop.png" height="30" width="30" style="float: center;">';
			rotateStartTime = new Date().getTime();
			playFrame = 0;
			createAnimationFilm();
			showMessage('');
			frameOnScreenID = requestAnimationFrame(runAnimation);
		}, waitTime)
		divEdit.style.visibility = "hidden";
		generatePattern.style.visibility = "hidden";

		canvRing2.style.transitionTimingFunction = 'linear';
		canvRing2.style.transitionDuration = '0ms';
		refreshButtons(false);


	} else {
		showMessage('');
		cancelAnimationFrame(frameOnScreenID);
		obj.innerHTML = '<img src="../assets/images/ani_play.png" height="30" width="30" style="float: center;">';
		if(generatorOn){
			generatePattern.style.visibility = "visible";
		} else if(randomizerOn){
			aniRandomizer.style.visibility = "visible";
		} else {
			divEdit.style.visibility = "visible";
		}

		divRing.style.transform = 'rotate(0deg)';
		refreshButtons();
		canvRing.style.opacity = 1;
		canvRing2.style.opacity = 0;
		activateSelect();
	}
}


// requestAnimationFrame polyfill by Erik M?ller (Opera).
// fixes from Paul Irish (Google) and Tino Zijdel (Tweakers.net).
(function() {
	var	lastTime = 0,
		vendors = ['ms', 'moz', 'webkit', 'o'];

	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
			|| window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
		var	currTime = new Date().getTime(),
			timeToCall = Math.max(0, 16 - (currTime - lastTime)),
			id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);

		lastTime = currTime + timeToCall;
		return id;
	};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}());


function runAnimation(){
	setTimeout(function() {
		if(playMode){
			frameOnScreenID = requestAnimationFrame(runAnimation);

			var	ms = new Date().getTime(),
				thisFramePulse = Math.round(ms / (1000 / inFPS.value)),
				framePulseDif = (thisFramePulse - prevFramePulse);

			// frame change
			if(framePulseDif > 0){
				if(framePulseDif >= ledFrames.length){
					playFrame = 0;
				} else{
					playFrame += framePulseDif;
					if(playFrame >= ledFrames.length){
						playFrame -= ledFrames.length;
					}
				}
				refreshFrameNr(playFrame + 1);
				prevFramePulse = thisFramePulse;
				opacStartTime = ms;
				updateAniFrame();
			}
			// canvas opacity change
			canvRing2.style.opacity = opacMs * (ms - opacStartTime);
			var xRotate = rotateMs * (ms - rotateStartTime);
			divRing.style.transform = 'rotate(' + xRotate + 'deg)';
		}
	}, 1000 / inTFPS.value);

}

function updateAniFrame(){
	opacMs = 1 / (1000 / inFPS.value);
	rotateMs = inRPM.value * 360 / 60000;
	// copy canvRing2 to canvRing
	var prevFrame = playFrame - 1;
	if(prevFrame < 0){prevFrame += ledFrames.length;}
	ctxRing.putImageData(animationFilm[prevFrame],0,0);

	// put new frame on canvRing2
	ctxRing2.putImageData(animationFilm[playFrame],0,0);
}

function createAnimationFilm(){
	animationFilm = [];
	for(var i = 0; i < ledFrames.length; i++){
		ledFrame = ledFrames[i];
		drawLedRing();
		animationFilm[i] = ctxRing.getImageData(0,0,editorWidth,editorWidth);
	}
}
// ************** END SCREEN ANIMATION ENGINE **************

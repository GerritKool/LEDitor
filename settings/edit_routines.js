
// ********** animation edit **********



function addNewFrame() {
	ledFrames.push(emptyFrame.slice(0));
	refreshCounter(1);
	selectedFrame = ledFrames.length-1;
	refreshFramesList();
}

function removeFrame(obj){
	var id = obj.id;
	selectedFrame = Number(id.substr(3));
	ledFrames.splice(selectedFrame, 1);
	refreshCounter(-1);
	if(ledFrames.length == 0){
		addNewFrame();
	} else {
		if(selectedFrame >= ledFrames.length){
			selectedFrame = ledFrames.length - 1;
		}
		refreshFramesList();
	}
	actionUndo();
}

function aniFill(fillType){
// Fill empty frames
// fillType = 'connect' or 'flow'

	var	frameStart = {id:-1},
		frameEnd = {id:-1};

	if(fillType == undefined){fillType = '';}

	ledFrames.forEach(function(item, index){
		var ledVal = 0;
		for(var led = 0; led < 24; led ++){
			ledVal += Number(item[led].r) + Number(item[led].g) + Number(item[led].b);
		}

		// When all leds are off in this frame, find previous on-frame
		if(ledVal == 0 && frameStart.id == -1){
				var startId = index - 1;
			if(startId < 0){startId += ledFrames.length;}
			while(startId != index && frameStart.id == -1){
				ledVal = 0;
				for(led = 0; led < 24; led ++){
					ledVal += Number(ledFrames[startId][led].r) + Number(ledFrames[startId][led].g) + Number(ledFrames[startId][led].b);
				}
				if(ledVal > 0){
					var frameData = ledFrames[startId].slice(0);
					frameStart = {id:startId, frame:frameData}
				}
				startId --;
				if(startId < 0){startId += ledFrames.length;}
			}

			// When start-frame found, find end-frame
			if(frameStart.id != -1){
				var endId = index + 1;
				if(endId >= ledFrames.length){endId -= ledFrames.length;}
				while(endId != index && frameEnd.id == -1){
					ledVal = 0;
					for(led = 0; led < 24; led ++){
						ledVal += Number(ledFrames[endId][led].r) + Number(ledFrames[endId][led].g) + Number(ledFrames[endId][led].b);
					}
					if(ledVal > 0){
						var frameData = ledFrames[endId].slice(0);
						frameEnd = {id:endId, frame:frameData}
					}
					endId ++;
					if(endId >= ledFrames.length){endId -= ledFrames.length;}
				}
			}

			// When start and end are found, fill frames inbetween
			if(frameStart.id != -1 && frameEnd.id != -1){
				// how many steps to do?
				if(frameEnd.id > frameStart.id){
					var fStep = frameEnd.id - frameStart.id;
				} else {
					var fStep = ledFrames.length + frameEnd.id - frameStart.id;
				}

				var ctrl = [];
				switch(fillType){
				case'connect':
					// **** connect fill: change color & position to nearest led in frameEnd ****
					// collect control data for each led

					var colLed = [];
					for(led = 0; led < 24; led ++){
						var	ctrlArray = [],
							colArray = [],
							col1 = ledFrames[frameStart.id][led];

						if(col1.r + col1.g + col1.b > 0){

							var ledEnd = [24, 24];
							// find nearest opposite leds in both directions
							for(var led2 = 0; led2 < 24; led2 ++){
								var ledNr = led + led2;
								if(ledNr > 23){ledNr -= 24;}
								var col2 = ledFrames[frameEnd.id][ledNr];
								if(col2.r + col2.g + col2.b > 0){
									ledEnd[0] = ledNr;
									led2 = 24;
								}
							}
							for(var led2 = 0; led2 < 24; led2 ++){
								var ledNr = led - led2;
								if(ledNr < 0){ledNr += 24;}
								var col2 = ledFrames[frameEnd.id][ledNr];
								if(col2.r + col2.g + col2.b > 0){
									ledEnd[1] = ledNr;
									led2 = 24;
								}
							}
							
							var movePos1 = ledEnd[0] - led; // position shift flow 1
							if(movePos1 > 12){movePos1 = -24 + movePos1;}
							if(movePos1 < -12){movePos1 = 24 + movePos1;}

							if(ledEnd[1] != 24){ // flow 2 activated?
								var movePos2 = ledEnd[1] - led; // position shift flow 2
								if(movePos2 > 12){movePos2 = -24 + movePos2;}
								if(movePos2 < -12){movePos2 = 24 + movePos2;}

								if(Math.abs(movePos2) < Math.abs(movePos1)){ // distance 2 is smaller than 1. only flow 2
									movePos1 = movePos2;
									ledEnd[0] = ledEnd[1];
								} else if(movePos2 !=0 && Math.abs(movePos2) == Math.abs(movePos1)){ // distance 2 is equal to 1. both flows active
									var	moveStep = movePos2 / fStep;
									ctrlArray.push({posL:led, posStep:moveStep});
									colArray.push( createColorFlow(ledFrames[frameStart.id][led], ledFrames[frameEnd.id][ledEnd[1]], fStep, dropAniConnectType.value) );
								}
							}
							
							var moveStep = movePos1 / fStep;
							ctrlArray.push({posL:led, posStep:moveStep});
							colArray.push( createColorFlow(ledFrames[frameStart.id][led], ledFrames[frameEnd.id][ledEnd[0]], fStep, dropAniConnectType.value) );
						}
						ctrl[led] = ctrlArray.slice(0);
						colLed[led] = colArray.slice(0);
					}

					var frCount = 1;
					var frEdit = frameStart.id+1;
					while(frEdit != frameEnd.id){
						var frameNew = emptyFrame.slice(0);

						for(led = 0; led < 24; led ++){
							for(var i=0; i < ctrl[led].length; i++){
								ctrl[led][i].posL += ctrl[led][i].posStep;
								if(ctrl[led][i].posL > 23){ctrl[led][i].posL -= 24}
								if(ctrl[led][i].posL < 0){ctrl[led][i].posL += 24}

								var	ledNr = Math.round(ctrl[led][i].posL);

								if(ledNr > 23){ledNr -= 24}
								var currentCol = frameNew[ledNr];
								var newCol = colLed[led][i][frCount];
								var replaceCol = [0,0,0];
								replaceCol[0] = Number(newCol.r) + Number(currentCol.r);
								replaceCol[1] = Number(newCol.g) + Number(currentCol.g);
								replaceCol[2] = Number(newCol.b) + Number(currentCol.b);


								var maxDivisor = 1;
								replaceCol.forEach(function(item, index){
									if( item/255 > maxDivisor ){maxDivisor = item/255;}
								});
								replaceCol.forEach(function(item, index){
									replaceCol[index] = Math.round(item / maxDivisor);
								});

								frameNew[ledNr] = {r:replaceCol[0], g:replaceCol[1], b:replaceCol[2] };
							}
						}

						ledFrames[frEdit] = frameNew.slice(0);
						frEdit ++; if(frEdit == ledFrames.length){frEdit = 0;}
						frCount ++;
					}
					break;



				case'flow':
					// **** vertical fill: move color to opposite led in frameEnd ****
					for(led = 0; led < 24; led ++){
						var	col1 = ledFrames[frameStart.id][led],
							col2 = ledFrames[frameEnd.id][led];
				
						var	newLeds = createColorFlow(ledFrames[frameStart.id][led], ledFrames[frameEnd.id][led], fStep, dropAniFlowType.value );
						ctrl[led] = newLeds.slice(0);

					}

					var frEdit = frameStart.id+1;
					while(frEdit != frameEnd.id){
						var frameNew = [];
						frFlow = frEdit - frameStart.id
						for(led = 0; led < 24; led ++){
							frameNew.push(ctrl[led][frFlow]);
						}
						ledFrames[frEdit] = frameNew.slice(0);
						frEdit ++; if(frEdit == ledFrames.length){frEdit = 0;}
					}
					break;

				default:
					return;
				}


				// go on finding next hole
				index = Number(frameEnd.id-1);
				frameStart = {id:-1};
				frameEnd = {id:-1};
			}
		}
	});
}



// ********** single frame edit **********

function frameFill(frameNr){
	var newFrame = ledFrames[frameNr].slice(0);

	var colFill = [0,0,0];
	for(var i=0; i<48; i++){
		colN = i; if(colN>23){colN -= 24;}
		var codeRGB = newFrame[colN].r + ',' + newFrame[colN].g + ',' + newFrame[colN].b;
		if(!(codeRGB == '0,0,0')){
			colFill = [Number(newFrame[colN].r), Number(newFrame[colN].g), Number(newFrame[colN].b)];
		} else {
			newFrame[colN] = {r:colFill[0], g:colFill[1], b:colFill[2]}
		}
	}
	ledFrames[frameNr] = newFrame.slice(0);
}

function frameFlow(frameNr){
	var newFrame = ledFrames[frameNr].slice(0);
	var	col1 = -1,
		col2 = -1;

	for(var i=0; i<=48; i++){
		var colN = i; while(colN>23){colN -= 24;}
		var codeRGB = newFrame[colN].r + ',' + newFrame[colN].g + ',' + newFrame[colN].b;
		var codeHSV = rgbToHsv(newFrame[colN].r, newFrame[colN].g, newFrame[colN].b);

		if(!(codeRGB == '0,0,0')){
			if(col2 == -1){
				col1 = i;
			}

			if(col2 == -2){
				col2 = i;
				var	l1 = col1,
					l2 = col2,
					stepN = col2-col1;

				if(l1>23){l1 -= 24;}
				if(l2>23){l2 -= 24;}

				var arrayCol = createColorFlow(newFrame[l1], newFrame[l2], stepN, dropFlowType.value );
				arrayCol.forEach(function(item, index){
					if(index > 0 && index < arrayCol.length - 1){
						xLed = col1 + index;
						if(xLed > 23){xLed -= 24;}
						newFrame[xLed] = {r:item.r, g:item.g, b:item.b};
					}
				});


				col1 = col2; col2 = -1;
			}
		} else {
			if(col1 > -1){col2 = -2;}
		}
	}
	ledFrames[frameNr] = newFrame.slice(0);
}

function framePush(frameNr){
	ledFrames[frameNr] = [ledFrames[frameNr][23]].concat(ledFrames[frameNr].slice(0, 8)).concat(ledFrames[frameNr][9]).concat(ledFrames[frameNr].slice(11, 21)).concat(ledFrames[frameNr][10]).concat(ledFrames[frameNr][21]).concat(ledFrames[frameNr][8]).concat(ledFrames[frameNr][22]);
}

function framePull(frameNr){
	ledFrames[frameNr] = ledFrames[frameNr].slice(1, 9).concat(ledFrames[frameNr][22]).concat(ledFrames[frameNr][9]).concat(ledFrames[frameNr][20]).concat(ledFrames[frameNr].slice(10, 20)).concat(ledFrames[frameNr][21]).concat(ledFrames[frameNr][23]).concat(ledFrames[frameNr][0]);
}

function frameRotateClock(frameNr){
	ledFrames[frameNr] = [ledFrames[frameNr][23]].concat(ledFrames[frameNr].slice(0, 23));
}

function frameRotateCounterclock(frameNr){
	ledFrames[frameNr] = ledFrames[frameNr].slice(1, 24).concat([ledFrames[frameNr][0]]);
}

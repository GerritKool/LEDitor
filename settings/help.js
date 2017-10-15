// ******************** In-app help ********************

function showHelp(obj, event){
	if(	thisApp.helpText.length == 0 ||
		typeof selectedGenerator === "undefined" ||
		typeof colorPickerOn === "undefined" ||
		typeof enableAniCopy === "undefined" ||
		typeof colorSelectType === "undefined" ||
		animationIndex[selectedAnimation] === undefined
		){return;}

	var	docHelp = document.getElementById('helpInfoArea'),
		id = obj.id,
		idNumber = '';


	if(selectedGenerator >=0){
		var	genName = generatorParameters[selectedGenerator].generator.substr(8).toLowerCase(),
			genFPS = Number(generatorParameters[selectedGenerator].options.fps),
			genTFPS = Number(generatorParameters[selectedGenerator].options.tfps),
			genRPM = Number(generatorParameters[selectedGenerator].options.rpm),
			genRepeat = Number(generatorParameters[selectedGenerator].options.repeat),
			genColorN = Number(generatorParameters[selectedGenerator].options.colorN),
			genRandom = generatorParameters[selectedGenerator].options.random,
			genFrame = 0;

		if(generatorParameters[selectedGenerator].options.frames != undefined){
			genFrame = generatorParameters[selectedGenerator].options.frames;
		}
	}



	var multiControl = ['ledMarker', 'colPreset', 'colUser', 'ledPrev'];
	for(var i = 0; i < multiControl.length; i ++){
		if(id.substr(0,multiControl[i].length) == multiControl[i]){
			idNumber = id.substr(multiControl[i].length);
			id = multiControl[i];
		}
	}

	switch(id){
		case 'ledMarker':
			if(colorPickerOn){
				id = id + '_B';
			} else {
				id = id + '_A';
			}
			break;

		case 'dropAnimation':
			if(enableAniCopy){
				id = id + '_B';
			} else {
				id = id + '_A';
			}
			break;

		case 'but_copy_ani':
			if(enableAniCopy){
				id = id + '_B';
			} else {
				id = id + '_A';
			}
			break;

		case 'colUser':
			if(saveUserColorOn){
				id = id + '_B';
			} else {
				id = id + '_A';
			}
			break;

		case 'but_color_select_type':
			id = id + colorSelectType;
			break;

	}

	switch(event.type){
		case'mouseover':

			//**** Hide options menu ****
			if(	id != 'but_editor_leds' &&
				id != 'but_editor_generator' &&
				id != 'but_editor_randomizer' &&
				id != 'but_select_editor'
			){ menu_select_editor.style.visibility = 'hidden'; }
			//**** Show options menu ****
			if( id == 'but_select_editor' ){ menu_select_editor.style.visibility = 'visible'; }



			if(!settingControlInfo.checked){return;}
			docHelp.style.fontWeight = '600';
			docHelp.style.color = '#400000';
			if(thisApp.helpText[id] == undefined){
				docHelp.innerHTML = 'Missing: helpText.' + id;
			} else {
				var txtHelp = thisApp.helpText[id];
				switch(id){// additional text
					case'dropFillType':
						txtHelp = txtHelp + ' ' + thisApp.helpText['dropFillType1'] + ' ' + thisApp.helpText['dropFillType2'] + ' ' + thisApp.helpText['dropFillType3'];
						break;

					case'dropFillRange':
						var xType = dropFillType.value.substr(5);
						switch(xType){
						case '3':
							txtHelp = '' + thisApp.helpText['dropFlowType'];
							break;

						default:
							txtHelp = txtHelp + ': ';
							txtHelp = txtHelp + thisApp.helpText['dropFillType' + xType];
						}
						break;

					case'colPreview':
						if(dropFillType.value == 'type_3'){
							docHelp.style.fontWeight = 'normal';
							docHelp.style.color = document.body.style.color;
							txtHelp = thisApp.helpText['Default'];
						}
						break;

					case 'generatorCol1':
						if(genColorN == 1){
							txtHelp = txtHelp + ' ' + thisApp.helpText['generatorCol1_flow'];
						}
						break;

					case 'generatorCol2':
						if(genColorN == 1){
							txtHelp = txtHelp + ' ' + thisApp.helpText['generatorCol2_flow'];
						}
						break;

					case 'generatorCol3':
						break;

					case 'inGenFrame':
						switch(genName){

						case'satellite':
						case'lighthouse':
						case'sparkle':
							break;

						default:
							if(genFrame > 0){
								switch(genName){
								case'newtonian':
									var xHelp = thisApp.helpText['inGenFrame_number1'];
									break;

								default:
									var xHelp = thisApp.helpText['inGenFrame_number'];
								}
								xHelp = xHelp.replace('#1#', genFrame);
								xHelp = xHelp.replace('#2#', (Number(genFrame) * 2));
								xHelp = xHelp.replace('#3#', (Number(genFrame) * 6));
								txtHelp = txtHelp + ' ' + xHelp;
							}
						}
						break;

					case 'colUser_A': case 'colUser_B':
						txtHelp = txtHelp .replace('#1#', Number(idNumber)+1);
						break;

					case 'but_ani_open': case 'but_ani_store': case 'but_image_import': case 'but_import_accept':
						txtHelp = txtHelp.replace('#1#', Number(selectedAnimation)+1);
						txtHelp = txtHelp.replace('#2#', animationIndex[selectedAnimation].name);
						break;

				}

				switch(id){
					case'dropFillType': case'dropFillRange':
						txtHelp = txtHelp.replace('#1#', thisApp.text.drop_type[0]);
						txtHelp = txtHelp.replace('#2#', thisApp.text.drop_type[1]);
						txtHelp = txtHelp.replace('#3#', thisApp.text.drop_type[2]);

						var xType = dropFillType.value.substr(5);
						if(id == 'dropFillRange' && dropFillType.value != 'type_3'){txtHelp = txtHelp + ' ' + thisApp.helpText['dropFillType' + xType + 'ext']}
						break;
				}

				docHelp.innerHTML = txtHelp;
			}
			break;

		case'mouseout':
			if(document.getElementById('editor').style.visibility == 'hidden'){
				var txtHelpDefault = thisApp.helpText['but_image_import'];
				txtHelpDefault = txtHelpDefault.replace('#1#', Number(selectedAnimation)+1);
				txtHelpDefault = txtHelpDefault.replace('#2#', animationIndex[selectedAnimation].name);
			} else {
				var txtHelpDefault = thisApp.helpText['Default'];
			}

			docHelp.style.fontWeight = 'normal';
			docHelp.style.color = document.body.style.color;
			docHelp.innerHTML = txtHelpDefault;
			break;
	}
}

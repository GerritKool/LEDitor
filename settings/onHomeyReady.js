function onHomeyReady(Homey){
	instanceHomey = Homey;
	Homey.ready();

	// collect all html object-ids
	var	id_index = [],
		xText = document.getElementById('leditor_ui').innerHTML;
	xText = xText.replace(/ id =/g, " id="); // replace all ' id =' by ' id='
	xText = xText.replace(/ id= /g, " id="); // replace all ' id= ' by ' id='
	var posId = xText.indexOf(' id="');
	while(posId > -1){
		var posIdEnd = xText.indexOf('"' , posId + 5);
		id_index.push( xText.substr(posId + 5, posIdEnd - (posId + 5)) );
		var posId = xText.indexOf(' id="', posIdEnd + 1);
	}

	// help index with all ids + extra / multiple help for controls
	var help_index = id_index.concat ([
		'but_copy_ani_A', 'but_copy_ani_B',
		'dropAnimation_A', 'dropAnimation_B',
		'ledMarker_A', 'ledMarker_B',
		'dropFillType1', 'dropFillType2', 'dropFillType3', 'dropFillType1ext', 'dropFillType2ext', 'dropFillType3ext',
		'generatorCol1_flow', 'generatorCol2_flow', 'generatorCol3_flow',
		'inGenFrame_number', 'inGenFrame_number1',
		'but_color_select_type0', 'but_color_select_type1', 'ledPrev',
		'colUser_A', 'colUser_B', 'colPreset'
	]);

	// copy help_ to thisApp.helpText{}
	for(var i = 0; i < help_index.length; i ++){
		var helpID = 'settings.help_' + help_index[i];
		var hText = __('settings.help_' + help_index[i]);
		if(helpID == hText){
			help_index.splice(i, 1);
			i --;
		} else {
			thisApp.helpText[help_index[i]] = hText;
		}
	}
	thisApp.helpText.Default = __('settings.intro');
	thisApp.helpText.dropAniFlowType =  __('settings.help_dropFlowType');
	thisApp.helpText.dropAniConnectType =  __('settings.help_dropFlowType');
	thisApp.helpText.dropEditFlowType =  __('settings.help_dropFlowType');
	thisApp.helpText.dropGenFlowType =  __('settings.help_dropFlowType');
	help_index = undefined;

	// set button titles
	for(var i = 0; i < id_index.length; i ++){
		var xID = 'settings.title_' + id_index[i];
		var xText = __('settings.title_' + id_index[i]);
		if(xID != xText){
			document.getElementById(id_index[i]).title = xText
		}
	}

	// text. variable / multiple times used
	var text_index = [];
	for (var key in thisApp.text) {
		text_index.push(key);
	}
	for(var i = 0; i < text_index.length; i ++){
		xId = text_index[i];
		thisApp.text[xId] = __('settings.txt_'+xId);
	}

	thisApp.text.frame_add = __('settings.title_but_frame_add');
	thisApp.text.frame_copy = __('settings.title_but_frame_copy');

	thisApp.text.drop_type = [];
	for(var i = 1; i < 4; i ++){
		thisApp.text.drop_type.push( __('settings.txt_drop_type_' + i) );
	}

	thisApp.text.drop_range = [];
	for(var i = 1; i < 4; i ++){
		thisApp.text.drop_range.push( __('settings.txt_drop_range_t' + i) );
	}

	thisApp.text.count = [];
	for(var i = 0; i < 13; i ++){
		thisApp.text.count.push( __('settings.count' + i) );
	}

	// info messages.
	var message_index = [];
	for (var key in thisApp.message) {
		message_index.push(key);
	}
	for(var i = 0; i < message_index.length; i ++){
		xId = message_index[i];
		thisApp.message[xId] = __('settings.message_'+xId);
	}

	thisApp.text.ani_copy = __('settings.title_but_copy_ani');

	var xDoc = '';
	xDoc = xDoc + '<option value="gen_0">' + __('settings.txt_generator_0') +'</option>';
	for(var i=1; i <= 18; i++){
		xDoc = xDoc + '<option value="gen_' + i + '">' + __('settings.txt_generator_' + i) +'</option>';
	}
	dropGenerator.innerHTML = xDoc;

	//activateSettingListener();

	createFramesList();

	getSettingVersion();
	getSettingTopColor();
	getSettingColorSelectType();
	getSettingDirectSelect();
	getSettingScreenGamma();
	getSettingGammaLink();
	getSettingControlInfo();
	getSettingShowOnHomey();
	getSettingShowOnHomeyTime();
	getSettingUserColor();
	setupUI();

	getSettingAnimationIndex();
	openAnimation();
}

var 	instanceHomey = null,		// Homey instance. Gets defined at onHomeyReady ()
	settingListenerAvailable = false,
	thisApp = {
		versionMajor: 0,
		versionMinor: 0,
		versionRevision: 0,
		text: {
			move_up:'', move_down:'', remove:'', frame_add:'', frame_copy:'', empty_preset:'',
			wrong_image:'', ani_copy:'', off:'', same:'', inverted:'',
			drop_type:[], drop_range:[],
			plural_s:'', count:[], hue:'', saturation:'', brightness:'',

			solid:'', select:'', direct_select:'',
			pure_red:'', pure_green:'', pure_blue:'', pure_yellow:'', pure_magenta:'', pure_cyan:'', bright_white:'',
			no_color:'', first_color:'', second_color:'', third_color:'', ring_color:'', flow_to:'',
			generator_1:'', generator_2:'', generator_3:'', generator_4:'', generator_5:'', generator_6:'',
			generator_7:'', generator_8:'', generator_9:'', generator_10:'', generator_11:'', generator_12:'',
			generator_13:'', generator_14:'', generator_15:'', generator_16:'', generator_17:'', generator_18:''
		},
		message: {
			load_animation:'', prepare_animation:'', send_animation:''
		},
		helpText: {}
	},
	keyShortcut = {
		y: 'but_edit_redo',
		z: 'but_edit_undo'
	},
	butColorDef = 'rgba(238, 238, 238, 0.8)',
	butColorDefOnWhite = 'rgba(119, 119, 119, 0.2)',
	undoList = [],				// stores all frames for each edit
	undoPointer = -1,

	ledFrame = [],				// container for 24 LED objects {r:<0...255>, g:<0...255>, b:<0...255>}
	ledFrames = [],				// container for multiple ledFrames
	playMode = false,			// preview mode true/false
	generatorOn = false,			// generator window visible / hidden (true / false)
	settingsOn = false,			// settings window visible / hidden (true / false)
	colorSelector = 0,			// 0 = editor, 1 2 & 3 = pattern generator
	emptyFrame = [];

// fill emptyFrame and set ledFrame and ledFrames to empty
for(i = 0; i < 24; i++){
	emptyFrame.push({r:0, g:0, b:0});
	ledFrame.push({r:0, g:0, b:0});
}
ledFrames.push(ledFrame);


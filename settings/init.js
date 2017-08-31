var 	thisApp = {
		versionMajor: 0,
		versionMinor: 0,
		versionRevision: 0,
		text: {
			move_up:'', move_down:'', remove:'', frame_add:'', frame_copy:'',
			wrong_image:'', ani_copy:'', off:'', same:'', inverted:'',
			drop_type:[], drop_range:[],
			plural_s:'', count:[], hue:'', saturation:'', brightness:'',

			solid:'', select:'',
			pure_red:'', pure_green:'', pure_blue:'', pure_yellow:'', pure_magenta:'', pure_cyan:'', bright_white:'',
			no_color:'', first_color:'', second_color:'', third_color:'', ring_color:'', flow_to:''
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
	undoList = [],				// stores all frames for each edit
	undoPointer = -1,

	ledFrame = [],				// container for 24 LED objects {r:<0...255>, g:<0...255>, b:<0...255>}
	ledFrames = [],				// container for multiple ledFrames
	playMode = false,			// preview mode true/false
	generatorOn = false,			// generator window visible / hidden (true / false)
	settingsOn = false,			// settings window visible / hidden (true / false)
	colorSelector = 0;			// 0 = editor, 1 2 & 3 = pattern generator

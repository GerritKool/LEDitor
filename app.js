"use strict";
const Homey = require('homey');

class LEDitor extends Homey.App {
	onInit() {
		this.log('LEDitor initializing...');
		var	Animation = new Homey.LedringAnimation(),
			frames = [],
			frame = [],
			animation_run = false,
			leditor_preview_run = false,
			leditor_edit_run = false;

		// save version number as setting, so it's available to index.html
		Homey.ManagerSettings.set('version', Homey.manifest.version );

		// create animation with 1 empty frame
		for( var i = 0; i < 24; i ++){ frame.push( { r:0, g:0, b:0 } ); }
		frames.push(frame);

		var ani = {
			frames	: frames,
			priority: 'INFORMATIVE',
			duration: 10,
			options	: { fps: 1, tfps: 60, rpm: 0 }
		}

		// check for initial animation data and create it if not defined.
		var aIndex = Homey.ManagerSettings.get('aniIndex');
		if (aIndex == undefined){
			// create empty memory slots
			this.log('Creating initial animation presets.');
			aIndex = [];
			for(var i=0; i<100; i++){
				var xName =  Homey.__('settings.txt_empty_preset');
				aIndex.push({name: ( xName + ' ' + (i+1))});
				var aniId = 'animation' + i;

				Homey.ManagerSettings.set(aniId, ani );
			}
			Homey.ManagerSettings.set('aniIndex', aIndex );
		} else {
			this.log('Animation presets found');
			if(aIndex.length<100){
				for(var i=aIndex.length; i<100; i++){
					aIndex.push({name: ( __('settings.txt_empty_preset') + ' ' + (i+1))});
					var aniId = 'animation' + i;

					Homey.ManagerSettings.set(aniId, ani );
				}
			};
		}


	// ********** create and register LEDitor animation objects **********
		// flow controlled animation
		var animation = new Homey.LedringAnimation({
			frames  : ani.frames,
			priority: ani.priority,
			duration: ani.duration,
			options : { fps : ani.options.fps, tfps: ani.options.tfps, rpm : ani.options.rpm }
		});

		animation
			.on('start', () => {
				animation_run = true;
				Homey.ManagerSettings.set('status_animation', 'started' );
				this.log('Started animation: ' + animation.id );
			})
			.on('stop', () => {
				animation_run = false;
				Homey.ManagerSettings.set('status_animation', 'stopped' );
				this.log( 'Stopped animation: ' + animation.id );
			})
			.register()
        			.then( () => {
            				this.log('Flow animation registered.');
        			})
        			.catch( this.error )


		// preview animation
		var leditor_preview = new Homey.LedringAnimation({
			frames  : ani.frames,
			priority: ani.priority,
			duration: ani.duration,
			options : { fps : ani.options.fps, tfps: ani.options.tfps, rpm : ani.options.rpm }
		});

		leditor_preview
			.on('start', () => {
				leditor_preview_run = true;
				Homey.ManagerSettings.set('status_leditor_preview', 'started' );
				this.log('Started preview: ' + leditor_preview.id );
			})
			.on('stop', () => {
				leditor_preview_run = false;
				Homey.ManagerSettings.set('status_leditor_preview', 'stopped' );
				this.log( 'Stopped preview: ' + leditor_preview.id );
			})
			.register()
        			.then( () => {
            				this.log('Preview animation registered.');
        			})
        			.catch( this.error )


		// frame edit preview
		var leditor_edit = new Homey.LedringAnimation({
			frames  : ani.frames,
			priority: ani.priority,
			duration: ani.duration,
			options : { fps : ani.options.fps, tfps: ani.options.tfps, rpm : ani.options.rpm }
		});

		leditor_edit
			.on('start', () => {
				leditor_edit_run = true;
				Homey.ManagerSettings.set('status_edit_preview', 'started' );
				this.log('Show edit' );
			})
			.on('stop', () => {
				leditor_edit_run = false;
				Homey.ManagerSettings.set('status_edit_preview', 'stopped' );
				this.log( 'Stop show edit' );
			})
			.register()
        			.then( () => {
            				this.log('Show edit registered.');
        			})
        			.catch( this.error )


	// ********** settings management **********
		Homey.ManagerSettings
			.on('set', function (setting) {
			switch(setting){

			case 'leditor_preview':
				if(leditor_preview_run){leditor_preview.stop();}
				ani = Homey.ManagerSettings.get('leditor_preview');
				if(Number(ani.options.fps) != 0){
					leditor_preview.opts = {
						frames  : ani.frames,
						priority: ani.priority,
						transition: Math.floor( 1000 / ( Number(ani.options.fps) + 1) ),
						duration: ani.duration,
						options : {
							fps : ani.options.fps,
							tfps: ani.options.tfps,
							rpm : ani.options.rpm
						}
					};
					leditor_preview
						.register()
		        				.then( () => {
		            					leditor_preview.start();
		        				})
		        				.catch( this.error )
				}
				break;

			case 'leditor_edit':
				if(leditor_edit_run){leditor_edit.stop();}
				ani = Homey.ManagerSettings.get('leditor_edit');
				leditor_edit.opts = {
					frames  : ani.frames,
					priority: ani.priority,
					transition: Math.floor( 1000 / ( Number(ani.options.fps) + 1) ),
					duration: ani.duration,
					options : {
						fps : ani.options.fps,
						tfps: ani.options.tfps,
						rpm : ani.options.rpm
					}
				};
				leditor_edit
					.register()
		        			.then( () => {
		            				leditor_edit.start();
		        			})
		        			.catch( this.error )
				break;
			}
		});


	// ********** Flow Cards **********

		// **** Select and start an animation
		let animationSelectAction = new Homey.FlowCardAction('animation_select');
		animationSelectAction
			.register()
			.registerRunListener(( args, state ) => {
				var aniId = 'animation' + args.animation_selector.value;
				var aniDuration = args.animationTime * 1000;
				ani = Homey.ManagerSettings.get(aniId);
				if(animation_run){animation.stop();}
				animation.opts = {
					frames  : ani.frames,
					priority: 'INFORMATIVE',
					transition: Math.round( 300 / Number(ani.options.fps)  ),
					duration: aniDuration,
					options : {
						fps : ani.options.fps,
						tfps: ani.options.tfps,
						rpm : ani.options.rpm
					}
				};
				animation
					.register()
	        				.then( () => {
	            					this.log('Flow animation started');
	            					animation.start();
	        				})
	        				.catch( this.error )

				let isReg = true; // true or false
				return Promise.resolve( isReg );
			})
			.getArgument('animation_selector')

			.registerAutocompleteListener( args => {
				var	aniIndex = Homey.ManagerSettings.get('aniIndex'),
					values = [];
				aniIndex.forEach(function(item, index){
					var xNum = (index + 1).toString();
					if(xNum.length<3){xNum = '0' + xNum;}
					values.push({ name: xNum + ': '+ item.name, value: index });
				});
				return Promise.resolve(values);
			})

		// **** Stop the animation
		let animationStopAction = new Homey.FlowCardAction('animation_stop');
		animationStopAction
			.register()
			.registerRunListener(( args, state ) => {
				if(animation_run){animation.stop();}

				let isReg = true; // true or false
				return Promise.resolve( isReg );
			})


		// **** App ready.
		this.log('LEDitor v' + Homey.manifest.version + ' started.');
	}
}
module.exports = LEDitor;



/* ************************************************
- DOC: example registered Homey LED Ring Animation object
***************************************************
Legacy (pre SDK2):
Animation {
	args: {
		frames    : [ [Object], [Object], .... ],	// array, containing max 200 frame-arrays, containing 24 pixel-objects { r:int, g:int, b:int }}
		priority  : 'INFORMATIVE',			// CRITICAL, FEEDBACK or INFORMATIVE
		transition: 300,				// transition time between 2 frames ????
		duration  : 1000,				// duration in ms, or '' for infinite
		options   : {
			fps : '1',				// frame change per second
			tfps: '60',				// Virtual Frames per second.
			rpm : '0'				// ring rotations per minute
		}
	},
	id: '5352c7db-be14-4b10-9a9d-939023667288',
	_events: { start: [Function], stop: [Function] },
	_eventsCount: 2 }
}

SDK2:
LedringAnimation {
	opts: {
		frames    : [ [Array] ],
		priority  : 'INFORMATIVE',
		transition: 300,
		duration  : 1000,
		options   : {
			fps: 1,
			tfps: 60,
			rpm: 0
		}
	},
	id: '63efb65c-dc3c-4423-9834-ef2ec06d87a8',
	domain       : null,
	_events      : { start: [Function], stop: [Function] },
	_eventsCount : 2,
	_maxListeners: undefined,
	_start       : [Function: bound _onAnimationStart],
	_stop        : [Function: bound _onAnimationStop],
	_updateFrames: [Function: bound _onAnimationUpdateFrames],
	_fn          : [Function: bound _onAnimationFn]
}
************************************************** */

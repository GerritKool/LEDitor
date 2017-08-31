"use strict";

Homey.log('LEDitor initializing...');
function init() {
	var	Animation = Homey.manager('ledring').Animation,
		frames = [],
		frame = [];


	// save version number as setting, so it's available for index.html
	Homey.manager('settings').set('version', Homey.manifest.version );

	// create animation with 1 empty frame
	for( var i = 0; i < 24; i ++){ frame.push( { r:0, g:0, b:0 } ); }
	frames.push(frame);
	var ani = {
		frames	: frames,
		priority: 'INFORMATIVE',
		duration: 1000,
		options	: { fps: 1, tfps: 60, rpm: 0 }
	}

	// check for initial animation data and create it if not defined.
	var aIndex = Homey.manager('settings').get('aniIndex');
	if (aIndex == undefined){
		// create empty memory slots
		Homey.log('Creating initial animation presets.');
		aIndex = [];
		for(var i=0; i<100; i++){
			aIndex.push({name: ( __('settings.txt_empty_preset') + ' ' + (i+1))});
			var aniId = 'animation' + i;

			Homey.manager('settings').set(aniId, ani );
		}
		Homey.manager('settings').set('aniIndex', aIndex );
	} else {
		Homey.log('Animation presets found');
		if(aIndex.length<100){
			for(var i=aIndex.length; i<100; i++){
				aIndex.push({name: ( __('settings.txt_empty_preset') + ' ' + (i+1))});
				var aniId = 'animation' + i;

				Homey.manager('settings').set(aniId, ani );
			}
		};
	}

// ********** create and register LEDitor animation objects **********
	// standard timed animation
	var animation = new Animation({
		frames  : ani.frames,
		priority: ani.priority,
		duration: ani.duration,
		options : {
			fps : ani.options.fps,
			tfps: ani.options.tfps,
			rpm : ani.options.rpm
		}
	});
	animation.register(function(err, result){
		if( err ) return Homey.error(err);
		animation.start();
		animation.on('start', function(){
			Homey.log('Started animation: ' + animation.id );
		})

		animation.on('stop', function(){
			Homey.log( 'Stopped animation: ' + animation.id );
		})
	});


	// frame edit preview
	var leditor_edit = new Animation({ 
		frames  : ani.frames,
		priority: ani.priority,
		duration: ani.duration,
		options : {
			fps : ani.options.fps,
			tfps: ani.options.tfps,
			rpm : ani.options.rpm
		}
	});
	leditor_edit.register(function(err, result){
		if( err ) return Homey.error(err);
		leditor_edit.start();
		leditor_edit.on('start', function(){
			Homey.log( 'Started edit preview' );
		})

		leditor_edit.on('stop', function(){
			Homey.log( 'Stopped edit preview' );
		})
	});


/* not yet
	// screensaver
	var leditor_screensaver = new Animation({ 
		frames  : ani.frames,
		priority: ani.priority,
		duration: ani.duration,
		options : {
			fps : ani.options.fps,
			tfps: ani.options.tfps,
			rpm : ani.options.rpm
		}
	});
	leditor_screensaver.register(function(err, result){
		if( err ) return Homey.error(err);
		leditor_screensaver.start();
		leditor_screensaver.on('start', function(){
			Homey.log( 'Started LEDitor screensaver' );
		})

		leditor_screensaver.on('stop', function(){
			Homey.log( 'Stopped LEDitor screensaver' );
		})
	});
	Homey.manager('ledring').registerScreensaver( 'leditor_1', leditor_screensaver );
*/


// ********** settings management **********
	Homey.manager('settings')
		.on('set', function (setting) {
		switch(setting){
		case 'animation':
			animation.stop();
			ani = Homey.manager('settings').get('animation');
			animation.args = {
				frames    : ani.frames,
				priority  : ani.priority,
				transition: Math.floor( 1000 / ( Number(ani.options.fps) + 1) ),
				duration  : ani.duration,
				options   : { fps: ani.options.fps, tfps: ani.options.tfps, rpm: ani.options.rpm }
			}
			animation.register(function(err, result){
				if( err ) return Homey.error(err);
				animation.start();
			});
			break;

		case 'leditor_edit':
			leditor_edit.stop();
			ani = Homey.manager('settings').get('leditor_edit');
			leditor_edit.args = {
				frames    : ani.frames,
				priority  : ani.priority,
				transition: Math.floor( 1000 / ( Number(ani.options.fps) + 1) ),
				duration  : ani.duration,
				options   : { fps: ani.options.fps, tfps: ani.options.tfps, rpm: ani.options.rpm }
			}
			leditor_edit.register(function(err, result){
				if( err ) return Homey.error(err);
				leditor_edit.start();
			});
			break;

		case 'leditor_screensaver':
			leditor_screensaver.stop();
			ani = Homey.manager('settings').get('leditor_screensaver');
			leditor_screensaver.args = {
				frames    : ani.frames,
				priority  : ani.priority,
				transition: Math.floor( 1000 / ( Number(ani.options.fps) + 1) ),
				duration  : ani.duration,
				options   : { fps: ani.options.fps, tfps: ani.options.tfps, rpm: ani.options.rpm }
			}
			leditor_screensaver.register(function(err, result){
				if( err ) return Homey.error(err);
				//leditor_screensaver.start();
			});
			Homey.manager('ledring').registerScreensaver( 'leditor_1', leditor_screensaver );
			break;
		}
	});


// ********** Flow Cards **********
	Homey.manager('flow')
		.on('action.animation_select.animationSelector.autocomplete',
			function(callback, args) {
				var aniIndex = Homey.manager('settings').get('aniIndex');
				var values = [];
				for( i=0; i<100; i++){
					var xNum = (i+1).toString(); if(xNum.length<3){xNum = '0' + xNum;}
					values[i] = {
						name: xNum + ': '+ aniIndex[i].name,
						value: i
					}
				}
				callback( null, values );
			}
		);

	Homey.manager('flow')
		.on('action.animation_select',
			function( callback, args ){
				var aniId = 'animation' + args.animationSelector.value;
				var aniDuration = args.animationTime * 1000;

				ani = Homey.manager('settings').get(aniId);
				animation.stop();
				animation.args = {
					frames	: ani.frames,
					priority	: 'INFORMATIVE',
					transition	: Math.round( 300 / Number(ani.options.fps)  ),
					duration	: aniDuration,
					options		: { fps: ani.options.fps, tfps: ani.options.tfps, rpm: ani.options.rpm }
				};
				animation.register(function(err, result){
					if( err ) return Homey.error(err);
					animation.start();
				});
				callback( null, true ); // fired successfully
			}
		);

	Homey.manager('flow')
		.on('action.animation_stop',
			function( callback, args ){
				animation.stop();
				callback( null, true ); // fired successfully
			}
		);

	Homey.log('LEDitor v' + Homey.manifest.version + ' started.');


	Homey.on('unload', function(){
		animation.stop();
		leditor_edit.stop();
		// not yet: leditor_screensaver.stop();
	});
}
module.exports.init = init;



/* ************************************************
- DOC: example registered Homey LED Ring Animation object
***************************************************
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
************************************************** */

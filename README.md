## Create your own custom LED-ring animations for Homey.
* Use millions of color tones to create any LED Ring animation that you like, up to 200 frames per animation.
* Use some helpfull tools for fills and rotations.
* Use generators to create basic animations with a few mouse clicks.
* Import frames and colors from any image.
* Save your creations and exchange them with your Homey friends.

NOTE 1: The operation of this app may work on some tablets, but it is designed for laptop and desktop PCs. Future versions might get mobile support.

NOTE 2: Homey's Desktop Application is very slow  in performing some functions. It also might not render some screens as they should be.
Urgent advice: Use Google Chrome (or a compatible browser) for the best experience with LEDitor. Just ignore the message that says 'Browsers are not supported'.

NOTE 3: Homey's screensavers wont work as long as a LEDitor animation is playing. Take that in consideration in case you are using screensavers for notifications. You could use LEDitor animations or Homey's built-in animation cards for these notifications. Homey's animation cards will interrupt a LEDitor animation. The LEDitor animation will continue when Homey's animation has finished.

If you think you have found a bug, or maybe you have a great idea, do not hesitate to open an issue at:
https://github.com/OpenMindNL/LEDitor/issues


The user's pleasure is my reward. People who like to show some extra gratitude can buy me a coffee.
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif" width="1" height="1">
</form>


### Brainwaves that still need to be converted to code:
* Make it possible to use animations as (semi?) screensavers.
* Add flow cards to use individual leds as status indicators, for example to indicate whether certain people or pets are present.
* Add flow cards to select a random animation and/or sequence of animations. Preferably with some in-card settings.
* Combine one or more animations to one. Needs some thinking about settings for stretching to an equal amount of frames, mixing  several colors to one etc.
* Special generator with sweeping lines, sine waves, blinking leds and more party stuff.
* Dummy-TV function to mislead potential burglars, with random selected 'movie light' effects like passing cars by night, zooming and panning colors, incidental flashes, lightning, explosions etc.


## What happened so far...
### v1.0.0
* New: LEDitor resizes with the browser window. The largest possible square area is assigned to the LED ring / editors on the right. The remaining screen part is used for the frame list, with a minimum width being taken into account.
* New: Display type selection for the frame list: Color view, LED view or Ring view.
* New: Randomizer. Changes hue, saturation, brightness and position of active LEDs randomly. The changes are adjustable from very subtle to fully chaotic.
* Optimized: More realistic neighboring color mix for onscreen LED Ring display.
* Optimized: Animation name will be set accordingly when using a animation generator, or when importing frames and colors from an image.
* Optimized Image-import section:
   * 'View' selection for the imported frames. The 'Ring view' option is a huge help to instantly see how the colors will be displayed on the LED Ring, and to adjust them if necessary.
   * The clicked preview pixel now becomes the view center when the image is zoomed in. Now it's much easier to select a different area without having to zoom out first.
   * Info about the image, zoom and scan area is shown in the mouse tooltip.
* Change: The 'LED Editor' and 'Animation generator' buttons are combined into a popup menu that also contains 'Randomize'.
* Change: The setting for 'Show control information' has been changed to 'Show header and control information', so when you uncheck it you will have maximum screen space for the editor.
* Bug removed: 'Direct select' option (at Color selection) was not stored properly.
* Bug removed: 'Fill empty frames smoothly. Fixed position' with 'HSB 2' gradient could create an invalid animation because of wrong color codes for inactive LEDs.
* Bug removed: 'Fill empty frames smoothly. Variable position' would sometimes add an extra frame, including a wrong gradient. If this resulted in a total of 201 frames, Homey would not play the animation anymore.
* Bug removed: 'Fill empty frames smoothly. Variable position'. When start frame and end frame both had only 1 active LED on exact opposite sides, there was only one flow when there should be two flows in opposite directions.

### v0.3.1
* Updated to Homey Apps SDK v2. Homey v1.5.0 or later is required!
* Optimized Undo/Redo to include FPS, VFPS, RPM and the animation name.
* Optimized HSB 1 and HSB 2 fills to show two different gradients when color hues are exactly 180 degrees apart (complementary colors).
* Added gradient type selection (HSB 1, HSB 2, RGB) to the generators.
* Added setting to select a pallet color, a color preference or a standard color with 1 mouse click.
* Added some missing control/help information.
* Various small updates and user interface improvements.

### v0.3.0
Completely reworked color display and color selection to provide a more intuitive operation.
* New: LED/light related display of colors.
* New: Palette expanded from 285 to 475 color tones. 19 colors / 25 brightness levels.
* New: Advanced color selection lets you choose any color you like and save 24 as your personal favorites.
* New: Pick the color from one LED and use it for further editing.
* New: Gamma control to match the screen colors to the actual LED Ring colors.
* New: Show frame changes on LED Ring.
* Added option: Choose from 3 different types of gradient fills. HSB 1, HSB 2 or RGB. Previous LEDitor version only had RGB-fill.
* Expanded total number of animations from 30 to 100.
* Removed bug: Fill-buttons were not always enabled when an animation contained inactive LEDs and 'All frames' was checked.
* Removed bug: Frames that were imported from images were processed with unwanted color corrections.
* Various small fixes and user interface updates. The term "Interpolated Frames" has been changed to "Virtual Frames"
* Code optimizing and rewriting.

### v0.2.2
* Removed bug: When accessing flow actions before the settings page was visited, LEDitor would crash.
* Straightened a few wrinkles in the user interface.
* Less storage because of removing unnecessary images from install.

### v0.2.1
* Removed bug: Internal color vector was not updated after selecting a color for the generator and returning to the editor. This made the generator trigger whenever color changes for the editor were expected.
* Removed bug: On-screen LED ring display did not update anymore with Solid Fill or Gradient Fill buttons.
* Removed bug: Frame counter did not update with Undo or Redo. 
* Updated 'Save LEDitor animation' window.
* Added missing translations and help texts.
* Small fixes / changes.

### v0.2.0
* Added the ability to save and (re)load animations, which allows for back-ups and exchange with other users.
* Included a generator which produces all the patterns from the "LED-ring collection" with user definable colors and settings.
* Included two different ways to smoothly fill empty/inactive frames in animations.
* Included an option to apply rotate and fill actions to all frames at once.
* Reorganized the user interface a little.
* Small fixes.

### v0.1.2
* Removed bug: Adding a new frame would clear recently created frames.
* Removed bug: An animation would not always play correct on-screen immediately after being edited.
* Removed bug: In particular situations, when opening an image was canceled, the user-interface could become unresponsive.
* Code optimized.

### v0.1.1
* Removed bug: Moving a frame up/down and then use undo would result in two corrupted frames and render the animation unusable.
* Removed bug: When moving a frame up/down, it now stays selected.
* Removed some useless code

### v0.1.0
* First beta release

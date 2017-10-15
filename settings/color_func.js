function adjustRgbGamma(objColRgb){
//corrected = 255 * (Image/255)^(1/gammaValue)
	var	cR = 255 * Math.pow((Number(objColRgb.r) / 255), 1/Number(settingGammaR.value)),
		cG = 255 * Math.pow((Number(objColRgb.g) / 255), 1/Number(settingGammaG.value)),
		cB = 255 * Math.pow((Number(objColRgb.b) / 255), 1/Number(settingGammaB.value));

	return {r:cR, g:cG, b:cB};
}

function adjustHsvGamma(h, s, v){
	var arrayRgb = hsvToRgb( h, s, v);
	var colRGB = {r:arrayRgb[0], g:arrayRgb[1], b:arrayRgb[2] };
	colRGB = adjustRgbGamma(colRGB, gammaValue);

	return rgbToHsv(Number(colRGB.r), Number(colRGB.g), Number(colRGB.b));
}

function contrastBlackOrWhite(contrastColor){ // {r:x, g:x, b:x}
	if(contrastColor.r * 0.3 + contrastColor.g* 0.6 + contrastColor.b * 0.1 > 118){
		var xR = 0, xG = 0, xB= 0;
	} else {
		var xR = 255, xG = 255, xB= 255;
	}
	return {r:xR, g:xG, b:xB};
}

function getColorName(objRGB){
	var	colName = '',
		compCol = objRGB.r +','+ objRGB.g +','+ objRGB.b;

	switch(compCol){
		case '0,0,0': colName = thisApp.text.off; break;
		case '255,0,0': colName = thisApp.text.pure_red; break;
		case '254,255,0':
		case '255,255,0': colName = thisApp.text.pure_yellow; break;
		case '1,255,0':
		case '0,255,0': colName = thisApp.text.pure_green; break;
		case '0,255,255': colName = thisApp.text.pure_cyan; break;
		case '1,0,255':
		case '0,0,255': colName = thisApp.text.pure_blue; break;
		case '254,0,255':
		case '255,0,255': colName = thisApp.text.pure_magenta; break;
		case '255,255,255': colName = thisApp.text.bright_white; break;
	}
	return colName.substr(0,1).toUpperCase() + colName.substr(1).toLowerCase();;
}

function getViewColor(colObj){
	gammaRGB = adjustRgbGamma(colObj);
	return {r:Math.round(gammaRGB.r), g:Math.round(gammaRGB.g), b:Math.round(gammaRGB.b)};
}

function createColorFlow(colRGB1, colRGB2, nSteps, flowType){
// colRGB1, colRGB2 = start/end rgbObjects: {r:<int>, g:<int>, b:<int>}
// flowType = 'hsv1', 'hsv2', 'rgb'

	var	colorFlow =[];

	switch(flowType){
	case'rgb':
		var	colR = Number(colRGB1.r),
			colG = Number(colRGB1.g),
			colB = Number(colRGB1.b),
			colStepR = (Number(colRGB2.r) - colR) / nSteps,
			colStepG = (Number(colRGB2.g) - colG) / nSteps,
			colStepB = (Number(colRGB2.b) - colB) / nSteps;

		for(var j = 0; j<= nSteps; j++){
			colorFlow.push( {r:Math.round(colR), g:Math.round(colG), b:Math.round(colB)} );
			colR += colStepR;
			colG += colStepG;
			colB += colStepB;
		}
		break;

	case'hsv1': // short hue track
	case'hsv2': // long hue track
		var	hsv1 = rgbToHsv(colRGB1.r, colRGB1.g, colRGB1.b),
			hsv2 = rgbToHsv(colRGB2.r, colRGB2.g, colRGB2.b);

		if(hsv1[2] == 0){
			hsv1[0] = hsv2[0];
			hsv1[1] = hsv2[1];
		} else if(hsv2[2] == 0){
			hsv2[0] = hsv1[0];
			hsv2[1] = hsv1[1];
		}

		if(flowType == 'hsv2' && hsv1[0] == hsv2[0]){
			if(hsv2[2] == 0){
				hsv2[0] = 0;
			} else {
				hsv2[0] -= (1/18 / (hsv2[2] * 84));
				if(hsv2[0] < 0){hsv2[0] = 1 + hsv2[0];}
			}
		}

		var	hueTrack = (hsv2[0] - hsv1[0]),
			colH = hsv1[0],
			colS = hsv1[1],
			colV = hsv1[2],
			colStepH = hueTrack / nSteps,
			colStepS = (hsv2[1] - hsv1[1]) / nSteps,
			colStepV = (hsv2[2] - hsv1[2]) / nSteps;


		switch(flowType){
		case'hsv1':
			if( hueTrack > 0.5 ){
				colStepH = (hueTrack - 1) / nSteps;
			} else if( hueTrack < -0.5 ){
				colStepH = (hueTrack + 1) / nSteps;
			}
			break;

		case'hsv2':
			if( hueTrack > 0 && hueTrack < 0.5 ){
				colStepH = (hueTrack - 1) / nSteps;
			} else if(  hueTrack < 0 && hueTrack > -0.5 ){
				colStepH = (hueTrack + 1) / nSteps;
			}
			if( Math.abs(hueTrack) == 0.5 ){ colStepH = -colStepH; }
			break;
		}

		for(var j = 0; j<= nSteps; j++){
			newRGB = hsvToRgb(colH, colS, colV);
			colorFlow.push( {r:newRGB[0], g:newRGB[1], b:newRGB[2]} );
			colH += colStepH; if(colH < 0){ colH += 1; } else if(colH > 1){ colH -= 1; }
			colS += colStepS;
			colV += colStepV;
		}
		break;
	}
	// returning array containing rgbObjects: {r:<int>, g:<int>, b:<int>}
	// first and last = colRGB1 and colRGB2
	return colorFlow;
}

function getTopColor(){
	switch(topColor){// topColor = 0...3 (black, 33% grey, 67% grey, white)
		case 0: var	bB = '#000000',
				bT = '#ffffff';
			break;

		case 1: var	bB = '#555555',
				bT = '#ffffff';
			break;

		case 2: var	bB = '#aaaaaa',
				bT = '#000000';
			break;

		default: var	bB = '#ffffff',
				bT = '#000000';
	}
	return {b:bB, t:bT};
}


// ************ rgb hsl/hsv conversion ************
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

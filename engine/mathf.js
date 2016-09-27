//Put in namespace
var mathf =
{
    /*
		Missing functions (This that should be added but I couldnt figure out):
		- Inverse learping - find the iterpolant between a and b based on t
		- Negative infinity - JS does not support (I think)
	*/

	/* ----- Constant values ----- */
    PI : 3.1415926, //The circumference to the perimeter of a circle
    TAU : 6.2831852, //Double 'pi'
    TRUNCATION_LIMITS : 0.005, //Temp
    INFINITE : Infinity, //Like: HUGE_VALF
    DEG_TO_RAD : (3.1415926 * 2) / 360, //For converting degrees to radians
    RAD_TO_DEG : 360 / (3.1415926 * 2), //For converting radians to degrees

	/* ----- Wrapper functions ----- */

	//General
    sqrt : function(f) { return Math.sqrt(f); },
    pow : function(f, power) { return Math.pow(f, power); },
	root : function(f, n) { return Math.pow(f, 1.0 / n); },
    abs : function(foo) { return Math.abs(foo); },

	//Trig
    cos : function(foo) { return Math.cos(foo); },
	sin : function(foo) { return Math.sin(foo); },
	acos : function(foo) { return Math.acos(foo); },
	asin : function(foo) { return Math.asin(foo); },
	atan : function(foo) { return Math.atan(foo); },
	atan2 : function(x, y) { return Math.atan2(x, y); },

	//Rounding
	ceil : function(f) { return Math.ceil(f); },
	floor : function(f) { return Math.floor(f); },
	max : function(a, b) { return Math.max(a, b); },
	min : function(a, b) { return Math.min(a, b); },
    round : function(f) { return Math.round(f); },
    
	/* ----- Useful functions ----- */

	//Since the JS '%' doesnt support floats
	mod : function(num, div) { return div * ((num / div) - mathf.floor(num / div)); },

	//Returns a value inbetween min and max
	clamp : function(value, minimum, maximum)
	{
		//Combine the maximum and mimumm functions to achive this
		return mathf.max(minimum, mathf.min(value, maximum));
	},

	//Clamps between 0 and 1
	clamp01 : function(value) { return mathf.clamp(value, 0.0, 1.0); },

	//Smoothdamp, much like lerp interpolates between values
	//But smoothing (much like a broad cubic function)
	//Apply the equation:
	//fn(x) = 3x^2 - 2x^3
	//This is in the form of a wuatratic equation
	//Source: https://en.wikipedia.org/wiki/Smoothstep
	// http://http.developer.nvidia.com/Cg/smoothstep.html
    smoothstep : function(left, right, x)
	{
		//Clamp the value
		x = mathf.clamp01((x - left) / (right - left));

		//Evaluate quadratic
		return x * x * (3.0 - 2.0 * x);
	},
    smoothstep01 : function(x) { return Math.smoothstep(0.0, 1.0, x); },

	//This applies a combination of lerping and smooth stepping
	//By haveint a smooth interpolation to a result
	//This is a 100% copy of unitys Smooth damp, found here:
	//https://docs.unity3d.com/ScriptReference/Mathf.SmoothDamp.html
    smoothdamp : function(current, target, vel, smoothTime, maxSpeed, deltaTime)
	{
		smoothTime = mathf.max(0.0001, smoothTime);
		var num = 2.0 / smoothTime;
		var num2 = num * deltaTime;
		var num3 = 1.0 / (1.0 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
		var num4 = current - target;
		var num5 = target;
		var num6 = maxSpeed * smoothTime;
		num4 = mathf.clamp(num4, -num6, num6);
		target = current - num4;
		var num7 = (vel + num * num4) * deltaTime;
		vel = (vel - num * num7) * num3;
		var num8 = target + (num4 + num7) * num3;
		if (num5 - current > 0.0 == num8 > num5)
		{
			num8 = num5;
			vel = (num8 - num5) / deltaTime;
		}

		return num8;
	},

	//Similar but with the equation:
	//6x^5 - 15x^4 + 10x^3
    smootherstep : function(left, right, x)
	{
		//Scale and clamp
		var nx = mathf.clamp01((x - left) / (right - left));

		//Evaluate
		return nx * nx * nx * (nx * (nx * 6 - 15) + 10);
	},
    smootherstep01 : function(x) { return mathf.smootherstep(0.0, 1.0, x); },

	//A simplified version of smotherstep
	//This is used for perlin noise interpolation between seed vector
    interpolateNoiseCurve : function(t) { return t * t * t * (t * (t * 6 - 15) + 10); },

	//For finding the gradient of two point in the perlin noise cube
    noiseGradient : function(hash, x, y, z)
	{
		//From: https://github.com/sol-prog/Perlin_Noise
		var h = hash & 15;

		var u = h < 8 ? x : y,
			v = h < 4 ? y : h == 12 || h == 14 ? x : z;
		return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
	},

	//Find the sign (posative of negative) of a number
	//Note: 0 is considered a posative number
    sign : function(foo) { return (foo < 0.0) ? -1.0 : 1.0; },

	//Linearly interpolate between two floats by t
    lerpUnclamped : function(a, b, t)
	{
		//Just use equation from:
		//(1 - t) * v0 + t * v1
		//https://devblogs.nvidia.com/parallelforall/lerp-faster-cuda/
		return (1 - t) * a + t * b;
	},
    
    lerp : function(a, b, t) { return mathf.lerpUnclamped(a, b, mathf.clamp01(t)); },
    noiseLerp : function(t, a, b) { return a + t * (b - a); },

	//Like lerping but the value will never exceed a delta
    moveTowards : function(current, target, delta)
	{
		//Make sure distance is less than delta
		if (mathf.abs(target - current) <= delta) return target;

		//Otherwise apply a lerp
		return current + mathf.sign(target - current) * delta;
	},
    
    //Like movetowards but it corrects for angles
    moveTowardsAngle : function(current, target, delta)
    {
        target = current + mathf.deltaAngle(current, target);
        return mathf.moveTowards(current, target, delta)
    },

	//Ping pong will loop a value between 0 and the upper limit
    bounce : function(value, min, max)
	{
		var range = max - min;
		var state = mathf.mod(value - min, 2 * range);

		if (state > range)
			state = (2 * range) - state;

		return state + min;
	},

	//Overload
    bounce0 : function(value, max) { return mathf.bounce(value, 0.0, max); },
    bounce01 : function(value)     { return mathf.bounce(value, 0.0, 1.0); },

	//Logarithmics...
    logbase : function(f, base)
	{
		//Consider C++ only priveds a base 2 and 10 log
		//The other base must be calculated
		return Math.log(f) / Math.log(base);
	},
    log : function(f) { return Math.log(f); },
	log2 : function(f) { return mathf.logbase(f, 2); },
	log10 : function(f) { return mathf.logbase(f, 10); },

	//This will find the percentage trhough a lerp based on paramters
	//Inverse lerp - not done

	//Find the the closest difference between two angles
    deltaAngle : function(current, target)
	{
		//FInd difference
		var diff = target - current;

		//Adjust signs
		while (diff < -180) diff += 360;
		while (diff > 180) diff -= 360;

		//Done
		return diff;
	},

	//Find the value as a power of two
    closestBinaryPower : function(value)
	{
		//Needs	 the find the 2 root of the value then round that to an int
		return mathf.round(mathf.pow(mathf.round(mathf.sqrt(value)), 2));
	},
    isBinaryPower : function(value) { return closestBinaryPower(value) == value; },

	//Find the max where:
	//Arr is a heap array
	//size is the BYTE size
    maxarray : function(arr)
	{
		//Stores the best value
		var current_highest = 0;

		//Go through and set based on max
		for (var i = 0; i < arr.length; i++) 
        { 
            if (arr[i] > current_highest || i == 0) current_highest = arr[i]; 
        }

		//Done
		return current_highest;
	},

	//Find the min where:
	//Arr is a heap array
	//size is the BYTE size
    minarray : function(arr)
	{
		//Stores the best value
		var current_lowest = 0;

		//Go through and set based on max
		for (var i = 0; arr.length; i++) 
        { 
            if (arr[i] < current_lowest || i == 0) current_lowest = arr[i]; 
        }

		//Done
		return current_lowest;
	},

	//Because of slight round errors in floats, this should be used when comparing
    approximatly : function(a, b, rounding = mathf.TRUNCATION_LIMITS) 
    { return mathf.abs(a - b) < rounding; }
};

//Some simple functions for random number generation
//This is so perlin noise is easier
var random =
{
	//Random number between min and max
    range : function(min, max) { return (Math.random() * (max - min)) + min; },
	
	//Generates a random number between 0 and 1
    value : function() { return Math.random(); },

	//Generate a random integer 
    randInt : function(min, max) { return mathf.round(random.range(min, max)); },
    randBin : function() { return random.randInt(0, 2); }
};
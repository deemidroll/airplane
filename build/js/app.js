/* Made by deemidroll | 2014 | deemidroll@gmail.com */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Dmitry/projects/helicopter/tech/airplane/node_modules/tween.js/index.js":[function(require,module,exports){
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/sole/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Date.now shim for (ahem) Internet Explo(d|r)er
if ( Date.now === undefined ) {

	Date.now = function () {

		return new Date().valueOf();

	};

}

var TWEEN = TWEEN || ( function () {

	var _tweens = [];

	return {

		REVISION: '14',

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function ( tween ) {

			_tweens.push( tween );

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			if ( _tweens.length === 0 ) return false;

			var i = 0;

			time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

			while ( i < _tweens.length ) {

				if ( _tweens[ i ].update( time ) ) {

					i++;

				} else {

					_tweens.splice( i, 1 );

				}

			}

			return true;

		}
	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {

		_valuesStart[ field ] = parseFloat(object[field], 10);

	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {

			_duration = duration;

		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

			}

			_valuesStart[ property ] = _object[ property ];

			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

		}

		return this;

	};

	this.stop = function () {

		if ( !_isPlaying ) {
			return this;
		}

		TWEEN.remove( this );
		_isPlaying = false;

		if ( _onStopCallback !== null ) {

			_onStopCallback.call( _object );

		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

			_chainedTweens[ i ].stop();

		}

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function ( times ) {

		_repeat = times;
		return this;

	};

	this.yoyo = function( yoyo ) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function ( callback ) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function ( callback ) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function ( callback ) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function ( callback ) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function ( time ) {

		var property;

		if ( time < _startTime ) {

			return true;

		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {

				_onStartCallback.call( _object );

			}

			_onStartCallbackFired = true;

		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				_object[ property ] = _interpolationFunction( end, value );

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				// protect against non numeric properties.
				if ( typeof(end) === "number" ) {
					_object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _repeat > 0 ) {

				if( isFinite( _repeat ) ) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for( property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[ property ];
						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object );

				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

					_chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function ( k ) {

			return k;

		}

	},

	Quadratic: {

		In: function ( k ) {

			return k * k;

		},

		Out: function ( k ) {

			return k * ( 2 - k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In: function ( k ) {

			return k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In: function ( k ) {

			return k * k * k * k;

		},

		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In: function ( k ) {

			return k * k * k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

	Circular: {

		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

	Back: {

		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In: function ( k ) {

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

		},

		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		InOut: function ( k ) {

			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier: function ( v, k ) {

		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear: function ( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein: function ( n , i ) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( function () {

			var a = [ 1 ];

			return function ( n ) {

				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;

			};

		} )(),

		CatmullRom: function ( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

};

module.exports=TWEEN;
},{}],"/Users/Dmitry/projects/helicopter/tech/airplane/src/js/animate.js":[function(require,module,exports){
window.requestAnimationFrame = function () {
    return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();
window.cancelAnimationFrame = function () {
    return (
        window.cancelAnimationFrame       ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame    ||
        window.oCancelAnimationFrame      ||
        window.msCancelAnimationFrame     ||
        function(id){
            window.clearTimeout(id);
        }
    );
}();

function animate(nowMsec, callback) {
    var deltaMsec;
    nowMsec = nowMsec || Date.now();
    animate.lastTimeMsec = animate.lastTimeMsec || nowMsec - 1000 / 60;
    deltaMsec = Math.min(100, nowMsec - animate.lastTimeMsec);
    // keep looping
    animate.id = window.requestAnimationFrame(animate);
    // change last time
    animate.lastTimeMsec = nowMsec;
    // call each update function
    if (callback) animate.callback = callback;
    animate.callback(deltaMsec, nowMsec, animate.id);
}

module.exports = animate;
},{}],"/Users/Dmitry/projects/helicopter/tech/airplane/src/js/main.js":[function(require,module,exports){
var Detector = window.Detector;
var THREE = window.THREE;
var TWEEN = require('tween.js');
var tweens = require('./tweens.js');
var animate = require('./animate.js');
var socket = require('./socket.js');
var $ = window.$;

if (! Detector.webgl) Detector.addGetWebGLMessage();

var $document = $(document);

var $address = $('#address');
var $interface = $('.interface');

socket.init();

var gameStarted = false;
var isControl = true;

var airplane;

$document.on('socketInitialized', function (e, data) {
    var address = window.location.origin + '/m/#' + data.gameCode;
    $('.content-info-qr').qrcode({
        render: 'div',
        size: 150,
        fill: '#fff',
        text: address
    });
    $address.text(address);
});

var rot = {x: 0, y: 0, z: 0};
$document.on('turn', function (e, data) {
    var turn = -data.turn/90;
    var x = data.x;
    rot = {x: (x - 45)/180, y: turn * 2, z: Math.PI + turn};
});

$document.on('start', function () {
    var startTime = 1500;
    $interface.addClass('hidden');
    gameStarted = true;
    isControl = false;
    tweens.start(airplane, startTime);
    setTimeout(function () {
        isControl = true;
    }, startTime);
});

var camera, scene, renderer;

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function generateTexture(color1, color2) {
    var size = 512;
    // create canvas
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    // get context
    var crx = canvas.getContext('2d');
    // draw gradient
    crx.rect(0, 0, size, size);
    var gradient = crx.createLinearGradient(0, 0, size, 0);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(0.5, color2);
    gradient.addColorStop(1, color1);
    crx.fillStyle = gradient;
    crx.fill();
    return canvas;
}

function init() {
    var container = document.createElement( 'div' );
    document.body.appendChild( container );
    // scene

    scene = new THREE.Scene();

    // camera

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 0;
    camera.position.z = 30;
    camera.up = new THREE.Vector3(0,1,0);
    scene.add( camera );

    //

    renderer = new THREE.WebGLRenderer( {
        antialias: true,
    } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x102037 );

    container.appendChild( renderer.domElement );

    //
    window.addEventListener( 'resize', onWindowResize, false );

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var loader = new THREE.OBJLoader(manager);

    airplane = new THREE.Object3D();

    loader.load('./obj/airplane10.obj', function (object) {

        var color2 = '#F3F3F5',
            color1 = '#B1B2B6';

        var texture = new THREE.Texture(generateTexture(color1, color2));
        var texture2 = new THREE.Texture(generateTexture(color2, color1));
        texture.needsUpdate = true; // important!
        texture2.needsUpdate = true; // important!

        object.children[0].material = new THREE.MeshBasicMaterial({
            map: texture,
            // color: 0xF3F3F5,
            transparent: true,
            side: THREE.DoubleSide
        });
        var object2 = object.clone();
        object2.children[0].material = new THREE.MeshBasicMaterial({
            map: texture2,
            // color: 0xF3F3F5,
            transparent: true,
            side: THREE.DoubleSide
        });
        object2.position.y = 0.01;

        airplane.add(object);
        airplane.add(object2);
        airplane.scale.set(0.05, 0.05, 0.05);
        airplane.rotation.z = Math.PI;
        airplane.rotation.x = Math.PI/12;

        airplane.rotation.x += Math.PI/12;
        airplane.rotation.z -=Math.PI/24;
        airplane.rotation.y = -Math.PI/6;

        airplane.position.x = 1;
        airplane.position.y = 8;
    });
    scene.add(airplane);

    var ambient = new THREE.AmbientLight( 0x344163 );
    scene.add( ambient );

    var light = new THREE.PointLight( 0xffffff, 0.75, 500 );
    light.position.set(0, 8.3, 10);
    airplane.add( light );
}

init();

function genRandomFloorBetween(min, max) {
    var rand = min - 0.5 + Math.random()*(max-min+1);
    rand = Math.round(rand);
    return rand;
}

var planets = [];
var planetTextrure = THREE.ImageUtils.loadTexture( './img/noise.jpg' );
var planetColors = [0x43FFD9, 0xFE147A, 0xE7C08C];
var planetSizes = [2, 3, 4];

var Planet = function () {
    this.geom = new THREE.SphereGeometry( planetSizes[genRandomFloorBetween(0, 2)], 60, 40 );
    this.mat = new THREE.MeshLambertMaterial({
        color: planetColors[genRandomFloorBetween(0, 2)],
        map: planetTextrure
    });
    this.mesh = new THREE.Mesh(this.geom, this.mat);
    this.mesh.position.x = genRandomFloorBetween(-100, 100);
    this.mesh.position.y = genRandomFloorBetween(-20, 20);
    // this.mesh.position.z = -55;
    this.mesh.position.z = genRandomFloorBetween(-100, -10);
    scene.add( this.mesh );
};

Planet.prototype.update = function () {
    this.mesh.rotation.y += 0.01;
    return this;
};

for (var i = 0; i < 20; i ++) {
    planets.push(new Planet());
}

function updateCamera() {
    var relativeCameraOffset = new THREE.Vector3(0, -80, 600);

    var cameraOffset = relativeCameraOffset.applyMatrix4( airplane.matrixWorld );

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt( airplane.position );
}

animate(0, function () {
    // updateCamera();
    if (gameStarted && isControl) {
        updateCamera();
        ['x', 'y', 'z'].forEach(function (axis) {
            var delta = rot[axis] - airplane.rotation[axis];
            airplane.rotation[axis] += delta/10;
        });
        airplane.translateZ( -0.1 );
    }
    planets.forEach(function (planet) {
        planet.update();
    });
    renderer.render(scene, camera);
    TWEEN.update();
});

},{"./animate.js":"/Users/Dmitry/projects/helicopter/tech/airplane/src/js/animate.js","./socket.js":"/Users/Dmitry/projects/helicopter/tech/airplane/src/js/socket.js","./tweens.js":"/Users/Dmitry/projects/helicopter/tech/airplane/src/js/tweens.js","tween.js":"/Users/Dmitry/projects/helicopter/tech/airplane/node_modules/tween.js/index.js"}],"/Users/Dmitry/projects/helicopter/tech/airplane/src/js/socket.js":[function(require,module,exports){
var io = window.io;
var $ = window.$;

// var server = window.location.origin !== 'http://localhost' ? window.location.origin : 'http://192.168.1.38';
var server = 'http://localhost:8080';
var socket;
var ws = {};

// var $window = $(window);
var $document = $(document);

ws.init = function() {
    console.log(server);
    // set socket
    socket = ws.socket = io.connect(server);
    // When initial welcome message, reply with 'game' device type
    socket.on('welcome', function() {
        socket.emit('device', {'type':'game'});
    });
    // We receive our game code to show the user
    socket.on('initialize', function(gameCode) {
        socket.gameCode = gameCode;
        $document.trigger('socketInitialized', {gameCode: gameCode, server: server});
    });
    // When the user inputs the code into the phone client, we become 'connected'. Start the game.
    socket.on('connected', function(data) {
        $document.trigger('socketConnected', data);
    });
    // When the phone is turned, change destPoint
    socket.on('turn', function(data) {
        $document.trigger('turn', data);
        // if (DT.enableMobileSatus === 'enabled') DT.handlers.turnHandler(turn);;
    });
    socket.on('click', function(click) {
        console.log('click', click);
        // if (DT.enableMobileSatus === 'enabled') DT.handlers[click]();
    });
    socket.on('start', function(data) {
        console.log('start', data);
        $document.trigger('start', data);
    });
    // DT.$document.on('changeScore', function (e, data) {
    //     DT.sendMessage({type: 'vibr', time: 10});
    // });
};
ws.sendMessage = function (options) {
    var data = {
        'type': options.type,
        'gameCode': socket.socket.gameCode,
        'sessionid': socket.socket.socket.sessionid
    };
    if (socket.socket) {
        socket.socket.emit('message', data);
    }
};

// DT.$document.on('startGame', function (e, data) {
//     DT.sendMessage({type: 'gamestarted'});
// });
// DT.$document.on('startGame', function (e, data) {
//     if (data.control === 'mobile') DT.enableMobileSatus = 'enabled';
// });
// DT.$document.on('resetGame', function (e, data) {
//     if (data.cause === 'chooseControl') DT.enableMobileSatus = 'disabled';
// });
// DT.$document.on('gameOver', function (e, data) {
//     DT.sendMessage({type: 'gameover'});
// });
// DT.$document.on('checkup', function (e, data) {
//     DT.sendMessage({type: 'checkup', dogecoinId: data.dogecoinId});
// });
// DT.$document.on('resetGame', function (e, data) {
//     DT.sendMessage({type: 'resetGame'});
// });

module.exports = ws;

},{}],"/Users/Dmitry/projects/helicopter/tech/airplane/src/js/tweens.js":[function(require,module,exports){
var TWEEN = require('tween.js');

var tweens = {};

tweens.start = function (obj, time) {
    time = time || 1500;

    var posX = [10 * 1.5, 20 * 1.5, 10 * 1.5, 0];
    var posY = [16 * 1.5, 0 * 1.5, -8 * 1.5, 0];
    var posZ = [-10 * 1.5, 0 * 1.5, 10 * 1.5, 0];

    var rotX = [
        Math.PI/12,
        Math.PI/12,
        Math.PI/12,
        Math.PI/24
    ];
    var rotY = [
        -Math.PI/3,
        -1.1*Math.PI,
        -1.5*Math.PI,
        -2 * Math.PI
    ];
    var rotZ = [
        Math.PI/2,
        Math.PI/2,
        Math.PI,
        Math.PI
    ];

    new TWEEN.Tween(obj.position)
        .to({x: posX, y: posY, z: posZ}, time)
        .interpolation( TWEEN.Interpolation.Bezier )
        .easing( TWEEN.Easing.Sinusoidal.In )
        .start();

    new TWEEN.Tween(obj.rotation)
        .to({x: rotX, y: rotY, z: rotZ}, time)
        .interpolation( TWEEN.Interpolation.Bezier )
        .easing( TWEEN.Easing.Sinusoidal.In )
        .start();

    new TWEEN.Tween(obj.children[1].children[0].material.color)
        .to({r: 0.30196078431372547, g: 0.7843137254901961, b: 0.9764705882352941}, time)
        .easing( TWEEN.Easing.Sinusoidal.In )
        .start();

    new TWEEN.Tween(obj.children[2].children[0].material.color)
        .to({r: 0.30196078431372547, g: 0.7843137254901961, b: 0.9764705882352941}, time)
        .easing( TWEEN.Easing.Sinusoidal.In )
        .start();
};

module.exports = tweens;

},{"tween.js":"/Users/Dmitry/projects/helicopter/tech/airplane/node_modules/tween.js/index.js"}]},{},["/Users/Dmitry/projects/helicopter/tech/airplane/src/js/main.js"])
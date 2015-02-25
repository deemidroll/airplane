var TWEEN = require('tween.js');

var tweens = {};

tweens.start = function (obj, time) {
    time = time || 1500;

    var posX = [10 * 1.5, 20 * 1.5, 10 * 1.5, 0];
    var posY = [16 * 1.5, 0 * 1.5, -8 * 1.5, -2];
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

/* Made by deemidroll | 2014 | deemidroll@gmail.com */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var Detector = window.Detector;
var THREE = window.THREE;
var animate = require('./animate.js');

if (! Detector.webgl) Detector.addGetWebGLMessage();

var camera, scene, renderer;

var obj;

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

    // scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    // camera

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 0;
    camera.position.z = 20;
    scene.add( camera );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff );
    renderer.shadowMapEnabled = true;

    container.appendChild( renderer.domElement );

    //
    window.addEventListener( 'resize', onWindowResize, false );

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var loader = new THREE.OBJLoader(manager);

    obj = new THREE.Object3D();
    obj.castShadow = true;

    loader.load('./obj/airplane.obj', function (object) {
        // var color2 = '#F3F3F5',
            // color1 = '#B1B2B6';
        var color2 = '#4DC8F9',
            color1 = '#1880B4';

        var texture = new THREE.Texture(generateTexture(color1, color2));
        var texture2 = new THREE.Texture(generateTexture(color2, color1));
        texture.needsUpdate = true; // important!
        texture2.needsUpdate = true; // important!

        object.children[0].material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        var object2 = object.clone();
        object2.children[0].material = new THREE.MeshBasicMaterial({
            map: texture2,
            transparent: true,
            side: THREE.DoubleSide
        });
        object2.position.y = 0.01;

        obj.add(object);
        obj.add(object2);
        obj.scale.multiplyScalar(0.1);
        obj.rotation.z = Math.PI;
    });
    scene.add(obj);

}

init();

animate(0, function () {
    renderer.render(scene, camera);
    // obj.rotation.x += 0.01;
    obj.rotation.y += 0.01;
});

},{"./animate.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9EbWl0cnkvcHJvamVjdHMvaGVsaWNvcHRlci90ZWNoL2FpcnBsYW5lL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0RtaXRyeS9wcm9qZWN0cy9oZWxpY29wdGVyL3RlY2gvYWlycGxhbmUvc3JjL2pzL2FuaW1hdGUuanMiLCIvVXNlcnMvRG1pdHJ5L3Byb2plY3RzL2hlbGljb3B0ZXIvdGVjaC9haXJwbGFuZS9zcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICAgfHxcbiAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG4gICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgfHxcbiAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICB8fFxuICAgICAgICBmdW5jdGlvbigvKiBmdW5jdGlvbiAqLyBjYWxsYmFjayl7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgfVxuICAgICk7XG59KCk7XG53aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG4gICAgICAgIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgICAgfHxcbiAgICAgICAgd2luZG93Lm9DYW5jZWxBbmltYXRpb25GcmFtZSAgICAgIHx8XG4gICAgICAgIHdpbmRvdy5tc0NhbmNlbEFuaW1hdGlvbkZyYW1lICAgICB8fFxuICAgICAgICBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgICAgfVxuICAgICk7XG59KCk7XG5cbmZ1bmN0aW9uIGFuaW1hdGUobm93TXNlYywgY2FsbGJhY2spIHtcbiAgICB2YXIgZGVsdGFNc2VjO1xuICAgIG5vd01zZWMgPSBub3dNc2VjIHx8IERhdGUubm93KCk7XG4gICAgYW5pbWF0ZS5sYXN0VGltZU1zZWMgPSBhbmltYXRlLmxhc3RUaW1lTXNlYyB8fCBub3dNc2VjIC0gMTAwMCAvIDYwO1xuICAgIGRlbHRhTXNlYyA9IE1hdGgubWluKDEwMCwgbm93TXNlYyAtIGFuaW1hdGUubGFzdFRpbWVNc2VjKTtcbiAgICAvLyBrZWVwIGxvb3BpbmdcbiAgICBhbmltYXRlLmlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICAvLyBjaGFuZ2UgbGFzdCB0aW1lXG4gICAgYW5pbWF0ZS5sYXN0VGltZU1zZWMgPSBub3dNc2VjO1xuICAgIC8vIGNhbGwgZWFjaCB1cGRhdGUgZnVuY3Rpb25cbiAgICBpZiAoY2FsbGJhY2spIGFuaW1hdGUuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICBhbmltYXRlLmNhbGxiYWNrKGRlbHRhTXNlYywgbm93TXNlYywgYW5pbWF0ZS5pZCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYW5pbWF0ZTsiLCJ2YXIgRGV0ZWN0b3IgPSB3aW5kb3cuRGV0ZWN0b3I7XG52YXIgVEhSRUUgPSB3aW5kb3cuVEhSRUU7XG52YXIgYW5pbWF0ZSA9IHJlcXVpcmUoJy4vYW5pbWF0ZS5qcycpO1xuXG5pZiAoISBEZXRlY3Rvci53ZWJnbCkgRGV0ZWN0b3IuYWRkR2V0V2ViR0xNZXNzYWdlKCk7XG5cbnZhciBjYW1lcmEsIHNjZW5lLCByZW5kZXJlcjtcblxudmFyIG9iajtcblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG5cbiAgICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgIHJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcblxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRleHR1cmUoY29sb3IxLCBjb2xvcjIpIHtcbiAgICB2YXIgc2l6ZSA9IDUxMjtcbiAgICAvLyBjcmVhdGUgY2FudmFzXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy53aWR0aCA9IHNpemU7XG4gICAgY2FudmFzLmhlaWdodCA9IHNpemU7XG4gICAgLy8gZ2V0IGNvbnRleHRcbiAgICB2YXIgY3J4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgLy8gZHJhdyBncmFkaWVudFxuICAgIGNyeC5yZWN0KDAsIDAsIHNpemUsIHNpemUpO1xuICAgIHZhciBncmFkaWVudCA9IGNyeC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBzaXplLCAwKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgY29sb3IxKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC41LCBjb2xvcjIpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBjb2xvcjEpO1xuICAgIGNyeC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICBjcnguZmlsbCgpO1xuICAgIHJldHVybiBjYW52YXM7XG59XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XG4gICAgLy8gc2NlbmVcblxuICAgIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAvLyBzY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKCAweGNjZTBmZiwgNTAwLCAxMDAwMCApO1xuXG4gICAgLy8gY2FtZXJhXG5cbiAgICBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDQ1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMTAwMCApO1xuICAgIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcbiAgICBjYW1lcmEucG9zaXRpb24ueiA9IDIwO1xuICAgIHNjZW5lLmFkZCggY2FtZXJhICk7XG5cbiAgICAvL1xuXG4gICAgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlciggeyBhbnRpYWxpYXM6IHRydWUgfSApO1xuICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8oIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICk7XG4gICAgcmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xuICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IoIDB4ZmZmZmZmICk7XG4gICAgcmVuZGVyZXIuc2hhZG93TWFwRW5hYmxlZCA9IHRydWU7XG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoIHJlbmRlcmVyLmRvbUVsZW1lbnQgKTtcblxuICAgIC8vXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKTtcblxuICAgIHZhciBtYW5hZ2VyID0gbmV3IFRIUkVFLkxvYWRpbmdNYW5hZ2VyKCk7XG4gICAgbWFuYWdlci5vblByb2dyZXNzID0gZnVuY3Rpb24gKGl0ZW0sIGxvYWRlZCwgdG90YWwpIHtcbiAgICAgICAgY29uc29sZS5sb2coaXRlbSwgbG9hZGVkLCB0b3RhbCk7XG4gICAgfTtcblxuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuT0JKTG9hZGVyKG1hbmFnZXIpO1xuXG4gICAgb2JqID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG4gICAgb2JqLmNhc3RTaGFkb3cgPSB0cnVlO1xuXG4gICAgbG9hZGVyLmxvYWQoJy4vb2JqL2FpcnBsYW5lLm9iaicsIGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgICAgLy8gdmFyIGNvbG9yMiA9ICcjRjNGM0Y1JyxcbiAgICAgICAgICAgIC8vIGNvbG9yMSA9ICcjQjFCMkI2JztcbiAgICAgICAgdmFyIGNvbG9yMiA9ICcjNERDOEY5JyxcbiAgICAgICAgICAgIGNvbG9yMSA9ICcjMTg4MEI0JztcblxuICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGdlbmVyYXRlVGV4dHVyZShjb2xvcjEsIGNvbG9yMikpO1xuICAgICAgICB2YXIgdGV4dHVyZTIgPSBuZXcgVEhSRUUuVGV4dHVyZShnZW5lcmF0ZVRleHR1cmUoY29sb3IyLCBjb2xvcjEpKTtcbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7IC8vIGltcG9ydGFudCFcbiAgICAgICAgdGV4dHVyZTIubmVlZHNVcGRhdGUgPSB0cnVlOyAvLyBpbXBvcnRhbnQhXG5cbiAgICAgICAgb2JqZWN0LmNoaWxkcmVuWzBdLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgICAgICAgIG1hcDogdGV4dHVyZSxcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG9iamVjdDIgPSBvYmplY3QuY2xvbmUoKTtcbiAgICAgICAgb2JqZWN0Mi5jaGlsZHJlblswXS5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgICBtYXA6IHRleHR1cmUyLFxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlXG4gICAgICAgIH0pO1xuICAgICAgICBvYmplY3QyLnBvc2l0aW9uLnkgPSAwLjAxO1xuXG4gICAgICAgIG9iai5hZGQob2JqZWN0KTtcbiAgICAgICAgb2JqLmFkZChvYmplY3QyKTtcbiAgICAgICAgb2JqLnNjYWxlLm11bHRpcGx5U2NhbGFyKDAuMSk7XG4gICAgICAgIG9iai5yb3RhdGlvbi56ID0gTWF0aC5QSTtcbiAgICB9KTtcbiAgICBzY2VuZS5hZGQob2JqKTtcblxufVxuXG5pbml0KCk7XG5cbmFuaW1hdGUoMCwgZnVuY3Rpb24gKCkge1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICAvLyBvYmoucm90YXRpb24ueCArPSAwLjAxO1xuICAgIG9iai5yb3RhdGlvbi55ICs9IDAuMDE7XG59KTtcbiJdfQ==

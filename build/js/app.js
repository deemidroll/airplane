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

var planet, planet2, planet3, planet4;

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
    camera.position.z = 30;
    // camera.setLens ( 0, 100 )
    scene.add( camera );

    //

    renderer = new THREE.WebGLRenderer( {
        antialias: true,
    } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x102037 );
    // renderer.shadowMapEnabled = true;

    container.appendChild( renderer.domElement );

    //
    window.addEventListener( 'resize', onWindowResize, false );

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var loader = new THREE.OBJLoader(manager);

    obj = new THREE.Object3D();
    // obj.castShadow = true;

    loader.load('./obj/airplane10.obj', function (object) {
        // white
        var color2 = '#F3F3F5',
            color1 = '#B1B2B6';
        // blue
        // var color2 = '#4DC8F9',
            // color1 = '#1880B4';
        // red
        // var color2 = '#00BDDA',
            // color1 = '#13608A';
        // green
        // var color2 = '#C2D900',
            // color1 = '#65BD2E';

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
        obj.scale.set(0.05, 0.05, 0.05);
        obj.rotation.z = Math.PI;
        obj.rotation.x = Math.PI/12;

        obj.rotation.x += Math.PI/12;
        obj.rotation.z -=Math.PI/24;
        obj.rotation.y = -Math.PI/6;

        obj.position.x = 1;
        obj.position.y = 8;
    });
    scene.add(obj);

    //pan
    // var gBG = new THREE.SphereGeometry(20, 60, 40);
    // gBG.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    // var mBG = new THREE.MeshBasicMaterial({
    //     map: THREE.ImageUtils.loadTexture( './img/space.png' )
    // });

    // mesh = new THREE.Mesh( gBG, mBG );
    // // mesh.position.y = 20;
    // // mesh.position.z = -100;
    // scene.add( mesh );

    var gP = new THREE.SphereGeometry( 2, 60, 40 );
    // gP.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

    var mP = new THREE.MeshLambertMaterial({
        color: 0x43FFD9,
        map: THREE.ImageUtils.loadTexture( './img/texture1.jpg' )
    });

    planet = new THREE.Mesh(gP, mP );
    planet.position.x = -15;
    planet.position.y = -7;
    // planet.position.z = -55;
    planet.position.z = -5;
    scene.add( planet );

    var gP2 = new THREE.SphereGeometry( 3, 60, 40 );
    var mP2 = new THREE.MeshLambertMaterial({
        color: 0xFE147A,
    });
    planet2 = new THREE.Mesh(gP2, mP2 );
    planet2.position.x = 22;
    planet2.position.y = 10;
    planet2.position.z = -10;
    scene.add( planet2 );

    var gP3 = new THREE.SphereGeometry( 2, 60, 40 );
    var mP3 = new THREE.MeshLambertMaterial({
        color: 0x43FFD9,
    });
    planet3 = new THREE.Mesh(gP3, mP3 );
    planet3.position.x = 20;
    planet3.position.y = 1;
    planet3.position.z = -20;
    scene.add( planet3 );

    var gP4 = new THREE.SphereGeometry( 2, 60, 40 );
    var mP4 = new THREE.MeshLambertMaterial({
        color: 0xE7C08C,
    });
    planet4 = new THREE.Mesh(gP4, mP4 );
    planet4.position.x = -24;
    planet4.position.y = 10;
    planet4.position.z = -30;
    scene.add( planet4 );

    // var gP5 = new THREE.SphereGeometry( 9, 60, 40 );
    // var mP5 = new THREE.MeshLambertMaterial({
    //     color: 0xffffff,
    // });
    // planet5 = new THREE.Mesh(gP5, mP5 );
    // planet5.position.x = 0;
    // planet5.position.y = 20;
    // planet5.position.z = -20;
    // scene.add( planet5 );


    var ambient = new THREE.AmbientLight( 0x344163 );
    scene.add( ambient );

    var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
    var light = new THREE.PointLight( 0xffffff, 0.75, 500 );
    light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x43FFD9 } ) ) );
    light.position.y = 8.3;
    light.position.z = 10;
    scene.add( light );

}

init();

animate(0, function () {
    renderer.render(scene, camera);
    // planet.position.z += 0.5;
    // planet2.position.z += 0.5;
    // planet3.position.z += 0.5;
    // planet4.position.z += 0.5;
    planet.rotation.y += 0.01;
    // obj.rotation.x += 0.01;
    // obj.rotation.y -= 0.0025;
    // mesh.rotation.x -= 0.001;
    // mesh.rotation.y -= 0.001;
    if (planet.position.z  >10) {
        planet.position.z = -200;
    }
    if (planet2.position.z  >10) {
        planet2.position.z = -200;
    }
    if (planet3.position.z  >10) {
        planet3.position.z = -200;
    }
    if (planet4.position.z  >10) {
        planet4.position.z = -200;
    }
});

},{"./animate.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9EbWl0cnkvcHJvamVjdHMvaGVsaWNvcHRlci90ZWNoL2FpcnBsYW5lL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0RtaXRyeS9wcm9qZWN0cy9oZWxpY29wdGVyL3RlY2gvYWlycGxhbmUvc3JjL2pzL2FuaW1hdGUuanMiLCIvVXNlcnMvRG1pdHJ5L3Byb2plY3RzL2hlbGljb3B0ZXIvdGVjaC9haXJwbGFuZS9zcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwid2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuICAgICAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgIHx8XG4gICAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgfHxcbiAgICAgICAgZnVuY3Rpb24oLyogZnVuY3Rpb24gKi8gY2FsbGJhY2spe1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG4gICAgICAgIH1cbiAgICApO1xufSgpO1xud2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSAgICAgICB8fFxuICAgICAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lICAgIHx8XG4gICAgICAgIHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWUgICAgICB8fFxuICAgICAgICB3aW5kb3cubXNDYW5jZWxBbmltYXRpb25GcmFtZSAgICAgfHxcbiAgICAgICAgZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChpZCk7XG4gICAgICAgIH1cbiAgICApO1xufSgpO1xuXG5mdW5jdGlvbiBhbmltYXRlKG5vd01zZWMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGRlbHRhTXNlYztcbiAgICBub3dNc2VjID0gbm93TXNlYyB8fCBEYXRlLm5vdygpO1xuICAgIGFuaW1hdGUubGFzdFRpbWVNc2VjID0gYW5pbWF0ZS5sYXN0VGltZU1zZWMgfHwgbm93TXNlYyAtIDEwMDAgLyA2MDtcbiAgICBkZWx0YU1zZWMgPSBNYXRoLm1pbigxMDAsIG5vd01zZWMgLSBhbmltYXRlLmxhc3RUaW1lTXNlYyk7XG4gICAgLy8ga2VlcCBsb29waW5nXG4gICAgYW5pbWF0ZS5pZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG4gICAgLy8gY2hhbmdlIGxhc3QgdGltZVxuICAgIGFuaW1hdGUubGFzdFRpbWVNc2VjID0gbm93TXNlYztcbiAgICAvLyBjYWxsIGVhY2ggdXBkYXRlIGZ1bmN0aW9uXG4gICAgaWYgKGNhbGxiYWNrKSBhbmltYXRlLmNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgYW5pbWF0ZS5jYWxsYmFjayhkZWx0YU1zZWMsIG5vd01zZWMsIGFuaW1hdGUuaWQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFuaW1hdGU7IiwidmFyIERldGVjdG9yID0gd2luZG93LkRldGVjdG9yO1xudmFyIFRIUkVFID0gd2luZG93LlRIUkVFO1xudmFyIGFuaW1hdGUgPSByZXF1aXJlKCcuL2FuaW1hdGUuanMnKTtcblxuaWYgKCEgRGV0ZWN0b3Iud2ViZ2wpIERldGVjdG9yLmFkZEdldFdlYkdMTWVzc2FnZSgpO1xuXG52YXIgY2FtZXJhLCBzY2VuZSwgcmVuZGVyZXI7XG5cbnZhciBvYmo7XG5cbnZhciBwbGFuZXQsIHBsYW5ldDIsIHBsYW5ldDMsIHBsYW5ldDQ7XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuXG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XG5cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVUZXh0dXJlKGNvbG9yMSwgY29sb3IyKSB7XG4gICAgdmFyIHNpemUgPSA1MTI7XG4gICAgLy8gY3JlYXRlIGNhbnZhc1xuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSBzaXplO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBzaXplO1xuICAgIC8vIGdldCBjb250ZXh0XG4gICAgdmFyIGNyeCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIC8vIGRyYXcgZ3JhZGllbnRcbiAgICBjcngucmVjdCgwLCAwLCBzaXplLCBzaXplKTtcbiAgICB2YXIgZ3JhZGllbnQgPSBjcnguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgc2l6ZSwgMCk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGNvbG9yMSk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNSwgY29sb3IyKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgY29sb3IxKTtcbiAgICBjcnguZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgY3J4LmZpbGwoKTtcbiAgICByZXR1cm4gY2FudmFzO1xufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xuICAgIC8vIHNjZW5lXG5cbiAgICBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgLy8gc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZyggMHhjY2UwZmYsIDUwMCwgMTAwMDAgKTtcblxuICAgIC8vIGNhbWVyYVxuXG4gICAgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA0NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDEsIDEwMDAgKTtcbiAgICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnogPSAzMDtcbiAgICAvLyBjYW1lcmEuc2V0TGVucyAoIDAsIDEwMCApXG4gICAgc2NlbmUuYWRkKCBjYW1lcmEgKTtcblxuICAgIC8vXG5cbiAgICByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCB7XG4gICAgICAgIGFudGlhbGlhczogdHJ1ZSxcbiAgICB9ICk7XG4gICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggd2luZG93LmRldmljZVBpeGVsUmF0aW8gKTtcbiAgICByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XG4gICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggMHgxMDIwMzcgKTtcbiAgICAvLyByZW5kZXJlci5zaGFkb3dNYXBFbmFibGVkID0gdHJ1ZTtcblxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCggcmVuZGVyZXIuZG9tRWxlbWVudCApO1xuXG4gICAgLy9cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplLCBmYWxzZSApO1xuXG4gICAgdmFyIG1hbmFnZXIgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKTtcbiAgICBtYW5hZ2VyLm9uUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoaXRlbSwgbG9hZGVkLCB0b3RhbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhpdGVtLCBsb2FkZWQsIHRvdGFsKTtcbiAgICB9O1xuXG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIobWFuYWdlcik7XG5cbiAgICBvYmogPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgICAvLyBvYmouY2FzdFNoYWRvdyA9IHRydWU7XG5cbiAgICBsb2FkZXIubG9hZCgnLi9vYmovYWlycGxhbmUxMC5vYmonLCBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgIC8vIHdoaXRlXG4gICAgICAgIHZhciBjb2xvcjIgPSAnI0YzRjNGNScsXG4gICAgICAgICAgICBjb2xvcjEgPSAnI0IxQjJCNic7XG4gICAgICAgIC8vIGJsdWVcbiAgICAgICAgLy8gdmFyIGNvbG9yMiA9ICcjNERDOEY5JyxcbiAgICAgICAgICAgIC8vIGNvbG9yMSA9ICcjMTg4MEI0JztcbiAgICAgICAgLy8gcmVkXG4gICAgICAgIC8vIHZhciBjb2xvcjIgPSAnIzAwQkREQScsXG4gICAgICAgICAgICAvLyBjb2xvcjEgPSAnIzEzNjA4QSc7XG4gICAgICAgIC8vIGdyZWVuXG4gICAgICAgIC8vIHZhciBjb2xvcjIgPSAnI0MyRDkwMCcsXG4gICAgICAgICAgICAvLyBjb2xvcjEgPSAnIzY1QkQyRSc7XG5cbiAgICAgICAgdmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShnZW5lcmF0ZVRleHR1cmUoY29sb3IxLCBjb2xvcjIpKTtcbiAgICAgICAgdmFyIHRleHR1cmUyID0gbmV3IFRIUkVFLlRleHR1cmUoZ2VuZXJhdGVUZXh0dXJlKGNvbG9yMiwgY29sb3IxKSk7XG4gICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlOyAvLyBpbXBvcnRhbnQhXG4gICAgICAgIHRleHR1cmUyLm5lZWRzVXBkYXRlID0gdHJ1ZTsgLy8gaW1wb3J0YW50IVxuXG4gICAgICAgIG9iamVjdC5jaGlsZHJlblswXS5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgICBtYXA6IHRleHR1cmUsXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBvYmplY3QyID0gb2JqZWN0LmNsb25lKCk7XG4gICAgICAgIG9iamVjdDIuY2hpbGRyZW5bMF0ubWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICAgICAgbWFwOiB0ZXh0dXJlMixcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZVxuICAgICAgICB9KTtcbiAgICAgICAgb2JqZWN0Mi5wb3NpdGlvbi55ID0gMC4wMTtcblxuICAgICAgICBvYmouYWRkKG9iamVjdCk7XG4gICAgICAgIG9iai5hZGQob2JqZWN0Mik7XG4gICAgICAgIG9iai5zY2FsZS5zZXQoMC4wNSwgMC4wNSwgMC4wNSk7XG4gICAgICAgIG9iai5yb3RhdGlvbi56ID0gTWF0aC5QSTtcbiAgICAgICAgb2JqLnJvdGF0aW9uLnggPSBNYXRoLlBJLzEyO1xuXG4gICAgICAgIG9iai5yb3RhdGlvbi54ICs9IE1hdGguUEkvMTI7XG4gICAgICAgIG9iai5yb3RhdGlvbi56IC09TWF0aC5QSS8yNDtcbiAgICAgICAgb2JqLnJvdGF0aW9uLnkgPSAtTWF0aC5QSS82O1xuXG4gICAgICAgIG9iai5wb3NpdGlvbi54ID0gMTtcbiAgICAgICAgb2JqLnBvc2l0aW9uLnkgPSA4O1xuICAgIH0pO1xuICAgIHNjZW5lLmFkZChvYmopO1xuXG4gICAgLy9wYW5cbiAgICAvLyB2YXIgZ0JHID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDIwLCA2MCwgNDApO1xuICAgIC8vIGdCRy5hcHBseU1hdHJpeChuZXcgVEhSRUUuTWF0cml4NCgpLm1ha2VTY2FsZSgtMSwgMSwgMSkpO1xuXG4gICAgLy8gdmFyIG1CRyA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgLy8gICAgIG1hcDogVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSggJy4vaW1nL3NwYWNlLnBuZycgKVxuICAgIC8vIH0pO1xuXG4gICAgLy8gbWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBnQkcsIG1CRyApO1xuICAgIC8vIC8vIG1lc2gucG9zaXRpb24ueSA9IDIwO1xuICAgIC8vIC8vIG1lc2gucG9zaXRpb24ueiA9IC0xMDA7XG4gICAgLy8gc2NlbmUuYWRkKCBtZXNoICk7XG5cbiAgICB2YXIgZ1AgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoIDIsIDYwLCA0MCApO1xuICAgIC8vIGdQLmFwcGx5TWF0cml4KCBuZXcgVEhSRUUuTWF0cml4NCgpLm1ha2VTY2FsZSggLTEsIDEsIDEgKSApO1xuXG4gICAgdmFyIG1QID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogMHg0M0ZGRDksXG4gICAgICAgIG1hcDogVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSggJy4vaW1nL3RleHR1cmUxLmpwZycgKVxuICAgIH0pO1xuXG4gICAgcGxhbmV0ID0gbmV3IFRIUkVFLk1lc2goZ1AsIG1QICk7XG4gICAgcGxhbmV0LnBvc2l0aW9uLnggPSAtMTU7XG4gICAgcGxhbmV0LnBvc2l0aW9uLnkgPSAtNztcbiAgICAvLyBwbGFuZXQucG9zaXRpb24ueiA9IC01NTtcbiAgICBwbGFuZXQucG9zaXRpb24ueiA9IC01O1xuICAgIHNjZW5lLmFkZCggcGxhbmV0ICk7XG5cbiAgICB2YXIgZ1AyID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KCAzLCA2MCwgNDAgKTtcbiAgICB2YXIgbVAyID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogMHhGRTE0N0EsXG4gICAgfSk7XG4gICAgcGxhbmV0MiA9IG5ldyBUSFJFRS5NZXNoKGdQMiwgbVAyICk7XG4gICAgcGxhbmV0Mi5wb3NpdGlvbi54ID0gMjI7XG4gICAgcGxhbmV0Mi5wb3NpdGlvbi55ID0gMTA7XG4gICAgcGxhbmV0Mi5wb3NpdGlvbi56ID0gLTEwO1xuICAgIHNjZW5lLmFkZCggcGxhbmV0MiApO1xuXG4gICAgdmFyIGdQMyA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSggMiwgNjAsIDQwICk7XG4gICAgdmFyIG1QMyA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IDB4NDNGRkQ5LFxuICAgIH0pO1xuICAgIHBsYW5ldDMgPSBuZXcgVEhSRUUuTWVzaChnUDMsIG1QMyApO1xuICAgIHBsYW5ldDMucG9zaXRpb24ueCA9IDIwO1xuICAgIHBsYW5ldDMucG9zaXRpb24ueSA9IDE7XG4gICAgcGxhbmV0My5wb3NpdGlvbi56ID0gLTIwO1xuICAgIHNjZW5lLmFkZCggcGxhbmV0MyApO1xuXG4gICAgdmFyIGdQNCA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSggMiwgNjAsIDQwICk7XG4gICAgdmFyIG1QNCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IDB4RTdDMDhDLFxuICAgIH0pO1xuICAgIHBsYW5ldDQgPSBuZXcgVEhSRUUuTWVzaChnUDQsIG1QNCApO1xuICAgIHBsYW5ldDQucG9zaXRpb24ueCA9IC0yNDtcbiAgICBwbGFuZXQ0LnBvc2l0aW9uLnkgPSAxMDtcbiAgICBwbGFuZXQ0LnBvc2l0aW9uLnogPSAtMzA7XG4gICAgc2NlbmUuYWRkKCBwbGFuZXQ0ICk7XG5cbiAgICAvLyB2YXIgZ1A1ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KCA5LCA2MCwgNDAgKTtcbiAgICAvLyB2YXIgbVA1ID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgIC8vICAgICBjb2xvcjogMHhmZmZmZmYsXG4gICAgLy8gfSk7XG4gICAgLy8gcGxhbmV0NSA9IG5ldyBUSFJFRS5NZXNoKGdQNSwgbVA1ICk7XG4gICAgLy8gcGxhbmV0NS5wb3NpdGlvbi54ID0gMDtcbiAgICAvLyBwbGFuZXQ1LnBvc2l0aW9uLnkgPSAyMDtcbiAgICAvLyBwbGFuZXQ1LnBvc2l0aW9uLnogPSAtMjA7XG4gICAgLy8gc2NlbmUuYWRkKCBwbGFuZXQ1ICk7XG5cblxuICAgIHZhciBhbWJpZW50ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCggMHgzNDQxNjMgKTtcbiAgICBzY2VuZS5hZGQoIGFtYmllbnQgKTtcblxuICAgIHZhciBzcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoIDAuNSwgMTYsIDggKTtcbiAgICB2YXIgbGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCggMHhmZmZmZmYsIDAuNzUsIDUwMCApO1xuICAgIGxpZ2h0LmFkZCggbmV3IFRIUkVFLk1lc2goIHNwaGVyZSwgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweDQzRkZEOSB9ICkgKSApO1xuICAgIGxpZ2h0LnBvc2l0aW9uLnkgPSA4LjM7XG4gICAgbGlnaHQucG9zaXRpb24ueiA9IDEwO1xuICAgIHNjZW5lLmFkZCggbGlnaHQgKTtcblxufVxuXG5pbml0KCk7XG5cbmFuaW1hdGUoMCwgZnVuY3Rpb24gKCkge1xuICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICAvLyBwbGFuZXQucG9zaXRpb24ueiArPSAwLjU7XG4gICAgLy8gcGxhbmV0Mi5wb3NpdGlvbi56ICs9IDAuNTtcbiAgICAvLyBwbGFuZXQzLnBvc2l0aW9uLnogKz0gMC41O1xuICAgIC8vIHBsYW5ldDQucG9zaXRpb24ueiArPSAwLjU7XG4gICAgcGxhbmV0LnJvdGF0aW9uLnkgKz0gMC4wMTtcbiAgICAvLyBvYmoucm90YXRpb24ueCArPSAwLjAxO1xuICAgIC8vIG9iai5yb3RhdGlvbi55IC09IDAuMDAyNTtcbiAgICAvLyBtZXNoLnJvdGF0aW9uLnggLT0gMC4wMDE7XG4gICAgLy8gbWVzaC5yb3RhdGlvbi55IC09IDAuMDAxO1xuICAgIGlmIChwbGFuZXQucG9zaXRpb24ueiAgPjEwKSB7XG4gICAgICAgIHBsYW5ldC5wb3NpdGlvbi56ID0gLTIwMDtcbiAgICB9XG4gICAgaWYgKHBsYW5ldDIucG9zaXRpb24ueiAgPjEwKSB7XG4gICAgICAgIHBsYW5ldDIucG9zaXRpb24ueiA9IC0yMDA7XG4gICAgfVxuICAgIGlmIChwbGFuZXQzLnBvc2l0aW9uLnogID4xMCkge1xuICAgICAgICBwbGFuZXQzLnBvc2l0aW9uLnogPSAtMjAwO1xuICAgIH1cbiAgICBpZiAocGxhbmV0NC5wb3NpdGlvbi56ICA+MTApIHtcbiAgICAgICAgcGxhbmV0NC5wb3NpdGlvbi56ID0gLTIwMDtcbiAgICB9XG59KTtcbiJdfQ==

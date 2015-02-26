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

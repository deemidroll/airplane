var Detector = window.Detector;
var THREE = window.THREE;
var animate = require('./animate.js');
var socket = require('./socket.js');
var $ = window.$;

var $document = $(document);

var $address = $('#address');
var $interface = $('.interface');

socket.init();

var gameStarted = false;

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

$document.on('turn', function (e, data) {
    airplane.rotation.z = Math.PI - data.turn/180;
});

$document.on('start', function () {
    $interface.addClass('hidden');
    gameStarted = true;


    airplane.rotation.x = Math.PI/12;
    airplane.rotation.y = 0;
    airplane.rotation.z = Math.PI;

    airplane.position.x = 0;
    airplane.position.y = 0;
});

if (! Detector.webgl) Detector.addGetWebGLMessage();

var camera, scene, renderer;

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

    airplane = new THREE.Object3D();
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
    var tP = THREE.ImageUtils.loadTexture( './img/noise.jpg' );

    var gP = new THREE.SphereGeometry( 2, 60, 40 );
    // gP.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

    var mP = new THREE.MeshLambertMaterial({
        color: 0x43FFD9,
        map: tP
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
        map: tP
    });
    planet2 = new THREE.Mesh(gP2, mP2 );
    planet2.position.x = 22;
    planet2.position.y = 10;
    planet2.position.z = -10;
    scene.add( planet2 );

    var gP3 = new THREE.SphereGeometry( 2, 60, 40 );
    var mP3 = new THREE.MeshLambertMaterial({
        color: 0x43FFD9,
        map: tP
    });
    planet3 = new THREE.Mesh(gP3, mP3 );
    planet3.position.x = 20;
    planet3.position.y = 1;
    planet3.position.z = -20;
    scene.add( planet3 );

    var gP4 = new THREE.SphereGeometry( 2, 60, 40 );
    var mP4 = new THREE.MeshLambertMaterial({
        color: 0xE7C08C,
        map: tP
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
    if (gameStarted) {
        planet.position.z += 0.5;
        planet2.position.z += 0.5;
        planet3.position.z += 0.5;
        planet4.position.z += 0.5;
    }
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

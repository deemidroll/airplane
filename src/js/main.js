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

// three渲染模块
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );

// renderer.setClearColor(0xffffff);

document.body.appendChild( renderer.domElement );
camera.position.z = 50;
camera.position.x = 50;
camera.position.y = 50;

scene.add(new THREE.AxesHelper(500));
scene.add(new THREE.GridHelper(100, 10));
var env = new PhysicsEnvironment();

var size = 50;
var grounds = new THREE.Group();

var ground1 = new THREE.Mesh(new THREE.BoxGeometry(size, 0.5, size), new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1
}));
grounds.add(ground1);

var ground2 = ground1.clone();
ground2.position.y = size;
grounds.add(ground2);

var ground3 = ground1.clone();
ground3.rotation.x = Math.PI / 2;
ground3.position.set(0, size / 2, -size / 2);
grounds.add(ground3);

var ground4 = ground1.clone();
ground4.rotation.x = Math.PI / 2;
ground4.position.set(0, size / 2, size / 2);
grounds.add(ground4);

var ground5 = ground1.clone();
ground5.rotation.z = Math.PI / 2;
ground5.position.set(size / 2, size / 2, 0);
grounds.add(ground5);

var ground6 = ground1.clone();
ground6.rotation.z = Math.PI / 2;
ground6.position.set(-size / 2, size / 2, 0);
grounds.add(ground6);

scene.add(grounds);

grounds.children.forEach(function (value) {
    env.bindBoxShapeWithEnvironment(value, 0, 0.5, 0x0002, 0x0001);
    value.userData.physicsBody.setRestitution(0.2);
});

// 第一人称控制
var cameraController = new THREE.FirstPersonControls(camera, renderer.domElement);
cameraController.lookSpeed = 2;
cameraController.movementSpeed = 50;
cameraController.lookVertical = true;
cameraController.lon = 250;
cameraController.lat = -30;
var clock = new THREE.Clock();
clock.start();


var manager = new SmokeCreater({
    physicsEnv: env
});

var manager2 = new WaterCreater();
manager2.setStartEndPosition({x: 0, y: 0, z: 0}, { x: 20, y: 40, z: 0 });
scene.add(manager2.target);
scene.add(manager.target);
var gui = new dat.GUI();


var i = 1;
function render(timestamp) {

    i += 5;
    manager2.endPosition.x = Math.abs(Math.sin(i*Math.PI / 360) * 20);
    manager2.endPosition.z =  Math.cos(i*Math.PI / 360) * 20;

    var delta = clock.getDelta()
    cameraController.update(delta);
    renderer.render(scene, camera);
    env.updatePhysics(delta);
    manager.update(delta);
    // manager2.update(delta);
    requestAnimationFrame(render);
};

render();
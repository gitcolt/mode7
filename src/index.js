import * as THREE from 'three';
import Stats from 'stats-js';
import vertexShader from './glsl/vert.glsl';
import fragmentShader from './glsl/frag.glsl';
import Course from './MuteCity.png';

const stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
document.body.appendChild(stats.domElement);

let camera, scene, renderer;
let geometry, material, mesh;
let uniforms;

let isAccelerating = false,
    isTurningLeft = false,
    isTurningRight = false;
let playerX = 0.0,
    playerY = 0.0;

init();
animate();

function init () {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();

    //geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
    geometry = new THREE.PlaneBufferGeometry(window.innerWidth/window.innerHeight, 1.5);

    uniforms = {
        uDelta: {type: 'f', value: 0},
        uTexture: {value: new THREE.TextureLoader().load(Course)},
        uPlayerY: {value: playerY},
        uPlayerX: {value: playerX},
        uPlayerAngle: {value: 0.0}

        //mousePosition: {value: mousePos}
    };

    uniforms.uTexture.value.wrapS = uniforms.uTexture.value.wrapT = THREE.RepeatWrapping;
    uniforms.uTexture.value.magFilter = uniforms.uTexture.value.minFilter = THREE.NearestFilter;
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);
}

let mousePos = new THREE.Vector2();;
renderer.domElement.addEventListener('mousemove', (e) => {
    //mousePos.setX(e.clientX);
    //mousePos.setY(e.clientY);
});
document.addEventListener('keydown', (e) => {
    const keyName = e.key;
    switch (keyName) {
        case 'ArrowUp':
            isAccelerating = true;
            break;
        case 'ArrowLeft':
            isTurningLeft = true;
            break;
        case 'ArrowRight':
            isTurningRight = true;
            break;
    }
});
document.addEventListener('keyup', (e) => {
    const keyName = e.key;
    switch (keyName) {
        case 'ArrowUp':
            isAccelerating = false;
            break;
        case 'ArrowLeft':
            isTurningLeft = false;
            break;
        case 'ArrowRight':
            isTurningRight = false;
            break;
    }
});

let delta = 0;

function animate () {
    requestAnimationFrame(animate);
    stats.begin();

    delta += 0.1;
    mesh.material.uniforms.uDelta.value = 0.5 + Math.sin(delta) * 0.5;

    // Update player angle
    if (isTurningLeft) {
        mesh.material.uniforms.uPlayerAngle.value += 0.03;
    }
    if (isTurningRight) {
        mesh.material.uniforms.uPlayerAngle.value -= 0.03;
    }

    // Update player position
    if (isAccelerating) {
        mesh.material.uniforms.uPlayerY.value += Math.sin(mesh.material.uniforms.uPlayerAngle.value)*0.2;
        mesh.material.uniforms.uPlayerX.value += Math.cos(mesh.material.uniforms.uPlayerAngle.value)*0.2;
    }

    renderer.clear();
    renderer.render(scene, camera);
    stats.end();
}

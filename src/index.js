import Course from './SuperMarioKartMapStarCup5.png';
//import Course from './F-ZeroMap01MuteCity1.png';
import Stats from 'stats-js';
import * as dat from 'dat.gui';

var img = new Image();
img.onload = drawImage;
img.src = Course;
let can = document.querySelector('#can');
let c = can.getContext('2d');
let can2 = document.querySelector('#can2');
let c2 = can2.getContext('2d');

let worldX = 0;
let worldY = 0;
let worldA = 0;
let near = 0.01;
let far = 0.05;
let fovHalf = Math.PI / 4;

let srcImgData, srcImgDataPixels, stageImgData, stageImgDataPixels;
let isTurningLeft = false;
let isTurningRight = false;
let isAccelerating = false;

const stats = new Stats();
stats.setMode(0);
document.body.appendChild(stats.domElement);

let obj = {
    name: 'Colt',
    num: 23,
    winner: true
};
const gui = new dat.GUI();
gui.add(obj, 'name');
gui.add(obj, 'num');

function drawImage () {
    can.width = this.naturalWidth;
    can.height = this.naturalHeight;
    can2.width = 500;
    can2.height = 500;
    c.imageSmoothingEnabled = false;
    c2.imageSmoothingEnabled = false;
    c.drawImage(this, 0, 0);
    can.style.display = 'none';
    srcImgData = c.getImageData(0, 0, can.width, can.height);
    srcImgDataPixels = srcImgData.data;
    stageImgData = c2.createImageData(can2.width, can2.height);
    stageImgDataPixels = stageImgData.data;
    c2.putImageData(srcImgData, 0, 0);
    loop();
}
document.addEventListener('keyup', (e) => {
    const keyName = e.key;
    switch(keyName) {
        case 'ArrowLeft':
            isTurningLeft = false;
            break;
        case 'ArrowRight':
            isTurningRight = false;
            break;
        case 'ArrowUp':
            isAccelerating = false;
            break;
    }
});

document.addEventListener('keydown', (e) => {
    const keyName = e.key;

    switch (keyName) {
        case 'ArrowRight':
            isTurningRight = true;
            break;
        case 'ArrowLeft':
            isTurningLeft= true;
            break;
        case 'ArrowUp':
            e.preventDefault();
            isAccelerating = true;
            break;
    }
});

function loop () {
    stats.begin();

    let farX1 = worldX + Math.cos(worldA - fovHalf) * far;
    let farY1 = worldY + Math.sin(worldA - fovHalf) * far;

    let farX2 = worldX + Math.cos(worldA + fovHalf) * far;
    let farY2 = worldY + Math.sin(worldA + fovHalf) * far;

    let nearX1 = worldX + Math.cos(worldA - fovHalf) * near;
    let nearY1 = worldY + Math.sin(worldA - fovHalf) * near;

    let nearX2 = worldX + Math.cos(worldA + fovHalf) * near;
    let nearY2 = worldY + Math.sin(worldA + fovHalf) * near;

    for (let y = 1; y < (can2.height / 2); y++) {
        let sampleDepth = y / (can2.height / 2);

        let startX = (farX1 - nearX1) / (sampleDepth) + nearX1;
        let startY = (farY1 - nearY1) / (sampleDepth) + nearY1;
        let endX = (farX2 - nearX2) / (sampleDepth) + nearX2;
        let endY = (farY2 - nearY2) / (sampleDepth) + nearY2;

        for (let x = 0; x < can2.width; x++) {
            let sampleWidth = x / can2.width;
            let sampleX = (endX - startX) * sampleWidth + startX;
            let sampleY = (endY - startY) * sampleWidth + startY;

            let imgIdx = Math.floor(sampleX*can.width) + Math.floor(sampleY*can.height)*can.width;
            stageImgDataPixels[(x + y*can2.width)*4    ] = srcImgDataPixels[Math.round((imgIdx)*4)    ];
            stageImgDataPixels[(x + y*can2.width)*4 + 1] = srcImgDataPixels[Math.round((imgIdx)*4) + 1];
            stageImgDataPixels[(x + y*can2.width)*4 + 2] = srcImgDataPixels[Math.round((imgIdx)*4) + 2];
            stageImgDataPixels[(x + y*can2.width)*4 + 3] = 255;

        }
    }
    c2.putImageData(stageImgData, 0, 0);

    if (isTurningLeft)
        worldA -= 0.04;
    else if (isTurningRight)
        worldA += 0.04;
    if (isAccelerating) {
        worldX += 0.01*Math.cos(worldA);
        worldY += 0.01*Math.sin(worldA);
    } else {
    }

    stats.end();
    requestAnimationFrame(loop);
}


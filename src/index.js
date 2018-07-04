import Course from './SuperMarioKartMapStarCup5.png';
//import Course from './F-ZeroMap01MuteCity1.png';
//import Background from './Chrysanthemum.jpg';
import Background from './landscape.png';
//import Course from './Koala.jpg';
import Stats from 'stats-js';
import * as dat from 'dat.gui';

//import Coin from './coinsprite.png';
import BlueFalcon from './bluefalcon.png';

const courseImg = new Image();
const backgroundImg = new Image();
backgroundImg.src = Background;
backgroundImg.onload = onBackgroundLoaded;
courseImg.onload = onCourseImgLoaded;
courseImg.src = Course;
const hiddenCourseCan = document.querySelector('#hiddenCourseCanvas');
const hiddenCourseCtx = hiddenCourseCan.getContext('2d');
const hiddenBgCan = document.querySelector('#hiddenBackgroundCanvas');
const hiddenBgCtx = hiddenBgCan.getContext('2d');
const viewCan = document.querySelector('#viewCanvas');
const viewCtx = viewCan.getContext('2d');
viewCan.style.background = 'black';

//const coinImage = new Image();
//coinImage.src = Coin;
const blueFalcon = new Image();
blueFalcon.src = BlueFalcon;

const p = {
    x: 0,
    y: 0,
    a: 0,
    speed: 0
};

const camera = {
    near: 0.01,
    far: 0.03,
    fovHalf: Math.PI / 4
}

const bgArea = {
    x1: 0,
    x2: 0.25
};

let srcImgData, srcImgDataPixels, stageImgData, stageImgDataPixels, backgroundImgData, backgroundImgDataPixels;
let isTurningLeft = false;
let isTurningRight = false;
let isAccelerating = false;

const stats = new Stats();
stats.setMode(0);
document.body.appendChild(stats.domElement);

const gui = new dat.GUI();

class Sprite {
    constructor(image, nFrames, context) {
        this.image = image;
        this.nFrames = nFrames;
        this.context = context;
        this.curFrame = 0;
        this.frameWidth = this.image.width/nFrames;
    }
    
    render () {
        this.context.drawImage(this.image, this.curFrame*this.frameWidth, 0, this.image.width/this.nFrames, 40, viewCan.width/2 - (this.image.width/this.nFrames)/2, viewCan.height*2/3, this.image.width/this.nFrames, 40);
    }
}

class PlayerKartSprite extends Sprite {
    constructor (image, nFrames, context) {
        super(image, nFrames, context);
    }

    update () {
        if (isTurningLeft) {
            this.curFrame = 1; 
        } else if (isTurningRight) {
            this.curFrame = 2;
        } else {
            this.curFrame = 0;
        }
    }
}

function init () {
    gui.add(camera, 'near', 0.0001, 0.03);
    gui.add(camera, 'far', 0.001, 0.075);
    gui.add(camera, 'fovHalf', 0.2, 3.14);

    loop();
}

function onBackgroundLoaded () {
    hiddenBgCan.width = this.naturalWidth;
    hiddenBgCan.height = this.naturalHeight;
    hiddenBgCtx.drawImage(this, 0, 0);
    backgroundImgData = hiddenBgCtx.getImageData(0, 0, hiddenBgCan.width, hiddenBgCan.height);
    backgroundImgDataPixels = backgroundImgData.data;
}

function onCourseImgLoaded () {
    hiddenCourseCan.width = this.naturalWidth;
    hiddenCourseCan.height = this.naturalHeight;
    viewCan.width = 300;
    viewCan.height = 300;
    hiddenCourseCtx.imageSmoothingEnabled = false;
    viewCtx.imageSmoothingEnabled = false;
    hiddenCourseCtx.drawImage(this, 0, 0);
    stageImgData = viewCtx.createImageData(viewCan.width, viewCan.height);
    stageImgDataPixels = stageImgData.data;

    // Create track
    for (let i = 0; i < 2; i++) {
        hiddenCourseCtx.beginPath();
        hiddenCourseCtx.moveTo(300, 300);
        hiddenCourseCtx.bezierCurveTo(100, 300, 100, 600, 300, 600);
        hiddenCourseCtx.lineTo(700, 600);
        hiddenCourseCtx.bezierCurveTo(900, 600, 900, 300, 700, 300);
        hiddenCourseCtx.lineTo(300, 300);
        if (i === 0) {
            hiddenCourseCtx.lineWidth = 70;
            hiddenCourseCtx.strokeStyle = 'rgb(255, 0, 0)';
        } else {
            hiddenCourseCtx.lineWidth = 60;
            hiddenCourseCtx.strokeStyle = 'rgb(123, 123, 123)';
        }
        hiddenCourseCtx.stroke();
    }

    srcImgData = hiddenCourseCtx.getImageData(0, 0, hiddenCourseCan.width, hiddenCourseCan.height);
    srcImgDataPixels = srcImgData.data;

    init();
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

function processInput () {
    if (p.speed > 0) {
        if (isTurningLeft) {
            p.a -= 0.07;
        } else if (isTurningRight) {
            p.a += 0.07;
        }
    }
    if (isAccelerating) {
        /*
        // Player is faster when on the track
        let roadIdx = Math.floor(p.x*hiddenCourseCan.width) + Math.floor(p.y*hiddenCourseCan.height)*hiddenCourseCan.width;
        if (srcImgDataPixels[roadIdx*4    ] === 123 &&
            srcImgDataPixels[roadIdx*4 + 1] === 123 &&
            srcImgDataPixels[roadIdx*4 + 2] === 123) {
            p.speed = 0.01;
        } else {
            p.speed = 0.005;
        }
        */

        //p.x += p.speed*Math.cos(p.a);
        //p.y += p.speed*Math.sin(p.a);
        p.speed = Math.min(p.speed + 0.0005, 0.01);
    } else {
        p.speed = Math.max(p.speed - 0.0005, 0);
    }
    p.x += p.speed * Math.cos(p.a);
    p.y += p.speed * Math.sin(p.a);

    let t = bgArea.x2 - bgArea.x1;
    bgArea.x1 = p.a / (Math.PI*2);
    bgArea.x2 = bgArea.x1 + t;
}

let playerKart = new PlayerKartSprite(blueFalcon, 3, viewCtx);

function loop () {
    stats.begin();

    let farX1 = p.x + Math.cos(p.a - camera.fovHalf) * camera.far;
    let farY1 = p.y + Math.sin(p.a - camera.fovHalf) * camera.far;

    let farX2 = p.x + Math.cos(p.a + camera.fovHalf) * camera.far;
    let farY2 = p.y + Math.sin(p.a + camera.fovHalf) * camera.far;

    let nearX1 = p.x + Math.cos(p.a - camera.fovHalf) * camera.near;
    let nearY1 = p.y + Math.sin(p.a - camera.fovHalf) * camera.near;

    let nearX2 = p.x + Math.cos(p.a + camera.fovHalf) * camera.near;
    let nearY2 = p.y + Math.sin(p.a + camera.fovHalf) * camera.near;

    for (let y = Math.floor(viewCan.height/3); y < viewCan.height; y+=2) {
        let sampleDepth = (y-viewCan.height/3) / viewCan.height;

        let startX = (farX1 - nearX1) / (sampleDepth) + nearX1;
        let startY = (farY1 - nearY1) / (sampleDepth) + nearY1;
        let endX = (farX2 - nearX2) / (sampleDepth) + nearX2;
        let endY = (farY2 - nearY2) / (sampleDepth) + nearY2;

        for (let x = 0; x < viewCan.width; x++) {
            let sampleWidth = x / viewCan.width;
            let sampleX = (endX - startX) * sampleWidth + startX;
            let sampleY = (endY - startY) * sampleWidth + startY;

            let imgIdx = Math.floor(sampleX*hiddenCourseCan.width) + Math.floor(sampleY*hiddenCourseCan.height)*hiddenCourseCan.width;
            stageImgDataPixels[(x + y*viewCan.width)*4    ] = srcImgDataPixels[imgIdx*4    ];
            stageImgDataPixels[(x + y*viewCan.width)*4 + 1] = srcImgDataPixels[imgIdx*4 + 1];
            stageImgDataPixels[(x + y*viewCan.width)*4 + 2] = srcImgDataPixels[imgIdx*4 + 2];
            stageImgDataPixels[(x + y*viewCan.width)*4 + 3] = 255;

            if (imgIdx*4 > srcImgDataPixels.length || imgIdx*4 < 0) {
                stageImgDataPixels[(x + y*viewCan.width)*4    ] = 0;
                stageImgDataPixels[(x + y*viewCan.width)*4 + 1] = 255;
                stageImgDataPixels[(x + y*viewCan.width)*4 + 2] = 0;
                stageImgDataPixels[(x + y*viewCan.width)*4 + 3] = 255;
            }

        }
    }

    // Draw background landscape
    for (let y = 0; y < viewCan.height/3; y+=2) {
        let sampleHeight = y / (viewCan.height / 3);

        for (let x = 0; x < viewCan.width; x++) {
            let sampleWidth = x / viewCan.width; 

            let sampleX = (bgArea.x2 - bgArea.x1) * sampleWidth + bgArea.x1;

            let backgroundIdx = (Math.floor(sampleX*hiddenBgCan.width) + Math.floor(sampleHeight*hiddenBgCan.height)*hiddenBgCan.width)*4;
            stageImgDataPixels[(x + y*viewCan.width)*4    ] = backgroundImgDataPixels[backgroundIdx    ];
            stageImgDataPixels[(x + y*viewCan.width)*4 + 1] = backgroundImgDataPixels[backgroundIdx + 1];
            stageImgDataPixels[(x + y*viewCan.width)*4 + 2] = backgroundImgDataPixels[backgroundIdx + 2];
            stageImgDataPixels[(x + y*viewCan.width)*4 + 3] = 255;
        }
    }

    viewCtx.putImageData(stageImgData, 0, 0);
    playerKart.render();
    playerKart.update();

    processInput();

    stats.end();
    requestAnimationFrame(loop);
}


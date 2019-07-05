const electron = require('electron');
const { ipcRenderer } = electron;

let fileName;

let canvas;
let saveButton;
let saveSeq = false;
let startFrame;
const fRate = 30; // set framerate for sketch and video

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(fRate);

  saveButton = createButton('start recording');
  saveButton.position(10, 10);
  saveButton.mousePressed(toggleSaving);

  background(200, 100, 100);
}

function draw() {
  noStroke();
  fill(noise(frameCount/30)*255);
  ellipse(width/2 + sin(frameCount/60)*width/3, noise(frameCount/60)*height, 20, 20);

  if (saveSeq) {
    sendDataToElectron();
  }
}

function sendDataToElectron() {
  const dataURL = canvas.elt.toDataURL('image/png');
  fileName = (frameCount-startFrame) + '.png';
  const data = { dataURL, fileName };
  ipcRenderer.send('image:save', data);
  console.log(`saving image... ${fileName}`);
}

function toggleSaving() {
  startFrame = frameCount;
  saveSeq = !saveSeq;
  if (saveSeq) {
    saveButton.html('stop recording');
    ipcRenderer.send('folder:create'); // tell Electron to create a folder
  } else {
    saveButton.html('start recording');
    ipcRenderer.send('video:save', { fRate }); // video conversion will start once images are ready.
  }
}

ipcRenderer.on('video:progress', (event, frames) => {
  console.log(`saving video... ${frames} frames converted`);
});
ipcRenderer.on('video:end', (event) => {
  console.log('video conversion finished');
});

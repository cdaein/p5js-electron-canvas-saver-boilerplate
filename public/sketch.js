const electron = require('electron');
const { ipcRenderer, remote } = electron;
const { app, dialog } = remote;
const fs = require('fs');

let folderPath;
let timestamp; // string
let filePath;

let canvas;
let saveButton;
let saveSeq = false;
let startFrame;
const fRate = 30; // also used for video frame rate

let videoOptions = {

};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(fRate);

  saveButton = createButton('start recording');
  saveButton.position(10, 10);
  saveButton.mousePressed(toggleSaving);

  ipcRenderer.send('video:options', videoOptions);

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
  filePath = folderPath + '/' + (frameCount-startFrame) + '.png';
  const data = { dataURL, filePath };
  ipcRenderer.send('image:save', data);
  console.log(`saving image... ${filePath}`);
}

function toggleSaving() {
  startFrame = frameCount;
  saveSeq = !saveSeq;
  if (saveSeq) {
    saveButton.html('stop recording');
    timestamp = Date.now();
    // create render folder automatically in Downloads
    folderPath = app.getPath('downloads') + '/canvas-saver-renders/' + timestamp;
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
  } else {
    saveButton.html('start recording');
    ipcRenderer.send('video:save', {filePath, fRate}); // video conversion will start once images are ready.
  }
}

ipcRenderer.on('video:progress', (event, frames) => {
  console.log(`saving video... ${frames} frames converted`);
});
ipcRenderer.on('video:end', (event) => {
  console.log('video conversion finished');
});

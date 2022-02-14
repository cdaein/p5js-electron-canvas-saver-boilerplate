let canvas;
let saveButton;
let statusMsg;
let saveSeq = false;
let startFrame;
const fRate = 30; // set framerate for sketch and video

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(fRate);

  saveButton = createButton("start recording");
  saveButton.position(10, 10);
  saveButton.mousePressed(toggleSaving);
  statusMsg = createP("");
  statusMsg.position(110, 0);

  background(200, 100, 100);
}

function draw() {
  noStroke();
  fill(noise(frameCount / 30) * 255);
  ellipse(
    width / 2 + (sin(frameCount / 60) * width) / 3,
    noise(frameCount / 60) * height,
    20,
    20
  );

  if (saveSeq) {
    sendCanvasDataToElectron();
  }
}

function sendCanvasDataToElectron() {
  const dataURL = canvas.elt.toDataURL("image/png");
  const fileName = frameCount - startFrame + ".png";
  const data = { dataURL, fileName };
  window.electron.imageSave(data);
  console.log(`saving image... ${fileName}`);
}

function toggleSaving() {
  saveSeq = !saveSeq;
  startFrame = frameCount;
  saveButton.toggleClass("recording");
  if (saveSeq) {
    saveButton.html("stop recording");
    statusMsg.html("");
    window.electron.folderCreate(); // tell Electron to create a folder
  } else {
    saveButton.html("start recording");
    window.electron.videoSave(fRate); // tell Electron to start video conversion once images are ready.
  }
}

// // Electron lets p5 sketch know how conversion is going
// ipcRenderer.on("video:progress", (event, { frames, numFrames }) => {
//   const msg = `saving video... ${frames}/${numFrames} frames converted`;
//   statusMsg.html(msg);
//   console.log(msg);
// });
// ipcRenderer.on("video:end", (event) => {
//   const msg = "video conversion finished";
//   statusMsg.html(msg);
//   console.log(msg);
// });

const electron = require("electron");
const { app, BrowserWindow, ipcMain, shell } = electron;
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const pathToFfmpeg = require("ffmpeg-static");
ffmpeg.setFfmpegPath(pathToFfmpeg);
require("electron-reload")(__dirname);

let mainWindow;
let folderPath;
let imagesPath;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, // browser window width
    height: 600, // browser window height
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowEval: false,
      allowRunningInsecureContent: false,
    },
  });
  mainWindow.loadFile("public/index.html");
  // mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
app.on("closed", () => {
  app.quit();
});

const addZero = (n) => (n < 10 ? `0${n}` : `${n}`);

// create a new folder for storing image/video files
ipcMain.on("folder:create", () => {
  // const timestamp = Date.now();
  const timestamp = new Date();
  const timestampFormatted =
    timestamp.getFullYear() +
    "." +
    addZero(timestamp.getMonth() + 1) +
    "." +
    addZero(timestamp.getDate()) +
    "-" +
    addZero(timestamp.getHours()) +
    "." +
    addZero(timestamp.getMinutes()) +
    "." +
    addZero(timestamp.getSeconds());

  folderPath =
    app.getPath("downloads") + `/canvas-saver-renders/${timestampFormatted}`;
  imagesPath = folderPath + `/images`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    fs.mkdirSync(imagesPath, { recursive: true });
  }
});

// write image files with data received from p5 sketch
ipcMain.on("image:save", (event, data) => {
  const { dataURL, fileName } = data;
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(
    imagesPath + "/" + fileName,
    base64Data,
    "base64",
    function (err) {
      if (err) return console.log("error: " + err);
      console.log(`saving image... ${fileName}`);
    }
  );
});

ipcMain.on("video:save", (event, { fRate }) => {
  try {
    let numFrames;
    fs.readdir(imagesPath, (err, files) => {
      numFrames = files.length;
    });
    const input = `${imagesPath}/%d.png`;
    const proc = ffmpeg(input)
      .inputOptions([`-r ${fRate}`])
      .outputOptions("-pix_fmt yuv420p")
      .format("mp4")
      .videoCodec("libx264")
      .videoBitrate("6000k")
      .size("100%")
      .on("end", () => {
        console.log("video file conversion finished.");
        mainWindow.webContents.send("video:end"); // let p5 sketch know it's done.
        shell.openPath(folderPath); // once finished, open folder automatically
      })
      .on("error", (err) => {
        console.log(`error occured: ${err.message}`);
      })
      .on("progress", ({ frames }) => {
        console.log(`saving video... ${frames}/${numFrames} frames converted.`);
        mainWindow.webContents.send("video:progress", { frames, numFrames });
      })
      .save(`${folderPath}/video-converted.mp4`);
  } catch (err) {
    console.log(err);
  }
});

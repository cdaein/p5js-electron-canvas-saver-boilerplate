const electron = require('electron');
const { app, BrowserWindow, ipcMain, shell } = electron;
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked'));

let mainWindow;
let folderPath;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, // browser window width
    height: 600, // browser window height
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile('public/index.html');
  // mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.on('closed', () => {
  app.quit();
});

// create a new folder for storing image/video files
ipcMain.on('folder:create', () => {
  const timestamp = Date.now();
  folderPath = app.getPath('downloads') + `/canvas-saver-renders/${timestamp}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, {recursive: true});
  }
});

// write image files with data received from p5 sketch
ipcMain.on('image:save', (event, data) => {
  const { dataURL, fileName } = data;
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(folderPath + '/' + fileName, base64Data, 'base64', function (err) {
      if (err) return console.log('error: ' + err);
      console.log(`saving image... ${fileName}`);
  });
});

ipcMain.on('video:save', (event, { fRate }) => {
  try {
    const input = `${folderPath}/%d.png`;
    const proc = ffmpeg(input)
      .inputOptions([`-r ${fRate}`])
      .format('mp4')
      .videoCodec('libx264')
      .videoBitrate('6000k')
      .size('100%')
      .on('end', () => {
        console.log('video file conversion finished.');
        mainWindow.webContents.send('video:end'); // let p5 sketch know it's done.
        shell.openItem(folderPath); // once finished, open folder automatically
      })
      .on('error', (err) => {
        console.log(`error occured: ${err.message}`);
      })
      .on('progress', ({ frames }) => {
        console.log(`saving video... ${frames} frames converted.`)
        mainWindow.webContents.send('video:progress', frames);
      })
      .save(`${folderPath}/video-converted.mp4`);
  } catch (err) {
    console.log(err);
  }
});

const electron = require('electron');
const { app, BrowserWindow, ipcMain, shell } = electron;
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked'));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000, // browser window width
    height: 600, // browser window height
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile('public/index.html');
  mainWindow.webContents.openDevTools(); // comment out when distributing app
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.on('closed', () => {
  app.quit();
});

ipcMain.on('image:save', (event, data) => {
  const { dataURL, filePath } = data;
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(filePath, base64Data, 'base64', function (err) {
      if (err) return console.log('error: ' + err);
      console.log(`saving image... ${filePath}`);
  });
});

ipcMain.on('video:save', (event, { filePath, fRate }) => {
  try {
    const { ext, name, dir } = path.parse(filePath);
    const input = `${dir}/%d.png`;
    const proc = ffmpeg(input)
      .inputOptions([`-r ${fRate}`])
      .format('mp4')
      .videoBitrate('6000k')
      .size('100%')
      .on('end', () => {
        console.log('video file conversion finished.');
        mainWindow.webContents.send('video:end');
        shell.openItem(dir); // once finished, open folder automatically
      })
      .on('error', (err) => {
        console.log(`error occured: ${err.message}`);
      })
      .on('progress', ({ frames }) => {
        console.log(`saving video... ${frames} frames converted.`)
        mainWindow.webContents.send('video:progress', frames);
      })
      .save(`${dir}/video-converted.mp4`);
  } catch (err) {
    console.log(err);
  }
});

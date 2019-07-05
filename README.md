# p5js-electron-canvas-saver-boilerplate

## What it tries to do
- It gets around p5js' limitation of saving up to 15 frames. (see [here](http://p5js.org/reference/#/p5/saveFrames))
- Export image sequence and video files in a single app.
  - No need to use screen capture software. (No frame rate drops)
  - No need to use video editing software.
- It uses ffmpeg for video encoding which adds a lot of customizability.
- Ffmpeg is included as static binary. No need to install separately. A downside is that each project will have its own binary file which makes the whole project significantly bigger
- Once packaged, no need to use command line at all.

## How to use
*If you are more of a visual person, then check my youtube video explaining how to use.*
1. download or clone this repo.
1. install node for your system. The simplest way is to go to https://nodejs.org and download/install the package.
1. open Terminal
1. Change directory to the downloaded folder. If you have downloaded to desktop,
  `cd desktop/p5js-electron-canvas-saver-boilerplate`
1. install dependencies
  `npm install`
1. run it
  `npm run electron`
1. You can write p5js code as usual inside `public/sketch.js`.
1. When you press `start recording` button, it will start recording PNG images, and when you press the button again, it will stop saving images and start converting the images to video file. You can check the progress from the browser console (or Terminal).
1. When you are done and want to make a distributable app (.app)
  `npm run dist`
1. press `Ctrl+C` in Terminal to quit at any point.

## Customization
- file format (both image and video)
- folder name, file name

## Limitations
- tested only on Mac.
- If you want to use ffmpeg in commercial products, be sure to check out their licensing terms.

## dependencies
- p5js
- electron
- electron-builder
- fluent-ffmpeg: you can find many more options than included in index.js
- ffmpeg-static: binary link

## license
MIT

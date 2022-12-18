# p5js-electron-canvas-saver-boilerplate

![animated gif](video.gif)

_I tried to make it so that even if you have never used Node/Electron, you should be able to use this boilerplate. This is the first app I made using Node or Electron, so if you have any suggestions or comments, please let me know._

## What it tries to do

- Save unlimited number of frames from your p5js sketch. (p5 by default can save up to 15 frames. see [here](http://p5js.org/reference/#/p5/saveFrames))
- Export image sequence and video files in a single app.
  - No need to use screen capture software. (No frame drops)
  - No need to use video editing software.
- It uses ffmpeg for video encoding which adds a lot of customizability.
- Ffmpeg is included as static binary. No need to install separately. A downside is that each project will have its own binary file which makes the whole project significantly bigger.
- Once packaged, no need to use command line at all.

## What is is not so good at

- Recording _demonstration_ video - it only records what's on HTML5 canvas, so any sliders on HTML DOM won't be recorded.
- Real time interaction - the frame rate may drop while recording depending on the complexity of your sketch.

## How to use

<!-- *If you are more of a visual person, then check out my youtube video explaining how to use.* -->

1. download or clone this repo.
1. install node for your system. The simplest way is to go to [https://nodejs.org](https://nodejs.org) and download/install the package.
1. open Terminal app.
1. Change directory to the downloaded folder. If you have downloaded to desktop,  
   `cd desktop/p5js-electron-canvas-saver-boilerplate`
1. install dependencies  
   `npm install`
1. run it  
   `npm run electron`
1. You can write p5js and other html/css/js code as usual inside `public` folder. Take a look at `index.js` as well.
1. All the Chrome keyboard shortcuts work. Refresh by `Cmd+R`, toggle console by `Cmd+Opt+I`.
1. When you press `start recording` button, it will start recording PNG images, and when you press the button again, it will stop saving images and start converting the images to video file. You can check the progress from the browser console (or Terminal).
1. By default, files rendered are saved to `downloads` folder.
1. When you are done and want to package as app  
   `npm run dist`
1. press `Ctrl+C` in Terminal to quit at any point.

## Customization

Refer to fluent-ffmpeg [documentation](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) for different options you can add to video.

## Limitations

- `p5.js` library is loaded from CDN - if you need to load from a local file, include the `p5.js` (or any other library files) in `public` folder and link it in `public/index.html`
- tested only on Mac.
- If you want to use ffmpeg-included app commercially, be sure to check out their licensing terms.

## Dependencies

- [p5js](http://p5js.org)
- [electron](http://electronjs.org)
- [electron-builder](https://github.com/electron-userland/electron-builder)
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static): Mac binary comes from [here](https://evermeet.cx/pub/ffmpeg/)

## License

MIT

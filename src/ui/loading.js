//const { LoadTask } = require('../class/LoadTask.js');
//const { ipcRenderer } = require('electron/main');
import { LoadTask } from '../class/LoadTask.js';
import * as metronome from "../loading/metronome.js";
import '../loading/tasks.js';
import '../loading/progress.js';

const CLOSE_DELAY = 5000;

$(document).ready(function (){
  // Create the final task to close window for main window
  let finalLoadTask = new LoadTask((task) => {
    $('#descriptor').empty();
    $('#title').empty();
    $('#subtitle').empty();
    metronome.stop();
    metronome.set('rocket-takeoff-fill');
    task.complete();
  });

  let listener = finalLoadTask.on('allComplete', () => {
    listener.unregister();
    setTimeout(() => {
      window.electron.finishedLoading();
    }, CLOSE_DELAY);
  });

  // Begin loading
  LoadTask.perform();
});

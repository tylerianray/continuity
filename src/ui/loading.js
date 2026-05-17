const $ = require('jquery');
const { LoadTask } = require('../class/LoadTask.js');
const { ipcRenderer } = require('electron/main');

const CLOSE_DELAY = 5000;

$(document).ready(function (){
  // Begin metronome animation
  let metronome = require('../loading/metronome.js');
  // Register LoadTasks to run
  require('../loading/tasks.js');
  // Begin updating progress bar
  require('../loading/progress.js');

  // Create the final task to close window for main window
  let finalLoadTask = new LoadTask((task) => {
    $('#descriptor').empty();
    $('#title').empty();
    $('#subtitle').empty();
    metronome.stop();
    metronome.set('rocket-takeoff-fill');
    task.complete();
  });

  finalLoadTask.on('allComplete', () => {
    setTimeout(() => {
      ipcRenderer.send('finishedLoading');
    }, CLOSE_DELAY);
  });

  // Begin loading
  LoadTask.perform();
});

const $ = require('jquery');
const path = require('node:path');
const fs = require('node:fs');
const { constants } = require('node:fs');
const { LoadTask } = require('../class/LoadTask.js');
const { ipcRenderer } = require('electron/main');

const TITLE_DELAY = 1000;
const CONFIG_DELAY = 1;
const CLOSE_DELAY = 5000;
const CONFIG_PATH = 'config.json';

const METRONOME_STATES = [
  $('<i class="bi bi-arrow-up-circle-fill">'),
  $('<i class="bi bi-arrow-up-right-circle-fill">'),
  $('<i class="bi bi-arrow-right-circle-fill">'),
  $('<i class="bi bi-arrow-down-right-circle-fill">'),
  $('<i class="bi bi-arrow-down-circle-fill">'),
  $('<i class="bi bi-arrow-down-left-circle-fill">'),
  $('<i class="bi bi-arrow-left-circle-fill">'),
  $('<i class="bi bi-arrow-up-left-circle-fill">')
];

function createTitleTask(title) {
  return new LoadTask((task) => {
    $('#title').text(title.length==0?'\u00A0':title);
    setTimeout(() => {
      task.complete();
    }, TITLE_DELAY);
  });
}

function createSubtitleTask(title) {
  return new LoadTask((task) => {
    $('#subtitle').text(title.length==0?'\u00A0':title);
    setTimeout(() => {
      task.complete();
    }, TITLE_DELAY/4);
  });
}

function createConfigTask(identifier, value = undefined) {
  return new LoadTask((task) => {
    $('#subtitle').text(`Validating: ${identifier}`);
    setTimeout(() => {
      try {
        if(eval(`config.${identifier}`) == undefined) {
          configChanged = true;
          eval(`config.${identifier} = value;`);
        }
        task.complete();
      } catch(e) {
        task.fail(e);
      }
    }, CONFIG_DELAY);
  })
}

// Initial title
createTitleTask('Configuration');
// Check if config exists
let config;
let configChanged;
new LoadTask((task) => {
  fs.access(CONFIG_PATH, constants.F_OK, (err) => {
    if(err) {
      task.fail(err);
      try {
        fs.writeFile(CONFIG_PATH, JSON.stringify({}, null, 2), (writeErr) => {
          if(writeErr) task.fail(writeErr);
          else task.complete();
        });
      } catch(e) {
        task.fail(e);
      }
    }
    else task.complete();
  });
});
new LoadTask((task) => {
  fs.readFile(CONFIG_PATH, (err, read) => {
    if(err) task.fail(err);
    else {
      config = JSON.parse(read);
      task.complete()
    }
  })
});

createConfigTask('video', {});
createConfigTask('video.fullscreen', false);
createConfigTask('video.centered', true);
createConfigTask('video.preferred_x', 0);
createConfigTask('video.preferred_y', 0);
createConfigTask('video.prev_x', 0);
createConfigTask('video.prev_y', 0);
createConfigTask('video.preferred_width', 1280);
createConfigTask('video.preferred_height', 720);
createConfigTask('video.prev_width', 1280);
createConfigTask('video.prev_height', 720);

createConfigTask('db', {});
createConfigTask('db.host', '127.0.0.1');
createConfigTask('db.port', 3306);
createConfigTask('db.username', '');
createConfigTask('db.password', '');

createSubtitleTask('Saving updated configuration');
new LoadTask((task) => {
  if(configChanged) {
    fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), (err) => {
      if(err) task.fail(err);
      else task.complete();
    })
  } else task.complete();
});

// Validated title
createSubtitleTask('');

$(document).ready(function (){
  const TOTAL_TASKS = LoadTask.getAllTasks().length;
  let progress = $('.progress');

  let metroState = 0;
  setInterval(() => {
    if(metroState >= METRONOME_STATES.length) metroState = 0;
    $('#metronome').empty();
    $('#metronome').append(METRONOME_STATES[metroState]);
    metroState++;
  }, 250);

  progress.attr('aria-valuemax', `${TOTAL_TASKS}`);

  setInterval(() => {
    progress.attr('aria-valuenow', `${TOTAL_TASKS - LoadTask.getAllTasks().length}`);
  }, 1);


  let finalLoadTask = new LoadTask((task) => {
    $('#title').text('Done');
    task.complete();
  });

  finalLoadTask.on('allComplete', () => {
    setTimeout(() => {
      ipcRenderer.send('finishedLoading');
    }, CLOSE_DELAY);
  });

  LoadTask.perform();
});

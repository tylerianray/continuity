const { LoadTask } = require('../class/LoadTask.js');
const config = require('../class/Config.js');

const TITLE_DELAY = 1000;
const CONFIG_DELAY = 100;

function createTitleTask(title = undefined) {
  return new LoadTask((task) => {
    if(title == undefined) title = '';
    $('#title').text(title.length==0?'\u00A0':title);
    setTimeout(() => {
      task.complete();
    }, TITLE_DELAY);
  });
}

function createSubtitleTask(subtitle = undefined) {
  return new LoadTask((task) => {
    if(subtitle == undefined) subtitle = '';
    $('#subtitle').text(subtitle.length==0?'\u00A0':subtitle);
    setTimeout(() => {
      task.complete();
    }, TITLE_DELAY/4);
  });
}

function createConfigTask(identifier, value = undefined) {
  return new LoadTask((task) => {
    $('#subtitle').text(`Validating: ${identifier}`);
    setTimeout(() => {
      if(config.exists(identifier)) task.complete();
      else {
        try {
          config.set(identifier, value);
          task.complete();
        } catch(e) {
          task.fail(e);
        }
      }
    }, CONFIG_DELAY);
  })
}

// Initial title
createTitleTask('Configuration');

// Validate config contains necessary values
createConfigTask('window', {});
createConfigTask('window.fullscreen', false);
createConfigTask('window.centered', true);
createConfigTask('window.preferred_x', 0);
createConfigTask('window.preferred_y', 0);
createConfigTask('window.prev_x', 0);
createConfigTask('window.prev_y', 0);
createConfigTask('window.preferred_width', 1280);
createConfigTask('window.preferred_height', 720);
createConfigTask('window.prev_width', 1280);
createConfigTask('window.prev_height', 720);

createConfigTask('db', {});
createConfigTask('db.host', '127.0.0.1');
createConfigTask('db.port', 3306);
createConfigTask('db.username', '');
createConfigTask('db.password', '');

// Clear subtitle
createSubtitleTask();

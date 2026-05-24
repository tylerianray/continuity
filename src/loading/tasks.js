// const { LoadTask } = require('../class/LoadTask.js');
// const config = require('../class/Config.js');
import { LoadTask } from '../class/LoadTask.js';
import { Config } from '../class/Config.js';
import { Locale } from '../lang/Locale.js';

let locale;

const config = new Config();
let bounds;

const TITLE_DELAY = 1000;
const CONFIG_DELAY = 100;

function createTitleTask(title = undefined) {
  return new LoadTask((task) => {
    if(title == undefined) title = '';
    $('#title').text(title.length==0?'\u00A0':locale.get(title));
    setTimeout(() => {
      task.complete();
    }, TITLE_DELAY);
  });
}

function createSubtitleTask(subtitle = undefined) {
  return new LoadTask((task) => {
    if(subtitle == undefined) subtitle = '';
    $('#subtitle').text(subtitle.length==0?'\u00A0':local.get(subtitle));
    setTimeout(() => {
      task.complete();
    }, TITLE_DELAY/4);
  });
}

function createConfigTask(identifier, value = undefined) {
  const task = new LoadTask((task) => {
    $('#subtitle').text(`${locale.get('load-validating')}${locale.get('load-pointer')} ${identifier}`);
    setTimeout(() => {
      console.log(`${identifier}: ${config.exists(identifier)}`);
      if(config.exists(identifier)) task.complete();
      else {
        try {
          config.set(identifier, value);
          task.complete();
        } catch(e) {
          console.error(e)
          task.fail(e);
        }
      }
    }, CONFIG_DELAY);
  });

  task.on('fail', (e) => {
    console.error(e);
  });

  return task;
}

function start(bounds) {
  return new Promise((resolve, reject) => {
    if(config.exists('settings.language')) locale = new Locale(config.get('settings.language'));
    else locale = new Locale('en');
    // Initial title
    createTitleTask('load-configuration');

    // Validate config contains necessary values
    createConfigTask('window', {});
    createConfigTask('window.fullscreen', false);
    createConfigTask('window.centered', true);
    createConfigTask('window.preferred_x', 0);
    createConfigTask('window.preferred_y', 0);
    createConfigTask('window.prev_x', 0);
    createConfigTask('window.prev_y', 0);
    createConfigTask('window.preferred_width', bounds.width/2);
    createConfigTask('window.preferred_height', bounds.width/4);
    createConfigTask('window.prev_width', bounds.width/2);
    createConfigTask('window.prev_height', bounds.width/4);

    createConfigTask('db', {});
    createConfigTask('db.host', '127.0.0.1');
    createConfigTask('db.port', 3306);
    createConfigTask('db.username', '');
    createConfigTask('db.password', '');
    createConfigTask('db.schema', '');

    createConfigTask('settings', {});
    createConfigTask('settings.language', 'en');

    new LoadTask((task) => {
      config.set('db.host', '127.0.0.1');
      task.complete();
    });

    // Clear subtitle
    createSubtitleTask();
    resolve();
  });
}

export { start };

import { LoadTask } from '../class/LoadTask.js';
import * as metronome from "../loading/metronome.js";
import * as tasks from '../loading/tasks.js';
import * as progress from '../loading/progress.js';
import { Config } from '../class/Config.js';
import { Locale } from '../lang/Locale.js';

let locale;

const config = new Config();

const LOAD_DELAY = 1000;
const CLOSE_DELAY = 5000;

$(document).ready(() => {
  if(config.exists('settings.language')) locale = new Locale(config.get('settings.language'));
  else locale = new Locale('en');

  $('.lang').each(function (index) {
    let self = $(this);
    let classAttr = self.attr('class');
    let classes;
    if(classAttr.includes(' ')) classes = classAttr.split(' ');
    else classes = [ classAttr ];

    for(let cls of classes) {
      if(cls !== 'lang') {
        self.text(locale.get(cls));
      }
    }
  });

  window.electron.on('displayBounds', (data) => {
    //const config = new Config();

    // config.on('override', (json) => {
    //   console.log(JSON.stringify(json, null, 2));
    // })

    tasks.start(data).then(() => {
      progress.start().then(() => {
        setTimeout(() => {
          // Create the final task to close window for main window
          let finalLoadTask = new LoadTask((task) => {
            let metroClone = $('#metronome').clone();
            $('#information').empty();
            metroClone.appendTo($('#information'));
            metronome.stop();
            metronome.set('rocket-takeoff-fill');
            task.complete();
          });

          let listener = finalLoadTask.on('allComplete', () => {
            listener.unregister();
            setTimeout(() => {
              //window.electron.finishedLoading();
            }, CLOSE_DELAY);
          });

          // Begin loading
          LoadTask.perform();
        }, LOAD_DELAY);
      });
    });
  });
  window.electron.requestDisplay();
});

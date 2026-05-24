//const { LoadTask } = require('../class/LoadTask.js');
import { LoadTask } from '../class/LoadTask.js';

function start() {
  return new Promise((resolve, reject) => {
    const TOTAL_TASKS = LoadTask.getAllTasks().length;
    let progress = $('.progress');

    progress.attr('aria-valuemax', `${TOTAL_TASKS}`);

    setInterval(() => {
      progress.attr('aria-valuenow', `${TOTAL_TASKS - LoadTask.getAllTasks().length}`);
    }, 1);
    resolve();
  });
}

export { start }

const { LoadTask } = require('../class/LoadTask.js');

const TOTAL_TASKS = LoadTask.getAllTasks().length;
let progress = $('.progress');

progress.attr('aria-valuemax', `${TOTAL_TASKS}`);

setInterval(() => {
  progress.attr('aria-valuenow', `${TOTAL_TASKS - LoadTask.getAllTasks().length}`);
}, 1);

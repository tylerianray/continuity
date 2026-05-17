const EventEmitter = require('node:events');

const TASKS = [];

class LoadTask extends EventEmitter {

  #runTask;
  #completed = false;
  #failed = false;
  #error;

  constructor(runTask) {
    super();
    this.#runTask = runTask;
    TASKS.push(this);
  }

  run() {
    this.#runTask(this);
  }

  complete() {
    this.#completed = true;
    this.emit('complete');
    if(TASKS.length == 0) this.emit('allComplete');
    else LoadTask.perform();
  }

  isComplete() {
    return this.#completed;
  }

  fail(err = undefined) {
    this.#failed = true;
    this.#error = err;
    this.emit('fail', err);
  }

  // Begins processing the task array;
  static perform() {
    if(TASKS.length > 0) TASKS.shift().run();
  }

  static getAllTasks() {
    return TASKS;
  }

}

module.exports = {
  LoadTask
}

import { EventEmitter } from './EventEmitter.js';

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
    //if(TASKS.length == 0) ;
    //else LoadTask.perform();
    if(TASKS.length != 0) {
      LoadTask.perform();
    } else {
      this.emit('allComplete');
    }
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

export { LoadTask };

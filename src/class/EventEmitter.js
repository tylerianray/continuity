/**
 * @param event - The id of the event to validate
 * @returns {boolean} Whether the event id is valid
 */
function eventValid(event) {
  return event != undefined && typeof event === 'string' && event.length > 0;
}

class EventEmitter {

  #listeners = {};
  #ids = {};

  /**
   * @param {string} event - The event to listen for
   * @param {function} callback - The function to run when the event emits
   * @returns {Listener} A new listener for the event
   */
  on(event, callback) {
    if(callback != undefined) {
      if(eventValid(event)) {
        event = event.toLowerCase();
        if(this.#listeners[event] == undefined) {
          this.#listeners[event] = [];
          this.#ids[event] = 0;
        }

        let listener = new Listener(this.#ids[event], this, event, callback);
        this.#ids[event]++;
        this.#listeners[event].push(listener);
        return listener;
      }
    }
  }

  /**
   * @param {string} event - The event to send to listeners
   * @param {...any} data - An indefinite number of parameters to pass to the event
   */
  emit(event, ...data) {
    if(eventValid(event)) {
      event = event.toLowerCase();
      if(this.#listeners[event] != undefined) {
        for(let listener of this.#listeners[event]) {
          listener.invoke(...data);
        }
      }
    }
  }

  /**
   * @param {number} id - The id of the listener
   * @param {string} event - The event to remove the listener of id from
   */
  unregister(id, event) {
    if(eventValid(event)) {
      event = event.toLowerCase();
      if(this.#listeners[event] != undefined) {
        let length = this.#listeners[event].length - 1;
        for(let listenerIndex in this.#listeners[event].toReversed()) {
          let listener = this.#listeners[event][length-listenerIndex];
          if(listener.getId() == id) {
            this.#listeners[event].splice(length-listenerIndex, 1);
          }
        }
      }
    }
  }
}

class Listener {

  #id;
  #emitter;
  #event;
  #callback;

  /**
   * @constructor
   * @param {number} id - The id of the listener
   * @param {EventEmitter} emitter - The parent emitter that created this Listener
   * @param {string} event - The event this listener responds to
   * @param {function} callback - The callback function to run from the emitter
   */
  constructor(id, emitter, event, callback) {
    this.#id = id;
    this.#emitter = emitter;
    this.#event = event;
    this.#callback = callback;
  }

  /**
   * @returns {number} The id of the listener
   */
  getId() {
    return this.#id;
  }

  /**
   * @param {...any} data - The data passed from this event (# of parameters is event dependant)
   */
  invoke(...data) {
    this.#callback(...data);
  }

  /**
   * Unregisters this event from the parent EventEmitter and deletes itself *poof*
   */
  unregister() {
    this.#emitter.unregister(this.#id, this.#event);
    delete this;
  }

  /**
   * @returns {string} Converts this listener to a readable string
   */
  toString() {
    return `[Listener id:'${this.#id}' event:'${this.#event}']`
  }

}

export { EventEmitter };

function eventValid(event) {
  return event != undefined && typeof event === 'string' && event.length > 0;
}

class EventEmitter {

  #listeners = {};

  on(event, callback) {
    if(callback != undefined) {
      if(eventValid(event)) {
        event = event.toLowerCase();
        if(this.#listeners[event] == undefined) this.#listeners[event] = [];

        let listener = new Listener(this.#listeners[event].length, this, event, callback);
        this.#listeners[event].push(listener);
        return listener;
      }
    }
  }

  emit(event, ...options) {
    if(eventValid(event)) {
      event = event.toLowerCase();
      if(this.#listeners[event] != undefined) {
        for(let listener of this.#listeners[event]) {
          listener.invoke(event, ...options);
        }
      }
    }
  }

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

  constructor(id, emitter, event, callback) {
    this.#id = id;
    this.#emitter = emitter;
    this.#event = event;
    this.#callback = callback;
  }

  getId() {
    return this.#id;
  }

  invoke(...options) {
    this.#callback(...options);
  }

  unregister() {
    this.#emitter.unregister(this.#id, this.#event);
    delete this;
  }

  toString() {
    return `[Listener id:'${this.#id}' event:'${this.#event}']`
  }

}

export { EventEmitter };

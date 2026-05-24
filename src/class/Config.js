// let CONFIG;
import { EventEmitter } from './EventEmitter.js';
const CONFIG_PATH = 'config.json';

class Config extends EventEmitter {

  static CONFIGS = {};
  static CONFIG_VALUES = {};
  #path;
  #config;

  constructor(path = CONFIG_PATH) {
    super();
    console.log(new Date() * 1);
    if(Config.CONFIGS[path] == undefined) Config.CONFIGS[path] = [];
    Config.CONFIGS[path].push(this);
    this.#path = path;
    let read;

    if(Config.CONFIG_VALUES[path] == undefined) Config.CONFIG_VALUES[path] = {};
    else this.#config = Config.CONFIG_VALUES[path];

    if(this.#config == undefined) {
      try {
        read = window.fs.readFileSync(this.#path);
        if(read == undefined) this.#config = {};
        else {
          try {
            let tempConfig = JSON.parse(read);
            this.#config = tempConfig;
            Config.CONFIG_VALUES[path] = this.#config;
          } catch(e) {
            this.#config = {};
            this.saveConfig();
            console.error(e);
          }
        }
      } catch(e) {
        this.#config = {};
        this.saveConfig();
        console.error(e);
      }
    }
    console.log(this.#config);
  }

  /**
   * Parses identifier lists for eval seperated by '.'
   * @param {string} identifier - The identifier to parse
   * @returns {string} A parsed version of the identifier, suitable for eval
   */
  parseIdentifier(identifier) {
    let split;
    if(identifier.includes('.')) split = identifier.split('.');
    else split = [ identifier ];

    return split;
  }

  /**
   * Creates the necessary parents for an identifier
   * @param {string} identifier - The identifier to create parents for
   */
  createParentNodes(identifier) {
    let parse = this.parseIdentifier(identifier);
    if(parse.length > 0) parse.pop();

    let sub = this.#config;
    for(let key of parse) {
      if(sub[key] == undefined) sub[key] = {};
      sub = sub[key];
    }

    this.saveConfig();
  }

  /**
   * Checks if the identifier exists
   * @param {string} identifier - The identifier to check existance of
   * @returns {boolean} Whether the identifier exists
   */
  exists(identifier) {
    let parse = this.parseIdentifier(identifier);
    return this.get(identifier) != undefined;
  }

  /**
   * Gets the value of the identifier (undefined if it doesn't exist)
   * @param {string} identifier - The identifier to get the value of
   * @returns {any|undefined} The value or undefined of the identifier
   */
  get(identifier) {
    let parse = this.parseIdentifier(identifier);

    let sub = this.#config;
    for(let index = 0; index < parse.length - 1; index++) {
      let key = parse[index];
      if(sub[key] == undefined) return undefined;
      sub = sub[key];
    }

    return sub[parse[parse.length-1]];
  }

  /**
   * Sets the value of an identifier to the value. Parent nodes are created by default
   * @param {string} identifier - The identifier to modify
   * @param {any} value - The value to set
   * @param {boolean} createParents - Default: true. Do (or do not) create the parent nodes
   */
  set(identifier, value, createParents = true) {
    if(createParents) this.createParentNodes(identifier);
    let parse = this.parseIdentifier(identifier);

    let sub = this.#config;
    for(let index = 0; index < parse.length - 1; index++) {
      if(parse[index] == undefined) return undefined;
      sub = sub[parse[index]];
    }
    sub[parse[parse.length-1]] = value;
    Config.CONFIG_VALUES[this.#path] = this.#config;
    Config.update(this.#path, this.#config, this);

    this.saveConfig();
  }

  /**
   * Saves the config to local file
   */
  saveConfig(pathOverride = undefined) {
    window.fs.writeFileSync(pathOverride?pathOverride:this.#path, JSON.stringify(this.#config));
  }

  asJSON() {
    return this.#config;
  }

  toString() {
    return JSON.stringify(this.#config);
  }

  forceConfigOverride() {
    this.#config = Config.CONFIG_VALUES[this.#path];
    this.emit('override', this.#config);
  }

  static update(path, newConfig, source) {
    if(Config.CONFIGS[path] != undefined) {
      for(let configClass of Config.CONFIGS[path]) {
        try {
          Config.CONFIG_VALUES[path] = newConfig;
          configClass.forceConfigOverride();
        } catch(e) {
          console.error(e);
        }
      }
    }
  }

}

export { Config };

/**
 * @param {string} key - The key to seperate
 * @param {string} [delimeter] - The delimeter to seperate with (optional)
 * @returns {string[]} Key split using delimeter
 */
function parseKey(key, delimiter = '-') {
  let split;
  if(key.includes(delimiter)) split = key.split(delimiter);
  else split = [ key ];
  return split;
}

class Locale {

  #code;
  #name
  #json;

  /**
   * @constructor
   * @param {string} code - Language identifier code
   */
  constructor(code) {
    let jsonPath = `./src/lang/${code}.json`;
    if(window.fs.exists(jsonPath)) {
      this.#code = code;
      this.#json = JSON.parse(window.fs.readFileSync(jsonPath));
    } else throw new Error(`File not found '${code}.json' in lang directory`);
    this.#code = code;
  }

  /**
   * @param {string} key - The translation key
   * @returns {string} The translated final string
   */
  get(key) {
    let keys = parseKey(key);
    let sub = this.#json;
    for(let index = 0; index < keys.length; index++) {
      let subkey = keys[index];
      if(sub[subkey] == undefined) return undefined;
      sub = sub[subkey];
    }
    return sub;
  }

  /**
   * @param {string} key - The translation key
   * @returns {boolean} If the key exists
   */
  exists(key) {
    let keys = parseKey(key);
    let sub = this.#json;
    for(let index = 0; index < keys.length - 1; index++) {
      let subkey = keys[index];
      if(sub[subkey] == undefined) return false;
      sub = sub[subkey];
    }
    return true;
  }

}

export { Locale };

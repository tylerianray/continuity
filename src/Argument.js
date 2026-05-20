class Argument {

  #name;
  #aliases;

  constructor(name, aliases = []) {
    this.#name = name;
    this.#aliases = aliases;
  }

  /**
   * Compares an input name or alias to this argument
   * @param {string} input - The name or alias
   * @returns {boolean} If this argument is the input (name or aliases)
   */
  isThisArgument(input) {
    input = input.toLowerCase();
    if(input.startsWith('--')) input = input.substring(2);
    if(input.startsWith('-')) input = input.substring(1);
    for(let alias of this.#aliases) {
      if(alias.toLowerCase() === input) return true;
    }
    return this.#name.toLowerCase() === input;
  }

}

module.exports = Argument;

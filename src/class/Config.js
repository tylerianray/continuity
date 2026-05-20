const CONFIG_PATH = 'config.json';
let CONFIG;

if(window.fs.exists(CONFIG_PATH)) {
  window.fs.readFile(CONFIG_PATH).then((data) => {
    try {
      tempConfig = JSON.parse(data);
      CONFIG = tempConfig;
    } catch(e) {
      CONFIG = {};
      saveConfig();
    }
  }).catch((err) => {
    CONFIG = {};
    saveConfig();
  });
}

/**
 * Parses identifier lists for eval seperated by '.'
 * @param {string} identifier - The identifier to parse
 * @returns {string} A parsed version of the identifier, suitable for eval
 */
function parseIdentifier(identifier) {
  let result = '';

  let split;
  if(identifier.includes('.')) split = identifier.split('.');
  else split = [ identifier ];

  for(let id of split) {
    result += `[\"${id}\"]`;
  }

  return result;
}

/**
 * Creates the necessary parents for an identifier
 * @param {string} identifier - The identifier to create parents for
 */
function createParentNodes(identifier) {
  let currentIdentifier = '';

  let split;
  if(identifier.includes('.')) {
    split = identifier.split('.');
    split.pop();
  } else split = [];

  for(let id of split) {
    currentIdentifier += `[\"${id}\"]`;
    eval(`if(CONFIG${currentIdentifier} == undefined) CONFIG${currentIdentifier} = {};`);
  }

  saveConfig();
}

/**
 * Checks if the identifier exists
 * @param {string} identifier - The identifier to check existance of
 * @returns {boolean} Whether the identifier exists
 */
function exists(identifier) {
  let parse = parseIdentifier(identifier);
  return eval(`CONFIG${parse} != undefined`);
}

/**
 * Gets the value of the identifier (undefined if it doesn't exist)
 * @param {string} identifier - The identifier to get the value of
 * @returns {any|undefined} The value or undefined of the identifier
 */
function get(identifier) {
  let parse = parseIdentifier(identifier);
  return eval(`CONFIG${parse}`);
}

/**
 * Sets the value of an identifier to the value. Parent nodes are created by default
 * @param {string} identifier - The identifier to modify
 * @param {any} value - The value to set
 * @param {boolean} createParents - Default: true. Do (or do not) create the parent nodes
 */
function set(identifier, value, createParents = true) {
  let parse = parseIdentifier(identifier);
  if(createParents) createParentNodes(identifier);
  try {
    eval(`CONFIG${parse} = value`);
    saveConfig();
  } catch(e) {
    console.error(e);
  }
}

/**
 * Saves the config to local file
 */
function saveConfig(pathOverride = undefined) {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathOverride?pathOverride:CONFIG_PATH, JSON.stringify(CONFIG, null, 2), (err) => {
      if(err) reject(err);
      else resolve();
    });
  });
}

export {
  exists,
  get,
  set,
  saveConfig
}

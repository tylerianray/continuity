const path = require('path');
const fs = require('fs');
const { constants } = require('node:fs');
const CONFIG_PATH = 'config.json';

let CONFIG;
try {
  fs.accessSync(CONFIG_PATH, constants.F_OK);
  CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH));
} catch(e) {
  CONFIG = {};
  saveConfig();
}

/*
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

function exists(identifier) {
  let parse = parseIdentifier(identifier);
  return eval(`CONFIG${parse} != undefined`);
}

function get(identifier) {
  let parse = parseIdentifier(identifier);
  return eval(`CONFIG${parse}`);
}

function set(identifier, value) {
  let parse = parseIdentifier(identifier);
  createParentNodes(identifier);
  eval(`CONFIG${parse} = value`);
  saveConfig();
}

function saveConfig(pathOverride = undefined) {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathOverride?pathOverride:CONFIG_PATH, JSON.stringify(CONFIG, null, 2), (err) => {
      if(err) reject(err);
      else resolve();
    });
  });
}

module.exports = {
  exists,
  get,
  set,
  saveConfig
}

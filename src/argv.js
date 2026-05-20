const process = require('node:process');
const Argument = require('./Argument.js');

const ARGUMENTS = [
  new Argument('developer-tools', [ 'd', 'dev', 'developer', 'dev-mode'])
];

function getArgument(input) {
  let argument;
  for(let arg of ARGUMENTS) {
    if(arg.isThisArgument(input)) {
      argument = arg;
      break;
    }
  }
  if(!argument) throw new Error('Argument not found');
  return argument;
}

function getValue(input) {
  try {
    let argument = getArgument(input);
    for(let argIndex in process.argv) {
      let argv = process.argv[argIndex];
      if(argument.isThisArgument(argv)) {
        let nextIndex = parseInt(argIndex) + 1;
        if(process.argv.length > nextIndex) {
          let argvValue = process.argv[nextIndex];
          if(!argvValue.startsWith('-')) {
            return argvValue;
          }
        }
      }
    }
  } catch(e) {}
  return undefined;
}

/**
 *
 */
function hasArg(input) {
  try {
    let argument = getArgument(input);
    for(let argv of process.argv) {
      if(argument.isThisArgument(argv)) {
        return true;
      }
    }
  } catch(e) {}
  return false;
}

module.exports = {
  getValue,
  hasArg
}

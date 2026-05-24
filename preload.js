const { contextBridge, ipcRenderer, screen } = require('electron');
const fs = require('node:fs');
const { constants } = require('node:fs');
//const path = require('path');

contextBridge.exposeInMainWorld('electron', {
  on: (event, callback) => { ipcRenderer.on(event, (_event, ...values) => {
    try {
      callback(...values);
    } catch(e) {}
  }); },
  requestDisplay: () => { ipcRenderer.send('requestDisplay'); },
  finishedLoading: () => { ipcRenderer.send('finishedLoading'); }
});

contextBridge.exposeInMainWorld('fs', {
  readFile: (path) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if(err) reject(err);
        else resolve(data.toString());
      });
    });
  },
  readFileSync: (path) => {
    let result = fs.readFileSync(path);
    if(result != undefined) result = result.toString();
    return result;
  },
  writeFile: (path, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if(err) reject(err);
        else resolve();
      });
    });
  },
  writeFileSync: (path, data) => {
    fs.writeFileSync(path, data);
  },
  exists: (path) => {
    try {
      fs.accessSync(path, constants.F_OK);
      return true;
    } catch(e) {}
    return false;
  }
});

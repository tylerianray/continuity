const { contextBridge, ipcRenderer } = require('electron');
const fs = require('node:fs');
const { constants } = require('node:fs');
//const path = require('path');

contextBridge.exposeInMainWorld('electron', {
  finishedLoading: () => {
    ipcRenderer.send('finishedLoading');
  }
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
  writeFile: (path, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if(err) reject(err);
        else resolve();
      });
    });
  },
  exists: (path) => {
    try {
      fs.accessSync(path, constants.F_OK);
      return true;
    } catch(e) {}
    return false;
  }
});

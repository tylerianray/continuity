const { app, BrowserWindow, ipcMain, screen } = require('electron/main');
const path = require('node:path');
//const process = require('node:process');
const argv = require('./src/argv.js');

let loadingWindow;
let mainWindow;

let display;

const LOADING_HTM = path.join(__dirname, 'src/ui/loading.htm');
const MAIN_HTM = path.join(__dirname, 'src/ui/main.htm');

const devValue = argv.getValue('developer-tools');
let isDeveloper = (devValue?JSON.parse(devValue):false);
if(isDeveloper !== true && isDeveloper !== false) isDeveloper = false;

function createLoadingWindow(display = undefined) {
  loadingWindow = new BrowserWindow({
    width: display?parseInt(display.size.width/(isDeveloper?2:4)):640,
    height: display?parseInt(display.size.width/(isDeveloper?4:8)):320,
    frame: false,
    transparent: true,
    alwaysOnTop: !isDeveloper,
    skipTaskbar: !isDeveloper,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    }
  });

  loadingWindow.loadFile(LOADING_HTM);

  if(isDeveloper) {
    loadingWindow.webContents.once('did-finish-load', () => {
      loadingWindow.webContents.openDevTools();
    });
  }
}

function createMainWindow(display = undefined) {
  mainWindow = new BrowserWindow({
    width: display?parseInt(display.size.width/2):1280,
    height: display?parseInt(display.size.height/2):720,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  mainWindow.loadFile(MAIN_HTM);

  mainWindow.webContents.on('did-finish-load', () => {
    loadingWindow.on('closed', () => {
      delete loadingWindow;
      setTimeout(() => {
        mainWindow.show();
      }, 1000);
    })
    if(loadingWindow) {
      loadingWindow.close();
    }
  });
}

ipcMain.on('finishedLoading', (event) => {
  createMainWindow(display);
});

ipcMain.on('test', (event) => {
  console.log('TESTED AND WORKING');
});

app.whenReady().then(() => {
  display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  createLoadingWindow(display);

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
      createLoadingWindow(display);
    }
  });
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
})

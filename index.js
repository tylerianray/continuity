const { app, BrowserWindow, ipcMain, screen } = require('electron/main');
const path = require('node:path');

let loadingWindow;
let mainWindow;

let display;

const LOADING_HTM = path.join(__dirname, 'src/ui/loading.htm');
const MAIN_HTM = path.join(__dirname, 'src/ui/main.htm');

function createLoadingWindow(display = undefined) {
  loadingWindow = new BrowserWindow({
    width: display?parseInt(display.size.width/4):640,
    height: display?parseInt(display.size.width/8):320,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  loadingWindow.loadFile(LOADING_HTM);
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

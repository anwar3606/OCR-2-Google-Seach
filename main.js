

const { app, BrowserWindow, ipcMain } = require('electron')
const settings = require('electron-settings');
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow()
  mainWindow.loadFile('index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  const ua = require('universal-analytics');
  const uuid = require('uuid/v4');
  const settings = require('electron-settings');


  userId ="";
  if (!settings.has('userid')) {
    userId = uuid();
    settings.set('userid', userId);
  } else {
    userId = settings.get("userid")
  }

  const usr = ua('UA-128596209-1', userId);
  
  usr.screenview("Home Screen", "OCR 2 Google", '1.0.0', "anwar.ocr.google")

  function trackEvent(category, action, label, value) {
    usr.event({
      ec: category,
      ea: action,
      el: label,
      ev: value,
    }).send();
  }

  ipcMain.on('usage_history', (event, arg) => {
    trackEvent(arg[1], arg[3])
  });

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})


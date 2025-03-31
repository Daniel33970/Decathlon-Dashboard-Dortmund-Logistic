const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional, falls du preload nutzen willst
    },
  })
  mainWindow.setMenuBarVisibility(false);
  
  

  // Lade deine Firebase-gehostete Seite
  mainWindow.loadURL('https://decathlon-dashboard-ede9a.web.app/');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

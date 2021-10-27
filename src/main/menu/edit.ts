import { dialog, BrowserWindow } from 'electron';

const findInPage = (mainWindow: BrowserWindow) => {
  console.log('finding');
  mainWindow.webContents.findInPage('text');
};

export default { findInPage };

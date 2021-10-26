import { dialog, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

const readFile = (filePath: fs.PathLike) => {
  return fs.readFileSync(filePath).toString();
};

const writeFile = (filePath: string | undefined, content: string) => {
  if (filePath) {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

const openFile = (mainWindow: BrowserWindow) => {
  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Text Document', extensions: ['txt', 'text'] }],
    })
    .then((file) => {
      // eslint-disable-next-line promise/always-return
      if (!file.canceled) {
        const content = readFile(file.filePaths[0]);
        if (content) {
          mainWindow.webContents.send('app:open-text-reply', content);
        } else {
          console.log('error: could not read file');
        }
      }
    })
    .catch((err) => {
      console.error(`error: showOpenDialog - ${err}`);
    });
};

const saveFile = (mainWindow: BrowserWindow) => {
  dialog
    .showSaveDialog({
      title: 'Save As',
      defaultPath: path.join(__dirname, '../assets/*.txt'),
      filters: [{ name: 'Text Documents(*.txt)', extensions: ['txt'] }],
    })
    .then((file) => {
      // eslint-disable-next-line promise/always-return
      if (file.filePath) {
        mainWindow.webContents.send('app:save-text-request');
        ipcMain.once('app:save-text-reply', (_event, textValue) => {
          writeFile(file.filePath, textValue);
        });
      }
    })
    .catch((err) => {
      console.error(`error: showSaveDialog - ${err}`);
    });
};

const saveAsFile = (mainWindow: BrowserWindow) => {
  dialog
    .showSaveDialog({
      title: 'Save As',
      defaultPath: path.join(__dirname, '../assets/*.txt'),
      filters: [{ name: 'Text Documents(*.txt)', extensions: ['txt'] }],
    })
    .then((file) => {
      // eslint-disable-next-line promise/always-return
      if (file.filePath) {
        mainWindow.webContents.send('app:save-text-request');
        ipcMain.once('app:save-text-reply', (_event, textValue) => {
          writeFile(file.filePath, textValue);
        });
      }
    })
    .catch((err) => {
      console.error(`error: showSaveDialog - ${err}`);
    });
};

export default { openFile, saveFile, saveAsFile };

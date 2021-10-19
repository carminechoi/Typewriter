import { dialog, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

const openFile = (mainWindow: BrowserWindow) => {
  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Text Document', extensions: ['txt', 'text'] }],
    })
    .then((file) => {
      // eslint-disable-next-line promise/always-return
      if (!file.canceled) {
        fs.readFile(file.filePaths[0], (err, data) => {
          if (!err) {
            mainWindow.webContents.send('FILE_OPEN', data.toString());
          } else {
            console.log(err);
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
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
      if (!file.canceled && file.filePath) {
        mainWindow.webContents.send('SEND_ME_TEXTVALUE');
        fs.writeFile(
          file.filePath.toString(),
          'This is a Sample File',
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const saveAsFile = (mainWindow: BrowserWindow) => {
  dialog
    .showSaveDialog({
      title: 'Save As',
      defaultPath: path.join(__dirname, '../assets/*.txt'),
      filters: [{ name: 'Text Documents (*.txt)', extensions: ['txt'] }],
    })
    .then((file) => {
      // eslint-disable-next-line promise/always-return
      if (!file.canceled && file.filePath) {
        mainWindow.webContents.send('SEND_ME_TEXT');
        fs.writeFile(
          file.filePath.toString(),
          'This is a Sample File',
          (err) => {
            if (err) console.log(err);
          }
        );
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export default { openFile, saveFile, saveAsFile };

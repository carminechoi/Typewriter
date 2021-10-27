import { dialog, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

let currentFile = {
  isOpen: false,
  filePath: '',
};

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

// const getTextFromRenderer = (mainWindow: BrowserWindow) => {
//   let text = '';
//   mainWindow.webContents.send('app:save-text-request');
//   ipcMain.once('app:save-text-reply', async (_event, textValue) => {
//     text = await textValue;
//     console.log(`text: ${text}`);
//   });
//   return text;
// };

// const isWindowChangeValid = () => {
//   const content = readFile(currentFile.filePath);
// };

const openNewFile = (mainWindow: BrowserWindow) => {
  currentFile = { isOpen: false, filePath: '' };
  mainWindow.webContents.send('app:set-new-text-request');
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
          currentFile = { isOpen: true, filePath: file.filePaths[0] };
          mainWindow.webContents.send('app:set-open-text-request', content);
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
  if (currentFile.isOpen) {
    // eslint-disable-next-line promise/always-return
    mainWindow.webContents.send('app:save-text-request');
    ipcMain.once('app:save-text-reply', (_event, textValue) => {
      writeFile(currentFile.filePath, textValue);
    });
  } else {
    dialog
      .showSaveDialog({
        title: 'Save As',
        defaultPath: path.join(__dirname, '../assets/*.txt'),
        filters: [{ name: 'Text Documents(*.txt)', extensions: ['txt'] }],
      })
      .then((file) => {
        // eslint-disable-next-line promise/always-return
        if (file.filePath) {
          currentFile = { isOpen: true, filePath: file.filePath };
          // writeFile(file.filePath, getTextFromRenderer(mainWindow));
          mainWindow.webContents.send('app:save-text-request');
          ipcMain.once('app:save-text-reply', (_event, textValue) => {
            writeFile(file.filePath, textValue);
          });
        }
      })
      .catch((err) => {
        console.error(`error: showSaveDialog - ${err}`);
      });
  }
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
        currentFile = { isOpen: true, filePath: file.filePath };
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

const print = (mainWindow: BrowserWindow) => {
  const options = {
    silent: false,
    printBackground: true,
    color: false,
    margin: {
      marginType: 'printableArea',
    },
    landscape: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: 'Header of the Page',
    footer: 'Footer of the Page',
  };
  mainWindow.webContents.print(options, () => {});
};

export default { openNewFile, openFile, saveFile, saveAsFile, print };

import { dialog, BrowserWindow } from 'electron';

const openFile = (mainWindow: BrowserWindow) => {
  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Text Document',
          extensions: ['txt', 'text'],
        },
      ],
    })
    .then((filename) => {
      // eslint-disable-next-line promise/always-return
      if (!filename.canceled) {
        mainWindow.webContents.send('FILE_OPEN', filename);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
};

export default openFile;

import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import file from './file';
import edit from './edit';

// eslint-disable-next-line import/no-cycle
import { createWindow } from '../main';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme'
            );
          },
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&New',
            accelerator: 'Ctrl+N',
            click: () => {
              file.openNewFile(this.mainWindow);
            },
          },
          {
            label: '&New Window',
            accelerator: 'Ctrl+Shift+N',
            click: () => {
              createWindow();
            },
          },
          {
            label: '&Open...',
            accelerator: 'Ctrl+O',
            click: () => {
              file.openFile(this.mainWindow);
            },
          },
          {
            label: '&Save',
            accelerator: 'Ctrl+S',
            click: () => {
              file.saveFile(this.mainWindow);
            },
          },
          {
            label: '&Save As...',
            accelerator: 'Ctrl+Shift+S',
            click: () => {
              file.saveAsFile(this.mainWindow);
            },
          },
          { type: 'separator' },
          {
            label: '&Page Setup...',
          },
          {
            label: '&Print...',
            accelerator: 'Ctrl+P',
            click: () => {
              file.print(this.mainWindow);
            },
          },
          { type: 'separator' },
          {
            label: '&Exit',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&Edit',
        submenu: [
          {
            label: '&Undo',
            accelerator: 'Ctrl+Z',
            role: 'undo',
          },
          { type: 'separator' },
          {
            label: '&Cut',
            // accelerator: 'Ctrl+X',
            role: 'cut',
          },
          {
            label: '&Copy',
            accelerator: 'Ctrl+C',
            role: 'copy',
          },
          {
            label: '&Paste',
            accelerator: 'Ctrl+V',
            role: 'paste',
          },
          {
            label: '&Delete',
            accelerator: 'Del',
            role: 'delete',
          },
          { type: 'separator' },
          {
            label: 'Find...',
            accelerator: 'Ctrl+F',
            click: () => {
              edit.findInPage(this.mainWindow);
            },
          },
          {
            label: '&Find Next',
            accelerator: 'F3',
          },
          {
            label: '&Find Previous',
            accelerator: 'Shift+F3',
          },
          {
            label: '&Replace...',
            accelerator: 'Ctrl+H',
          },
          {
            label: '&Go To...',
            accelerator: 'Ctrl+G',
          },
          { type: 'separator' },
          {
            label: '&Select All',
            accelerator: 'Ctrl+A',
            role: 'selectAll',
          },
          {
            label: '&Time/Date',
            accelerator: 'F5',
          },
        ],
      },
      {
        label: '&Format',
        submenu: [
          {
            label: '&Word Wrap',
          },
          {
            label: '&Font...',
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: 'Zoom',
                },
                {
                  label: 'Status Bar',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'View Help',
            click() {
              shell.openExternal('https://electronjs.org');
            },
          },
          {
            label: 'Send Feedback',
            click() {
              shell.openExternal(
                'https://www.bing.com/search?q=get+help+with+notepad+in+windows+10&filters=guid:%224466414-en-dia%22%20lang:%22en%22&form=T00032&ocid=HelpPane-BingIA'
              );
            },
          },
          { type: 'separator' },
          {
            label: 'About Notepad',
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}

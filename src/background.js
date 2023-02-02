'use strict';

import path from 'path';
import { app, protocol, BrowserWindow, Menu, Tray } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import database from '@/database';

import '@/apis/index';

const isDevelopment = process.env.NODE_ENV !== 'production';
let tray;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);
Menu.setApplicationMenu(null);
app.disableHardwareAcceleration();

app.on('ready', async () => {
  if (!isDevelopment) {
    createProtocol('app');
  }
  await database().createDatatable();
  await database()
    .asyncRun(
      `INSERT INTO
        dh_employees (dh_employee_phone, dh_employee_password, dh_employee_name, dh_employee_auth)
      VALUES
        ('18000000000', '000000', 'oooweee', 'employee,category,goods,stock,order')`
    )
    .catch(() => {});

  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__static, 'preload.js')
    }
  });
  win.on('close', e => {
    e.preventDefault();
    win.hide();
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/login');
    if (isDevelopment) win.webContents.openDevTools();
  } else {
    win.loadURL('app://./index.html/#/login');
  }

  tray = new Tray(path.join(__static, 'favicon.ico'));
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: '切换账号',
        type: 'normal',
        click() {
          if (process.env.WEBPACK_DEV_SERVER_URL) {
            win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/login');
          } else {
            win.loadURL('app://./index.html/#/login');
          }
        }
      },
      {
        label: '退出',
        type: 'normal',
        click() {
          app.exit();
        }
      }
    ])
  );
  tray.on('double-click', () => {
    win.show();
    win.focus();
  });
});

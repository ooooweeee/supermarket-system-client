'use strict';

import path from 'path';
import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import database from '@/database';

import '@/apis/index';

const isDevelopment = process.env.NODE_ENV !== 'production';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

app.on('ready', async () => {
  if (!isDevelopment) {
    createProtocol('app');
  }
  await database().createDatatable();
  await database().asyncRun(
    `INSERT INTO dh_employees (dh_employee_phone, dh_employee_password, dh_employee_name) VALUES ('18000000000', '000000', 'oooweee')`
  );

  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__static, 'preload.js')
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/login');
    if (isDevelopment) win.webContents.openDevTools();
  } else {
    win.loadURL('app://./index.html');
  }
});

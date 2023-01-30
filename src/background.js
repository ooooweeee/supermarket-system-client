'use strict';

import path from 'path';
import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import database from './database';

const isDevelopment = process.env.NODE_ENV !== 'production';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

app.on('ready', async () => {
  if (!isDevelopment) {
    createProtocol('app');
  }
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__static, 'preload.js')
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (isDevelopment) win.webContents.openDevTools();
  } else {
    win.loadURL('app://./index.html');
  }
  const db2 = database();
  const db = database();
  await db.createDatatable();
  await db.asyncRun(
    `INSERT INTO dh_employees (dh_employee_phone, dh_employee_password, dh_employee_name) VALUES ('${Date.now()}', '000000', 'oooweee')`
  );
  const result = await db2.asyncAll(`SELECT * FROM dh_employees`);
  console.log(result);
});

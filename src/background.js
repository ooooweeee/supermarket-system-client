'use strict';

import path from 'path';
import { app, protocol, BrowserWindow, Menu } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import database from '@/database';
import './apis';

const isDevelopment = process.env.NODE_ENV !== 'production';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);
Menu.setApplicationMenu(null);

app.on('ready', async () => {
  if (!isDevelopment) {
    createProtocol('app');
  }

  const db = database();
  await db.createDatatable();

  const win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__static, 'preload.js')
    }
  });

  console.log(process.env.WEBPACK_DEV_SERVER_URL);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#/login');
    if (isDevelopment) win.webContents.openDevTools();
  } else {
    win.loadURL('app://./index.html');
  }
});

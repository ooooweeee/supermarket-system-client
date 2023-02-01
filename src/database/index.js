import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import sqlite3 from 'sqlite3';

const { Database } = sqlite3.verbose();
const SECRET_KEY = 'dh_supermarket_system_db';
const dbDir = path.join(app.getPath('userData'), 'database');

class DB {
  constructor() {
    fs.mkdirSync(dbDir, { recursive: true });
    this.db = new Database(path.join(dbDir, 'db_management.db'));
    this.db.serialize(async () => {
      this.db.exec('PRAGMA cipher_compatibility = 3');
      this.db.exec(`PRAGMA key = ${SECRET_KEY}`);
    });
  }

  asyncRun(command) {
    return new Promise((resolve, reject) => {
      this.db.run(command, (err, res) => (err ? reject(err) : resolve(res)));
    });
  }
  asyncGet(command) {
    return new Promise((resolve, reject) => {
      this.db.get(command, (err, res) => (err ? reject(err) : resolve(res)));
    });
  }
  asyncAll(command) {
    return new Promise((resolve, reject) => {
      this.db.all(command, (err, res) => (err ? reject(err) : resolve(res)));
    });
  }

  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }

  createDatatable() {
    return Promise.all([
      this.asyncRun(`CREATE TABLE IF NOT EXISTS dh_employees (
        dh_employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
        dh_employee_phone TEXT NOT NULL UNIQUE,
        dh_employee_password TEXT NOT NULL,
        dh_employee_name TEXT NOT NULL,
        dh_employee_sex INTEGER DEFAULT 0,
        dh_employee_address TEXT,
        dh_employee_state INTEGER DEFAULT 0,
        dh_employee_update_date TEXT DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime'))
      )`),
      this.asyncRun(`CREATE TABLE IF NOT EXISTS dh_categories (
        dh_category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        dh_category_name TEXT NOT NULL UNIQUE,
        dh_category_state INTEGER DEFAULT 0,
        dh_category_update_date TEXT DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime'))
      )`),
      this.asyncRun(`CREATE TABLE IF NOT EXISTS dh_goods (
        dh_goods_id INTEGER PRIMARY KEY AUTOINCREMENT,
        dh_goods_name TEXT NOT NULL UNIQUE,
        dh_goods_price INTEGER NOT NULL,
        dh_goods_sale_price INTEGER NOT NULL,
        dh_goods_category_id INTEGER NOT NULL,
        dh_goods_store INTEGER NOT NULL,
        dh_goods_state INTEGER NOT NULL,
        dh_goods_update_date TEXT DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime'))
      )`),
      this.asyncRun(`CREATE TABLE IF NOT EXISTS dh_incidents (
        dh_incident_id INTEGER PRIMARY KEY AUTOINCREMENT,
        dh_incident_order TEXT NOT NULL,
        dh_incident_action INTEGER NOT NULL,
        dh_incident_goods_id INTEGER NOT NULL,
        dh_incident_sale_num INTEGER NOT NULL,
        dh_incident_employee_id INTEGER NOT NULL,
        dh_incident_update_date TEXT DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime'))
      )`)
    ]);
  }
}

export default DB.getInstance;

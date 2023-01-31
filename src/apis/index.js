import { ipcMain } from 'electron';
import database from '@/database';

ipcMain.handle('api/login', async (_, { account, password } = {}) => {
  return database()
    .asyncGet(
      `SELECT dh_employee_name FROM dh_employees WHERE dh_employee_phone = ${account} & dh_employee_password = ${password}`
    )
    .then(res => {
      if (!res) {
        throw '账号或密码错误';
      }
      return {
        code: 0,
        data: {
          user_name: res.dh_employee_name
        }
      };
    })
    .catch(err => {
      return Promise.resolve({ code: -1, msg: err });
    });
});

ipcMain.handle('api/categories', async () => {
  return database()
    .asyncAll(`SELECT * FROM dh_categories`)
    .then(res => {
      return {
        code: 0,
        data: res
      };
    })
    .catch(err => {
      return Promise.resolve({ code: -1, msg: err });
    });
});

ipcMain.handle('api/category/create', async (_, { name, state } = {}) => {
  return database()
    .asyncAll(
      `INSERT INTO dh_categories (dh_category_name, dh_category_state) VALUES ('${name}', ${state})`
    )
    .then(() => {
      return {
        code: 0
      };
    })
    .catch(err => {
      return Promise.resolve({ code: -1, msg: err });
    });
});

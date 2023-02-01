import { ipcMain } from 'electron';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import database from '@/database';

ipcMain.handle('api/login', async (_, { account, password } = {}) => {
  return database()
    .asyncGet(
      `SELECT
        dh_employee_name FROM dh_employees
      WHERE
        dh_employee_phone='${account}' and dh_employee_password='${password}'`
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
    .then((res = []) => {
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
    .asyncRun(
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

ipcMain.handle('api/category/editor', async (_, { id, state } = {}) => {
  return database()
    .asyncRun(
      `UPDATE dh_categories SET
        dh_category_state=${state},
        dh_category_update_date='${dayjs().format('YYYY-MM-DD HH:mm:ss')}'
      WHERE
        dh_category_id=${id}`
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

ipcMain.handle('api/employees', async () => {
  return database()
    .asyncAll(
      `SELECT
        dh_employee_id, dh_employee_phone, dh_employee_name, dh_employee_sex,
        dh_employee_address, dh_employee_state, dh_employee_update_date
      FROM dh_employees`
    )
    .then((res = []) => {
      return {
        code: 0,
        data: res
      };
    })
    .catch(err => {
      return Promise.resolve({ code: -1, msg: err });
    });
});

ipcMain.handle('api/employee/editor', async (_, { id, state } = {}) => {
  return database()
    .asyncRun(
      `UPDATE dh_employees SET
        dh_employee_state=${state},
        dh_employee_update_date='${dayjs().format('YYYY-MM-DD HH:mm:ss')}'
      WHERE
        dh_employee_id=${id}`
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

ipcMain.handle(
  'api/employee/create',
  async (_, { phone, password, name, sex, address, state } = {}) => {
    return database()
      .asyncRun(
        `INSERT INTO dh_employees (
          dh_employee_phone,
          dh_employee_password,
          dh_employee_name,
          dh_employee_sex,
          dh_employee_address,
          dh_employee_state
        ) VALUES ('${phone}', '${password}', '${name}', ${sex}, '${address}', ${state})`
      )
      .then(() => {
        return {
          code: 0
        };
      })
      .catch(err => {
        return Promise.resolve({ code: -1, msg: err });
      });
  }
);

ipcMain.handle(
  'api/goods/editor',
  async (_, { name, price, salePrice, categoryId, store, state } = {}) => {
    const db = database();
    const { dh_goods_store = 0 } =
      (await db.asyncGet(
        `SELECT dh_goods_store FROM dh_goods WHERE dh_goods_name='${name}'`
      )) || {};
    return db
      .asyncRun(
        `REPLACE INTO dh_goods (
          dh_goods_name,
          dh_goods_price,
          dh_goods_sale_price,
          dh_goods_category_id,
          dh_goods_store,
          dh_goods_state
        ) VALUES ('${name}', '${price}', '${salePrice}', ${categoryId}, '${
          dh_goods_store + store
        }', ${state})`
      )
      .then(() => {
        return {
          code: 0
        };
      })
      .catch(err => {
        return Promise.resolve({ code: -1, msg: err });
      });
  }
);

ipcMain.handle('api/goods', async () => {
  return database()
    .asyncAll(`SELECT * FROM dh_goods`)
    .then((res = []) => {
      return {
        code: 0,
        data: res
      };
    })
    .catch(err => {
      return Promise.resolve({ code: -1, msg: err });
    });
});

ipcMain.handle('api/goods/state', async (_, { id, state } = {}) => {
  return database()
    .asyncRun(
      `UPDATE dh_goods SET
        dh_goods_state=${state},
        dh_goods_update_date='${dayjs().format('YYYY-MM-DD HH:mm:ss')}'
      WHERE
        dh_goods_id=${id}`
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

ipcMain.handle('api/goods/sale', async (_, list = []) => {
  const db = database();
  const orderId = uuid();
  return Promise.all([
    ...list.map(item => {
      return db.asyncRun(`
          UPDATE dh_goods SET
            dh_goods_store=${item.remain},
            dh_goods_update_date='${dayjs().format('YYYY-MM-DD HH:mm:ss')}'
          WHERE dh_goods_id=${item.id}`);
    }),
    ...list.map(item => {
      return db.asyncRun(`
          INSERT INTO dh_incidents (
            dh_incident_order,
            dh_incident_action,
            dh_incident_goods_id,
            dh_incident_sale_num,
            dh_incident_employee_id
          ) VALUES ('${orderId}', 0, ${item.id}, ${item.num}, 0)`);
    })
  ])
    .then(() => {
      return {
        code: 0
      };
    })
    .catch(err => {
      return Promise.resolve({ code: -1, msg: err });
    });
});

import { ipcMain } from 'electron';
import database from '@/database';

ipcMain.handle('api/login', async (_, { account, password } = {}) => {
  return database()
    .asyncGet(`SELECT * FROM dh_employees`)
    .then(res => {
      if (!res) {
        throw '账号或密码错误';
      }
      return {
        code: 0,
        msg: '登录成功'
      };
    })
    .catch(err => {
      return Promise.resolve({ code: -1, msg: err });
    });
});

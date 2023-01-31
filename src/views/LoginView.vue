<template>
  <div class="login-page">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="off"
      @finish="onSubmit"
    >
      <a-form-item
        label="账户"
        name="account"
        :rules="[{ required: true, message: '请输入手机号码' }]"
      >
        <a-input
          v-model:value="formState.account"
          placeholder="请输入手机号码"
        />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="请输入密码"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 8 }">
        <a-button class="submit-btn" type="primary" html-type="submit">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Input, Button, notification } from 'ant-design-vue';

export default defineComponent({
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Input.Password.name]: Input.Password,
    [Button.name]: Button
  },
  setup() {
    const router = useRouter();
    const formState = reactive({
      account: '18000000000',
      password: '000000'
    });

    return {
      formState,
      onSubmit({ account, password }) {
        window.ipcRenderer
          .invoke('api/login', { account, password })
          .then(({ code, msg } = {}) => {
            if (code !== 0) {
              throw msg;
            }
            router.push({
              name: 'employee'
            });
          })
          .catch(err => {
            notification.error({
              message: err
            });
          });
      }
    };
  }
});
</script>

<style lang="less">
.login-page {
  display: grid;
  height: 100vh;
  align-items: center;

  .submit-btn {
    width: 100%;
  }
}
</style>

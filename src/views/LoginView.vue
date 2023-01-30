<template>
  <div class="login-page">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onSubmit"
    >
      <a-form-item
        label="账号"
        name="account"
        :rules="[{ required: true, message: '请输入手机号码' }]"
      >
        <a-input v-model:value="formState.account" placeholder="手机号码" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="用户密码"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { Form, Input, Button } from 'ant-design-vue';

export default defineComponent({
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Input.Password.name]: Input.Password,
    [Button.name]: Button
  },
  setup() {
    const formState = reactive({
      account: '',
      password: ''
    });
    return {
      formState,
      onSubmit(...args) {
        console.log(args);
      }
    };
  }
});
</script>

<style lang="less" scoped>
.login-page {
  height: 100vh;
  display: grid;
  align-content: center;
  justify-content: center;
}
</style>

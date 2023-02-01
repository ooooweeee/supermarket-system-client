<template>
  <a-form
    class="add-employee-component"
    :model="formState"
    name="basic"
    :label-col="{ span: 6, offset: 4 }"
    :wrapper-col="{ span: 12 }"
    autocomplete="off"
    @finish="onSubmit"
  >
    <a-form-item :wrapper-col="{ offset: 10 }">
      <a-avatar :size="80">
        <template #icon><user-outlined /></template>
      </a-avatar>
    </a-form-item>
    <a-form-item
      label="昵称"
      name="name"
      :rules="[{ required: true, message: '请输入昵称' }]"
    >
      <a-input v-model:value="formState.name" placeholder="请输入昵称" />
    </a-form-item>
    <a-form-item
      label="联系方式"
      name="phone"
      :rules="[{ required: true, message: '请输入联系方式' }]"
    >
      <a-input v-model:value="formState.phone" placeholder="请输入联系方式" />
    </a-form-item>
    <a-form-item
      label="登录密码"
      name="password"
      :rules="[{ required: true, message: '请输入密码' }]"
    >
      <a-input-password
        v-model:value="formState.password"
        placeholder="请输入密码"
      />
    </a-form-item>
    <a-form-item label="选择性别" name="sex">
      <a-radio-group v-model:value="formState.sex">
        <a-radio :value="0">
          <man-outlined />
        </a-radio>
        <a-radio :value="1">
          <woman-outlined />
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="选择权限"
      :rules="[{ required: true, message: '请选择权限' }]"
      name="auth"
    >
      <a-checkbox-group v-model:value="formState.auth">
        <a-checkbox value="employee">人员管理</a-checkbox>
        <a-checkbox value="category">品类管理</a-checkbox>
        <a-checkbox value="goods">商品管理</a-checkbox>
        <a-checkbox value="stock">库存管理</a-checkbox>
        <a-checkbox value="order">订单管理</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="联系地址" name="address">
      <a-textarea
        v-model:value="formState.address"
        placeholder="请输入联系地址"
      />
    </a-form-item>
    <a-form-item label="员工状态" name="state">
      <a-switch
        v-model:checked="formState.state"
        checked-children="正常"
        un-checked-children="封禁"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 8, span: 8 }">
      <a-button class="submit-btn" type="primary" html-type="submit">
        创建
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import {
  Form,
  Input,
  Radio,
  Button,
  Avatar,
  Switch,
  notification,
  Checkbox
} from 'ant-design-vue';
import {
  UserOutlined,
  ManOutlined,
  WomanOutlined
} from '@ant-design/icons-vue';

export default defineComponent({
  emits: ['create-success'],
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Input.Password.name]: Input.Password,
    [Input.TextArea.name]: Input.TextArea,
    [Radio.name]: Radio,
    [Radio.Group.name]: Radio.Group,
    [Button.name]: Button,
    [Avatar.name]: Avatar,
    [Switch.name]: Switch,
    [Checkbox.Group.name]: Checkbox.Group,
    [Checkbox.name]: Checkbox,
    UserOutlined,
    ManOutlined,
    WomanOutlined
  },
  setup(_, { emit }) {
    const formState = reactive({
      name: '',
      phone: '',
      password: '',
      sex: 0,
      auth: [],
      address: '',
      state: true
    });

    return {
      formState,
      onSubmit({ phone, password, name, sex, auth, address, state }) {
        window.ipcRenderer
          .invoke('api/employee/create', {
            phone,
            password,
            name,
            sex,
            auth: auth.join(','),
            address,
            state: state ? 0 : 1
          })
          .then(({ code, msg } = {}) => {
            if (code !== 0) {
              throw msg;
            }
            notification.success({
              message: '增加成功'
            });
            emit('create-success');
          })
          .catch(() => {
            notification.error({
              message: '增加失败'
            });
          });
      }
    };
  }
});
</script>

<style lang="less">
.add-employee-component {
  .employee-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .submit-btn {
    width: 100%;
  }
}
</style>

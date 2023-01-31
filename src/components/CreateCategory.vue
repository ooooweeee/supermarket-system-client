<template>
  <a-form
    class="create-category-component"
    :model="formState"
    name="basic"
    :label-col="{ span: 4, offset: 4 }"
    :wrapper-col="{ span: 12 }"
    autocomplete="off"
    @finish="onSubmit"
  >
    <a-form-item :wrapper-col="{ offset: 8, span: 8 }">
      <a-image
        class="category-pic"
        :width="200"
        :height="115"
        src=""
        fallback="/fallback.png"
        :preview="false"
      />
    </a-form-item>
    <a-form-item
      label="品类名称"
      name="name"
      :rules="[{ required: true, message: '请输入品类名称' }]"
    >
      <a-input v-model:value="formState.name" placeholder="请输入品类名称" />
    </a-form-item>
    <a-form-item label="销售状态" name="state">
      <a-switch
        v-model:checked="formState.state"
        checked-children="正常"
        un-checked-children="禁售"
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
  Button,
  Image,
  Switch,
  notification
} from 'ant-design-vue';

export default defineComponent({
  emits: ['create-success'],
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [Button.name]: Button,
    [Image.name]: Image,
    [Switch.name]: Switch
  },
  setup(_, { emit }) {
    const formState = reactive({
      name: '',
      state: true
    });

    return {
      formState,
      onSubmit({ name, state }) {
        window.ipcRenderer
          .invoke('api/category/create', { name, state: state ? 1 : 0 })
          .then(({ code, msg } = {}) => {
            if (code !== 0) {
              throw msg;
            }
            notification.success({
              message: '创建成功'
            });
            emit('create-success');
          })
          .catch(() => {
            notification.error({
              message: '创建失败'
            });
          });
      }
    };
  }
});
</script>

<style lang="less">
.create-category-component {
  .category-pic {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .submit-btn {
    width: 100%;
  }
}
</style>

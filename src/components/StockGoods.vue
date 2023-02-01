<template>
  <a-form
    class="stock-goods-component"
    :model="formState"
    name="basic"
    :label-col="{ span: 6, offset: 4 }"
    :wrapper-col="{ span: 12 }"
    autocomplete="off"
    @finish="onSubmit"
  >
    <a-form-item :wrapper-col="{ offset: 8 }">
      <a-image
        class="goods-pic"
        :width="200"
        :height="115"
        src=""
        fallback="/fallback.png"
        :preview="false"
      />
    </a-form-item>
    <a-form-item
      label="商品名称"
      name="name"
      :rules="[{ required: true, message: '请输入商品名称' }]"
    >
      <a-input v-model:value="formState.name" placeholder="请输入商品名称" />
    </a-form-item>
    <a-form-item
      label="价格"
      name="price"
      :rules="[{ required: true, message: '请输入价格' }]"
    >
      <a-input-number v-model:value="formState.price" />
    </a-form-item>
    <a-form-item
      label="售价"
      name="salePrice"
      :rules="[{ required: true, message: '请输入售价' }]"
    >
      <a-input-number v-model:value="formState.salePrice" />
    </a-form-item>
    <a-form-item
      label="品类"
      name="categoryId"
      :rules="[{ required: true, message: '请选择商品品类' }]"
    >
      <a-select
        v-model:value="formState.categoryId"
        placeholder="请选择商品品类"
      >
        <a-select-option
          v-for="item in categories"
          :key="item.id"
          :value="item.id"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="数量"
      name="store"
      :rules="[{ required: true, message: '请输入数量' }]"
    >
      <a-input-number v-model:value="formState.store" />
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
import { defineComponent, reactive, ref, onMounted } from 'vue';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Image,
  Switch,
  Select,
  notification
} from 'ant-design-vue';

export default defineComponent({
  emits: ['create-success'],
  components: {
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Input.name]: Input,
    [InputNumber.name]: InputNumber,
    [Button.name]: Button,
    [Image.name]: Image,
    [Switch.name]: Switch,
    [Select.name]: Select,
    'a-select-option': Select.Option
  },
  setup(_, { emit }) {
    const categories = ref([]);
    const formState = reactive({
      name: '',
      price: 0,
      salePrice: 0,
      categoryId: null,
      store: 0,
      state: true
    });

    function getData() {
      window.ipcRenderer.invoke('api/categories').then(({ data } = {}) => {
        categories.value = data.map(item => {
          return {
            id: item.dh_category_id,
            name: item.dh_category_name,
            state: item.dh_category_state
          };
        });
      });
    }

    onMounted(() => {
      getData();
    });

    return {
      categories,
      formState,
      onSubmit({ name, price, salePrice, categoryId, store, state }) {
        window.ipcRenderer
          .invoke('api/goods/editor', {
            name,
            price,
            salePrice,
            categoryId,
            store,
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
.stock-goods-component {
  .goods-pic {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .submit-btn {
    width: 100%;
  }
}
</style>

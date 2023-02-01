<template>
  <a-page-header title="库存管理" sub-title="This is a subtitle">
    <template #extra>
      <a-button @click="visible = true" type="primary">进货</a-button>
    </template>
  </a-page-header>
  <a-layout-content class="stock-content">
    <a-table :dataSource="stocks" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'state'">
          <a-switch
            :checked="record.state"
            checked-children="正常"
            un-checked-children="禁售"
            @change="updateState(record.id, record.state ? 1 : 0)"
          />
        </template>
      </template>
    </a-table>
    <a-modal
      v-model:visible="visible"
      title="进货"
      :footer="null"
      :destroyOnClose="true"
    >
      <stock-goods @create-success="stockGoods()" />
    </a-modal>
  </a-layout-content>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import {
  PageHeader,
  Layout,
  Table,
  Switch,
  Button,
  Modal
} from 'ant-design-vue';
import StockGoods from '@/components/StockGoods.vue';

export default defineComponent({
  components: {
    [PageHeader.name]: PageHeader,
    [Layout.Content.name]: Layout.Content,
    [Table.name]: Table,
    [Switch.name]: Switch,
    [Button.name]: Button,
    [Modal.name]: Modal,
    StockGoods
  },
  setup() {
    const visible = ref(false);
    const stocks = ref([]);

    function getCategories() {
      return window.ipcRenderer
        .invoke('api/categories')
        .then(({ data } = {}) => {
          return data.map(item => {
            return {
              id: item.dh_category_id,
              name: item.dh_category_name,
              state: item.dh_category_state
            };
          });
        });
    }

    async function getData() {
      const categories = await getCategories();
      window.ipcRenderer.invoke('api/goods').then(({ data } = {}) => {
        stocks.value = data.map(item => {
          const { name: categoryName } =
            categories.find(i => i.id === item.dh_goods_category_id) || {};
          return {
            id: item.dh_goods_id,
            name: item.dh_goods_name,
            price: item.dh_goods_price,
            salePrice: item.dh_goods_sale_price,
            categoryName,
            store: item.dh_goods_store,
            state: item.dh_goods_state === 0
          };
        });
      });
    }

    onMounted(() => {
      getData();
    });

    return {
      visible,
      stocks,
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '价格',
          dataIndex: 'price',
          key: 'price'
        },
        {
          title: '售价',
          dataIndex: 'salePrice',
          key: 'salePrice'
        },
        {
          title: '品类',
          dataIndex: 'categoryName',
          key: 'categoryName'
        },
        {
          title: '库存',
          dataIndex: 'store',
          key: 'store'
        },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state'
        }
      ],
      updateState(id, state) {
        window.ipcRenderer.invoke('api/goods/state', { id, state }).then(() => {
          getData();
        });
      },
      stockGoods() {
        visible.value = false;
        getData();
      }
    };
  }
});
</script>

<style lang="less">
.stock-content {
  box-sizing: border-box;
  padding: 10px;
  overflow: overlay;
}
</style>

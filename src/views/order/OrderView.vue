<template>
  <a-page-header title="订单管理" sub-title="This is a subtitle" />
  <a-layout-content class="order-content">
    <a-table :dataSource="orders" :columns="columns" :pagination="false">
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
  </a-layout-content>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { PageHeader, Layout, Table, Button } from 'ant-design-vue';

export default defineComponent({
  components: {
    [PageHeader.name]: PageHeader,
    [Layout.Content.name]: Layout.Content,
    [Table.name]: Table,
    [Button.name]: Button
  },
  setup() {
    const orders = ref([]);

    function getData() {
      window.ipcRenderer.invoke('api/goods').then(({ data } = {}) => {});
    }

    onMounted(() => {
      getData();
    });

    return {
      orders,
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
      ]
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

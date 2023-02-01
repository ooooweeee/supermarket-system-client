<template>
  <a-page-header title="订单管理" sub-title="This is a subtitle" />
  <a-layout-content class="order-content">
    <a-table
      rowKey="orderId"
      :dataSource="orders"
      :columns="columns"
      :pagination="false"
    >
      <template #expandedRowRender="{ record }">
        <a-descriptions v-for="item in record.list" :key="item.id">
          <a-descriptions-item label="商品名称">{{
            item.goodsName
          }}</a-descriptions-item>
          <a-descriptions-item label="销量">{{
            item.saleNum
          }}</a-descriptions-item>
        </a-descriptions>
      </template>
    </a-table>
  </a-layout-content>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import {
  PageHeader,
  Layout,
  Table,
  Button,
  Descriptions
} from 'ant-design-vue';

export default defineComponent({
  components: {
    [PageHeader.name]: PageHeader,
    [Layout.Content.name]: Layout.Content,
    [Table.name]: Table,
    [Button.name]: Button,
    [Descriptions.name]: Descriptions,
    [Descriptions.Item.name]: Descriptions.Item
  },
  setup() {
    const orders = ref([]);

    function getData() {
      window.ipcRenderer.invoke('api/incidents').then(({ data } = {}) => {
        orders.value = data.reduce((result, current) => {
          const index = result.findIndex(
            item => item.orderId === current.dh_incident_order
          );
          if (index === -1) {
            result.push({
              orderId: current.dh_incident_order,
              employeeId: current.dh_incident_employee_id,
              employeeName: current.dh_employee_name,
              action: current.dh_incident_action,
              list: [
                {
                  id: current.dh_incident_id,
                  goodsId: current.dh_incident_goods_id,
                  goodsName: current.dh_goods_name,
                  saleNum: current.dh_incident_sale_num
                }
              ]
            });
          } else {
            const tmp = result[index];
            tmp.list.push({
              id: current.dh_incident_id,
              goodsId: current.dh_incident_goods_id,
              goodsName: current.dh_goods_name,
              saleNum: current.dh_incident_sale_num
            });
            result.splice(index, 1, tmp);
          }
          return result;
        }, []);
      });
    }

    onMounted(() => {
      getData();
    });

    return {
      orders,
      columns: [
        {
          title: '操作员',
          dataIndex: 'employeeName',
          key: 'employeeName'
        },
        {
          title: '类型',
          dataIndex: 'action',
          key: 'action'
        }
      ]
    };
  }
});
</script>

<style lang="less">
.order-content {
  box-sizing: border-box;
  padding: 10px;
  overflow: overlay;
}
</style>

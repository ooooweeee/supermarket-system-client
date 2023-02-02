<template>
  <a-page-header title="订单管理" sub-title="This is a subtitle" />
  <a-layout-content class="order-content">
    <a-table
      rowKey="orderId"
      :dataSource="orders"
      :columns="columns"
      :pagination="false"
      sticky
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          {{ record.action === 0 ? '销售' : '进货' }}
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <a-descriptions v-for="item in record.list" :key="item.goodsName">
          <a-descriptions-item label="商品名称">
            {{ item.goodsName }}
          </a-descriptions-item>
          <a-descriptions-item label="商品品类">
            {{ item.categoryName }}
          </a-descriptions-item>
          <a-descriptions-item :label="record.action === 0 ? '销量' : '数量'">
            {{ item.saleNum }}
          </a-descriptions-item>
          <a-descriptions-item :label="record.action === 0 ? '售价' : '单价'">
            {{ record.action === 0 ? item.salePrice : item.price }}
          </a-descriptions-item>
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
              totalPrice:
                current.dh_incident_action === 0
                  ? current.dh_incident_sale_num * current.dh_goods_sale_price
                  : current.dh_incident_sale_num * current.dh_goods_price,
              list: [
                {
                  id: current.dh_incident_id,
                  goodsName: current.dh_goods_name,
                  saleNum: current.dh_incident_sale_num,
                  categoryName: current.dh_category_name,
                  salePrice: current.dh_goods_sale_price,
                  price: current.dh_goods_price
                }
              ]
            });
          } else {
            const tmp = result[index];
            (tmp.totalPrice +=
              current.dh_incident_action === 0
                ? current.dh_incident_sale_num * current.dh_goods_sale_price
                : current.dh_incident_sale_num * current.dh_goods_price),
              tmp.list.push({
                id: current.dh_incident_id,
                goodsName: current.dh_goods_name,
                saleNum: current.dh_incident_sale_num,
                categoryName: current.dh_category_name,
                salePrice: current.dh_goods_sale_price,
                price: current.dh_goods_price
              });
            result.splice(index, 1, tmp);
          }
          return result;
        }, []);
        console.log(orders.value.length);
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
          title: '交易总价',
          dataIndex: 'totalPrice',
          key: 'totalPrice'
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
  margin-top: 10px;
  padding: 0 10px 10px;
  overflow: overlay;
}
</style>

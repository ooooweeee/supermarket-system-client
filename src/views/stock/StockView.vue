<template>
  <a-page-header title="库存管理" sub-title="This is a subtitle">
    <template #extra>
      <a-button @click="visible = true" type="primary">进货</a-button>
    </template>
  </a-page-header>
  <a-layout-content class="stock-content">
    <a-table :dataSource="stocks" :columns="columns" :pagination="false" />
    <a-modal
      v-model:visible="visible"
      title="进货"
      :footer="null"
      :destroyOnClose="true"
    >
      进货
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

export default defineComponent({
  components: {
    [PageHeader.name]: PageHeader,
    [Layout.Content.name]: Layout.Content,
    [Table.name]: Table,
    [Switch.name]: Switch,
    [Button.name]: Button,
    [Modal.name]: Modal
  },
  setup() {
    const visible = ref(false);
    const stocks = ref([]);

    function getData() {
      window.ipcRenderer
        .invoke('api/employees')
        .then(({ code, msg, data } = {}) => {
          if (code !== 0) {
            throw msg;
          }
          stocks.value = data.map(item => {
            return {
              id: item.dh_employee_id,
              name: item.dh_employee_name,
              phone: item.dh_employee_phone,
              sex: item.dh_employee_sex,
              address: item.dh_employee_address,
              state: item.dh_employee_state === 0
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
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          key: 'sex'
        },
        {
          title: '联系地址',
          dataIndex: 'address',
          key: 'address'
        },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state'
        }
      ],
      updateEmployee(id, state) {
        window.ipcRenderer
          .invoke('api/employee/editor', { id, state })
          .then(({ code, msg } = {}) => {
            if (code !== 0) {
              throw msg;
            }
            getData();
          });
      },
      addEmployee() {
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

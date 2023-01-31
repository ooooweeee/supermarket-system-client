<template>
  <a-page-header
    title="人员管理"
    sub-title="This is a subtitle"
  ></a-page-header>
  <a-layout-content class="employee-content">
    <a-table :dataSource="employees" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'sex'">
          <man-outlined v-if="record.sex === 1" />
          <woman-outlined v-else-if="record.sex === 2" />
          <span v-else>popp</span>
        </template>
        <template v-if="column.key === 'state'">
          <a-switch
            :checked="record.state"
            checked-children="正常"
            un-checked-children="封存"
            @change="updateEmployee(record.phone, record.state ? 1 : 0)"
          />
        </template>
      </template>
    </a-table>
  </a-layout-content>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { PageHeader, Layout, Table, Switch } from 'ant-design-vue';
import { ManOutlined, WomanOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    [PageHeader.name]: PageHeader,
    [Layout.Content.name]: Layout.Content,
    [Table.name]: Table,
    ManOutlined,
    WomanOutlined,
    [Switch.name]: Switch
  },
  setup() {
    const employees = ref([]);

    function getData() {
      window.ipcRenderer
        .invoke('api/employees')
        .then(({ code, msg, data } = {}) => {
          if (code !== 0) {
            throw msg;
          }
          console.log(data);
          employees.value = data.map(item => {
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
      employees,
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
      updateEmployee(phone, state) {
        window.ipcRenderer
          .invoke('api/employee/editor', { phone, state })
          .then(({ code, msg } = {}) => {
            if (code !== 0) {
              throw msg;
            }
            getData();
          });
      }
    };
  }
});
</script>

<style lang="less">
.employee-content {
  box-sizing: border-box;
  padding: 10px;
  overflow: overlay;
}
</style>

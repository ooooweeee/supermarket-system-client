<template>
  <a-page-header title="人员管理" sub-title="This is a subtitle">
    <template #extra>
      <a-button @click="visible = true" type="primary">新增</a-button>
    </template>
  </a-page-header>
  <a-layout-content class="employee-content">
    <a-table
      rowKey="phone"
      :dataSource="employees"
      :columns="columns"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'sex'">
          <man-outlined v-if="record.sex === 0" />
          <woman-outlined v-else />
        </template>
        <template v-if="column.key === 'state'">
          <a-switch
            :checked="record.state"
            checked-children="正常"
            un-checked-children="封存"
            @change="updateEmployee(record.id, record.state ? 1 : 0)"
          />
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        权限列表：
        <a-tag v-for="item in record.auth" :key="item">
          {{ item }}
        </a-tag>
      </template>
    </a-table>
    <a-modal
      v-model:visible="visible"
      title="添加新员工"
      :footer="null"
      :destroyOnClose="true"
    >
      <add-employee @create-success="addEmployee()" />
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
  Modal,
  Tag
} from 'ant-design-vue';
import { ManOutlined, WomanOutlined } from '@ant-design/icons-vue';
import AddEmployee from '@/components/AddEmployee.vue';

export default defineComponent({
  components: {
    [PageHeader.name]: PageHeader,
    [Layout.Content.name]: Layout.Content,
    [Table.name]: Table,
    ManOutlined,
    WomanOutlined,
    [Switch.name]: Switch,
    [Button.name]: Button,
    [Modal.name]: Modal,
    [Tag.name]: Tag,
    AddEmployee
  },
  setup() {
    const visible = ref(false);
    const employees = ref([]);

    function getData() {
      window.ipcRenderer.invoke('api/employees').then(({ data } = {}) => {
        employees.value = data.map(item => {
          return {
            id: item.dh_employee_id,
            name: item.dh_employee_name,
            phone: item.dh_employee_phone,
            sex: item.dh_employee_sex,
            auth: item.dh_employee_auth.split(','),
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
          title: '权限',
          dataIndex: 'auth',
          key: 'auth'
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
          .then(() => {
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
.employee-content {
  box-sizing: border-box;
  padding: 10px;
  overflow: overlay;
}
</style>

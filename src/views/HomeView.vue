<template>
  <a-layout class="home-page">
    <a-layout-sider>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <div class="home-logo">
          <alibaba-outlined />
        </div>
        <router-link :to="{ name: 'employee' }" custom v-slot="{ navigate }">
          <a-menu-item :disabled="false" @click="navigate" key="employee">
            <team-outlined />
            <span>人员管理</span>
          </a-menu-item>
        </router-link>
        <router-link :to="{ name: 'category' }" custom v-slot="{ navigate }">
          <a-menu-item @click="navigate" key="category">
            <tags-outlined />
            <span>品类管理</span>
          </a-menu-item>
        </router-link>
        <router-link :to="{ name: 'goods' }" custom v-slot="{ navigate }">
          <a-menu-item @click="navigate" key="goods">
            <shopping-outlined />
            <span>商品管理</span>
          </a-menu-item>
        </router-link>
        <router-link :to="{ name: 'stock' }" custom v-slot="{ navigate }">
          <a-menu-item @click="navigate" key="stock">
            <gold-outlined />
            <span>库存管理</span>
          </a-menu-item>
        </router-link>
        <router-link :to="{ name: 'order' }" custom v-slot="{ navigate }">
          <a-menu-item @click="navigate" key="order">
            <gold-outlined />
            <span>订单管理</span>
          </a-menu-item>
        </router-link>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <router-view></router-view>
    </a-layout>
  </a-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { Layout, Menu } from 'ant-design-vue';
import {
  AlibabaOutlined,
  TeamOutlined,
  GoldOutlined,
  TagsOutlined,
  ShoppingOutlined
} from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    [Layout.name]: Layout,
    [Layout.Sider.name]: Layout.Sider,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    AlibabaOutlined,
    TeamOutlined,
    GoldOutlined,
    TagsOutlined,
    ShoppingOutlined,
    RouterLink,
    RouterView
  },
  setup() {
    return {
      selectedKeys: ref(['employee'])
    };
  }
});
</script>

<style lang="less">
.home-page {
  height: 100vh;
  .home-logo {
    font-size: 58px;
    line-height: 68px;
    text-align: center;
  }
}
</style>

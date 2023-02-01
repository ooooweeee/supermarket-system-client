import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import CategoryView from '@/views/category/CategoryView.vue';
import EmployeeView from '@/views/employee/EmployeeView.vue';
import GoodsView from '@/views/goods/GoodsView.vue';
import StockView from '@/views/stock/StockView.vue';
import OrderView from '@/views/order/OrderView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'category',
          component: CategoryView
        },
        {
          path: 'employee',
          name: 'employee',
          component: EmployeeView
        },
        {
          path: 'goods',
          name: 'goods',
          component: GoodsView
        },
        {
          path: 'stock',
          name: 'stock',
          component: StockView
        },
        {
          path: 'order',
          name: 'order',
          component: OrderView
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
});

export default router;

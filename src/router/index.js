import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import DashboradView from '@/views/DashboradView.vue';
import GoodsView from '@/views/GoodsView.vue';
import CategoryView from '@/views/CategoryView.vue';
import EmployeeView from '@/views/EmployeeView.vue';

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
          name: 'dashborad',
          component: DashboradView
        },
        {
          path: 'goods',
          name: 'goods',
          component: GoodsView
        },
        {
          path: 'category',
          name: 'category',
          component: CategoryView
        },
        {
          path: 'employee',
          name: 'employee',
          component: EmployeeView
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

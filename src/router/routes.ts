import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'main',
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'main',
      },
      {
        path: '/products',
        component: () => import('pages/Product/ProductsPage.vue'),
        name: 'products',
      },
      {
        path: '/product/create',
        component: () => import('pages/Product/ProductCreatePage.vue'),
        name: 'productCreate',
      },
      {
        path: '/daily-meal',
        component: () => import('pages/DailyMeal/DailyMealPage.vue'),
        name: 'dailyMeal',
      },
      {
        path: '/profile',
        component: () => import('pages/Profile/ProfilePage.vue'),
        name: 'profile',
      },
      {
        path: '/statistics',
        component: () => import('pages/Statistics/StatisticsPage.vue'),
        name: 'statistics',
      },
    ],
  },
  {
    name: 'regiser',
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Auth/RegisterPage.vue'),
        name: 'register',
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Auth/LoginPage.vue'),
        name: 'login',
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

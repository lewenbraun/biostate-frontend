import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  Router,
} from 'vue-router';
import routes from './routes';
import { useUserStore } from '../stores/userStore';

export default route(function (): Router {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    if (to.meta.requiresAuth && !userStore.user.token) {
      next({ name: 'login' });
    } else if (userStore.user.token && to.name === 'main') {
      next({ name: 'dailyMeal' });
    } else {
      next();
    }
  });

  return router;
});

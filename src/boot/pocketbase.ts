import { boot } from 'quasar/wrappers';
import PocketBase from 'pocketbase';
import { useAuth } from 'src/features/auth/authStore';

const pb = new PocketBase(process.env.PB_URL || 'http://localhost:8090');

export default boot(async ({ router, store }) => {
  const pinia = store;
  const authStore = useAuth(pinia);

  await new Promise<void>((resolve) => {
    pb.authStore.onChange(() => {
      authStore.authModel = pb.authStore.record;
      if (pb.authStore.isValid) {
        void authStore.getUser();
      }
      resolve();
    }, true);
  });

  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      if (!pb.authStore.isValid) {
        next('/');
      } else {
        next();
      }
    } else {
      next();
    }
  });
});

export { pb };


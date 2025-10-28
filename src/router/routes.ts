import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/features/main/IndexPage.vue'), meta: { requiresAuth: false } },
      {
        path: 'glomt-losenord', component: () => import('src/features/auth/ForgotPasswordPage.vue'),
      },
      {
        path: 'register',
        component: () => import('src/features/auth/RegisterPage.vue'),
      },
      { name: 'search', path: '/sok-uppdrag', component: () => import('src/features/main/SearchJobsPage.vue'), meta: { requiresAuth: false } },
      { path: '/uppdrag/:id', component: () => import('src/features/jobs/JobDetailsPage.vue'), meta: { requiresAuth: false } },
      { path: '/kontakta-oss', component: () => import('pages/ContactUsPage.vue'), meta: { requiresAuth: false } },
      { path: '/annonsera', component: () => import('pages/AdvertisePage.vue'), meta: { requiresAuth: false } },
      { path: '/hur-det-funkar', component: () => import('pages/HowItWorksPage.vue'), meta: { requiresAuth: false } },
      { path: '/om-oss', component: () => import('pages/AboutUsPage.vue'), meta: { requiresAuth: false } },
      { path: '/anvandarvillkor', component: () => import('pages/PrivacyPolicyPage.vue'), meta: { requiresAuth: false } },
      { path: '/grupper', name: 'Grupper', component: () => import('src/features/groups/GroupsListPage.vue'), props: true, meta: { requiresAuth: false } },
      { path: '/grupp/:id', component: () => import('src/features/groups/GroupDetailsPage.vue'), meta: { requiresAuth: false } },
      { path: '/t-shirt', component: () => import('pages/ShopPage.vue'), meta: { requiresAuth: false } },
      { path: '/skapade-uppdrag', component: () => import('src/features/jobs/CreatedJobsListPage.vue'), meta: { requiresAuth: true } },
      { path: '/skapade-uppdrag/:id', component: () => import('src/features/jobs/CreatedJobDetailsPage.vue'), meta: { requiresAuth: true } },
      { path: '/mina-uppdrag', component: () => import('src/features/jobs/MyJobsListPage.vue'), meta: { requiresAuth: true } },
      { path: '/mina-uppdrag/:id', component: () => import('src/features/jobs/MyJobDetailsPage.vue'), meta: { requiresAuth: true } },
      { path: '/mina-grupper', component: () => import('src/features/groups/MyGroupsListPage.vue'), meta: { requiresAuth: true } },
      { path: '/mina-grupper/:id', component: () => import('src/features/groups/MyGroupDetailsPage.vue'), meta: { requiresAuth: true } },
      { path: '/installningar', component: () => import('src/features/settings/SettingsPage.vue'), meta: { requiresAuth: true } },
      { path: '/skapa-uppdrag', component: () => import('src/features/jobs/CreateJobPage.vue'), meta: { requiresAuth: true } },
      { path: '/skapa-grupp', component: () => import('src/features/groups/CreateGroupPage.vue'), meta: { requiresAuth: true } },
      { path: '/redigera-uppdrag/:id', component: () => import('src/features/jobs/CreateJobPage.vue'), meta: { requiresAuth: true } },
      { path: '/redigera-grupp/:id', component: () => import('src/features/groups/CreateGroupPage.vue'), meta: { requiresAuth: true } },
      { path: '/leaflet-map-test', component: () => import('src/components/LeafletMapTest.vue'), meta: { requiresAuth: false } },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

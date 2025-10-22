import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: false } },
      {
        path: 'glomt-losenord',
        component: () => import('src/features/auth/ForgotPasswordPage.vue'),
      },
      {
        path: 'register',
        component: () => import('src/features/auth/RegisterPage.vue'),
      },
      { name: 'search', path: '/sok-uppdrag', component: () => import('pages/SearchUppdragPage.vue'), meta: { requiresAuth: false } },
      { path: '/uppdrags-info/:id', component: () => import('src/features/jobs/Job2DetailsPage.vue'), meta: { requiresAuth: false } },
      { path: '/kontakta-oss', component: () => import('pages/ContactUsPage.vue'), meta: { requiresAuth: false } },
      { path: '/annonsera', component: () => import('pages/AdvertisePage.vue'), meta: { requiresAuth: false } },
      { path: '/hur-det-funkar', component: () => import('pages/HowItWorksPage.vue'), meta: { requiresAuth: false } },
      { path: '/om-oss', component: () => import('pages/AboutUsPage.vue'), meta: { requiresAuth: false } },
      { path: '/anvandarvillkor', component: () => import('pages/PrivacyPolicyPage.vue'), meta: { requiresAuth: false } },
      { path: '/alla-lag', name: 'AllaLag', component: () => import('src/features/groups/GroupsListPage.vue'), props: true, meta: { requiresAuth: false } },
      { path: '/grupp/:id', component: () => import('src/features/groups/GroupDetailsPage.vue'), meta: { requiresAuth: false } },
      { path: '/t-shirt', component: () => import('pages/ShopPage.vue'), meta: { requiresAuth: false } },
      { path: '/skapade-uppdrag', component: () => import('src/features/jobs/MyJobsListPage.vue'), meta: { requiresAuth: true } },
      { path: '/jobb-uppdrag', component: () => import('src/features/jobs/JobsListPage.vue'), meta: { requiresAuth: true } },
      { path: '/jobb-uppdrag/:id', name: 'JobbUppdrag', component: () => import('src/features/jobs/Job2DetailsPage.vue'), meta: { requiresAuth: true }, props: true },
      { path: '/mina-uppdrag/:id', component: () => import('src/features/jobs/MyJobDetailsPage.vue'), meta: { requiresAuth: true } },
      { path: '/sparade-uppdrag', component: () => import('src/features/jobs/SavedJobsPage.vue'), meta: { requiresAuth: true } },
      { path: '/mina-grupper-lista', component: () => import('src/features/groups/MyGroupsListPage.vue'), meta: { requiresAuth: true } },
      { path: '/mina-grupper/:id', component: () => import('src/features/groups/MyGroupDetailsPage.vue'), meta: { requiresAuth: true } },
      { path: '/installningar', component: () => import('pages/SettingsPage.vue'), meta: { requiresAuth: true } },
      { path: '/skapa-uppdrag', component: () => import('src/features/jobs/CreateJobPage.vue'), meta: { requiresAuth: true } },
      { path: '/skapa-grupp', component: () => import('src/features/groups/CreateNewGroupPage.vue'), meta: { requiresAuth: true } },
      { path: '/redigera-uppdrag/:id', component: () => import('src/features/jobs/EditJobPage.vue'), meta: { requiresAuth: true } },
      { path: '/redigera-grupp/:id', component: () => import('src/features/groups/EditGroupPage.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

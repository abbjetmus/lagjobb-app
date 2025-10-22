<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-blue-5 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <router-link to="/" class="text-white row items-center no-wrap" style="text-decoration: none; gap: 8px;">
            <q-avatar size="32px">
              <img src="../assets/team.svg" />
            </q-avatar>
            <span>LagJobb</span>
          </router-link>
        </q-toolbar-title>

        <div class="row q-gutter-sm items-center">
          <q-btn flat label="Skapa uppdrag" icon="add_circle" @click="goToNewUppdrag()" class="gt-sm" />

          <q-btn flat icon="add_circle" @click="goToNewUppdrag()" class="lt-md" />

          <q-btn flat icon="search" to="/sok-uppdrag" />

          <toolbar-user-menu v-if="isAuthenticated && currentUser" :user="currentUser" />

          <q-btn v-else flat @click="showSignInSignUpDialog()">
            <span class="gt-xs">Logga in / Skapa konto</span>
            <span class="lt-sm">Logga in</span>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-blue-5 text-white">
      <div class="q-pa-md">
        <footer-component />
      </div>
    </q-footer>

    <SignInSignUpDialog v-model="signInSignUpDialog" :is-sign-in="toReturnAfterCancel === 'create'"
      :name="currentUser?.name" to-return-after-cancel="toReturnAfterCancel" @return-after-cancel="afterDialogCancel" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'src/stores/auth';
import ToolbarUserMenu from 'src/components/ToolbarUserMenuComponent.vue';
import FooterComponent from 'src/components/FooterComponent.vue';
import SignInSignUpDialog from 'src/features/auth/components/SignInSignUpDialog.vue';
import { useJobs } from 'src/features/jobs/jobsStore';
const router = useRouter();
const authStore = useAuth();
const jobsStore = useJobs();

const signInSignUpDialog = ref(false);
const toReturnAfterCancel = ref('');

const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => authStore.currentUser);

const showSignInSignUpDialog = () => {
  signInSignUpDialog.value = true;
};

const goToNewUppdrag = () => {
  if (isAuthenticated.value) {
    router.push('/skapa-uppdrag').catch(() => { });
  } else {
    toReturnAfterCancel.value = 'create';
    signInSignUpDialog.value = true;
  }
};

const afterDialogCancel = (value: string) => {
  if (value === 'create') {
    toReturnAfterCancel.value = '';
    if (isAuthenticated.value) {
      router.push('/skapa-uppdrag').catch(() => { });
    }
  }
};

onMounted(async () => {
  await Promise.all([
    jobsStore.getAllJobs(),
    jobsStore.getAllJobCategories(),
    jobsStore.getAllCounties(),
  ]);
});
</script>

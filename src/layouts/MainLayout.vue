<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-secondary" style="border-bottom: 2px solid var(--q-primary)">
      <q-toolbar class="row justify-around">
        <q-toolbar-title class="col-auto">
          <router-link to="/" class="text-primary row items-center no-wrap" style="text-decoration: none; gap: 8px;">

            <span>Lag <q-avatar size="32px">
                <img src="../assets/team.svg" />
              </q-avatar> Jobb</span>
          </router-link>
        </q-toolbar-title>

        <div class="col-auto row q-gutter-lg items-center">
          <q-btn v-if="!isUppdragsutforare" unelevated label="Skapa uppdrag" icon="add_circle" @click="goToNewUppdrag()"
            class="gt-sm" color="primary" />

          <q-btn v-if="!isUppdragsutforare" flat color="primary" icon="add_circle" @click="goToNewUppdrag()"
            class="lt-md" />

          <q-btn flat color="primary" stack icon="search" label="Sök" to="/sok-uppdrag" />

          <toolbar-user-menu color="primary" v-if="isAuthenticated && currentUser" />

          <q-btn v-else outline @click="showSignInSignUpDialog()" color="primary">
            <span class="gt-xs">Logga in / Skapa konto</span>
            <span class="lt-sm">Logga in</span>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import ToolbarUserMenu from 'src/components/ToolbarUserMenuComponent.vue';
import SignInSignUpDialog from 'src/features/auth/components/SignInSignUpDialog.vue';
import { useJobs } from 'src/features/jobs/jobsStore';
import { UsersUserAccountTypeOptions } from 'app/pocketbase-types';

const router = useRouter();
const authStore = useAuth();
const jobsStore = useJobs();
const $q = useQuasar();

const toReturnAfterCancel = ref('');

const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => authStore.currentUser);
const isUppdragsutforare = computed(() => currentUser.value?.userAccountType === UsersUserAccountTypeOptions.Uppdragsutförare);
const showSignInSignUpDialog = () => {
  $q.dialog({
    component: SignInSignUpDialog,
    persistent: true,
  }).onOk(() => {
    // Handle successful login
    console.log('User logged in successfully');
  });
};

const goToNewUppdrag = () => {
  if (isAuthenticated.value) {
    router.push('/skapa-uppdrag').catch(() => { });
  } else {
    toReturnAfterCancel.value = 'create';
    showSignInSignUpDialog();
  }
};

onMounted(async () => {
  await Promise.all([
    jobsStore.getAllJobCategories(),
    jobsStore.getAllCounties(),
  ]);
});
</script>

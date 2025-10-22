<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-primary text-white">
      <q-toolbar class="row justify-around">
        <q-toolbar-title class="col-auto">
          <router-link to="/" class="text-secondary row items-center no-wrap" style="text-decoration: none; gap: 8px;">

            <span>Lag <q-avatar size="32px">
                <img src="../assets/team.svg" />
              </q-avatar> Jobb</span>
          </router-link>
        </q-toolbar-title>

        <div class="col-auto row q-gutter-lg items-center">
          <q-btn unelevated label="Skapa uppdrag" icon="add_circle" @click="goToNewUppdrag()" class="gt-sm"
            color="secondary" />

          <q-btn flat color="secondary" icon="add_circle" @click="goToNewUppdrag()" class="lt-md" />

          <q-btn flat color="secondary" stack icon="search" label="Sök" to="/sok-uppdrag" />

          <toolbar-user-menu color="secondary" v-if="isAuthenticated && currentUser" :user="currentUser" />

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

    <q-footer class="bg-primary text-white">
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

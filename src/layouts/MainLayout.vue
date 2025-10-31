<template>
  <q-layout view="hHh lpR fff">
    <q-header :dark="$q.dark.isActive" class="bg-secondary" style="border-bottom: 2px solid var(--q-primary)">
      <q-toolbar :dark="$q.dark.isActive" class="row" :class="$q.screen.lt.md ? 'justify-between' : 'justify-around'">
        <q-toolbar-title class="col-auto">
          <router-link to="/" class="text-primary row items-center no-wrap" style="text-decoration: none; gap: 8px;">
            <span>Lag <q-avatar size="32px">
                <img src="../assets/team.svg" />
              </q-avatar> Jobb</span>
          </router-link>
        </q-toolbar-title>

        <div class="col-auto row q-gutter-lg items-center gt-md">
          <q-btn v-if="!isUppdragsutforare" unelevated label="Skapa uppdrag" icon="add_circle" @click="goToNewUppdrag()"
            color="primary" />

          <q-btn flat color="primary" stack icon="search" label="Sök" to="/sok-uppdrag" />

          <q-toggle v-model="darkMode" @update:model-value="toggleDarkMode"
            :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'" size="md" class="text-primary"
            :label="$q.dark.isActive ? 'Mörkt läge' : 'Ljust läge'">
            <q-tooltip>{{ $q.dark.isActive ? 'Växla till ljust läge' : 'Växla till mörkt läge' }}</q-tooltip>
          </q-toggle>

          <toolbar-user-menu color="primary" v-if="isAuthenticated && currentUser" />

          <q-btn v-else outline @click="showSignInSignUpDialog()" color="primary">
            <span>Logga in / Skapa konto</span>
          </q-btn>
        </div>

        <q-btn flat color="primary" icon="menu" @click="drawerOpen = !drawerOpen" class="lt-md" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" side="right" overlay class="lt-md" :dark="$q.dark.isActive">
      <q-list>
        <q-item-label header class="text-primary">Meny</q-item-label>

        <q-item v-if="!isUppdragsutforare" clickable @click="goToNewUppdrag(); drawerOpen = false">
          <q-item-section avatar>
            <q-icon name="add_circle" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Skapa uppdrag</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="/sok-uppdrag" @click="drawerOpen = false">
          <q-item-section avatar>
            <q-icon name="search" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sök</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable @click="toggleDarkMode(!darkMode)">
          <q-item-section avatar>
            <q-icon :name="$q.dark.isActive ? 'dark_mode' : 'light_mode'" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $q.dark.isActive ? 'Ljust läge' : 'Mörkt läge' }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item v-if="isAuthenticated && currentUser" clickable @click="drawerOpen = false">
          <q-item-section>
            <toolbar-user-menu color="primary" />
          </q-item-section>
        </q-item>

        <q-item v-else clickable @click="showSignInSignUpDialog(); drawerOpen = false">
          <q-item-section avatar>
            <q-icon name="login" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logga in / Skapa konto</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'src/features/auth/authStore';
import { useQuasar } from 'quasar';
import ToolbarUserMenu from 'src/components/ToolbarUserMenuComponent.vue';
import SignInSignUpDialog from 'src/features/auth/components/SignInSignUpDialog.vue';
import { useJobs } from 'src/features/jobs/jobsStore';
import { UsersUserAccountTypeOptions } from 'app/pocketbase-types';

const router = useRouter();
const authStore = useAuth();
const jobsStore = useJobs();
const $q = useQuasar();

const darkMode = ref($q.dark.isActive);

const toggleDarkMode = (val: boolean) => {
  $q.dark.set(val);
  darkMode.value = val;
  localStorage.setItem('darkMode', String(val));
};

watch(() => $q.dark.isActive, (val) => {
  darkMode.value = val;
});

const toReturnAfterCancel = ref('');
const drawerOpen = ref(false);

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
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    $q.dark.set(savedDarkMode === 'true');
    darkMode.value = savedDarkMode === 'true';
  }

  await Promise.all([
    jobsStore.getAllJobCategories(),
    jobsStore.getAllCounties(),
  ]);
});
</script>

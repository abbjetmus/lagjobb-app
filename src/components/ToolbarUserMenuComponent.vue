<template>
  <q-btn-dropdown outline color="secondary" :label="user.name || 'Meny'">
    <q-list>
      <q-item clickable v-close-popup @click="goToMyGroups">
        <q-item-section>
          <q-item-label>Mina grupper</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="goToMyUppdrag">
        <q-item-section>
          <q-item-label>Mina uppdrag</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="goToJobbUppdrag">
        <q-item-section>
          <q-item-label>Jobb uppdrag</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="goToSettings">
        <q-item-section>
          <q-item-label>Inställningar</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable v-close-popup @click="logout">
        <q-item-section>
          <q-item-label>Logga ut</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from 'src/stores/auth';
import type { User } from 'src/models/User';

defineProps<{
  user: User;
}>();

const router = useRouter();
const authStore = useAuth();

const goToMyGroups = () => {
  router.push('/mina-grupper-lista');
};

const goToMyUppdrag = () => {
  router.push('/skapade-uppdrag');
};

const goToJobbUppdrag = () => {
  router.push('/jobb-uppdrag');
};

const goToSettings = () => {
  router.push('/installningar');
};

const logout = async () => {
  await authStore.signOut();
  router.push('/');
};
</script>

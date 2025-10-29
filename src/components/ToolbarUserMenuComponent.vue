<template>
  <q-btn-dropdown outline color="primary" :label="currentUser?.name || 'Meny'">
    <q-list>
      <q-item v-if="currentUser?.userAccountType === UsersUserAccountTypeOptions.Uppdragsutförare" clickable
        v-close-popup @click="goToMyGroups">
        <q-item-section>
          <q-item-label>Mina grupper</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="currentUser?.userAccountType === UsersUserAccountTypeOptions.Uppdragsutförare" clickable
        v-close-popup @click="goToMyJobs">
        <q-item-section>
          <q-item-label>Mina uppdrag</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="currentUser?.userAccountType === UsersUserAccountTypeOptions.Uppdragsgivare" clickable v-close-popup
        @click="goToCreatedJobs">
        <q-item-section>
          <q-item-label>Skapade uppdrag</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="goToSettings">
        <q-item-section>
          <q-item-label>Inställningar</q-item-label>
        </q-item-section>
      </q-item>

      <!-- <q-item clickable v-close-popup @click="goToLeafletMapTest">
        <q-item-section>
          <q-item-label>Leaflet Map Test</q-item-label>
        </q-item-section>
      </q-item> -->

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
import { UsersUserAccountTypeOptions } from 'app/pocketbase-types';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const router = useRouter();
const authStore = useAuth();

const { currentUser } = storeToRefs(authStore);

const goToMyGroups = async () => {
  await router.push('/mina-grupper');
};

const goToMyJobs = async () => {
  await router.push('/mina-uppdrag');
};

const goToCreatedJobs = async () => {
  await router.push('/skapade-uppdrag');
};

const goToSettings = async () => {
  await router.push('/installningar');
};

// const goToLeafletMapTest = async () => {
//   await router.push('/leaflet-map-test');
// };

const logout = async () => {
  authStore.signOut();
  await router.push('/');
};

onMounted(() => {
  console.log('🔵 [ToolbarUserMenuComponent] currentUser:', currentUser.value);
  console.log('🔵 [ToolbarUserMenuComponent] currentUser.userAccountType:', currentUser.value?.userAccountType);
});
</script>

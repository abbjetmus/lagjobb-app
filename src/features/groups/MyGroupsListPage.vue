<template>
  <q-page class="full-height page-background-pattern" style="display: flex; flex-direction: column;">
    <div v-if="!$q.platform.is.mobile" class="row items-center q-pa-sm bg-primary">
      <q-btn unelevated color="secondary" text-color="primary" icon="add" label="Skapa grupp" to="/skapa-grupp" />
      <q-space />
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="myGroups.length === 0" class="flex flex-center" style="flex: 1;">
      <div class="text-center q-gutter-md">
        <div class="text-h6">
          Du har inga grupper
        </div>
        <div>
          <q-btn to="/skapa-grupp" unelevated rounded size="lg" no-caps style="font-size: 1rem; width: 240px"
            color="primary">Skapa grupp</q-btn>
          <div v-if="$q.platform.is.mobile" class="q-mt-md">Eller använd knappen <q-badge rounded
              color="primary">+</q-badge> nedan för att
            skapa grupper.</div>
        </div>
      </div>
    </div>

    <q-list v-else class="q-ma-md">
      <group-list-item v-for="group in myGroups" :key="group.id" :group="group" :show-status="true"
        :to="`/mina-grupper/${group.id}`" />
    </q-list>

    <q-page-sticky v-if="$q.platform.is.mobile" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="primary" to="/skapa-grupp" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useGroups } from 'src/features/groups/groupsStore';
import { storeToRefs } from 'pinia';
import GroupListItem from './components/GroupListItem.vue';

const groupsStore = useGroups();
const $q = useQuasar();

const { myGroups } = storeToRefs(groupsStore);
const loading = ref(true);

onMounted(async () => {
  try {
    await groupsStore.getMyGroups();
  } catch (error) {
    console.error('Load my groups error:', error);
  } finally {
    loading.value = false;
  }
});
</script>

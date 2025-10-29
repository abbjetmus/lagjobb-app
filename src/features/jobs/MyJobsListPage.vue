<template>
  <q-page class="full-height page-background-pattern" style="display: flex; flex-direction: column;">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="myJobs.length === 0" class="flex flex-center" style="flex: 1;">
      <div class="text-center q-gutter-md">
        <div class="text-h6">
          Du har inga uppdrag
        </div>
        <div>
          <q-btn to="/sok-uppdrag" unelevated rounded size="lg" no-caps style="font-size: 1rem; width: 240px"
            color="primary">Sök uppdrag</q-btn>
        </div>
      </div>
    </div>

    <q-list v-else class="q-ma-md">
      <job-list-item v-for="item in myJobs" :key="item.id" :job="item as any" :to="`/mina-uppdrag/${item.id}`" />
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useJobs } from 'src/features/jobs/jobsStore';
import { storeToRefs } from 'pinia';
import JobListItem from './components/JobListItem.vue';

const jobsStore = useJobs();
const $q = useQuasar();

const { myJobs } = storeToRefs(jobsStore);
const loading = ref(true);

onMounted(async () => {
  try {
    await jobsStore.getMyJobs();
  } catch (error) {
    console.error('Load my jobs error:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <q-page class="full-height page-background-pattern" style="display: flex; flex-direction: column;">
    <div v-if="!$q.platform.is.mobile" class="row items-center q-pa-sm bg-primary">
      <q-btn unelevated color="secondary" text-color="primary" icon="add" label="Skapa uppdrag" to="/skapa-uppdrag" />
      <q-space />
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="createdJobs.length === 0" class="flex flex-center" style="flex: 1;">
      <div class="text-center q-gutter-md">
        <div class="text-h6">
          Du har inga skapade uppdrag
        </div>
        <div>
          <q-btn to="/skapa-uppdrag" unelevated rounded size="lg" no-caps style="font-size: 1rem; width: 240px"
            color="primary">Skapa uppdrag</q-btn>
          <div v-if="$q.platform.is.mobile" class="q-mt-md">Eller använd knappen <q-badge rounded
              color="primary">+</q-badge> nedan för att
            skapa uppdrag.</div>
        </div>
      </div>
    </div>

    <q-list v-else class="q-ma-md">
      <job-list-item v-for="item in createdJobs" :key="item.id" :job="item" :to="`/skapade-uppdrag/${item.id}`" />
    </q-list>

    <q-page-sticky v-if="$q.platform.is.mobile" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="primary" to="/skapa-uppdrag" />
    </q-page-sticky>
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

const { createdJobs } = storeToRefs(jobsStore);
const loading = ref(true);

onMounted(async () => {
  try {
    await jobsStore.getCreatedJobs();
  } catch (error) {
    console.error('Load created jobs error:', error);
  } finally {
    loading.value = false;
  }
});
</script>

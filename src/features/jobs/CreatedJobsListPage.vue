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

    <div v-else class="column">
      <div class="row items-center q-gutter-md q-mt-xs">
        <q-toggle v-model="showNonCompleted" label="Aktiva uppdrag" color="primary" />
        <q-toggle v-model="showCompleted" label="Klara uppdrag eller datumet passerat" color="primary" />
      </div>

      <q-list class="q-ma-md" style="flex: 1;">
        <created-jobs-list-item v-for="item in filteredJobs" :key="item.id" :job="item" :show-status="true"
          :to="`/skapade-uppdrag/${item.id}`" />
      </q-list>
    </div>

    <q-page-sticky v-if="$q.platform.is.mobile" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="primary" to="/skapa-uppdrag" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useJobs } from 'src/features/jobs/jobsStore';
import { storeToRefs } from 'pinia';
import CreatedJobsListItem from './components/CreatedJobsListItem.vue';

const jobsStore = useJobs();
const $q = useQuasar();

const { createdJobs } = storeToRefs(jobsStore);
const loading = ref(true);
const showNonCompleted = ref(true);
const showCompleted = ref(false);

const filteredJobs = computed(() => {
  const now = new Date();
  const filtered = createdJobs.value.filter(job => {
    const desiredAt = job.desiredAt ? new Date(job.desiredAt) : null;
    const desiredAtPassed = desiredAt ? desiredAt < now : false;
    const status = job.status as string | null;
    const jobCreatorDoneAt = job.jobCreatorDoneAt ? new Date(job.jobCreatorDoneAt) : null;

    const isNotActive =
      (desiredAtPassed && (status === 'Förfrågan' || status === 'Nekad')) ||
      (desiredAtPassed && jobCreatorDoneAt !== null);

    if (isNotActive) {
      return showCompleted.value;
    } else {
      return showNonCompleted.value;
    }
  });

  return filtered.sort((a, b) => {
    const dateA = a.desiredAt ? new Date(a.desiredAt).getTime() : 0;
    const dateB = b.desiredAt ? new Date(b.desiredAt).getTime() : 0;
    const nowTime = now.getTime();

    const diffA = Math.abs(dateA - nowTime);
    const diffB = Math.abs(dateB - nowTime);

    return diffA - diffB;
  });
});

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

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

    <div v-else class="column">
      <div class="row items-center q-gutter-md q-mt-xs">
        <q-toggle v-model="showNonCompleted" label="Aktiva uppdrag" color="primary" />
        <q-toggle v-model="showCompleted" label="Klara uppdrag eller datumet passerat" color="primary" />
      </div>
      <div class="text-h5 q-px-md q-pt-md q-pb-none">Mina Uppdrag</div>
      <q-list separator :class="$q.screen.gt.xs ? 'q-pa-md' : 'q-pa-sm'">
        <my-jobs-list-item v-for="item in filteredJobs" :key="item.id" :job="item" :to="`/mina-uppdrag/${item.id}`"
          :class="$q.screen.gt.xs ? 'q-mb-md' : 'q-mb-sm'" />
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useJobs } from 'src/features/jobs/jobsStore';
import { storeToRefs } from 'pinia';
import MyJobsListItem from './components/MyJobsListItem.vue';

const jobsStore = useJobs();

const { myJobs } = storeToRefs(jobsStore);
const loading = ref(true);
const showNonCompleted = ref(true);
const showCompleted = ref(false);

const filteredJobs = computed(() => {
  const now = new Date();
  const filtered = myJobs.value.filter(job => {
    const desiredAt = job.desiredAt ? new Date(job.desiredAt) : null;
    const desiredAtPassed = desiredAt ? desiredAt < now : false;
    const status = job.status as string | null;
    const groupDoneAt = job.groupDoneAt ? new Date(job.groupDoneAt) : null;

    const isNotActive =
      (desiredAtPassed && (status === 'Förfrågan' || status === 'Nekad')) ||
      (desiredAtPassed && groupDoneAt !== null);

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
    await jobsStore.getMyJobs();
  } catch (error) {
    console.error('Load my jobs error:', error);
  } finally {
    loading.value = false;
  }
});
</script>

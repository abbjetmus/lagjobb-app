<template>
  <q-page class="q-pa-md page-background-pattern">
    <div v-if="loading" class="flex flex-center">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="job">
      <job-details :job="job" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import JobDetails from './components/JobDetails.vue';
import { useJobs } from './jobsStore';
import type { JobsRecord } from 'app/pocketbase-types';
import type { JobsExpand } from 'app/expanded-pocketbase-types';
import type { WithId } from 'src/models/withIdType';

const route = useRoute();
const jobsStore = useJobs();
const loading = ref(true);
const job = ref<WithId<JobsRecord, JobsExpand> | null>(null);

const jobId = computed(() => route.params.id as string);

onMounted(async () => {
  job.value = await jobsStore.getJobById(jobId.value);
  loading.value = false;
});
</script>

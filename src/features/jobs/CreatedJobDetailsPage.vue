<template>
  <q-page class="page-background-pattern">
    <div v-if="loading" class="flex flex-center">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="job">
      <div v-if="!$q.platform.is.mobile" class="row items-center q-pa-md bg-primary q-gutter-md">
        <q-btn unelevated color="secondary" text-color="primary" icon="edit" label="Redigera" to="/skapa-uppdrag" />
        <q-btn unelevated color="secondary" text-color="primary" icon="question_answer" label="Förfrågningar"
          :to="`/interest-requests?jobId=${jobId}`" />

        <q-space />
      </div>
      <div class="q-pa-md">
        <job-details :job="job" :show-status="true" />
      </div>
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
const job = ref<WithId<JobsRecord> & { expand?: JobsExpand } | null>(null);

const jobId = computed(() => route.params.id as string);

onMounted(async () => {
  job.value = await jobsStore.getJobById(jobId.value);
  loading.value = false;
  console.log('job', job.value);
});
</script>

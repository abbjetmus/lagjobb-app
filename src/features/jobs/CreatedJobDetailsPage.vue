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
        <q-btn unelevated color="secondary" text-color="primary" icon="more_vert">
          <q-menu>
            <q-list>
              <q-item clickable v-close-popup @click="confirmDelete">
                <q-item-section>Radera uppdrag</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-space />
      </div>
      <div class="q-pa-md">
        <job-details :job="job" :show-status="true" />
      </div>
      <q-page-sticky v-if="$q.platform.is.mobile" position="bottom-right" :offset="[20, 20]">
        <q-btn fab icon="more_vert" color="primary" @click="showBottomSheet" />
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import JobDetails from './components/JobDetails.vue';
import { useJobs } from './jobsStore';
import type { JobsRecord } from 'app/pocketbase-types';
import type { JobsExpand } from 'app/expanded-pocketbase-types';
import type { WithId } from 'src/models/withIdType';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const jobsStore = useJobs();
const loading = ref(true);
const job = ref<WithId<JobsRecord> & { expand?: JobsExpand } | null>(null);

const jobId = computed(() => route.params.id as string);

const showBottomSheet = () => {
  $q.bottomSheet({
    actions: [
      {
        label: 'Redigera',
        icon: 'edit',
        color: 'primary',
        id: 'edit'
      },
      {},
      {
        label: 'Förfrågningar',
        icon: 'question_answer',
        color: 'primary',
        id: 'requests'
      },
      {},
      {
        label: 'Radera uppdrag',
        icon: 'delete',
        color: 'negative',
        id: 'delete'
      }
    ]
  }).onOk(action => {
    if (action.id === 'edit') {
      void router.push(`/redigera-uppdrag/${jobId.value}`);
    } else if (action.id === 'requests') {
      void router.push(`/interest-requests?jobId=${jobId.value}`);
    } else if (action.id === 'delete') {
      confirmDelete();
    }
  });
};

const confirmDelete = () => {
  void $q.dialog({
    title: 'Bekräfta borttagning',
    message: 'Är du säker på att du vill ta bort detta uppdrag?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    if (!job.value) return;

    void (async () => {
      try {
        await jobsStore.deleteJob(job.value!.id);
        $q.notify({
          type: 'positive',
          message: 'Uppdrag borttaget!',
        });
        void router.push('/skapade-uppdrag');
      } catch (error) {
        console.error('Delete error:', error);
        $q.notify({
          type: 'negative',
          message: 'Kunde inte ta bort uppdrag.',
        });
      }
    })();
  });
};

onMounted(async () => {
  job.value = await jobsStore.getJobById(jobId.value);
  loading.value = false;
  console.log('job', job.value);
});
</script>

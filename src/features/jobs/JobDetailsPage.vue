<template>
  <q-page class="page-background-pattern" :class="{ 'q-pa-md': $q.screen.gt.xs }">
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
import { useSEO } from 'src/composables/useSEO';
import { pb } from 'src/boot/pocketbase';

const route = useRoute();
const jobsStore = useJobs();
const loading = ref(true);
const job = ref<WithId<JobsRecord, JobsExpand> | null>(null);

const jobId = computed(() => route.params.id as string);

const getAbsoluteUrl = (path: string) => {
  if (typeof window === 'undefined') {
    const baseUrl = process.env.APP_URL || 'https://lagjobb.se';
    return `${baseUrl}${path}`;
  }
  return `${window.location.origin}${path}`;
};

useSEO({
  title: computed(() => job.value ? `${job.value.title} - Lagjobb` : 'Uppdrag - Lagjobb'),
  description: computed(() => {
    if (!job.value) return 'Se detaljer om detta uppdrag';
    const desc = job.value.description
      ? `${job.value.title} - ${job.value.description.substring(0, 150)}`
      : job.value.title;
    return desc || 'Se detaljer om detta uppdrag';
  }),
  image: computed(() => {
    if (job.value?.images?.[0] && job.value) {
      try {
        const url = pb.files.getURL(job.value, job.value.images[0]);
        return url || getAbsoluteUrl('/soccer-team.jpg');
      } catch {
        return getAbsoluteUrl('/soccer-team.jpg');
      }
    }
    return getAbsoluteUrl('/soccer-team.jpg');
  }),
  url: computed(() => getAbsoluteUrl(`/uppdrag/${jobId.value}`)),
  type: 'article',
  structuredData: computed(() => {
    if (!job.value) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.value.title,
      description: job.value.description || '',
      identifier: {
        '@type': 'PropertyValue',
        name: 'Lagjobb',
        value: job.value.id
      },
      datePosted: job.value.created,
      employmentType: 'PART_TIME',
      hiringOrganization: {
        '@type': 'Organization',
        name: job.value.expand?.createdBy?.name || 'Lagjobb'
      }
    };
  })
});

onMounted(async () => {
  job.value = await jobsStore.getJobById(jobId.value);
  loading.value = false;
});
</script>

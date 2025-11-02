<template>
  <q-item class="q-pa-none q-ma-none" clickable>
    <q-card class="full-width bg-transparent" flat>
      <q-card-section :horizontal="$q.screen.gt.xs" class="q-pa-none q-ma-none">
        <div v-if="job.images && job.images[0]" class="rounded-borders overflow-hidden flex-shrink" :style="imageStyle">
          <img class="full-width full-height" style="object-fit: cover;" :src="getImageUrl(job.images[0]!)" />
        </div>
        <q-card-section class="column justify-center">
          <div class="text-h6 text-weight-regular" style="line-height: 1.2;">
            {{ job.title }}
          </div>
          <div class="text-caption text-grey q-mt-xs">
            {{ formatDateTime(new Date(job.desiredAt ?? '')) }}
          </div>
          <div v-if="job.description" class="text-body2 text-grey-8 q-mt-sm gt-xs">
            {{ truncate(job.description, 100) }}
          </div>
          <div class="text-body1 text-grey-7 row items-center q-gutter-sm q-mt-xs">
            <q-chip v-if="showStatus && job.publicationStatus" :color="getStatusColor(job.publicationStatus)"
              text-color="white" size="sm">
              {{ job.publicationStatus }}
            </q-chip>
            <span v-if="showStatus && job.publicationStatus && job.price" class="text-grey-5">•</span>
            <span v-if="job.price" class="inline-flex items-center text-bold text-green">
              {{ job.price }} kr
            </span>
            <span v-if="job.price && (job.estimatedHours || job.expand?.city?.title)" class="text-grey-5">•</span>
            <span v-if="job.estimatedHours" class="inline-flex items-center">
              <q-icon name="schedule" size="sm" />
              {{ job.estimatedHours }}h
            </span>
            <span v-if="job.estimatedHours && job.expand?.city?.title" class="text-grey-5">•</span>
            <span v-if="job.expand?.city?.title" class="inline-flex items-center">
              <q-icon name="location_on" size="sm" />
              {{ job.expand.city.title }}
            </span>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-item>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { pb } from 'src/boot/pocketbase';
import type { WithId } from 'src/models/withIdType';
import type { JobsRecord, JobsPublicationStatusOptions } from 'app/pocketbase-types';
import type { JobsExpand } from 'app/expanded-pocketbase-types';
import { formatDateTime } from 'src/utils/dateUtils';

interface Props {
  job: WithId<JobsRecord, JobsExpand>;
  showStatus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showStatus: false,
});
const $q = useQuasar();

const getImageUrl = (imageName: string) => {
  return pb.files.getURL(props.job, imageName);
};

const truncate = (text: string, length: number) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const imageStyle = computed(() => {
  return $q.screen.gt.xs
    ? { width: '320px', height: '220px' }
    : { width: '100%', height: '180px' };
});

const getStatusColor = (status?: JobsPublicationStatusOptions) => {
  switch (status) {
    case 'Publicerad':
      return 'positive';
    case 'Granskning':
      return 'warning';
    case 'Uppdatering':
      return 'info';
    case 'Nekad':
      return 'negative';
    default:
      return 'grey';
  }
};
</script>

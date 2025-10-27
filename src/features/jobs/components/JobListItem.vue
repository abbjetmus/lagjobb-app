<template>
  <q-item class="q-px-md q-py-md min-sm-py-lg " clickable @click="$emit('click', job)">
    <q-item-section v-if="job.images && job.images[0]" side class="q-pa-none q-ma-none lt-sm-none"
      style="padding: 0px; margin: 0px;">
      <img height="180px" width="180px" style="object-fit: cover; border-radius: 4px;"
        :src="getImageUrl(job.images[0]!)" />
    </q-item-section>

    <q-item-section class="lj-column lj-items-start lj-justify-center min-md-justify-around">
      <q-item-label>
        <div class="text-h6 text-weight-regular" style="line-height: 1.2;">
          {{ job.title }}
        </div>
        <div class="text-caption text-grey q-mt-xs">
          {{ formatDate(job.created || '') }}
        </div>
      </q-item-label>

      <div v-if="job.images && job.images[0]" class="gt-xs-none q-mt-sm">
        <img height="120px" width="150px" style="object-fit: cover; border-radius: 4px;"
          :src="getImageUrl(job.images[0]!)" />
      </div>

      <q-item-label v-if="job.description" class="text-body2 text-grey-8 q-mt-sm">
        {{ truncate(job.description, 100) }}
      </q-item-label>

      <q-item-label class="text-body1 text-grey-7 lj-column min-md-row min-md-gap-lg q-mt-xs">
        <span v-if="job.price" class="text-bold text-primary">
          <q-icon name="attach_money" size="sm" />
          {{ job.price }} kr
        </span>
        <span v-if="job.estimatedHours" class="q-ml-md-min-none">
          <q-icon name="schedule" size="sm" />
          {{ job.estimatedHours }}h
        </span>
        <span v-if="job.city" class="q-ml-md-min-none">
          <q-icon name="location_on" size="sm" />
          {{ job.city }}
        </span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { pb } from 'src/boot/pocketbase';
import type { WithId } from 'src/models/withIdType';
import type { JobsRecord } from 'app/pocketbase-types';

interface Props {
  job: WithId<JobsRecord>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [job: WithId<JobsRecord>];
}>();

const getImageUrl = (imageName: string) => {
  return pb.files.getURL(props.job, imageName);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('sv-SE');
};

const truncate = (text: string, length: number) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};
</script>

<style scoped>
.lj-column {
  display: flex;
  flex-direction: column;
}

.lj-items-start {
  align-items: flex-start;
}

.lj-justify-center {
  justify-content: center;
}

.lj-gap-sm {
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .min-md-justify-around {
    justify-content: space-around;
  }

  .min-md-row {
    flex-direction: row;
  }

  .min-md-gap-lg {
    gap: 1rem;
  }

  .q-ml-md-min-none {
    margin-left: 0;
  }
}

@media (max-width: 599px) {
  .gt-xs-none {
    display: none;
  }
}

@media (min-width: 600px) {
  .lt-sm-none {
    display: none;
  }
}

.q-ml-md-min-none {
  margin-left: 0.5rem;
}
</style>

<template>
  <q-item class="q-px-md q-py-md min-sm-py-lg" clickable :to="props.to" @click="emit('click', props.group)">
    <q-item-section v-if="props.group.image" side class="q-pa-none q-ma-none lt-sm-none"
      style="padding: 0px; margin: 0px;">
      <img height="180px" width="180px" style="object-fit: cover; border-radius: 4px;"
        :src="getImageUrl(props.group.image)" />
    </q-item-section>

    <q-item-section class="lj-column lj-items-start lj-justify-center min-md-justify-around">
      <q-item-label>
        <div class="text-h6 text-weight-regular" style="line-height: 1.2;">
          {{ props.group.groupName }}
        </div>
        <div class="text-caption text-grey q-mt-xs">
          {{ formatDate(props.group.created || '') }}
        </div>
      </q-item-label>

      <div v-if="props.group.image" class="gt-xs-none q-mt-sm">
        <img height="120px" width="150px" style="object-fit: cover; border-radius: 4px;"
          :src="getImageUrl(props.group.image)" />
      </div>

      <q-item-label v-if="props.group.description" class="text-body2 text-grey-8 q-mt-sm">
        {{ truncate(props.group.description, 100) }}
      </q-item-label>

      <q-item-label class="text-body1 text-grey-7 lj-column min-md-row min-md-gap-lg q-mt-xs">
        <q-chip v-if="props.group.verified" color="positive" text-color="white" size="sm">
          Verifierad
        </q-chip>
        <span v-if="props.group.groupType" class="q-ml-md-min-none">
          <q-icon name="group" size="sm" />
          {{ props.group.groupType }}
        </span>
        <span v-if="props.group.city" class="q-ml-md-min-none">
          <q-icon name="location_on" size="sm" />
          {{ props.group.city }}
        </span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { pb } from 'src/boot/pocketbase';
import type { WithId } from 'src/models/withIdType';
import type { GroupsRecord } from 'app/pocketbase-types';

interface Props {
  group: WithId<GroupsRecord>;
  to?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [group: WithId<GroupsRecord>];
}>();

const getImageUrl = (imageName: string) => {
  return pb.files.getURL(props.group, imageName);
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

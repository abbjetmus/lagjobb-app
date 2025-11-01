<template>
  <q-item class="q-pa-none q-ma-none">
    <q-card class="full-width bg-transparent" flat clickable :to="props.to" @click="emit('click', props.group)">
      <q-card-section :horizontal="$q.screen.gt.xs" class="q-pa-none q-ma-none">
        <div v-if="props.group.image" class="rounded-borders overflow-hidden flex-shrink" :style="imageStyle">
          <img class="full-width full-height" style="object-fit: cover;" :src="getImageUrl(props.group.image)" />
        </div>
        <q-card-section class="column justify-center">
          <div class="text-h6 text-weight-regular" style="line-height: 1.2;">
            {{ props.group.groupName }}
          </div>
          <div class="text-caption text-grey q-mt-xs">
            {{ formatDate(props.group.created || '') }}
          </div>
          <div v-if="props.group.description" class="text-body2 text-grey-8 q-mt-sm gt-xs">
            {{ truncate(props.group.description, 100) }}
          </div>
          <div class="text-body1 text-grey-7 row items-center q-gutter-sm q-mt-xs">
            <q-chip v-if="props.group.verified" color="positive" text-color="white" size="sm">
              Verifierad
            </q-chip>
            <span v-if="props.group.verified && props.group.groupType" class="text-grey-5">•</span>
            <span v-if="props.group.groupType" class="inline-flex items-center">
              <q-icon name="group" size="sm" />
              {{ props.group.groupType }}
            </span>
            <span v-if="props.group.groupType && props.group.city" class="text-grey-5">•</span>
            <span v-if="props.group.city" class="inline-flex items-center">
              <q-icon name="location_on" size="sm" />
              {{ props.group.city }}
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
import type { GroupsRecord } from 'app/pocketbase-types';

interface Props {
  group: WithId<GroupsRecord>;
  to?: string;
}

const props = defineProps<Props>();
const $q = useQuasar();

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

const imageStyle = computed(() => {
  return $q.screen.gt.xs
    ? { width: '320px', height: '220px' }
    : { width: '100%', height: '180px' };
});
</script>

<template>
  <q-item clickable @click="$emit('click')" class="q-px-md q-py-md" :class="{ 'bg-grey-3': selected }">
    <q-item-section class="column items-start">
      <q-item-label>
        <div>
          <q-badge v-if="group?.groupType" class="q-mr-xs" color="blue-6" :label="group.groupType" />
          <q-badge v-if="group?.groupCategoryName" class="q-mr-xs" color="blue-6" :label="group.groupCategoryName" />
          <q-badge v-if="group?.groupSubcategoryName" class="q-mr-xs" color="blue-6"
            :label="group.groupSubcategoryName" />
        </div>
      </q-item-label>

      <q-item-label class="q-gutter-x-xs">
        <div>
          <span class="block text-h6 text-weight-regular" style="line-height: 1.0;">
            {{ group?.groupName || 'Okänd grupp' }}
          </span>
          <!-- <q-rating v-if="group?.rating" :model-value="group.rating" max="5" size="1.2em" color="yellow"
            icon="star_border" icon-selected="star" icon-half="star_half" no-dimming readonly /> -->
        </div>
      </q-item-label>
    </q-item-section>
    <q-item-section v-if="group?.image" side class="q-pa-none q-ma-none lt-sm-none">
      <img height="80px" width="80px" style="object-fit: contain;" :src="getImageUrl(group.image)" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { pb } from 'src/boot/pocketbase';
import type { GroupsRecord, InterestRequestsRecord } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';

interface Props {
  interestRequest: WithId<InterestRequestsRecord> & { expand?: { group?: WithId<GroupsRecord> } };
  selected: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  click: [];
}>();

const group = computed(() => props.interestRequest.expand?.group);

const getImageUrl = (imageName: string) => {
  if (!group.value) return '';
  return pb.files.getURL(group.value, imageName);
};
</script>

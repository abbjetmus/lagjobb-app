<template>
  <div class="row">
    <div class="col-xs-12 col-md-8">
      <q-card flat class="bg-transparent q-pa-none q-ma-none">
        <q-card-section v-if="group.image">
          <img :src="getImageUrl(group.image)"
            style="width: 100%; height: 300px; object-fit: cover; border-radius: 4px;" />
        </q-card-section>

        <q-card-section>
          <div class="text-h4"><span>{{ group.groupName }}</span> <span v-if="group.sectionName"> - {{
            group.sectionName }}</span></div>
          <div class="row items-center q-mt-sm q-gutter-sm">
            <q-chip v-if="showStatus && group.publicationStatus" :color="getGroupStatusColor(group.publicationStatus)"
              text-color="white" size="sm">
              {{ group.publicationStatus }}
            </q-chip>
            <q-chip v-if="group.verified" color="positive" text-color="white" size="sm">
              Verifierad
            </q-chip>
            <div class="text-caption text-grey">
              Publicerad: {{ formatDateTime(new Date(group.created ?? '')) }}
            </div>
          </div>
        </q-card-section>

        <q-separator class="q-mx-md" />

        <q-card-section v-if="group.description">
          <div class="text-h6 q-mb-sm">Beskrivning</div>
          <div class="text-body1" style="white-space: pre-wrap">{{ group.description }}</div>
        </q-card-section>

        <q-card-section v-if="group.groupType || group.groupCategoryName || group.sectionName">
          <div class="text-h6 q-mb-sm">Detaljer</div>
          <div v-if="group.groupType" class="q-mb-sm">
            <q-icon name="group" /> Grupptyp: {{ group.groupType }}
          </div>
          <div v-if="group.groupCategoryName" class="q-mb-sm">
            <q-icon name="category" /> Kategori: {{ group.groupCategoryName }}
          </div>
          <div v-if="group.sectionName" class="q-mb-sm">
            <q-icon name="subdirectory_arrow_right" /> Sektion: {{ group.sectionName }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="column col-xs-12 col-md-4">
      <q-card class="col-auto bg-transparent" flat>
        <q-card-section>
          <div class="text-h6 q-mb-sm">Information</div>
          <div v-if="group.expand?.city" class="q-mb-sm">
            <q-icon name="location_on" /> Stad: {{ group.expand.city.title }}
          </div>
          <div v-if="group.expand?.createdBy" class="q-mb-sm">
            <q-icon name="person" /> Skapad av: {{ group.expand.createdBy.name }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pb } from 'src/boot/pocketbase';
import type { WithId } from 'src/models/withIdType';
import type { GroupsRecord } from 'app/pocketbase-types';
import { formatDateTime } from 'src/utils/dateUtils';
import type { GroupsExpand } from 'app/expanded-pocketbase-types';
import { getGroupStatusColor } from 'src/utils/enumUtils';

const props = withDefaults(defineProps<{
  group: WithId<GroupsRecord, GroupsExpand>;
  showStatus?: boolean;
}>(), {
  showStatus: false,
});

const getImageUrl = (imageName: string) => {
  return pb.files.getURL(props.group, imageName);
};
</script>

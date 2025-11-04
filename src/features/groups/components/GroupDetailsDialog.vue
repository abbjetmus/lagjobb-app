<template>
  <q-dialog ref="dialogRef" :maximized="$q.screen.lt.md">
    <q-card flat style="max-width: 900px">
      <q-card-section class="row items-center q-pa-none q-ma-none">
        <q-space />
        <q-btn icon="close" class="q-ma-md" flat round dense @click="onDialogCancel" />
      </q-card-section>
      <q-card-section class="q-pa-none q-ma-none">
        <GroupDetails :group="groupWithExpand" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import GroupDetails from './GroupDetails.vue';
import type { WithId } from 'src/models/withIdType';
import type { GroupsRecord, UsersRecord, CitiesRecord } from 'app/pocketbase-types';
import type { GroupsExpand } from 'app/expanded-pocketbase-types';

const { dialogRef, onDialogCancel } = useDialogPluginComponent();

const props = defineProps<{
  group: WithId<GroupsRecord, GroupsExpand>;
  createdBy?: WithId<UsersRecord>;
  city?: WithId<CitiesRecord>;
}>();

const groupWithExpand = computed(() => {
  const result = { ...props.group };
  if (!result.expand) {
    result.expand = {} as GroupsExpand;
  }
  if (props.createdBy) {
    result.expand.createdBy = props.createdBy;
  }
  if (props.city) {
    result.expand.city = props.city;
  }
  return result;
});
</script>

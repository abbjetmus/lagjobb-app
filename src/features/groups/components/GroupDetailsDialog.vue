<template>
  <q-dialog ref="dialogRef" padding>
    <q-card style="min-width: 600px; max-width: 900px">
      <q-card-section class="row items-center q-pa-none q-ma-none">
        <q-space />
        <q-btn icon="close" class="q-ma-md" flat round dense @click="onDialogCancel" />
      </q-card-section>
      <q-card-section>
        <GroupDetails :group="group" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import GroupDetails from './GroupDetails.vue';
import type { WithId } from 'src/models/withIdType';
import type { GroupsRecord } from 'app/pocketbase-types';
import type { GroupsExpand } from 'app/expanded-pocketbase-types';

const { dialogRef, onDialogCancel } = useDialogPluginComponent();

defineProps<{
  group: WithId<GroupsRecord, GroupsExpand>;
}>();
</script>

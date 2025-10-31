<template>
  <div class="q-gutter-y-md">
    <div class="text-subtitle1">Information om organisationen</div>

    <q-input v-model="model.groupName" label="Organisationens namn" outlined :error="r?.groupName?.$error"
      error-message="Organisationens namn krävs" bg-color="secondary" no-error-icon
      placeholder="Sveriges hälsoorganisation..." hint="Ange organisationens fullständiga namn" />

    <q-input v-model="model.sectionName" label="Sektion inom organisationen" outlined :error="r?.sectionName?.$error"
      error-message="Sektion inom organisationen krävs" bg-color="secondary" no-error-icon
      placeholder="Hälsa och träning..." hint="Valfritt: ange specifik sektion eller avdelning" />
  </div>
</template>

<script setup lang="ts">
import type { GroupsRecord } from 'app/pocketbase-types';

defineProps<{
  r?: {
    groupName?: {
      $error: boolean;
    };
    sectionName?: {
      $error: boolean;
    };
  };
}>();

const model = defineModel<GroupsRecord>({ required: true });
</script>

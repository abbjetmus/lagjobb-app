<template>
  <div class="q-gutter-y-md">
    <div class="text-subtitle1">Klass information</div>

    <q-input v-model="model.groupName" label="Skolans namn" outlined :error="r?.groupName?.$error"
      error-message="Skolans namn krävs" bg-color="secondary" no-error-icon placeholder="Erikdalsskolan..."
      hint="Ange skolans fullständiga namn" />

    <q-input v-model="model.sectionName" label="Klassens namn" outlined :error="r?.sectionName?.$error"
      error-message="Klassens namn krävs" bg-color="secondary" no-error-icon placeholder="5A, 18C..."
      hint="Ange klassbeteckning, t.ex. 5A, 18C eller liknande" />
  </div>
</template>

<script setup lang="ts">
import type { GroupsRecord } from 'app/pocketbase-types';

defineProps<{
  r?: any;
}>();

const model = defineModel<GroupsRecord>({ required: true });
</script>

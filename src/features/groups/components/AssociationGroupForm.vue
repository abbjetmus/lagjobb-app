<template>
  <div class="q-gutter-y-md">
    <div class="text-subtitle1">Information om föreningen</div>

    <q-input v-model="model.groupName" label="Föreningens namn" outlined :error="r?.groupName?.$error"
      error-message="Föreningens namn krävs" bg-color="white" no-error-icon placeholder="Friluftsföreningen..."
      hint="Ange föreningens fullständiga namn" />

    <q-input v-model="model.sectionName" label="Sektion inom föreningen" outlined :error="r?.sectionName?.$error"
      error-message="Sektion inom föreningen krävs" bg-color="white" no-error-icon placeholder="ungdomssektionen..."
      hint="Valfritt: ange specifik sektion om det finns" />
  </div>
</template>

<script setup lang="ts">
import { GroupsRecord } from 'app/pocketbase-types';

defineProps<{
  r?: any;
}>();

const model = defineModel<GroupsRecord>({ required: true });
</script>

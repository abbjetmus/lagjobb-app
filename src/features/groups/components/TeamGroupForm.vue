<template>
  <div class="q-gutter-y-md">
    <div class="text-subtitle1">Lag information</div>

    <q-input v-model="model.groupCategoryName" label="Sport" outlined :error="r?.groupCategoryName?.$error"
      error-message="Sport krävs" bg-color="secondary" no-error-icon placeholder="Fotboll, Hockey, Innebandy..."
      hint="Ange typ av sport, t.ex. Fotboll, Hockey" />

    <q-input v-model="model.groupName" label="Klubbens namn" outlined :error="r?.groupName?.$error"
      error-message="Klubbens namn krävs" bg-color="secondary" no-error-icon placeholder="IFK Västerås..."
      hint="Ange klubbens fullständiga namn" />

    <q-input v-model="model.sectionName" label="Sektion inom klubben" outlined :error="r?.sectionName?.$error"
      error-message="Sektion inom klubben krävs" bg-color="secondary" no-error-icon
      placeholder="F17 eller A-laget Herr..." hint="T.ex. F17, A-laget Herr eller Dam" />
  </div>
</template>

<script setup lang="ts">
import type { GroupsRecord } from 'app/pocketbase-types';

defineProps<{
  r?: any;
}>();

const model = defineModel<GroupsRecord>({ required: true });
</script>

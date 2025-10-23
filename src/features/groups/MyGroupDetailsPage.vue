<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="group">
      <q-btn flat icon="arrow_back" label="Tillbaka" @click="router.back()" class="q-mb-md" />

      <q-card>
        <q-card-section>
          <div class="row items-center">
            <div class="text-h4">{{ group.name }}</div>
            <q-chip v-if="group.verified" color="positive" text-color="white" class="q-ml-md">
              Verifierad
            </q-chip>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="group.description">
          <div class="text-h6 q-mb-sm">Beskrivning</div>
          <div class="text-body1" style="white-space: pre-wrap">{{ group.description }}</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6 q-mb-md">Åtgärder</div>
          <q-btn color="primary" label="Redigera" :to="`/redigera-grupp/${group.id}`" class="q-mr-sm" />
          <q-btn color="negative" label="Ta bort" @click="confirmDelete" outline />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import type { Group } from 'src/models/Group';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const group = ref<Group | null>(null);
const loading = ref(true);

const loadGroup = async () => {
  const id = route.params.id as string;
  try {
    group.value = await pb.collection('groups').getOne(id) as unknown as Group;
  } catch (error) {
    console.error('Load group error:', error);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Bekräfta borttagning',
    message: 'Är du säker på att du vill ta bort denna grupp?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    if (!group.value) return;

    try {
      await pb.collection('groups').delete(group.value.id);
      $q.notify({
        type: 'positive',
        message: 'Grupp borttagen!',
      });
      router.push('/mina-grupper-lista');
    } catch (error) {
      console.error('Delete error:', error);
      $q.notify({
        type: 'negative',
        message: 'Kunde inte ta bort grupp.',
      });
    }
  });
};

onMounted(() => {
  loadGroup();
});
</script>

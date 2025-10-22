<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
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
          <div class="text-caption text-grey q-mt-sm">
            Skapad: {{ formatDate(group.created) }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="group.description">
          <div class="text-h6 q-mb-sm">Beskrivning</div>
          <div class="text-body1" style="white-space: pre-wrap">{{ group.description }}</div>
        </q-card-section>

        <q-card-section v-if="group.contactEmail || group.contactPhone">
          <div class="text-h6 q-mb-sm">Kontakt</div>
          <div v-if="group.contactEmail" class="q-mb-sm">
            <q-icon name="email" /> {{ group.contactEmail }}
          </div>
          <div v-if="group.contactPhone">
            <q-icon name="phone" /> {{ group.contactPhone }}
          </div>
        </q-card-section>

        <q-card-section v-if="group.workers && group.workers.length > 0">
          <div class="text-h6 q-mb-sm">Medlemmar</div>
          <q-list separator>
            <q-item v-for="worker in group.workers" :key="worker.id">
              <q-item-section>
                <q-item-label>{{ worker.name }}</q-item-label>
                <q-item-label caption v-if="worker.age">{{ worker.age }} år</q-item-label>
                <q-item-label caption v-if="worker.description">{{ worker.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { Group } from 'src/models/Group';

const router = useRouter();
const route = useRoute();

const group = ref<Group | null>(null);
const loading = ref(true);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('sv-SE');
};

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

onMounted(() => {
  loadGroup();
});
</script>


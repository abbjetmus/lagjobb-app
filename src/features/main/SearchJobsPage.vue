<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Sök Uppdrag</div>

    <div class="row q-gutter-md q-mb-lg">
      <q-select v-model="selectedTypes" :options="uppdragTypes" label="Uppdragstyper" multiple outlined use-chips
        style="min-width: 250px" />

      <q-select v-model="selectedCities" :options="cities" label="Städer" multiple outlined use-chips
        style="min-width: 250px" />

      <q-btn color="secondary" label="Sök" @click="searchUppdrag" class="q-ml-md" />

      <q-btn color="secondary" label="Rensa" outline @click="clearFilters" />
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="uppdrag.length === 0" class="text-center q-pa-xl">
      <q-icon name="search" size="5em" color="grey" />
      <div class="text-h6 q-mt-md text-grey">Inga uppdrag hittades</div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="item in uppdrag" :key="item.id" class="col-xs-12 col-sm-6 col-md-4">
        <q-card @click="goToUppdrag(item.id)" class="cursor-pointer">
          <q-card-section>
            <div class="text-h6">{{ item.title }}</div>
            <div class="text-caption text-grey">{{ item.created }}</div>
          </q-card-section>

          <q-card-section>
            <div class="text-body2">{{ truncate(item.description, 100) }}</div>
            <div v-if="item.price" class="text-bold q-mt-sm">
              {{ item.price }} kr
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn flat color="secondary" label="Läs mer" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { useData } from 'src/stores/data';
import type { Uppdrag } from 'src/models/Uppdrag';

const router = useRouter();
const route = useRoute();
const dataStore = useData();

const uppdrag = ref<Uppdrag[]>([]);
const loading = ref(false);
const selectedTypes = ref<string[]>([]);
const selectedCities = ref<string[]>([]);

const uppdragTypes = computed(() =>
  dataStore.uppdragTypes.map(t => ({ label: t.name, value: t.id }))
);

const cities = computed(() =>
  dataStore.cities.map(c => ({ label: c.name, value: c.id }))
);

const truncate = (text: string, length: number) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const searchUppdrag = async () => {
  loading.value = true;
  try {
    let filter = '';

    if (selectedTypes.value.length > 0) {
      const typeFilters = selectedTypes.value.map(t => `types ~ "${t}"`).join(' || ');
      filter += `(${typeFilters})`;
    }

    const records = await pb.collection('uppdrag').getList(1, 50, {
      filter: filter || undefined,
      sort: '-created',
    });

    uppdrag.value = records.items as unknown as Uppdrag[];
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  selectedTypes.value = [];
  selectedCities.value = [];
  searchUppdrag();
};

const goToUppdrag = (id: string) => {
  router.push(`/uppdrags-info/${id}`);
};

onMounted(() => {
  searchUppdrag();
});
</script>

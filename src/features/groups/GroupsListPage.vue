<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Alla grupper</div>

    <q-tabs v-model="activeTab" dense class="text-grey q-mb-md" active-color="secondary" indicator-color="secondary"
      align="left">
      <q-tab name="all" label="Alla" />
      <q-tab name="1" label="Lag" />
      <q-tab name="2" label="Klasser" />
      <q-tab name="3" label="Föreningar" />
      <q-tab name="4" label="Organisationer" />
    </q-tabs>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="groups.length === 0" class="text-center q-pa-xl">
      <q-icon name="groups" size="5em" color="grey" />
      <div class="text-h6 q-mt-md text-grey">Inga grupper hittades</div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="group in groups" :key="group.id" class="col-xs-12 col-sm-6 col-md-4">
        <q-card @click="goToGroup(group.id)" class="cursor-pointer">
          <q-card-section>
            <div class="text-h6">{{ group.name }}</div>
            <q-chip v-if="group.verified" color="positive" text-color="white" size="sm">
              Verifierad
            </q-chip>
          </q-card-section>

          <q-card-section v-if="group.description">
            <div class="text-body2">{{ truncate(group.description, 100) }}</div>
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
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import type { Group } from 'src/models/Group';

const router = useRouter();
const route = useRoute();

const groups = ref<Group[]>([]);
const loading = ref(true);
const activeTab = ref('all');

const truncate = (text: string, length: number) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const loadGroups = async () => {
  loading.value = true;
  try {
    let filter = '';
    if (activeTab.value !== 'all') {
      filter = `groupTypeId=${activeTab.value}`;
    }

    const records = await pb.collection('groups').getList(1, 50, {
      filter: filter || undefined,
      sort: '-created',
    });

    groups.value = records.items as unknown as Group[];
  } catch (error) {
    console.error('Load groups error:', error);
  } finally {
    loading.value = false;
  }
};

const goToGroup = (id: string) => {
  router.push(`/grupp/${id}`);
};

watch(activeTab, () => {
  loadGroups();
});

onMounted(() => {
  if (route.params.groupTypeId) {
    activeTab.value = route.params.groupTypeId as string;
  }
  loadGroups();
});
</script>

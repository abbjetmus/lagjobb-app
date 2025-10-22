<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Jobb uppdrag</div>
    <div class="text-subtitle2 text-grey q-mb-md">
      Uppdrag där grupper har visat intresse
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="uppdrag.length === 0" class="text-center q-pa-xl">
      <q-icon name="work" size="5em" color="grey" />
      <div class="text-h6 q-mt-md text-grey">Inga jobbuppdrag ännu</div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div
        v-for="item in uppdrag"
        :key="item.id"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <q-card @click="goToUppdrag(item.id)" class="cursor-pointer">
          <q-card-section>
            <div class="text-h6">{{ item.title }}</div>
            <div class="text-caption text-grey">{{ formatDate(item.created) }}</div>
          </q-card-section>

          <q-card-section>
            <div class="text-body2">{{ truncate(item.description, 100) }}</div>
            <div v-if="item.price" class="text-bold q-mt-sm">
              {{ item.price }} kr
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn flat color="primary" label="Läs mer" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/stores/auth';
import { Uppdrag } from 'src/models/Uppdrag';

const router = useRouter();
const authStore = useAuth();

const uppdrag = ref<Uppdrag[]>([]);
const loading = ref(true);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('sv-SE');
};

const truncate = (text: string, length: number) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const loadUppdrag = async () => {
  try {
    const records = await pb.collection('uppdrag').getList(1, 50, {
      sort: '-created',
    });

    uppdrag.value = records.items as unknown as Uppdrag[];
  } catch (error) {
    console.error('Load uppdrag error:', error);
  } finally {
    loading.value = false;
  }
};

const goToUppdrag = (id: string) => {
  router.push(`/jobb-uppdrag/${id}`);
};

onMounted(() => {
  loadUppdrag();
});
</script>


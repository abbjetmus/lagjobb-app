<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Mina uppdrag</div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="uppdrag.length === 0" class="text-center q-pa-xl">
      <q-icon name="assignment" size="5em" color="grey" />
      <div class="text-h6 q-mt-md text-grey">Du har inga skapade uppdrag</div>
      <q-btn
        color="primary"
        label="Skapa uppdrag"
        to="/skapa-uppdrag"
        class="q-mt-md"
      />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div
        v-for="item in uppdrag"
        :key="item.id"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <q-card>
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
            <q-btn flat color="primary" label="Visa" :to="`/mina-uppdrag/${item.id}`" />
            <q-btn flat color="secondary" label="Redigera" :to="`/redigera-uppdrag/${item.id}`" />
            <q-space />
            <q-btn flat color="negative" icon="delete" @click="confirmDelete(item.id)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/stores/auth';
import { Uppdrag } from 'src/models/Uppdrag';
import { useQuasar } from 'quasar';

const authStore = useAuth();
const $q = useQuasar();

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
  if (!authStore.currentUser) return;

  try {
    const records = await pb.collection('uppdrag').getList(1, 50, {
      filter: `creatorId="${authStore.currentUser.id}"`,
      sort: '-created',
    });

    uppdrag.value = records.items as unknown as Uppdrag[];
  } catch (error) {
    console.error('Load uppdrag error:', error);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (id: string) => {
  $q.dialog({
    title: 'Bekräfta borttagning',
    message: 'Är du säker på att du vill ta bort detta uppdrag?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await pb.collection('uppdrag').delete(id);
      uppdrag.value = uppdrag.value.filter(u => u.id !== id);
      $q.notify({
        type: 'positive',
        message: 'Uppdrag borttaget!',
      });
    } catch (error) {
      console.error('Delete error:', error);
      $q.notify({
        type: 'negative',
        message: 'Kunde inte ta bort uppdrag.',
      });
    }
  });
};

onMounted(() => {
  loadUppdrag();
});
</script>


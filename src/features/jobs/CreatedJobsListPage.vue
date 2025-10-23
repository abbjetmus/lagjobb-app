<template>
  <q-page class="full-height bg-grey-2" style="display: flex; flex-direction: column;">
    <div v-if="!$q.platform.is.mobile" class="row items-center q-pa-sm bg-primary q-mb-md">
      <q-btn unelevated color="secondary" text-color="primary" icon="add" label="Skapa uppdrag" to="/skapa-uppdrag" />
      <q-space />
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="uppdrag.length === 0" class="flex flex-center" style="flex: 1;">
      <div class="text-center q-gutter-md">
        <div class="text-h6">
          Du har inga jobbuppdrag
        </div>
        <div>
          <q-btn to="/skapa-uppdrag" unelevated rounded size="lg" no-caps style="font-size: 1rem; width: 240px"
            color="primary">Skapa uppdrag</q-btn>
          <div v-if="$q.platform.is.mobile" class="q-mt-md">Eller använd knappen <q-badge rounded
              color="primary">+</q-badge> nedan för att
            skapa uppdrag.</div>
        </div>
      </div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="item in uppdrag" :key="item.id" class="col-xs-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ item.title }}</div>
            <div class="text-caption text-grey">{{ formatDate(item.created) }}</div>
          </q-card-section>

          <q-card-section v-if="item.description">
            <div class="text-body2">{{ truncate(item.description, 100) }}</div>
            <div v-if="item.price" class="text-bold q-mt-sm">
              {{ item.price }} kr
            </div>
          </q-card-section>

          <q-card-actions>
            <q-btn flat color="primary" label="Visa" @click="goToUppdrag(item.id)" />
            <q-btn flat color="primary" label="Redigera" :to="`/redigera-uppdrag/${item.id}`" />
            <q-space />
            <q-btn flat color="negative" icon="delete" @click="confirmDelete(item.id)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-page-sticky v-if="$q.platform.is.mobile" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="primary" to="/skapa-uppdrag" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import type { Uppdrag } from 'src/models/Uppdrag';

const router = useRouter();
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

const goToUppdrag = (id: string) => {
  router.push(`/jobb-uppdrag/${id}`);
};

const confirmDelete = (id: string) => {
  $q.dialog({
    title: 'Bekräfta borttagning',
    message: 'Är du säker på att du vill ta bort detta uppdrag?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
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
    })();
  });
};

onMounted(() => {
  void loadUppdrag();
});
</script>

<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="uppdrag">
      <q-btn flat icon="arrow_back" label="Tillbaka" @click="router.back()" class="q-mb-md" />

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-md-8">
          <q-card>
            <q-card-section>
              <div class="text-h4">{{ uppdrag.title }}</div>
              <div class="text-caption text-grey q-mt-sm">
                Publicerad: {{ formatDate(uppdrag.created) }}
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="text-h6 q-mb-sm">Beskrivning</div>
              <div class="text-body1" style="white-space: pre-wrap">{{ uppdrag.description }}</div>
            </q-card-section>

            <q-card-section v-if="uppdrag.price">
              <div class="text-h6 q-mb-sm">Pris</div>
              <div class="text-h5 text-green">{{ uppdrag.price }} kr</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-sm">Kontakt</div>
              <div class="q-mb-sm">
                <q-icon name="person" /> {{ uppdrag.name }}
              </div>
              <div class="q-mb-sm">
                <q-icon name="email" /> {{ uppdrag.email }}
              </div>
              <div v-if="!uppdrag.hidePhone && uppdrag.phone" class="q-mb-sm">
                <q-icon name="phone" /> {{ uppdrag.phone }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import type { Uppdrag } from 'src/models/Uppdrag';

const router = useRouter();
const route = useRoute();

const uppdrag = ref<Uppdrag | null>(null);
const loading = ref(true);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('sv-SE');
};

const loadUppdrag = async () => {
  const id = route.params.id as string;
  try {
    uppdrag.value = await pb.collection('uppdrag').getOne(id) as unknown as Uppdrag;
  } catch (error) {
    console.error('Load uppdrag error:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUppdrag();
});
</script>

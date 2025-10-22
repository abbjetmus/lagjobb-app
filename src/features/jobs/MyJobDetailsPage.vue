<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
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

          <q-card class="q-mt-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Intresserade ({{ interestMessages.length }})</div>

              <div v-if="interestMessages.length === 0" class="text-center text-grey">
                Inga intresserade ännu
              </div>

              <q-list v-else separator>
                <q-item v-for="msg in interestMessages" :key="msg.id">
                  <q-item-section>
                    <q-item-label>{{ msg.message }}</q-item-label>
                    <q-item-label caption>{{ formatDate(msg.created) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Åtgärder</div>

              <q-btn
                color="primary"
                label="Redigera"
                :to="`/redigera-uppdrag/${uppdrag.id}`"
                class="full-width q-mb-sm"
              />

              <q-btn
                color="negative"
                label="Ta bort"
                @click="confirmDelete"
                class="full-width"
                outline
              />
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
import { Uppdrag, InterestMessage } from 'src/models/Uppdrag';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const uppdrag = ref<Uppdrag | null>(null);
const interestMessages = ref<InterestMessage[]>([]);
const loading = ref(true);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('sv-SE');
};

const loadUppdrag = async () => {
  const id = route.params.id as string;
  try {
    uppdrag.value = await pb.collection('uppdrag').getOne(id) as unknown as Uppdrag;

    const messages = await pb.collection('interest_messages').getList(1, 50, {
      filter: `uppdragId="${id}"`,
      sort: '-created',
    });
    interestMessages.value = messages.items as unknown as InterestMessage[];
  } catch (error) {
    console.error('Load uppdrag error:', error);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = () => {
  $q.dialog({
    title: 'Bekräfta borttagning',
    message: 'Är du säker på att du vill ta bort detta uppdrag?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    if (!uppdrag.value) return;

    try {
      await pb.collection('uppdrag').delete(uppdrag.value.id);
      $q.notify({
        type: 'positive',
        message: 'Uppdrag borttaget!',
      });
      router.push('/skapade-uppdrag');
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


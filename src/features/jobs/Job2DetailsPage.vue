<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="job">
      <q-btn flat icon="arrow_back" label="Tillbaka" @click="router.back()" class="q-mb-md" />

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-md-8">
          <q-card>
            <q-card-section>
              <div class="text-h4">{{ job.title }}</div>
              <div class="text-caption text-grey q-mt-sm">
                Publicerad: {{ formatDate(job.created ?? '') }}
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="text-h6 q-mb-sm">Beskrivning</div>
              <div class="text-body1" style="white-space: pre-wrap">{{ job.description }}</div>
            </q-card-section>

            <q-card-section v-if="job.price">
              <div class="text-h6 q-mb-sm">Pris</div>
              <div class="text-h5 text-green">{{ job.price }} kr</div>
            </q-card-section>

            <q-card-section v-if="job.desiredAt || job.desiredNumberOfPeople">
              <div class="text-h6 q-mb-sm">Detaljer</div>
              <div v-if="job.desiredAt" class="q-mb-sm">
                <q-icon name="event" /> Önskat datum: {{ job.desiredAt }}
              </div>
              <div v-if="job.desiredNumberOfPeople" class="q-mb-sm">
                <q-icon name="people" /> Antal personer: {{ job.desiredNumberOfPeople }}
              </div>
              <div v-if="job.estimatedHours" class="q-mb-sm">
                <q-icon name="schedule" /> Beräknad tid: {{ job.estimatedHours }} timmar
              </div>
            </q-card-section>

            <q-card-section v-if="location">
              <div class="text-h6 q-mb-sm">Plats</div>
              <div>{{ location.address }}</div>
              <google-map-component v-if="location.latitude && location.longitude"
                :center="{ lat: location.latitude, lng: location.longitude }"
                :markers="[{ id: '1', position: { lat: location.latitude, lng: location.longitude }, title: job.title ?? '' }]"
                :zoom="13" height="300px" class="q-mt-md" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-sm">Kontakt</div>
              <div class="q-mb-sm">
                <q-icon name="person" /> {{ job.expand?.createdBy?.name }}
              </div>
              <div class="q-mb-sm">
                <q-icon name="email" /> {{ job.expand?.createdBy?.email }}
              </div>
              <div v-if="!job.hidePhone && job.expand?.createdBy?.phone" class="q-mb-sm">
                <q-icon name="phone" /> {{ job.expand?.createdBy?.phone }}
              </div>
              <div v-if="job.contactHours" class="q-mb-sm text-caption">
                Kontakttider: {{ job.contactHours }}
              </div>
            </q-card-section>

            <q-card-actions v-if="authStore.isAuthenticated">
              <q-btn color="primary" label="Visa intresse" @click="showInterestDialog = true" class="full-width" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <q-dialog v-model="showInterestDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Visa intresse</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="interestMessage" type="textarea" label="Meddelande" outlined rows="5" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Avbryt" color="primary" v-close-popup />
          <q-btn flat label="Skicka" color="primary" @click="sendInterest" :loading="sendingInterest" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/stores/auth';
import type { JobsRecord, JobLocationsRecord } from 'app/pocketbase-types';
import GoogleMapComponent from 'src/components/GoogleMapComponent.vue';
import { useQuasar } from 'quasar';
import { useJobs } from './jobsStore';
import type { WithId } from 'src/models/withIdType';
import type { JobsExpand } from 'app/expanded-pocketbase-types';
const router = useRouter();
const route = useRoute();
const authStore = useAuth();
const $q = useQuasar();
const jobsStore = useJobs();

const job = ref<WithId<JobsRecord> & { expand?: JobsExpand } | null>(null);
const location = ref<JobLocationsRecord | null>(null);
const loading = ref(true);
const showInterestDialog = ref(false);
const interestMessage = ref('');
const sendingInterest = ref(false);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('sv-SE');
};

const jobId = computed(() => route.params.id as string);


const sendInterest = async () => {
  if (!job.value || !authStore.currentUser) return;

  sendingInterest.value = true;
  try {
    await pb.collection('interest_messages').create({
      uppdragId: job.value.id,
      userId: authStore.currentUser.id,
      message: interestMessage.value,
    });

    $q.notify({
      type: 'positive',
      message: 'Ditt intresse har skickats!',
    });

    showInterestDialog.value = false;
    interestMessage.value = '';
  } catch (error) {
    console.error('Send interest error:', error);
    $q.notify({
      type: 'negative',
      message: 'Kunde inte skicka meddelande.',
    });
  } finally {
    sendingInterest.value = false;
  }
};

onMounted(async () => {
  await jobsStore.getJobById(jobId.value);
});
</script>

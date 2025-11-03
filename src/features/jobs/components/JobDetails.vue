<template>
  <div class="row q-col-gutter-md">
    <div class="col-xs-12 col-md-8">
      <q-card flat class="bg-transparent">
        <q-card-section>
          <div class="text-h4">{{ job.title }}</div>
          <div class="row items-center q-mt-sm q-gutter-sm">
            <q-chip v-if="showStatus && job.publicationStatus" :color="getJobStatusColor(job.publicationStatus)"
              text-color="white" size="sm">
              {{ job.publicationStatus }}
            </q-chip>
            <div class="text-caption text-grey">
              Publicerad: {{ formatDateTime(new Date(job.created ?? '')) }}
            </div>
          </div>
        </q-card-section>

        <q-separator class="q-mx-md" />

        <q-card-section>
          <div class="text-h6 q-mb-sm">Beskrivning</div>
          <div class="text-body1" style="white-space: pre-wrap">{{ job.description }}</div>
        </q-card-section>

        <q-card-section v-if="job.price">
          <div class="text-h6 q-mb-sm">Pris</div>
          <div class="text-h5 text-green">{{ job.price }} kr</div>
        </q-card-section>

        <q-card-section v-if="job.desiredAt || job.desiredNumberOfPeople || job.expand?.jobSubcategories?.length">
          <div class="text-h6 q-mb-sm">Detaljer</div>
          <div v-if="job.desiredAt" class="q-mb-sm">
            <q-icon name="event" /> Önskat datum: {{ formatDateTime(new Date(job.desiredAt)) }}
          </div>
          <div v-if="job.desiredNumberOfPeople" class="q-mb-sm">
            <q-icon name="people" /> Antal personer: {{ job.desiredNumberOfPeople }}
          </div>
          <div v-if="job.estimatedHours" class="q-mb-sm">
            <q-icon name="schedule" /> Beräknad tid: {{ job.estimatedHours }} timmar
          </div>
          <div v-if="job.expand?.jobSubcategories?.length" class="q-mb-sm">
            <q-icon name="category" class="q-mr-sm" />
            <span class="q-mr-sm">Uppdragstyper:</span>
            <q-badge v-for="subcategory in job.expand.jobSubcategories" :key="subcategory.id" :label="subcategory.title"
              color="primary" class="q-mr-xs q-mb-xs" />
          </div>
        </q-card-section>

        <q-card-section v-if="job.images && job.images.length > 0">
          <div class="text-h6 q-mb-sm">Bilder</div>
          <image-gallery :images="imageUrls" />
        </q-card-section>
      </q-card>
    </div>

    <div class="column col-xs-12 col-md-4">
      <q-card class="col-auto bg-transparent" flat>
        <q-card-section>
          <div class="text-h6 q-mb-sm">Kontakt</div>
          <div class="q-mb-sm">
            <q-icon name="person" /> {{ job.expand?.createdBy?.name }}
          </div>
          <div v-if="job.contactHours" class="q-mb-sm text-caption">
            Kontakttider: {{ job.contactHours }}
          </div>
          <div class="text-caption text-grey q-mt-sm">
            Kontaktuppgifter visas endast till gruppen som tilldelas uppdraget.
          </div>
        </q-card-section>

        <q-card-actions v-if="authStore.isAuthenticated && isUppdragsutforare">
          <q-btn unelevated color="green-6" label="Skicka förfrågan" @click="showSendInterestDialog"
            :disable="!hasGroups" class="full-width" />
        </q-card-actions>
        <div v-if="authStore.isAuthenticated && isUppdragsutforare && !hasGroups"
          class="text-caption text-grey q-px-md q-pb-md text-center">
          Du måste ha skapat en grupp (lag, klass, förening, etc.) för att kunna skicka förfrågan.
        </div>
      </q-card>

      <q-card flat class="col bg-transparent" v-if="job.latitude && job.longitude">
        <q-card-section>
          <div class="text-h6">Plats</div>
          <div>{{ job.street }}, {{ job.zipcode }} {{ job.expand?.city?.title }}</div>
          <leaflet-map :lat="job.latitude!" :lng="job.longitude!" :zoom="15"
            :markers="[{ lat: job.latitude!, lng: job.longitude!, title: job.title || 'Jobb' }]" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/features/auth/authStore';
import type { JobsRecord } from 'app/pocketbase-types';
import { UsersUserAccountTypeOptions } from 'app/pocketbase-types';
import { useQuasar } from 'quasar';
import type { WithId } from 'src/models/withIdType';
import type { JobsExpand } from 'app/expanded-pocketbase-types';
import ImageGallery from 'src/components/ImageGallery.vue';
import LeafletMap from 'src/components/LeafletMap.vue';
import { formatDateTime } from 'src/utils/dateUtils';
import SendInterestDialog from './SendInterestDialog.vue';
import { useGroups } from 'src/features/groups/groupsStore';
import type { GroupsRecord } from 'app/pocketbase-types';
import { getJobStatusColor } from 'src/utils/enumUtils';

const authStore = useAuth();
const groupsStore = useGroups();
const $q = useQuasar();

const props = withDefaults(defineProps<{
  job: WithId<JobsRecord> & { expand?: JobsExpand };
  showStatus?: boolean;
}>(), {
  showStatus: false,
});

const userGroups = ref<WithId<GroupsRecord>[]>([]);

const imageUrls = computed(() => {
  if (!props.job.images || props.job.images.length === 0) return [];
  return props.job.images.map(imageName => pb.files.getURL(props.job, imageName));
});

const isUppdragsutforare = computed(() =>
  authStore.currentUser?.userAccountType === UsersUserAccountTypeOptions.Uppdragsutförare
);

const hasGroups = computed(() => userGroups.value.length > 0);

const showSendInterestDialog = () => {
  $q.dialog({
    component: SendInterestDialog,
    componentProps: {
      job: props.job,
      groups: userGroups.value,
    },
  });
};

onMounted(async () => {
  if (authStore.isAuthenticated && isUppdragsutforare.value) {
    await groupsStore.getMyGroups();
    userGroups.value = groupsStore.myGroups;
  }
});
</script>

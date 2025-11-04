<template>
  <div class="q-pa-md">
    <q-timeline v-if="interestRequest">
      <q-timeline-entry icon="mdi-numeric-1" :subtitle="requestSubTitle" :color="requestColor" icon-size="md"
        class="gt-sm-step-icon">
        <q-slide-transition appear>
          <div>
            <div class="row items-center">
              <q-chat-message bg-color="grey-4" :name="groupName" :text="requestMessage"
                :stamp="formatDateTime(new Date(interestRequest.created))" />
            </div>
            <span v-show="step === 1" style="font-size: 13px;">
              Väntar på svar från uppdragsgivaren.
            </span>
            <q-chat-message sent v-show="responseMessage && responseMessage.length > 0 && step > 1"
              :name="jobCreatorName" :text="[responseMessage]" :bg-color="isApproved ? 'green-4' : 'red-4'"
              :stamp="formatDateTime(new Date(interestRequest.responseAt || interestRequest.updated))" />
          </div>
        </q-slide-transition>
      </q-timeline-entry>

      <q-timeline-entry :subtitle="completedSubTitle" icon="mdi-numeric-2" :color="completedColor" icon-size="md"
        class="gt-sm-step-icon">
        <q-slide-transition appear>
          <div v-if="isApproved" v-show="step > 1">
            <span>Grattis ni har fått uppdraget!</span>
            <span class="block">Ni kan nu hålla kontakt med {{ jobCreatorName }}:</span>
            <span class="block" v-if="jobCreatorPhone">Telefon: {{ jobCreatorPhone }}</span>
            <span class="block" v-if="jobCreatorEmail">E-post: {{ jobCreatorEmail }}</span>
            <span class="block q-mt-sm" v-if="step === 2">
              Klick på knappen utfört när uppdraget är utfört.
            </span>
            <q-btn v-show="step === 2" @click="completed" color="green" unelevated label="Utfört" no-caps />
          </div>
        </q-slide-transition>
      </q-timeline-entry>

      <q-timeline-entry :subtitle="payedSubTitle" icon="mdi-numeric-3" :color="payedColor" icon-size="md"
        class="gt-sm-step-icon">
        <q-slide-transition appear>
          <div v-show="step > 2">
            <span class="block">Väntar på att {{ jobCreatorName }} ska godkänna betalningen.</span>
          </div>
        </q-slide-transition>
      </q-timeline-entry>

      <q-timeline-entry subtitle="Klart" icon="mdi-numeric-4" :color="doneColor" icon-size="md" class="gt-sm-step-icon">
        <q-slide-transition appear>
          <div v-show="step > 3">
            <div v-show="step === 4">
              <span class="block">Lämna gärna omdöme på uppdragsgivaren med stjärnorna och en kommentar.</span>
              <q-rating class="q-mb-sm" v-model="jobCreatorRating" max="5" size="2em" color="yellow" icon="star_border"
                icon-selected="star" icon-half="star_half" no-dimming />
              <q-chat-message sent size="12">
                <q-input type="textarea" v-model="jobCreatorRatingMessage" dense borderless no-error-icon
                  hide-bottom-space lazy-rules bg-color="grey-2" class="col-12 q-mb-xs" outlined />
              </q-chat-message>
            </div>
            <q-chat-message sent v-show="step > 4" name="Ditt omdöme på uppdragsgivaren" bg-color="green-4"
              :stamp="formatDateTime(new Date(interestRequest.groupDoneAt || interestRequest.updated))">
              <div>
                <span class="block">{{ jobCreatorRatingMessage }}</span>
                <q-rating class="q-mb-sm" v-model="jobCreatorRating" max="5" size="1.6em" color="yellow"
                  icon="star_border" icon-selected="star" icon-half="star_half" no-dimming readonly />
              </div>
            </q-chat-message>
            <q-btn v-show="step === 4" color="green" label="Klart" @click="done" no-caps unelevated />
          </div>
        </q-slide-transition>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useInterestRequests } from 'src/features/interestRequests/interestRequestsStore';
import { useGroups } from 'src/features/groups/groupsStore';
import { useAuth } from 'src/features/auth/authStore';
import type { GroupsRecord, InterestRequestsRecord, JobsRecord } from 'app/pocketbase-types';
import { InterestRequestsStatusOptions } from 'app/pocketbase-types';
import { formatDateTime } from 'src/utils/dateUtils';
import type { WithId } from 'src/models/withIdType';
import type { JobsExpand } from 'app/expanded-pocketbase-types';

interface Props {
  jobId: string;
}

const props = defineProps<Props>();
const interestRequestsStore = useInterestRequests();
const groupsStore = useGroups();
const authStore = useAuth();

const interestRequest = ref<WithId<InterestRequestsRecord> & { expand?: { group?: WithId<GroupsRecord>; job?: WithId<JobsRecord> & { expand?: JobsExpand } } } | null>(null);
const jobCreatorRatingMessage = ref('');
const jobCreatorRating = ref(0);

const step = computed(() => {
  if (!interestRequest.value) return 1;
  if (interestRequest.value.groupDoneAt) return 5;
  if (interestRequest.value.payedAt && !interestRequest.value.groupDoneAt) return 4;
  if (interestRequest.value.completedAt) return 3;
  if (interestRequest.value.responseAt) return 2;
  return 1;
});

const isApproved = computed(() => interestRequest.value?.status === InterestRequestsStatusOptions.Godkänd);

const groupName = computed(() => {
  const group = interestRequest.value?.expand?.group;
  if (!group) return 'Okänd grupp';
  return `${group.groupName || ''} ${group.sectionName || ''}`.trim();
});

const responseMessage = computed(() => interestRequest.value?.responseMessage || '');

const jobCreatorName = computed(() => {
  const job = interestRequest.value?.expand?.job;
  if (!job?.expand?.createdBy) return 'Uppdragsgivare';
  return job.expand.createdBy?.name || 'Uppdragsgivare';
});

const jobCreatorPhone = computed(() => {
  const job = interestRequest.value?.expand?.job;
  return job?.expand?.createdBy?.phone || '';
});

const jobCreatorEmail = computed(() => {
  const job = interestRequest.value?.expand?.job;
  return job?.expand?.createdBy?.email || '';
});

const requestMessage = computed(() => {
  return interestRequest.value?.requestMessage ? [interestRequest.value.requestMessage] : [''];
});

const requestColor = computed(() => {
  if (step.value > 1 && isApproved.value) return 'green';
  if (step.value > 1 && !isApproved.value) return 'red';
  if (step.value === 1) return 'blue';
  return 'grey';
});

const requestSubTitle = computed(() => {
  if (step.value > 1 && isApproved.value) return 'Förfrågan godkänd';
  if (step.value > 1 && !isApproved.value) return 'Förfrågan nekad';
  return 'Förfrågan';
});

const completedSubTitle = computed(() => {
  if (step.value > 2 && interestRequest.value?.completedAt) return 'Utfört';
  return 'Utföra';
});

const completedColor = computed(() => {
  if (step.value > 2 && interestRequest.value?.completedAt) return 'green';
  if (step.value > 2 && !interestRequest.value?.completedAt) return 'red';
  if (isApproved.value && step.value === 2) return 'blue';
  return 'grey';
});

const payedColor = computed(() => {
  if (step.value > 3 && interestRequest.value?.payedAt) return 'green';
  if (step.value > 3 && !interestRequest.value?.payedAt) return 'red';
  if (step.value === 3 && !interestRequest.value?.payedAt) return 'blue';
  return 'grey';
});

const payedSubTitle = computed(() => {
  if (step.value > 3 && interestRequest.value?.payedAt) return 'Betald';
  return 'Betala';
});

const doneColor = computed(() => {
  if (step.value > 4 && interestRequest.value?.groupDoneAt) return 'green';
  if (step.value === 4 && interestRequest.value?.payedAt) return 'blue';
  return 'grey';
});

const loadInterestRequest = async () => {
  if (!authStore.currentUser?.id) return;

  await groupsStore.getMyGroups();
  const myGroups = groupsStore.myGroups;

  if (myGroups.length === 0) return;

  for (const group of myGroups) {
    const request = await interestRequestsStore.getInterestRequestForJobAndGroup(props.jobId, group.id);
    if (request) {
      interestRequest.value = request as WithId<InterestRequestsRecord> & { expand?: { group?: WithId<GroupsRecord>; job?: WithId<JobsRecord> & { expand?: JobsExpand } } };
      if (interestRequest.value?.jobCreatorRatingMessage) {
        jobCreatorRatingMessage.value = interestRequest.value.jobCreatorRatingMessage;
      }
      if (interestRequest.value?.jobCreatorRating) {
        jobCreatorRating.value = interestRequest.value.jobCreatorRating;
      }
      break;
    }
  }
};

const completed = async () => {
  if (!interestRequest.value) return;
  const success = await interestRequestsStore.updateInterestRequest(interestRequest.value.id, {
    completedAt: new Date().toISOString(),
    status: InterestRequestsStatusOptions.Utförd,
  });
  if (success) {
    await loadInterestRequest();
  }
};

const done = async () => {
  if (!interestRequest.value) return;
  const success = await interestRequestsStore.updateInterestRequest(interestRequest.value.id, {
    groupDoneAt: new Date().toISOString(),
    jobCreatorRating: jobCreatorRating.value,
    jobCreatorRatingMessage: jobCreatorRatingMessage.value,
  });
  if (success) {
    await loadInterestRequest();
  }
};

onMounted(async () => {
  await loadInterestRequest();
});
</script>

<style scoped>
:deep(.gt-sm-step-icon) {
  --q-timeline-icon-size: 28px;
}

@media (min-width: 600px) {
  :deep(.gt-sm-step-icon .q-timeline__entry-icon) {
    font-size: 32px !important;
    width: 48px !important;
    height: 48px !important;
  }
}
</style>

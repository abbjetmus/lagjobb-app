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
              <q-btn label="Visa grupp" class="q-ml-md" no-caps color="blue" outline @click="showGroupDialog"
                style="height: 40px;" dense />
            </div>
            <span v-show="step === 1" style="font-size: 13px;">
              Ditt meddelande som skickas när du godkänt eller nekat förfrågan
            </span>
            <q-chat-message v-show="step === 1" sent size="12">
              <q-input type="textarea" v-model="responseMessage" dense borderless no-error-icon hide-bottom-space
                lazy-rules bg-color="grey-2" class="col-12 q-mb-xs" outlined />
            </q-chat-message>
            <q-chat-message sent v-show="responseMessage && responseMessage.length > 0 && step > 1"
              name="Ditt meddelande" :text="[responseMessage]" :bg-color="isApproved ? 'green-4' : 'red-4'"
              :stamp="formatDateTime(new Date(interestRequest.responseAt || interestRequest.updated))" />
            <q-btn v-show="step === 1" @click="accept" color="green" no-caps unelevated label="Godkänn förfrågan"
              class="q-mr-md" />
            <q-btn v-show="step === 1" @click="decline" color="red-8" no-caps unelevated label="Neka förfrågan" />
          </div>
        </q-slide-transition>
      </q-timeline-entry>

      <q-timeline-entry :subtitle="completedSubTitle" icon="mdi-numeric-2" :color="completedColor" icon-size="md"
        class="gt-sm-step-icon">
        <q-slide-transition appear>
          <div v-if="isApproved" v-show="step > 1">
            <span class="block">Du kan nu hålla kontakt med {{ groupName }} på numret {{ groupPhone
              }}.</span>
            <span class="block" v-if="step === 2">
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
            <span class="block">När du har betalat för uppdraget kan du klicka på knappen betala.</span>
            <q-btn v-show="step === 3" color="green" label="Betala" @click="pay" no-caps unelevated />
          </div>
        </q-slide-transition>
      </q-timeline-entry>

      <q-timeline-entry subtitle="Klart" icon="mdi-numeric-4" :color="doneColor" icon-size="md" class="gt-sm-step-icon">
        <q-slide-transition appear>
          <div v-show="step > 3">
            <div v-show="step === 4">
              <span class="block">Lämna gärna omdöme på gruppen med stjärnorna och en kommentar.</span>
              <q-rating class="q-mb-sm" v-model="groupRating" max="5" size="2em" color="yellow" icon="star_border"
                icon-selected="star" icon-half="star_half" no-dimming />
              <q-chat-message sent size="12">
                <q-input type="textarea" v-model="groupRatingMessage" dense borderless no-error-icon hide-bottom-space
                  lazy-rules bg-color="grey-2" class="col-12 q-mb-xs" outlined />
              </q-chat-message>
            </div>
            <q-chat-message sent v-show="step > 4" name="Ditt omdöme på gruppen" bg-color="green-4"
              :stamp="formatDateTime(new Date(interestRequest.doneAt || interestRequest.updated))">
              <div>
                <span class="block">{{ groupRatingMessage }}</span>
                <q-rating class="q-mb-sm" v-model="groupRating" max="5" size="1.6em" color="yellow" icon="star_border"
                  icon-selected="star" icon-half="star_half" no-dimming readonly />
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
import { ref, computed, onMounted, watch } from 'vue';
import { useInterestRequests } from 'src/features/interestRequests/interestRequestsStore';
import type { GroupsRecord, InterestRequestsRecord, JobsRecord } from 'app/pocketbase-types';
import { InterestRequestsStatusOptions } from 'app/pocketbase-types';
import { formatDateTime } from 'src/utils/dateUtils';
import type { WithId } from 'src/models/withIdType';
import { useQuasar } from 'quasar';
import GroupDetailsDialog from 'src/features/groups/components/GroupDetailsDialog.vue';
import type { JobsExpand, GroupsExpand } from 'app/expanded-pocketbase-types';
import { useInterestRequestNotifications } from 'src/composables/useInterestRequestNotifications';

interface Props {
  interestRequestId: string;
  jobId: string;
}

const props = defineProps<Props>();
const $q = useQuasar();
const interestRequestsStore = useInterestRequests();
const { sendNotification } = useInterestRequestNotifications();

const interestRequest = ref<WithId<InterestRequestsRecord> & { expand?: { group?: WithId<GroupsRecord, GroupsExpand>; job?: WithId<JobsRecord> & { expand?: JobsExpand } } } | null>(null);
const responseMessage = ref('');
const groupRatingMessage = ref('');
const groupRating = ref(0);

const step = computed(() => {
  if (!interestRequest.value) return 1;
  if (interestRequest.value.doneAt) return 5;
  if (interestRequest.value.payedAt) return 4;
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

const groupPhone = computed(() => {
  return interestRequest.value?.expand?.group?.expand?.createdBy?.phone || '';
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
  if (isApproved.value && step.value === 2) return 'blue-8';
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
  if (step.value > 4 && interestRequest.value?.doneAt) return 'green';
  if (step.value === 4 && interestRequest.value?.payedAt) return 'blue';
  return 'grey';
});

const loadInterestRequest = async () => {
  const fullRequest = await interestRequestsStore.getInterestRequestById(props.interestRequestId);
  if (fullRequest) {
    interestRequest.value = fullRequest;
    if (interestRequest.value?.responseMessage) {
      responseMessage.value = interestRequest.value.responseMessage;
    }
    if (interestRequest.value?.groupRatingMessage) {
      groupRatingMessage.value = interestRequest.value.groupRatingMessage;
    }
    if (interestRequest.value?.groupRating) {
      groupRating.value = interestRequest.value.groupRating;
    }
  }
};

const accept = async () => {
  if (!interestRequest.value) return;
  const success = await interestRequestsStore.updateInterestRequest(interestRequest.value.id, {
    status: InterestRequestsStatusOptions.Godkänd,
    responseMessage: responseMessage.value,
    responseAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
  });
  if (success) {
    await loadInterestRequest();
    await sendNotification({
      interestRequestId: interestRequest.value.id,
      action: 'approved',
    });
  }
};

const decline = async () => {
  if (!interestRequest.value) return;
  const success = await interestRequestsStore.updateInterestRequest(interestRequest.value.id, {
    status: InterestRequestsStatusOptions.Nekad,
    responseMessage: responseMessage.value,
    responseAt: new Date().toISOString(),
  });
  if (success) {
    await loadInterestRequest();
    await sendNotification({
      interestRequestId: interestRequest.value.id,
      action: 'declined',
    });
  }
};

const completed = async () => {
  if (!interestRequest.value) return;
  const success = await interestRequestsStore.updateInterestRequest(interestRequest.value.id, {
    completedAt: new Date().toISOString(),
  });
  if (success) {
    await loadInterestRequest();
    await sendNotification({
      interestRequestId: interestRequest.value.id,
      action: 'completed',
    });
  }
};

const pay = async () => {
  if (!interestRequest.value) return;
  const success = await interestRequestsStore.updateInterestRequest(interestRequest.value.id, {
    payedAt: new Date().toISOString(),
  });
  if (success) {
    await loadInterestRequest();
    await sendNotification({
      interestRequestId: interestRequest.value.id,
      action: 'paid',
    });
  }
};

const done = async () => {
  if (!interestRequest.value) return;
  const success = await interestRequestsStore.updateInterestRequest(interestRequest.value.id, {
    doneAt: new Date().toISOString(),
    groupRating: groupRating.value,
    groupRatingMessage: groupRatingMessage.value,
  });
  if (success) {
    await loadInterestRequest();
    await sendNotification({
      interestRequestId: interestRequest.value.id,
      action: 'done',
    });
  }
};

const showGroupDialog = () => {
  if (!interestRequest.value?.expand?.group) return;
  $q.dialog({
    component: GroupDetailsDialog,
    componentProps: {
      group: interestRequest.value.expand.group,
    },
  });
};

onMounted(async () => {
  await loadInterestRequest();
});

watch(() => props.interestRequestId, async () => {
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

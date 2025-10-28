<template>
  <q-dialog ref="dialogRef" padding>
    <q-card style="min-width: 400px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Skicka intresseanmälan</div>
      </q-card-section>

      <q-card-section>
        <q-select v-model="selectedGroupId" :options="groupOptions" label="Välj grupp" outlined class="q-mb-md"
          emit-value map-options :rules="[val => !!val || 'Du måste välja en grupp']" ref="groupSelectRef" />
        <q-input v-model="interestMessage" type="textarea" label="Meddelande" outlined rows="5" />
      </q-card-section>

      <q-card-actions class="row justify-between q-pa-md">
        <q-btn unelevated label="Skicka" color="primary" @click="sendInterest" :loading="sendingInterest"
          :disable="!selectedGroupId" />
        <q-btn flat label="Avbryt" color="primary" @click="cancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useQuasar } from 'quasar';
import { useJobs } from 'src/features/jobs/jobsStore';
import { useAuth } from 'src/stores/auth';
import { InterestRequestsStatusOptions, type JobsRecord } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import type { GroupsRecord } from 'app/pocketbase-types';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const jobsStore = useJobs();
const $q = useQuasar();
const authStore = useAuth();

const props = defineProps<{
  job: WithId<JobsRecord>;
  groups: WithId<GroupsRecord>[];
}>();

const interestMessage = ref('');
const selectedGroupId = ref<string>('');
const sendingInterest = ref(false);

const groupOptions = computed(() =>
  props.groups.map(group => ({ label: group.name, value: group.id }))
);

const cancel = () => {
  onDialogCancel();
};

const sendInterest = async () => {
  if (!props.job || !authStore.currentUser || !selectedGroupId.value) return;

  sendingInterest.value = true;
  try {
    await jobsStore.sendInterestRequest({
      job: props.job.id as string,
      requestMessage: interestMessage.value,
      group: selectedGroupId.value,
      id: '',
      status: InterestRequestsStatusOptions.Förfrågan,
    });

    $q.notify({
      type: 'positive',
      message: 'Ditt intresse har skickats!',
    });

    onDialogOK();
    interestMessage.value = '';
    selectedGroupId.value = '';
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
</script>

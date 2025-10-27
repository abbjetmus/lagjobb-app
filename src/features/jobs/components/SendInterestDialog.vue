<template>
  <q-dialog ref="dialogRef" padding>
    <q-card style="min-width: 400px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Skicka intresseanmälan</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="interestMessage" type="textarea" label="Meddelande" outlined rows="5" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Avbryt" color="primary" @click="cancel" />
        <q-btn flat label="Skicka" color="primary" @click="sendInterest" :loading="sendingInterest" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useQuasar } from 'quasar';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/stores/auth';
import type { JobsRecord } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const $q = useQuasar();
const authStore = useAuth();

const props = defineProps<{
  job: WithId<JobsRecord>;
}>();

const interestMessage = ref('');
const sendingInterest = ref(false);

const cancel = () => {
  onDialogCancel();
};

const sendInterest = async () => {
  if (!props.job || !authStore.currentUser) return;

  sendingInterest.value = true;
  try {
    await pb.collection('interest_messages').create({
      uppdragId: props.job.id,
      userId: authStore.currentUser.id,
      message: interestMessage.value,
    });

    $q.notify({
      type: 'positive',
      message: 'Ditt intresse har skickats!',
    });

    onDialogOK();
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
</script>

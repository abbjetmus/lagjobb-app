<template>
  <q-dialog ref="dialogRef" padding>
    <q-card style="min-width: 400px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Skicka intresseanmälan</div>
      </q-card-section>

      <q-card-section>
        <q-select bg-color="secondary" v-model="selectedGroupId" :options="groupOptions" label="Välj grupp" outlined
          class="q-mb-md" emit-value map-options :rules="[val => !!val || 'Du måste välja en grupp']"
          ref="groupSelectRef" no-error-icon>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ scope.opt.caption }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input bg-color="secondary" v-model="interestMessage" type="textarea" label="Meddelande" outlined rows="5"
          no-error-icon />
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
import { useInterestRequests } from 'src/features/interestRequests/interestRequestsStore';
import { useAuth } from 'src/features/auth/authStore';
import { InterestRequestsStatusOptions, type JobsRecord } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import type { GroupsRecord, InterestRequestsRecord } from 'app/pocketbase-types';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const interestRequestsStore = useInterestRequests();
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
  props.groups.map(group => ({
    label: group.groupName,
    value: group.id,
    caption: group.groupType
  }))
);

const cancel = () => {
  onDialogCancel();
};

const sendInterest = async () => {
  if (!props.job || !authStore.currentUser || !selectedGroupId.value) return;

  sendingInterest.value = true;
  const success = await interestRequestsStore.sendInterestRequest({
    id: '',
    job: props.job.id,
    requestMessage: interestMessage.value,
    group: selectedGroupId.value,
    status: InterestRequestsStatusOptions.Förfrågan
  } as InterestRequestsRecord);

  if (!success) {
    $q.notify({
      type: 'negative',
      message: 'Kunde inte skicka förfrågan.',
    });
  }
  else {
    $q.notify({
      type: 'positive',
      message: 'Förfrågan har skickats!',
    });

    onDialogOK();
    interestMessage.value = '';
    selectedGroupId.value = '';
  }

};
</script>

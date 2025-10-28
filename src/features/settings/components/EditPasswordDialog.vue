<template>
  <q-dialog v-model="dialogShow" @before-hide="cancel">
    <q-card class="full-width" style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Ändra lösenord</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-start">
        <q-form ref="formRef" class="q-gutter-y-sm">
          <q-input outlined dense no-error-icon hide-bottom-space label="Nuvarande lösenord" type="password"
            v-model="oldPassword" :rules="[v => !!v || 'Nuvarande lösenord krävs']" bg-color="grey-2" />

          <q-input outlined dense no-error-icon hide-bottom-space label="Nytt lösenord" type="password"
            v-model="newPassword"
            :rules="[v => !!v || 'Nytt lösenord krävs', v => v.length >= 6 || 'Lösenordet måste vara minst 6 tecken']"
            bg-color="grey-2" />

          <q-input outlined dense no-error-icon hide-bottom-space label="Bekräfta nytt lösenord" type="password"
            v-model="confirmPassword"
            :rules="[v => !!v || 'Bekräfta lösenord krävs', v => v === newPassword || 'Lösenorden matchar inte']"
            bg-color="grey-2" />
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn unelevated color="primary" :disable="updateDisabled" label="Uppdatera" @click="update" />
        <q-btn unelevated label="Avbryt" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { QForm } from 'quasar';

interface Props {
  show: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  'updatePassword': [data: { oldPassword: string; password: string; passwordConfirm: string }];
}>();

const dialogShow = ref(props.show);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const formRef = ref<QForm | null>(null);

const updateDisabled = computed(() => {
  return !oldPassword.value || !newPassword.value || !confirmPassword.value || newPassword.value !== confirmPassword.value;
});

watch(() => props.show, (val) => {
  dialogShow.value = val;
  if (val) {
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  }
});

watch(dialogShow, (val) => {
  emit('update:show', val);
});

const cancel = () => {
  formRef.value?.resetValidation();
  dialogShow.value = false;
  oldPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
};

const update = () => {
  formRef.value?.validate().then((success) => {
    if (success) {
      emit('updatePassword', {
        oldPassword: oldPassword.value,
        password: newPassword.value,
        passwordConfirm: confirmPassword.value,
      });
      cancel();
    }
  });
};
</script>

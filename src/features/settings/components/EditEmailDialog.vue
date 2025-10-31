<template>
  <q-dialog v-model="dialogShow" @before-hide="cancel">
    <q-card class="full-width" style="min-width: 350px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Uppdatera e-post</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-start">
        <q-form ref="formRef" class="q-gutter-y-sm">
          <q-input class="bg-white" outlined no-error-icon hide-bottom-space label="E-post" type="email"
            v-model="emailValue"
            :rules="[v => !!v || 'E-post krävs', v => /.+@.+\..+/.test(v) || 'Ogiltig e-postadress']"
            bg-color="white" />
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
  currentEmail: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  'updateEmail': [email: string];
}>();

const dialogShow = ref(props.show);
const emailValue = ref(props.currentEmail);
const formRef = ref<QForm | null>(null);

const updateDisabled = computed(() => {
  return emailValue.value === props.currentEmail || !emailValue.value.trim();
});

watch(() => props.show, (val) => {
  dialogShow.value = val;
  if (val) {
    emailValue.value = props.currentEmail;
  }
});

watch(dialogShow, (val) => {
  emit('update:show', val);
});

const cancel = () => {
  formRef.value?.resetValidation();
  dialogShow.value = false;
  emailValue.value = props.currentEmail;
};

const update = async () => {
  const result = await formRef.value?.validate();
  if (result) {
    emit('updateEmail', emailValue.value.trim());
    cancel();
  }
  return result;
};
</script>

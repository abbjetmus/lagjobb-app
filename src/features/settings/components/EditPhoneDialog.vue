<template>
  <q-dialog v-model="dialogShow" @before-hide="cancel">
    <q-card class="full-width" style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Uppdatera telefon</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="text-start">
        <q-form ref="formRef" class="q-gutter-y-sm">
          <q-input outlined dense no-error-icon hide-bottom-space label="Telefon" type="tel" v-model="phoneValue"
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
  currentPhone?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  'updatePhone': [phone: string];
}>();

const dialogShow = ref(props.show);
const phoneValue = ref(props.currentPhone || '');
const formRef = ref<QForm | null>(null);

const updateDisabled = computed(() => {
  return phoneValue.value === (props.currentPhone || '');
});

watch(() => props.show, (val) => {
  dialogShow.value = val;
  if (val) {
    phoneValue.value = props.currentPhone || '';
  }
});

watch(dialogShow, (val) => {
  emit('update:show', val);
});

const cancel = () => {
  formRef.value?.resetValidation();
  dialogShow.value = false;
  phoneValue.value = props.currentPhone || '';
};

const update = () => {
  emit('updatePhone', phoneValue.value.trim());
  cancel();
};
</script>

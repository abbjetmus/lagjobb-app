<template>
  <q-input outlined v-model="timeValue" mask="time" :label="label" no-error-icon :error="hasErrors"
    :error-message="errorMessage">
    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="timeValue" format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  label: string;
  hasErrors?: boolean;
  errorMessage?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const timeValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  timeValue.value = newValue;
});

watch(timeValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

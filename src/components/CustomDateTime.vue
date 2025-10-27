<template>
  <q-input outlined :label="label" hint="YYYY-MM-DD HH:mm" v-model="selectedDateTime" no-error-icon
    :error-message="errorMessage" :error="error">
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="selectedDateTime" mask="YYYY-MM-DD HH:mm">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Stäng" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time v-model="selectedDateTime" mask="YYYY-MM-DD HH:mm" format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Stäng" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const selectedDateTime = ref<string | undefined>()

const model = defineModel({ required: false, type: String });
defineProps<{ label: string, errorMessage: string, error: boolean }>()

onMounted(() => {
  if (model.value) {
    const date = new Date(model.value);
    selectedDateTime.value = date.toISOString().slice(0, 16);
  }
})

watch(
  selectedDateTime,
  (val) => {
    if (val) {
      model.value = new Date(val).toISOString()
    }
  },
  { immediate: true }
);
</script>

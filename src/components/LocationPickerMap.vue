<template>
  <div>
    <GoogleMap
      :api-key="apiKey"
      :center="mapCenter"
      :zoom="zoom"
      :style="mapStyle"
      @click="handleMapClick"
    >
      <Marker
        v-if="selectedLocation"
        :options="{ position: selectedLocation, draggable: true }"
        @dragend="handleMarkerDragEnd"
      />
    </GoogleMap>
    
    <div v-if="selectedLocation" class="q-mt-md">
      <q-input
        v-model="locationText"
        label="Vald plats"
        outlined
        readonly
        class="q-mb-sm"
      />
      <q-btn
        label="Rensa plats"
        color="negative"
        outline
        @click="clearLocation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';

interface Props {
  modelValue?: { lat: number; lng: number } | null;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  width?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  center: () => ({ lat: 59.3293, lng: 18.0686 }),
  zoom: 10,
  height: '400px',
  width: '100%',
});

const emit = defineEmits<{
  'update:modelValue': [value: { lat: number; lng: number } | null];
}>();

const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

const selectedLocation = ref<{ lat: number; lng: number } | null>(props.modelValue);
const mapCenter = ref(props.center);

const mapStyle = computed(() => ({
  width: props.width,
  height: props.height,
}));

const locationText = computed(() => {
  if (selectedLocation.value) {
    return `Lat: ${selectedLocation.value.lat.toFixed(6)}, Lng: ${selectedLocation.value.lng.toFixed(6)}`;
  }
  return '';
});

watch(() => props.modelValue, (newValue) => {
  selectedLocation.value = newValue;
  if (newValue) {
    mapCenter.value = newValue;
  }
});

const handleMapClick = (event: any) => {
  if (event.latLng) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    selectedLocation.value = { lat, lng };
    emit('update:modelValue', { lat, lng });
  }
};

const handleMarkerDragEnd = (event: any) => {
  if (event.latLng) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    selectedLocation.value = { lat, lng };
    emit('update:modelValue', { lat, lng });
  }
};

const clearLocation = () => {
  selectedLocation.value = null;
  emit('update:modelValue', null);
};
</script>


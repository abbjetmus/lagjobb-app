<template>
  <GoogleMap
    :api-key="apiKey"
    :center="center"
    :zoom="zoom"
    :style="mapStyle"
    :map-id="mapId"
    @click="handleMapClick"
  >
    <Marker
      v-for="marker in markers"
      :key="marker.id"
      :options="{ position: marker.position, title: marker.title }"
      @click="handleMarkerClick(marker)"
    />
  </GoogleMap>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';

interface MarkerData {
  id: string;
  position: { lat: number; lng: number };
  title?: string;
}

interface Props {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MarkerData[];
  height?: string;
  width?: string;
  mapId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  center: () => ({ lat: 59.3293, lng: 18.0686 }),
  zoom: 10,
  markers: () => [],
  height: '500px',
  width: '100%',
  mapId: undefined,
});

const emit = defineEmits<{
  'marker-click': [marker: MarkerData];
  'map-click': [event: any];
}>();

const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

const mapStyle = computed(() => ({
  width: props.width,
  height: props.height,
}));

const handleMarkerClick = (marker: MarkerData) => {
  emit('marker-click', marker);
};

const handleMapClick = (event: any) => {
  emit('map-click', event);
};
</script>


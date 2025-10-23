<template>
  <div id="mapContainer" :style="mapStyle"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png'

// Fix marker icons
const DefaultIcon = L.Icon.extend({
  options: {
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }
})

const defaultIcon = new DefaultIcon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerRetina
})

L.Marker.prototype.options.icon = defaultIcon

interface Props {
  lat?: number
  lng?: number
  zoom?: number
  width?: string
  height?: string
  markers?: Array<{
    lat: number
    lng: number
    title?: string
    popup?: string
  }>
}

const props = withDefaults(defineProps<Props>(), {
  lat: 46.05,
  lng: 11.05,
  zoom: 5,
  width: '100%',
  height: '400px',
  markers: () => []
})

const map = ref<L.Map | null>(null)
const markers = ref<L.Marker[]>([])

const mapStyle = ref({
  width: props.width,
  height: props.height
})

const initializeMap = () => {
  if (map.value) {
    map.value.remove()
  }

  // Create map
  map.value = L.map('mapContainer').setView([props.lat, props.lng], props.zoom)

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map.value)

  // Add markers
  addMarkers()
}

const addMarkers = () => {
  if (!map.value) return

  // Clear existing markers
  markers.value.forEach(marker => marker.remove())
  markers.value = []

  // Add new markers
  props.markers.forEach(markerData => {
    const marker = L.marker([markerData.lat, markerData.lng])
      .addTo(map.value!)

    if (markerData.title) {
      marker.bindTooltip(markerData.title)
    }

    if (markerData.popup) {
      marker.bindPopup(markerData.popup)
    }

    markers.value.push(marker)
  })
}

const updateMapView = () => {
  if (map.value) {
    map.value.setView([props.lat, props.lng], props.zoom)
  }
}

// Watch for prop changes
watch(() => [props.lat, props.lng, props.zoom], () => {
  updateMapView()
})

watch(() => props.markers, () => {
  addMarkers()
}, { deep: true })

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
#mapContainer {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

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

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
const markerInstances = ref<L.Marker[]>([])

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
  if (map.value) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map.value as L.Map)
  }

  // Add markers
  addMarkers()
}

const addMarkers = () => {
  if (!map.value) return

  // Clear existing markers
  markerInstances.value.forEach(marker => marker.remove())
  markerInstances.value = []

  // Add new markers
  if (map.value) {
    props.markers.forEach(markerData => {
      const marker = L.marker([markerData.lat, markerData.lng])
      marker.addTo(map.value as L.Map)

      if (markerData.title) {
        marker.bindTooltip(markerData.title)
      }

      if (markerData.popup) {
        marker.bindPopup(markerData.popup)
      }

      markerInstances.value.push(marker)
    })
  }
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

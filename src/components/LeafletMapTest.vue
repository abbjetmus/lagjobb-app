<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Leaflet Map Test</div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-sm">Map Controls</div>
        <div class="row q-gutter-sm">
          <q-input
            v-model.number="mapLat"
            label="Latitude"
            type="number"
            step="0.0001"
            style="width: 150px"
          />
          <q-input
            v-model.number="mapLng"
            label="Longitude"
            type="number"
            step="0.0001"
            style="width: 150px"
          />
          <q-input
            v-model.number="mapZoom"
            label="Zoom"
            type="number"
            min="1"
            max="18"
            style="width: 100px"
          />
          <q-btn color="primary" @click="addRandomMarker">
            Add Random Marker
          </q-btn>
          <q-btn color="secondary" @click="clearMarkers">
            Clear Markers
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-sm">Interactive Map</div>
        <LeafletMap
          :lat="mapLat"
          :lng="mapLng"
          :zoom="mapZoom"
          :markers="markers"
          width="100%"
          height="500px"
        />
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6 q-mb-sm">Current Markers</div>
        <div v-if="markers.length === 0" class="text-grey">
          No markers added yet
        </div>
        <div v-else>
          <q-list>
            <q-item
              v-for="(marker, index) in markers"
              :key="index"
              clickable
              @click="centerOnMarker(marker)"
            >
              <q-item-section>
                <q-item-label>{{ marker.title || `Marker ${index + 1}` }}</q-item-label>
                <q-item-label caption>
                  Lat: {{ marker.lat }}, Lng: {{ marker.lng }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click.stop="removeMarker(index)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LeafletMap from './LeafletMap.vue'

const mapLat = ref(46.05)
const mapLng = ref(11.05)
const mapZoom = ref(5)

const markers = ref([
  {
    lat: 50,
    lng: 14,
    title: 'Prague',
    popup: 'Welcome to Prague!'
  },
  {
    lat: 53,
    lng: 20,
    title: 'Warsaw',
    popup: 'Welcome to Warsaw!'
  },
  {
    lat: 49.5,
    lng: 19.5,
    title: 'Krakow',
    popup: 'Welcome to Krakow!'
  },
  {
    lat: 49,
    lng: 25,
    title: 'Lviv',
    popup: 'Welcome to Lviv!'
  }
])

const addRandomMarker = () => {
  const randomLat = (Math.random() - 0.5) * 20 + 46.05
  const randomLng = (Math.random() - 0.5) * 20 + 11.05

  markers.value.push({
    lat: randomLat,
    lng: randomLng,
    title: `Random Marker ${markers.value.length + 1}`,
    popup: `This is marker ${markers.value.length + 1}`
  })
}

const clearMarkers = () => {
  markers.value = []
}

const removeMarker = (index: number) => {
  markers.value.splice(index, 1)
}

const centerOnMarker = (marker: { lat: number; lng: number }) => {
  mapLat.value = marker.lat
  mapLng.value = marker.lng
  mapZoom.value = 10
}
</script>

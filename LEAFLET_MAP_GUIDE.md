# 🗺️ Leaflet Map Component

## ✅ **Modern Leaflet Implementation**

A clean, modern Leaflet map component using Vue 3 Composition API and TypeScript.

### **🎯 Features:**

- ✅ **Vue 3 Composition API** - Modern Vue.js patterns
- ✅ **TypeScript support** - Full type safety
- ✅ **Quasar integration** - Works seamlessly with Quasar components
- ✅ **Interactive markers** - Add, remove, and manage markers
- ✅ **Responsive design** - Adapts to container size
- ✅ **No API keys required** - Uses OpenStreetMap tiles

### **📦 Dependencies:**

```bash
npm install leaflet @types/leaflet
```

### **🔧 Usage:**

```vue
<template>
  <LeafletMap
    :lat="46.05"
    :lng="11.05"
    :zoom="5"
    :markers="markers"
    width="100%"
    height="400px"
  />
</template>

<script setup>
import LeafletMap from "src/components/LeafletMap.vue";

const markers = ref([
  {
    lat: 50,
    lng: 14,
    title: "Prague",
    popup: "Welcome to Prague!",
  },
]);
</script>
```

### **📝 Props:**

| Prop      | Type   | Default | Description             |
| --------- | ------ | ------- | ----------------------- |
| `lat`     | number | 46.05   | Map center latitude     |
| `lng`     | number | 11.05   | Map center longitude    |
| `zoom`    | number | 5       | Initial zoom level      |
| `width`   | string | '100%'  | Map width               |
| `height`  | string | '400px' | Map height              |
| `markers` | Array  | []      | Array of marker objects |

### **🎯 Marker Object:**

```typescript
interface Marker {
  lat: number; // Latitude
  lng: number; // Longitude
  title?: string; // Tooltip text
  popup?: string; // Popup content
}
```

### **🧪 Test the Implementation:**

Visit: `http://localhost:9000/leaflet-map-test`

**Features:**

- ✅ **Interactive map** - Pan, zoom, click
- ✅ **Add markers** - Click "Add Random Marker"
- ✅ **Remove markers** - Click delete button
- ✅ **Center on marker** - Click marker in list
- ✅ **Real-time updates** - Markers update instantly

### **🎉 Benefits:**

1. **No API keys** - Uses free OpenStreetMap tiles
2. **Lightweight** - Much smaller than Google Maps
3. **Open source** - No usage restrictions
4. **Customizable** - Easy to style and extend
5. **Mobile friendly** - Touch gestures work perfectly

### **🚀 Advanced Features:**

- **Custom markers** - Use your own icons
- **Clustering** - Group nearby markers
- **Drawing tools** - Add shapes and paths
- **Heatmaps** - Visualize data density
- **Routing** - Add navigation features

This is a **clean, modern, and efficient** map solution that's perfect for displaying location pins! 🎯

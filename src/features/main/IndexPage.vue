<template>
  <div>
    <div class="bg-image" style="border-bottom: 2px solid var(--q-primary)">
      <q-page class="flex flex-center q-pa-sm">
        <div>
          <div class="row items-center">
            <div class="col-xs-0 col-1"></div>
            <div class="col-xs-12 col-10">
              <p class="text-center text-h5 text-md-h4 text-white">
                Hitta uppdrag som ditt lag, klass eller förening kan utföra för att tjäna pengar
              </p>
              <p class="text-center text-subtitle1 text-sm-h5 text-white">Sök bland intressanta uppdrag</p>

              <div class="row">
                <q-select ref="jobsRef" v-model="selectedSubcategories" :options="filterJobsOptions" use-chips use-input
                  multiple outlined @filter="filterJobsFn" input-debounce="0" hide-dropdown-icon
                  label="Välj uppdragstyper..." bg-color="secondary" option-label="title" option-value="id" emit-value
                  map-options class="col-xs-12 col-md q-mt-sm q-mb-xs" square>
                  <template v-slot:prepend>
                    <q-icon name="mdi-briefcase" />
                  </template>

                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.title }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.category }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <q-select ref="cityRef" v-model="selectedCities" :options="filterCityOptions" use-chips use-input
                  multiple outlined @filter="filterCityFn" input-debounce="0" hide-dropdown-icon label="Välj orter..."
                  bg-color="secondary" option-label="title" option-value="id" emit-value map-options
                  class="col-xs-12 col-md q-mt-sm q-mb-xs" square>
                  <template v-slot:prepend>
                    <q-icon name="mdi-map-marker" />
                  </template>

                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.title }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.county }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <q-btn unelevated color="primary" icon="search" @click="search()"
                  class="col-12 col-md-1 q-mt-sm q-mb-xs" square />
                <q-btn st unelevated label="visa alla uppdrag" color="primary" @click="searchAll()"
                  class="col-12 col-md-1 q-ml-md-sm q-mt-sm q-mb-xs" style="min-width: 120px; margin-left: 1px;"
                  square />
              </div>
            </div>
            <div class="col-xs-0 col-1"></div>
          </div>
        </div>
      </q-page>
    </div>

    <div class="text-center q-py-xl q-px-md bg-grey-2">
      <span class="block text-h5 text-md-h4">
        Registrerade lag, klasser och föreningar redo att hjälpa dig
      </span>
      <span class="text-center block q-mb-xl text-subtitle1 text-sm-h5">
        Klicka på kategori för ett se vilka de är
      </span>
      <div class="row justify-center">
        <div class="col-xs-12 col-md-8 col-lg-6 row justify-around q-gutter-md">
          <q-btn unelevated style="width: 140px;" label="Lag" color="primary"
            :to="{ path: '/grupper', query: { groupType: 'Lag' } }" square />
          <q-btn unelevated style="width: 140px;" label="Klasser" color="primary"
            :to="{ path: '/grupper', query: { groupType: 'Klass' } }" square />
          <q-btn unelevated style="width: 140px;" label="Föreningar" color="primary"
            :to="{ path: '/grupper', query: { groupType: 'Förening' } }" square />
          <q-btn unelevated style="width: 140px;" label="Organisationer" color="primary"
            :to="{ path: '/grupper', query: { groupType: 'Organisation' } }" square />
        </div>
      </div>
    </div>

    <q-footer :dark="$q.dark.isActive" class="bg-secondary text-primary q-pa-lg"
      style="border-top: 2px solid var(--q-primary)">
      <footer-component />
    </q-footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useJobs } from 'src/features/jobs/jobsStore';
import { useQuasar, QSelect } from 'quasar';
import FooterComponent from 'src/components/FooterComponent.vue';
import { useSEO } from 'src/composables/useSEO';

const router = useRouter();
const jobsStore = useJobs();
const $q = useQuasar();

const getAbsoluteUrl = (path: string) => {
  if (typeof window === 'undefined') {
    const baseUrl = process.env.APP_URL || 'https://lagjobb.se';
    return `${baseUrl}${path}`;
  }
  return `${window.location.origin}${path}`;
};

useSEO({
  title: 'Lagjobb - Hitta uppdrag för ditt lag, klass eller förening',
  description: 'Lagjobb - Vi hjälper Sveriges föreningar genom att låta dem hjälpa dig! Hitta uppdrag som ditt lag, klass eller förening kan utföra för att tjäna pengar.',
  image: '/soccer-team.jpg',
  url: getAbsoluteUrl('/'),
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lagjobb',
    description: 'Vi hjälper Sveriges föreningar genom att låta dem hjälpa dig!',
    url: getAbsoluteUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getAbsoluteUrl('/sok-uppdrag')}?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lagjobb',
      logo: {
        '@type': 'ImageObject',
        url: getAbsoluteUrl('/soccer-team.jpg')
      }
    }
  }
});

const jobsRef = ref<QSelect | null>(null);
const cityRef = ref<QSelect | null>(null);
const selectedSubcategories = ref<string[]>([]);
const selectedCities = ref<string[]>([]);

// Simplified data structures with unique entries
const allCities = computed(() => {
  const citiesMap = new Map<string, { id: string; title: string; county: string }>();

  jobsStore.counties.forEach(county => {
    county.expand?.cities_via_county?.forEach(city => {
      // Use title as key to ensure uniqueness
      if (!citiesMap.has(city.title)) {
        citiesMap.set(city.title, {
          id: city.id,
          title: city.title,
          county: county.title
        });
      }
    });
  });

  return Array.from(citiesMap.values()).sort((a, b) => {
    // First sort by county, then by city name
    if (a.county !== b.county) {
      return a.county.localeCompare(b.county);
    }
    return a.title.localeCompare(b.title);
  });
});

const allJobSubcategories = computed(() => {
  const subcategoriesMap = new Map<string, { id: string; title: string; category: string }>();

  jobsStore.categories.forEach(category => {
    category.expand?.jobSubcategories_via_category?.forEach(sub => {
      // Use title as key to ensure uniqueness
      if (!subcategoriesMap.has(sub.title)) {
        subcategoriesMap.set(sub.title, {
          id: sub.id,
          title: sub.title,
          category: category.title
        });
      }
    });
  });

  return Array.from(subcategoriesMap.values()).sort((a, b) => {
    // First sort by category, then by subcategory name
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
});

// Simple filter functions
const filterCityOptions = ref<Array<{ id: string; title: string; county: string }>>([]);
const filterJobsOptions = ref<Array<{ id: string; title: string; category: string }>>([]);


// Initialize options
watch(allCities, (cities) => {
  filterCityOptions.value = cities;
}, { immediate: true });

watch(allJobSubcategories, (subcategories) => {
  filterJobsOptions.value = subcategories;
}, { immediate: true });

const search = () => {
  const filters: Record<string, string> = {};

  selectedCities.value.forEach(cityId => {
    const city = allCities.value.find(c => c.id === cityId);
    if (city) {
      filters['city' + cityId] = city.title;
    }
  });

  selectedSubcategories.value.forEach(subId => {
    const sub = allJobSubcategories.value.find(s => s.id === subId);
    if (sub) {
      filters['uppdrag' + subId] = sub.title;
    }
  });

  router.push({ path: '/sok-uppdrag', query: filters }).catch(() => { });
};

const searchAll = () => {
  router.push({ path: '/sok-uppdrag', query: {} }).catch(() => { });
};

const filterCityFn = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filterCityOptions.value = allCities.value;
    } else {
      const needle = val.toLowerCase();
      filterCityOptions.value = allCities.value.filter(city =>
        city.title.toLowerCase().includes(needle)
      );
    }
  });
};

const filterJobsFn = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filterJobsOptions.value = allJobSubcategories.value;
    } else {
      const needle = val.toLowerCase();
      filterJobsOptions.value = allJobSubcategories.value.filter(subcategory =>
        subcategory.title.toLowerCase().includes(needle)
      );
    }
  });
};

</script>

<style scoped>
.bg-image {
  background: url("../../assets/soccer-team.jpg") no-repeat center center fixed;
  background-size: cover;
  min-height: 500px;
  overflow: hidden;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url("../../assets/soccer-team.jpg");
}
</style>

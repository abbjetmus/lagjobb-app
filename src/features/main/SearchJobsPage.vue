<template>
  <q-page class="page-background-pattern">
    <div class="bg-image" style="border-bottom: 2px solid var(--q-primary)">
      <div class="search-container  q-pa-sm">
        <div>
          <div class="row items-center">
            <div class="col-xs-0 col-1"></div>
            <div class="col-xs-12 col-10">
              <div class="row">
                <q-select ref="jobsRef" style="min-width: 300px;" v-model="selectedSubcategories"
                  :options="filterJobsOptions" use-chips use-input multiple outlined @filter="filterJobsFn"
                  input-debounce="0" hide-dropdown-icon label="Välj uppdragstyper..." bg-color="secondary"
                  option-label="title" option-value="id" emit-value map-options class="col-xs-12 col-md q-mt-sm q-mb-xs"
                  square>
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

                <q-select ref="cityRef" style="min-width: 300px;" v-model="selectedCities" :options="filterCityOptions"
                  use-chips use-input multiple outlined @filter="filterCityFn" input-debounce="0" hide-dropdown-icon
                  label="Välj orter..." bg-color="secondary" option-label="title" option-value="id" emit-value
                  map-options class="col-xs-12 col-md q-mt-sm q-mb-xs" square>
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

                <q-btn unelevated color="primary" icon="search" @click="searchUppdrag"
                  class="col-12 col-md-1 q-mt-sm q-mb-xs" square />

                <q-btn label="visa alla" color="primary" unelevated @click="clearFilters"
                  class="col-12 col-md-1 q-ml-md-sm q-mt-sm q-mb-xs" style="min-width: 120px; margin-left: 1px;"
                  square />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="uppdrag.length === 0" style="min-height: 50vh;">
      <div class="text-center q-pa-xl">
        <q-icon name="search" size="5em" color="grey" />
        <div class="text-h6 q-mt-md text-grey">Inga uppdrag hittades</div>
      </div>
    </div>

    <q-list v-else separator class="q-pa-md">
      <job-list-item v-for="item in uppdrag" :key="item.id" :job="item" :to="`/uppdrag/${item.id}`" />
    </q-list>

    <q-page-sticky v-if="!loading && uppdrag.length > 0" position="bottom" :offset="[0, 18]">
      <q-pagination v-model="current" :max="totalPages" direction-links boundary-links icon-first="skip_previous"
        icon-last="skip_next" icon-prev="fast_rewind" icon-next="fast_forward" color="primary"
        class="q-pa-sm rounded-borders" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useJobs } from 'src/features/jobs/jobsStore';
import JobListItem from 'src/features/jobs/components/JobListItem.vue';
import type { WithId } from 'src/models/withIdType';
import type { JobsRecord } from 'app/pocketbase-types';
import { QSelect } from 'quasar';
import type { JobsExpand } from 'app/expanded-pocketbase-types';
const router = useRouter();
const route = useRoute();
const jobsStore = useJobs();
const jobsRef = ref<QSelect | null>(null);
const cityRef = ref<QSelect | null>(null);
const uppdrag = ref<(WithId<JobsRecord> & { expand?: JobsExpand })[]>([]);
const loading = ref(false);
const selectedSubcategories = ref<string[]>([]);
const selectedCities = ref<string[]>([]);
const current = ref(1);
const totalPages = ref(1);
const isUpdatingQuery = ref(false);
const isInitializing = ref(true);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const allCities = computed(() => {
  const citiesMap = new Map<string, { id: string; title: string; county: string }>();

  jobsStore.counties.forEach(county => {
    county.expand?.cities_via_county?.forEach(city => {
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
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
});

const filterCityOptions = ref<Array<{ id: string; title: string; county: string }>>([]);
const filterJobsOptions = ref<Array<{ id: string; title: string; category: string }>>([]);

watch(allCities, (cities) => {
  filterCityOptions.value = cities;
}, { immediate: true });

watch(allJobSubcategories, (subcategories) => {
  filterJobsOptions.value = subcategories;
}, { immediate: true });

watch([selectedCities, selectedSubcategories], () => {
  if (!isUpdatingQuery.value && !isInitializing.value) {
    current.value = 1;
    updateQueryParams();
    debouncedSearch();
  }
});

watch(() => route.query, (newQuery) => {
  if (!isUpdatingQuery.value && !isInitializing.value) {
    isUpdatingQuery.value = true;
    loadFromQueryParams(newQuery as Record<string, string | string[] | null>);
    isUpdatingQuery.value = false;
    debouncedSearch();
  }
});

const updateQueryParams = () => {
  const filters: Record<string, string> = {};

  if (current.value > 1) {
    filters.page = current.value.toString();
  }

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

  isUpdatingQuery.value = true;
  router.replace({ path: route.path, query: filters }).catch(() => { }).finally(() => {
    isUpdatingQuery.value = false;
  });
};

const loadFromQueryParams = (query: Record<string, string | string[] | null>) => {
  const cityIds: string[] = [];
  const subcategoryIds: string[] = [];

  for (const key in query) {
    const value = query[key];
    if (value == null) continue;

    if (key.startsWith('city')) {
      const id = key.replace('city', '');
      const city = allCities.value.find(c => c.id === id);
      if (city && !cityIds.includes(id)) {
        cityIds.push(id);
      }
    } else if (key.startsWith('uppdrag')) {
      const id = key.replace('uppdrag', '');
      const sub = allJobSubcategories.value.find(s => s.id === id);
      if (sub && !subcategoryIds.includes(id)) {
        subcategoryIds.push(id);
      }
    } else if (key === 'page') {
      const page = Number(value);
      if (!isNaN(page) && page > 0) {
        current.value = page;
      }
    }
  }

  selectedCities.value = cityIds;
  selectedSubcategories.value = subcategoryIds;
};

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    void searchUppdrag();
  }, 300);
};

const searchUppdrag = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;
  try {
    const result = await jobsStore.searchJobs({
      subcategoryIds: selectedSubcategories.value,
      cityIds: selectedCities.value,
      page: current.value,
      pageSize: 50,
    });

    uppdrag.value = result.items;
    totalPages.value = result.totalPages;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error &&
      (error.message === 'signal is aborted without reason' || error.message?.toString().includes('autocancelled'))) {
      // Request was cancelled by PocketBase, ignore
      return;
    }
    console.error('Search error:', error);
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  selectedSubcategories.value = [];
  selectedCities.value = [];
  current.value = 1;
  updateQueryParams();
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

watch(current, () => {
  if (!isInitializing.value) {
    updateQueryParams();
    debouncedSearch();
  }
});

onMounted(async () => {
  try {
    await jobsStore.getAllCounties();
  } catch (error) {
    // Ignore cancellation errors
    if (error && typeof error === 'object' && 'message' in error &&
      !error.message?.toString().includes('autocancelled')) {
      console.error('Get counties error:', error);
    }
  }

  try {
    await jobsStore.getAllJobCategories();
  } catch (error) {
    // Ignore cancellation errors
    if (error && typeof error === 'object' && 'message' in error &&
      !error.message?.toString().includes('autocancelled')) {
      console.error('Get job categories error:', error);
    }
  }

  if (Object.keys(route.query).length > 0) {
    loadFromQueryParams(route.query as Record<string, string | string[] | null>);
  }

  try {
    await searchUppdrag();
  } catch {
    // Error handling already in searchUppdrag
  } finally {
    isInitializing.value = false;
  }
});
</script>

<style scoped>
.bg-image {
  background: url("../../assets/soccer-team.jpg") no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url("../../assets/soccer-team.jpg");
}

.search-container {
  max-width: 1000px !important;
  margin: 0 auto;
}
</style>

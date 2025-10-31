<template>
  <q-page class="page-background-pattern">
    <div class="bg-image">
      <div class="search-container q-pa-sm" style="border-bottom: 2px solid var(--q-primary)">
        <div class="text-grey-3">
          <div class="text-center text-h5 text-md-h4 q-my-md">
            Registrerade lag, klasser och föreningar
          </div>

          <div class="row" :class="$q.screen.gt.sm ? 'q-pb-xl' : 'q-pb-md'">
            <q-select ref="cityRef" style="min-width: 300px;" v-model="selectedCities" :options="filterCityOptions"
              use-chips use-input multiple outlined @filter="filterCityFn" input-debounce="0" hide-dropdown-icon
              label="Välj orter..." bg-color="secondary" option-label="title" option-value="id" emit-value map-options
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

            <q-select style="min-width: 300px;" v-model="selectedGroupTypes" :options="groupTypeOptions" use-chips
              multiple outlined label="Välj grupptyp..." bg-color="secondary" option-label="label" option-value="value"
              emit-value map-options class="col-xs-12 col-md q-mt-sm q-mb-xs" square>
              <template v-slot:prepend>
                <q-icon name="group" />
              </template>
            </q-select>

            <q-btn unelevated color="primary" icon="search" @click="loadGroups()"
              class="col-12 col-md-1 q-mt-sm q-mb-xs" square />
            <q-btn unelevated label="visa alla grupper" color="primary" @click="clearFilters()"
              class="col-12 col-md-1 q-ml-md-sm q-mt-sm q-mb-xs" style="min-width: 120px; margin-left: 1px;" square />
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="groups.length === 0" style="min-height: 50vh;">
      <div class="text-center q-pa-xl">
        <q-icon name="groups" size="5em" />
        <div class="text-h6 q-mt-md text-grey">Inga grupper hittades</div>
      </div>
    </div>

    <q-list v-else separator class="q-pa-md">
      <group-list-item v-for="group in groups" :key="group.id" :group="group" :to="`/grupp/${group.id}`" />
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { Collections, GroupsGroupTypeOptions } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import type { GroupsRecord } from 'app/pocketbase-types';
import GroupListItem from './components/GroupListItem.vue';
import { useJobs } from 'src/features/jobs/jobsStore';
import { QSelect } from 'quasar';

const route = useRoute();
const jobsStore = useJobs();

const groups = ref<WithId<GroupsRecord>[]>([]);
const loading = ref(true);
const selectedCities = ref<string[]>([]);
const selectedGroupTypes = ref<GroupsGroupTypeOptions[]>([]);
const cityRef = ref<QSelect | null>(null);

const groupTypeOptions = [
  { label: 'Lag', value: GroupsGroupTypeOptions.Lag },
  { label: 'Klass', value: GroupsGroupTypeOptions.Klass },
  { label: 'Förening', value: GroupsGroupTypeOptions['Förening'] },
  { label: 'Organisation', value: GroupsGroupTypeOptions.Organisation },
];

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

const filterCityOptions = ref<Array<{ id: string; title: string; county: string }>>([]);

watch(allCities, (cities) => {
  filterCityOptions.value = cities;
}, { immediate: true });

watch([selectedCities, selectedGroupTypes], () => {
  void loadGroups();
}, { deep: true });

watch(() => route.query.groupType, (groupType) => {
  if (groupType && typeof groupType === 'string') {
    const groupTypeValue = groupTypeOptions.find(opt => opt.label === groupType);
    if (groupTypeValue && !selectedGroupTypes.value.includes(groupTypeValue.value)) {
      selectedGroupTypes.value = [groupTypeValue.value];
    }
  } else if (!groupType) {
    selectedGroupTypes.value = [];
  }
});

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

const loadGroups = async () => {
  loading.value = true;
  try {
    const filters: string[] = [];

    if (selectedCities.value.length > 0) {
      const cityFilter = selectedCities.value.map(cityId => `city="${cityId}"`).join(' || ');
      filters.push(`(${cityFilter})`);
    }

    if (selectedGroupTypes.value.length > 0) {
      const groupTypeFilter = selectedGroupTypes.value.map(type => `groupType="${type}"`).join(' || ');
      filters.push(`(${groupTypeFilter})`);
    }

    const filter = filters.length > 0 ? filters.join(' && ') : undefined;

    const records = await pb.collection(Collections.Groups).getList(1, 50, {
      ...(filter && { filter }),
      sort: '-created',
    });

    groups.value = records.items as unknown as WithId<GroupsRecord>[];
  } catch (error) {
    console.error('Load groups error:', error);
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  selectedCities.value = [];
  selectedGroupTypes.value = [];
};

onMounted(async () => {
  if (jobsStore.counties.length === 0) {
    await jobsStore.getAllCounties();
  }

  const groupTypeFromQuery = route.query.groupType;
  if (groupTypeFromQuery && typeof groupTypeFromQuery === 'string') {
    const groupTypeValue = groupTypeOptions.find(opt => opt.label === groupTypeFromQuery);
    if (groupTypeValue) {
      selectedGroupTypes.value = [groupTypeValue.value];
    }
  } else {
    void loadGroups();
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

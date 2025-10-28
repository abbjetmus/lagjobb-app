<template>
  <q-page class="q-pa-md row justify-center page-background-pattern">
    <div style="max-width: 800px; width: 100%;">
      <div class="text-h5 q-mb-md">{{ isEdit ? 'Uppdatera grupp' : 'Skapa ny grupp' }}</div>
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">

        <div class="text-h6 q-mb-md">Typ av grupp</div>

        <q-select v-model="group.groupType" :options="Object.values(GroupsGroupTypeOptions)" label="Grupptyp" outlined
          emit-value map-options :error="r$.groupType.$error" error-message="Grupptyp krävs" bg-color="white"
          no-error-icon />

        <q-card flat v-if="group.groupType" class="q-pa-none">
          <component :is="componentMap[group.groupType]" :key="group.groupType" v-model="group" :r="r$" />
        </q-card>

        <q-input v-model="group.description" type="textarea" label="Beskrivning" outlined rows="5"
          :error="r$.description.$error" error-message="Beskrivning är felaktigt ifylld" bg-color="white"
          no-error-icon />

        <q-select v-model="group.city" :options="filterCityOptions" label="Närmaste stad" outlined emit-value
          map-options use-input @filter="filterCityFn" option-value="id" option-label="title" :error="r$.city.$error"
          error-message="Stad krävs" bg-color="white" no-error-icon input-debounce="0">
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.title }}</q-item-label>
                <q-item-label caption>{{ scope.opt.county }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <div class="text-h6">Bild</div>
        <q-card flat class="bg-white">
          <q-card-section>
            <ImageThumbnail :photo-url="currentImageUrl" size="150px" @file-selected="onImageSelected" />
          </q-card-section>
        </q-card>

        <div align="left" class="row justify-between q-mt-md">
          <q-btn unelevated type="submit" color="primary" :label="isEdit ? 'Uppdatera grupp' : 'Skapa grupp'"
            :loading="loading" />
          <q-btn flat color="primary" label="Avbryt" @click="router.back()" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import type { Component } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { useQuasar } from 'quasar';
import { useRegle } from '@regle/core';
import { required } from '@regle/rules';
import TeamGroupForm from './components/TeamGroupForm.vue';
import ClassGroupForm from './components/ClassGroupForm.vue';
import AssociationGroupForm from './components/AssociationGroupForm.vue';
import OrganizationGroupForm from './components/OrganizationGroupForm.vue';
import { GroupsGroupTypeOptions, Collections, type GroupsRecord } from 'app/pocketbase-types';
import ImageThumbnail from 'src/components/ImageThumbnail.vue';
import { useGroups } from './groupsStore';
import { useJobs } from '../jobs/jobsStore';
import { useAuth } from 'src/stores/auth';

const router = useRouter();
const route = useRoute();
const groupsStore = useGroups();
const jobsStore = useJobs();
const $q = useQuasar();
const authStore = useAuth();
const loading = ref(false);
const initialLoading = ref(true);
const currentImageUrl = ref<string | null>(null);
const filterCityOptions = ref<Array<{ id: string; title: string; county: string }>>([]);

const componentMap: Record<GroupsGroupTypeOptions, Component> = {
  [GroupsGroupTypeOptions.Lag]: TeamGroupForm,
  [GroupsGroupTypeOptions.Klass]: ClassGroupForm,
  [GroupsGroupTypeOptions['Förening']]: AssociationGroupForm,
  [GroupsGroupTypeOptions.Organisation]: OrganizationGroupForm,
};

const group = ref<GroupsRecord>({
  id: '',
  createdBy: authStore.currentUser?.id || '',
  groupType: GroupsGroupTypeOptions.Lag,
  groupName: '',
  sectionName: '',
  description: '',
  city: '',
  verified: false,
  image: '',
});

const groupImage = ref<File | null>(null);

const isEdit = computed(() => route.params.id != null);

const onImageSelected = (file: File | null) => {
  groupImage.value = file;
};

// Validation rules
const baseRules: Record<string, { required: typeof required }> = {
  groupType: {
    required: required,
  },
  groupName: {
    required: required,
  },
  city: {
    required: required,
  },
};

const rules = computed(() => {
  const currentRules = { ...baseRules };

  // Add groupCategoryName validation only for Team (Lag) type
  if (group.value.groupType === GroupsGroupTypeOptions.Lag) {
    currentRules.groupCategoryName = {
      required: required,
    };
    currentRules.sectionName = {
      required: required,
    };
  }

  if (group.value.groupType === GroupsGroupTypeOptions.Klass) {
    currentRules.sectionName = {
      required: required,
    };
  }

  return currentRules;
});

const { r$ } = useRegle(
  {
    groupType: computed(() => group.value.groupType),
    groupCategoryName: computed(() => group.value.groupCategoryName || ''),
    groupName: computed(() => group.value.groupName || ''),
    sectionName: computed(() => group.value.sectionName || ''),
    description: computed(() => group.value.description || ''),
    city: computed(() => group.value.city || ''),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules as any,
  {
    silent: false
  }
);

// Simplified data structure with unique entries like IndexPage.vue
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

// Initialize data
onBeforeMount(async () => {
  await jobsStore.getAllCounties();
  filterCityOptions.value = allCities.value;

  if (isEdit.value) {
    const id = route.params.id as string;
    try {
      group.value = await pb.collection(Collections.Groups).getOne<GroupsRecord>(id) as unknown as GroupsRecord;
    } catch (error) {
      console.error('Load group error:', error);
      $q.notify({
        type: 'negative',
        message: 'Kunde inte ladda grupp.',
      });
      void router.push('/mina-grupper-lista');
    }
  }
  initialLoading.value = false;
});

const onSubmit = async () => {
  const result = await r$.$validate();
  if (!result.valid) {
    return;
  }

  loading.value = true;
  try {
    let success = false;

    if (isEdit.value) {
      success = await groupsStore.updateGroup(group.value, groupImage.value);
      if (success) {
        $q.notify({
          type: 'positive',
          message: 'Grupp uppdaterad!',
        });
        void router.push('/mina-grupper-lista');
      } else {
        $q.notify({
          type: 'negative',
          message: 'Kunde inte uppdatera grupp.',
        });
      }
    } else {
      success = await groupsStore.createGroup(group.value, groupImage.value);
      if (success) {
        $q.notify({
          type: 'positive',
          message: 'Grupp skapad!',
        });
        void router.push('/mina-grupper-lista');
      } else {
        $q.notify({
          type: 'negative',
          message: 'Kunde inte skapa grupp.',
        });
      }
    }
  } catch (error) {
    console.error('Create/update group error:', error);
    $q.notify({
      type: 'negative',
      message: isEdit.value ? 'Kunde inte uppdatera grupp.' : 'Kunde inte skapa grupp.',
    });
  } finally {
    loading.value = false;
  }
};
</script>

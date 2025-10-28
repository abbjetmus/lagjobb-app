<template>
  <q-page class="q-pa-md row justify-center page-background-pattern">
    <div style="max-width: 800px; width: 100%;">
      <div class="text-h5 q-mb-md">{{ isEdit ? 'Uppdatera uppdrag' : 'Skapa nytt uppdrag' }}</div>
      <q-form v-if="job" @submit.prevent="onSubmit" ref="form">

        <div class="text-h6 q-mb-md">Uppdragsinformation</div>

        <q-input v-model="job.title" label="Titel" outlined :error="r$.title.$error"
          error-message="Titel är obligatoriskt" bg-color="secondary" no-error-icon />

        <q-input v-model="job.description" type="textarea" label="Beskrivning" outlined rows="5"
          :error="r$.description.$error" error-message="Beskrivning är obligatorisk" bg-color="secondary"
          no-error-icon />

        <q-input v-model.number="job.price" type="number" label="Pris (kr)" outlined bg-color="secondary" no-error-icon
          :error="r$.price.$error" error-message="Pris är obligatoriskt" />

        <custom-date-time v-model="job.desiredAt" label="Önskat datum" :error="r$.desiredAt.$error"
          error-message="Önskat datum är obligatoriskt" class="q-mb-md" bg-color="secondary" />

        <q-input v-model.number="job.desiredNumberOfPeople" type="number" label="Önskad minst antal personer" outlined
          bg-color="secondary" no-error-icon :error="r$.desiredNumberOfPeople.$error"
          error-message="Antal personer är obligatoriskt" />

        <q-input v-model.number="job.estimatedHours" type="number" label="Beräknad tid (timmar)" outlined
          bg-color="secondary" no-error-icon :error="r$.estimatedHours.$error"
          error-message="Beräknad tid är obligatoriskt" />

        <q-select v-model="job.jobSubcategories" clearable :options="filterJobSubcategoryOptions" use-input use-chips
          multiple outlined @filter="filterJobSubcategoryFn" input-debounce="0" label="Välj uppdragstyper (max 5)"
          bg-color="secondary" option-label="title" option-value="id" :error="r$.jobSubcategories.$error"
          error-message="Välj minst en uppdragstyp (max 5)" emit-value map-options no-error-icon :max-values="5">
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

        <div class="text-h6">Kontaktinformation</div>

        <q-checkbox v-model="job.hidePhone" label="Dölj mitt telefonnummer - numret som du anger i inställningar"
          class="q-mb-md" bg-color="secondary" />
        <div>Önskar bli kontaktad mellan tiderna</div>
        <div class="row q-gutter-md">
          <div class="col">
            <custom-time bg-color="secondary" hint="HH:mm" v-model="contactHoursFrom" label="Från"
              :error="r$.contactHoursFrom.$error"
              error-message="Från-tid är obligatoriskt och måste vara före till-tid" />
          </div>
          <div class="col">
            <custom-time bg-color="secondary" hint="HH:mm" v-model="contactHoursTo" label="Till"
              :error="r$.contactHoursTo.$error"
              error-message="Till-tid är obligatoriskt och måste vara efter från-tid" />
          </div>
        </div>

        <div class="text-h6 q-mt-md">Plats</div>

        <q-input v-model="job.street" label="Gatuadress" outlined bg-color="secondary" no-error-icon
          :error="r$.street.$error" error-message="Gatuadress är obligatoriskt" />

        <q-select v-model="job.city" clearable :options="filterCityOptions" use-input outlined @filter="filterCityFn"
          input-debounce="0" label="Välj närmaste stad" bg-color="secondary" option-label="title" option-value="id"
          :error="r$.city.$error" error-message="Stad är obligatoriskt" emit-value map-options no-error-icon>
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

        <q-input v-model="job.zipcode" label="Postnummer" outlined bg-color="secondary" no-error-icon
          :error="r$.zipcode.$error" error-message="Postnummer är obligatoriskt" />

        <div class="text-h6 q-mt-md">Bilder</div>
        <image-picker v-model:images="jobImages" collection-name="jobs" :collection-item-id="job?.id" />


        <div align="left" class="row justify-between q-mt-lg">
          <q-btn unelevated type="submit" color="primary" :label="isEdit ? 'Uppdatera uppdrag' : 'Skapa uppdrag'"
            :loading="loading" />
          <q-btn flat color="primary" label="Avbryt" @click="router.back()" unelevated />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from 'src/stores/auth';
import { useJobs } from 'src/features/jobs/jobsStore';
import { useQuasar } from 'quasar';
import { useRegle } from '@regle/core';
import { required, maxLength } from '@regle/rules';
import type { JobsRecord } from 'app/pocketbase-types';
import type { Attachment } from 'src/models/attachment';
import { FileAction } from 'src/models/enums';
import CustomDateTime from 'src/components/CustomDateTime.vue';
import CustomTime from 'src/components/CustomTime.vue';
import ImagePicker from 'src/components/ImagePicker.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuth();
const jobsStore = useJobs();
const $q = useQuasar();

const loading = ref(false);
const initialLoading = ref(true);
const job = ref<JobsRecord | null>(null);

// City selection
const filterCityOptions = ref<Array<{ id: string; title: string; county: string }>>([]);

// Job subcategory selection
const filterJobSubcategoryOptions = ref<Array<{ id: string; title: string; category: string }>>([]);

// Contact hours
const contactHoursFrom = ref<string>('');
const contactHoursTo = ref<string>('');
const contactHoursError = ref<boolean>(false);
const contactHoursErrorMessage = ref<string>('');

// Images
const jobImages = ref<Attachment[]>([]);

// Computed properties
const isEdit = computed(() => {
  return route.params.id != null;
});

// City data from store
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

// Job subcategories data from store
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

// Validation rules with per-field modifiers
const rules = computed(() => ({
  title: {
    required: required,
  },
  description: {
    required: required,
  },
  price: {
    required: required,
  },
  desiredAt: {
    required: required,
  },
  desiredNumberOfPeople: {
    required: required,
  },
  estimatedHours: {
    required: required,
  },
  street: {
    required: required,
  },
  zipcode: {
    required: required,
  },
  contactHoursFrom: {
    required: required,
  },
  contactHoursTo: {
    required: required,
  },
  hidePhone: {
    required: required,
  },
  city: {
    required: required,
  },
  jobSubcategories: {
    required: required,
    maxLength: maxLength(5),
  }
}));

const { r$ } = useRegle({
  title: computed(() => job.value?.title || ''),
  description: computed(() => job.value?.description || ''),
  price: computed(() => job.value?.price),
  desiredAt: computed(() => job.value?.desiredAt || ''),
  desiredNumberOfPeople: computed(() => job.value?.desiredNumberOfPeople),
  estimatedHours: computed(() => job.value?.estimatedHours),
  street: computed(() => job.value?.street || ''),
  zipcode: computed(() => job.value?.zipcode || ''),
  hidePhone: computed(() => job.value?.hidePhone || false),
  city: computed(() => job.value?.city || ''),
  jobSubcategories: computed(() => job.value?.jobSubcategories || []),
  contactHoursFrom: computed(() => contactHoursFrom.value || ''),
  contactHoursTo: computed(() => contactHoursTo.value || ''),
}, rules, {
  silent: false
});

// Initialize options
watch(allCities, (cities) => {
  filterCityOptions.value = cities;
}, { immediate: true });

watch(allJobSubcategories, (subcategories) => {
  filterJobSubcategoryOptions.value = subcategories;
}, { immediate: true });

// Contact hours validation
const validateContactHours = () => {
  if (contactHoursFrom.value && contactHoursTo.value) {
    const fromTime = new Date(`2000-01-01T${contactHoursFrom.value}`);
    const toTime = new Date(`2000-01-01T${contactHoursTo.value}`);

    if (fromTime >= toTime) {
      contactHoursError.value = true;
      contactHoursErrorMessage.value = 'Från-tid måste vara före till-tid';
      return false;
    } else {
      contactHoursError.value = false;
      contactHoursErrorMessage.value = '';
      return true;
    }
  }
  return true;
};

// Watch contact hours changes
watch([contactHoursFrom, contactHoursTo], () => {
  validateContactHours();
  // Update job.contactHours with formatted string
  if (contactHoursFrom.value && contactHoursTo.value && validateContactHours()) {
    job.value!.contactHours = `${contactHoursFrom.value} - ${contactHoursTo.value}`;
  } else if (!contactHoursFrom.value || !contactHoursTo.value) {
    job.value!.contactHours = '';
  }
});

// City filter function
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

// Job subcategory filter function
const filterJobSubcategoryFn = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filterJobSubcategoryOptions.value = allJobSubcategories.value;
    } else {
      const needle = val.toLowerCase();
      filterJobSubcategoryOptions.value = allJobSubcategories.value.filter(subcategory =>
        subcategory.title.toLowerCase().includes(needle)
      );
    }
  });
};

// Initialize data
onBeforeMount(async () => {
  // Load counties and categories data
  await jobsStore.getAllCounties();
  await jobsStore.getAllJobCategories();

  if (isEdit.value) {
    const jobData = await jobsStore.getJobById(route.params.id as string);
    if (jobData) {
      job.value = jobData;

      // Parse existing contactHours
      if (jobData.contactHours) {
        const timeMatch = jobData.contactHours.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (timeMatch && timeMatch[1] && timeMatch[2]) {
          contactHoursFrom.value = timeMatch[1];
          contactHoursTo.value = timeMatch[2];
        }
      }

      // Load existing images
      if (jobData.images && jobData.images.length > 0) {
        jobImages.value = jobData.images.map((imageName: string) => ({
          file: new File([], imageName),
          name: imageName,
          fromServer: true,
          fileAction: FileAction.Keep
        }));
      }
    }
  } else {
    job.value = {
      createdBy: authStore.currentUser?.id || '',
      title: '',
      description: '',
      price: undefined,
      desiredAt: '',
      desiredNumberOfPeople: undefined,
      estimatedHours: undefined,
      jobSubcategories: [],
      contactHours: '',
      hidePhone: false,
      street: '',
      city: '',
      zipcode: '',
    } as unknown as JobsRecord;
  }
  initialLoading.value = false;
});

const onSubmit = async () => {
  // Validate form (lazy fields will be touched automatically)
  const result = await r$.$validate();
  if (!result.valid) {
    return;
  }

  loading.value = true;
  try {
    let success = false;

    if (isEdit.value) {
      success = await jobsStore.updateJob(job.value!, jobImages.value);
    } else {
      success = await jobsStore.createJob(job.value!, jobImages.value);
    }

    if (success) {
      $q.notify({
        type: 'positive',
        message: isEdit.value ? 'Uppdraget har uppdaterats!' : 'Uppdraget har skapats!',
      });
      await router.push('/mina-uppdrag');
    } else {
      $q.notify({
        type: 'negative',
        message: 'Ett fel uppstod. Försök igen.',
      });
    }
  } catch (error) {
    console.error('Job operation error:', error);
    $q.notify({
      type: 'negative',
      message: 'Ett fel uppstod. Försök igen.',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.q-checkbox__bg {
  background-color: var(--q-secondary);
}
</style>

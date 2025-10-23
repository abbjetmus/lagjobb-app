<template>
  <q-page class="q-pa-md bg-grey-2 row justify-center">
    <div style="max-width: 800px; width: 100%;">
      <div class="text-h6 q-mb-md">Skapa ny grupp</div>
      <q-form @submit="createGroup" class="q-gutter-md">

        <div class="text-subtitle1 q-mb-md">Gruppinformation</div>

        <q-select v-model="form.groupTypeId" :options="groupTypes" label="Grupptyp *" outlined emit-value map-options
          :rules="[val => !!val || 'Grupptyp krävs']" bg-color="white" />

        <q-input v-model="form.name" label="Gruppnamn *" outlined :rules="[val => !!val || 'Gruppnamn krävs']"
          bg-color="white" />

        <q-input v-model="form.description" type="textarea" label="Beskrivning" outlined rows="5" bg-color="white"
          no-error-icon />

        <q-input v-model="form.contactEmail" type="email" label="Kontakt e-post" outlined bg-color="white"
          no-error-icon />

        <q-input v-model="form.contactPhone" label="Kontakt telefon" outlined bg-color="white" no-error-icon />

        <div class="text-subtitle1 q-mb-md">Plats</div>

        <q-input v-model="locationForm.street" label="Gatuadress" outlined bg-color="white" no-error-icon />

        <q-input v-model="locationForm.city" label="Stad" outlined bg-color="white" no-error-icon />

        <q-input v-model="locationForm.postalCode" label="Postnummer" outlined bg-color="white" no-error-icon />

        <div align="left" class="row justify-between">
          <q-btn unelevated type="submit" color="primary" label="Skapa grupp" :loading="loading" />
          <q-btn flat color="primary" label="Avbryt" @click="router.back()" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import { GroupsGroupTypeOptions } from 'app/pocketbase-types';

const router = useRouter();
const authStore = useAuth();
const $q = useQuasar();

const loading = ref(false);

const groupTypes = Object.values(GroupsGroupTypeOptions);

const form = ref({
  name: '',
  description: '',
  groupTypeId: undefined as number | undefined,
  contactEmail: '',
  contactPhone: '',
});

const locationForm = ref({
  street: '',
  city: '',
  postalCode: '',
});

const createGroup = async () => {
  loading.value = true;
  try {
    let locationId;
    if (locationForm.value.city) {
      const location = await pb.collection('locations').create(locationForm.value);
      locationId = location.id;
    }

    await pb.collection('groups').create({
      ...form.value,
      locationId,
      creatorId: authStore.currentUser?.id,
      verified: false,
    });

    $q.notify({
      type: 'positive',
      message: 'Grupp skapad!',
    });

    router.push('/mina-grupper-lista');
  } catch (error) {
    console.error('Create group error:', error);
    $q.notify({
      type: 'negative',
      message: 'Kunde inte skapa grupp.',
    });
  } finally {
    loading.value = false;
  }
};
</script>

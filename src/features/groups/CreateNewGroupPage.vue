<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Skapa ny grupp</div>

    <q-form @submit="createGroup" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">Gruppinformation</div>

          <q-select
            v-model="form.groupTypeId"
            :options="groupTypes"
            label="Grupptyp *"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'Grupptyp krävs']"
          />

          <q-input
            v-model="form.name"
            label="Gruppnamn *"
            outlined
            :rules="[val => !!val || 'Gruppnamn krävs']"
          />

          <q-input
            v-model="form.description"
            type="textarea"
            label="Beskrivning"
            outlined
            rows="5"
          />

          <q-input
            v-model="form.contactEmail"
            type="email"
            label="Kontakt e-post"
            outlined
          />

          <q-input
            v-model="form.contactPhone"
            label="Kontakt telefon"
            outlined
          />
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">Plats</div>

          <q-input
            v-model="locationForm.street"
            label="Gatuadress"
            outlined
          />

          <q-input
            v-model="locationForm.city"
            label="Stad"
            outlined
          />

          <q-input
            v-model="locationForm.postalCode"
            label="Postnummer"
            outlined
          />
        </q-card-section>
      </q-card>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Avbryt" @click="router.back()" />
        <q-btn
          type="submit"
          color="primary"
          label="Skapa grupp"
          :loading="loading"
        />
      </q-card-actions>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const router = useRouter();
const authStore = useAuth();
const $q = useQuasar();

const loading = ref(false);

const groupTypes = [
  { label: 'Lag', value: 1 },
  { label: 'Klass', value: 2 },
  { label: 'Förening', value: 3 },
  { label: 'Organisation', value: 4 },
];

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


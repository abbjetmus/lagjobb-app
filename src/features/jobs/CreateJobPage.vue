<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Skapa nytt uppdrag</div>

    <q-form @submit="createUppdrag" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">Uppdragsinformation</div>

          <q-input v-model="form.title" label="Titel *" outlined :rules="[val => !!val || 'Titel krävs']" />

          <q-input v-model="form.description" type="textarea" label="Beskrivning *" outlined rows="5"
            :rules="[val => !!val || 'Beskrivning krävs']" />

          <q-input v-model.number="form.price" type="number" label="Pris (kr)" outlined />

          <q-input v-model="form.desiredDate" label="Önskat datum" outlined type="date" />

          <q-input v-model.number="form.desiredNumberOfPeople" type="number" label="Antal personer" outlined />

          <q-input v-model.number="form.estimatedHours" type="number" label="Beräknad tid (timmar)" outlined />
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">Kontaktinformation</div>

          <q-input v-model="form.name" label="Namn *" outlined :rules="[val => !!val || 'Namn krävs']" />

          <q-input v-model="form.email" type="email" label="E-post *" outlined
            :rules="[val => !!val || 'E-post krävs']" />

          <q-input v-model="form.phone" label="Telefon" outlined />

          <q-checkbox v-model="form.hidePhone" label="Dölj telefonnummer" />

          <q-input v-model="form.contactHours" label="Kontakttider" outlined />
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">Plats</div>

          <q-input v-model="locationForm.street" label="Gatuadress" outlined />

          <q-input v-model="locationForm.city" label="Stad *" outlined :rules="[val => !!val || 'Stad krävs']" />

          <q-input v-model="locationForm.postalCode" label="Postnummer" outlined />

          <location-picker-map v-model="mapLocation" height="400px" class="q-mt-md" />
        </q-card-section>
      </q-card>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Avbryt" @click="router.back()" />
        <q-btn type="submit" color="primary" label="Skapa uppdrag" :loading="loading" />
      </q-card-actions>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/stores/auth';
import LocationPickerMap from 'src/components/LocationPickerMap.vue';

const router = useRouter();
const authStore = useAuth();

const loading = ref(false);
const mapLocation = ref<{ lat: number; lng: number } | null>(null);

const form = ref({
  title: '',
  description: '',
  price: undefined as number | undefined,
  desiredDate: '',
  desiredNumberOfPeople: undefined as number | undefined,
  estimatedHours: undefined as number | undefined,
  name: authStore.currentUser?.name || '',
  email: authStore.currentUser?.email || '',
  phone: '',
  hidePhone: false,
  contactHours: '',
});

const locationForm = ref({
  street: '',
  city: '',
  postalCode: '',
});

const createUppdrag = async () => {
  loading.value = true;
  try {
    let locationId;
    if (locationForm.value.city) {
      const location = await pb.collection('locations').create({
        ...locationForm.value,
        lat: mapLocation.value?.lat,
        lng: mapLocation.value?.lng,
      });
      locationId = location.id;
    }

    await pb.collection('uppdrag').create({
      ...form.value,
      locationId,
      creatorId: authStore.currentUser?.id,
    });

    await router.push('/skapade-uppdrag');
  } finally {
    loading.value = false;
  }
};
</script>

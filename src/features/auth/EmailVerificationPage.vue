<template>
  <q-page class="column page-background-pattern">
    <div class="col flex justify-center items-center">
      <div class="column items-center full-width full-height q-pa-md">
        <div class="col flex flex-center">
          <div class="column items-center" style="max-width: 500px; width: 100%">
            <div class="text-primary text-h4">
              <span class="text-weight-bold">Lagjobb</span>
            </div>
            <div class="text-primary text-h6">E-postverifiering</div>

            <div v-if="status === 'loading'" class="q-mt-md text-center">
              <q-spinner color="primary" size="3em" />
              <p class="q-mt-md">Verifierar din e-postadress...</p>
            </div>

            <div v-else-if="status === 'success'" class="q-mt-md text-center">
              <q-icon name="check_circle" color="positive" size="5em" />
              <p class="q-mt-md text-h6">E-post verifierad!</p>
              <p class="q-mt-sm">Du kan nu logga in.</p>
              <q-btn color="primary" label="Logga in" no-caps unelevated class="q-mt-md" @click="goToLogin" />
            </div>

            <div v-else-if="status === 'error'" class="q-mt-md text-center">
              <q-icon name="error" color="negative" size="5em" />
              <p class="q-mt-md text-h6">Verifieringen misslyckades</p>
              <p class="q-mt-sm">{{ errorMessage }}</p>
              <q-btn color="primary" label="Gå till startsidan" no-caps unelevated class="q-mt-md" to="/" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/features/auth/authStore';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const authStore = useAuth();

const status = ref<'loading' | 'success' | 'error'>('loading');
const errorMessage = ref('');

const goToLogin = () => {
  router.replace('/');
};

onMounted(async () => {
  const token = route.params.token as string;

  if (!token) {
    status.value = 'error';
    errorMessage.value = 'Verifieringstoken saknas.';
    return;
  }

  try {
    const success = await authStore.confirmVerification(token);
    if (success) {
      status.value = 'success';
      $q.notify({
        type: 'positive',
        message: 'E-post verifierad!',
      });
    } else {
      status.value = 'error';
      errorMessage.value = 'Ogiltig eller utgången verifieringslänk.';
    }
  } catch (error) {
    status.value = 'error';
    errorMessage.value = 'Ett fel uppstod vid verifiering.';
  }
});
</script>

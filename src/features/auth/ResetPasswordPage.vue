<template>
  <q-page class="column page-background-pattern">
    <div class="col flex justify-center items-center">
      <div class="column items-center full-width full-height q-pa-md">
        <div class="col flex flex-center">
          <div class="column items-center" style="max-width: 500px; width: 100%">
            <div class="text-primary text-h4">
              <span class="text-weight-bold">Lagjobb</span>
            </div>
            <div class="text-primary text-h6">Återställ lösenord</div>
          </div>
        </div>

        <div class="col" style="max-width: 500px; width: 100%">
          <div style="width: 100%" class="row justify-center">
            <q-form ref="form" @submit.prevent="onSubmit" class="q-mt-md" greedy style="max-width: 500px; width: 100%">

              <div v-if="status === 'success'" class="column items-center q-gutter-y-md">
                <q-icon name="check_circle" color="positive" size="5em" />
                <p class="text-h6">Lösenordet har återställts!</p>
                <p class="text-body2 text-center">Du kan nu logga in med ditt nya lösenord.</p>
                <q-btn color="primary" label="Logga in" no-caps unelevated class="q-mt-md" @click="goToLogin" />
              </div>

              <div v-else-if="status === 'error'" class="column items-center q-gutter-y-md">
                <q-icon name="error" color="negative" size="5em" />
                <p class="text-h6">Något gick fel</p>
                <p class="text-body2 text-center">{{ errorMessage }}</p>
                <q-btn color="primary" label="Gå till startsidan" no-caps unelevated class="q-mt-md" to="/" />
              </div>

              <div v-else class="column q-gutter-y-lg">
                <span v-if="formError" class="text-center text-red">{{ formError }}</span>

                <q-input no-error-icon v-model="password" bg-color="secondary" class="q-pa-none" outlined square
                  :type="isPassword ? 'password' : 'text'" :error="r$.password.$error"
                  error-message="Lösenord inte ifyllt korrekt" placeholder="Nytt lösenord">
                  <template v-slot:append>
                    <q-icon @click="isPassword = !isPassword"
                      :name="isPassword ? 'visibility_off' : 'visibility'"></q-icon>
                  </template>
                </q-input>

                <q-input no-error-icon v-model="confirmPassword" bg-color="secondary" class="q-pa-none" outlined square
                  :type="isConfirmPassword ? 'password' : 'text'" :error="r$.confirmPassword.$error"
                  error-message="Bekräfta lösenord inte ifyllt korrekt" placeholder="Bekräfta lösenord">
                  <template v-slot:append>
                    <q-icon @click="isConfirmPassword = !isConfirmPassword"
                      :name="isConfirmPassword ? 'visibility_off' : 'visibility'"></q-icon>
                  </template>
                </q-input>

                <div class="q-mt-lg row justify-between">
                  <q-btn type="submit" color="primary" label="Återställ lösenord" no-caps unelevated class="full-width"
                    :loading="loading" square />
                </div>
              </div>
            </q-form>
          </div>
          <div v-if="status !== 'success' && status !== 'error'" class="q-mt-lg text-center">
            <q-btn label="Tillbaka" color="grey-7" flat dense to="/" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QForm } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useAuth } from 'src/features/auth/authStore';
import { useRegle } from '@regle/core';
import { required, minLength, sameAs } from '@regle/rules';
import { useQuasar } from 'quasar';

const authStore = useAuth();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// Form fields
const password = ref('');
const confirmPassword = ref('');
const isPassword = ref(true);
const isConfirmPassword = ref(true);

// Status tracking
const loading = ref(false);
const validInputs = ref(true);
const formError = ref('');
const status = ref<'form' | 'success' | 'error'>('form');
const errorMessage = ref('');

const rules = {
  password: {
    required: required,
    minLength: minLength(6),
  },
  confirmPassword: {
    required: required,
    sameAs: sameAs(password),
  }
};

const { r$ } = useRegle({
  password,
  confirmPassword
}, rules);

onMounted(() => {
  const token = route.params.token as string;
  if (!token) {
    status.value = 'error';
    errorMessage.value = 'Återställningstoken saknas.';
  }
});

const onSubmit = async () => {
  const result = await r$.$validate();
  validInputs.value = result.valid;

  if (validInputs.value) {
    loading.value = true;
    const token = route.params.token as string;

    try {
      const success = await authStore.resetPassword(token, password.value);
      if (success) {
        status.value = 'success';
        $q.notify({
          type: 'positive',
          message: 'Lösenordet har återställts!',
        });
      } else {
        validInputs.value = false;
        formError.value = 'Återställning misslyckades.';
      }
    } catch {
      validInputs.value = false;
      formError.value = 'Ett fel uppstod vid återställning.';
    }
    loading.value = false;
  }
};

const goToLogin = async () => {
  await router.replace('/');
};
</script>

<style scoped></style>

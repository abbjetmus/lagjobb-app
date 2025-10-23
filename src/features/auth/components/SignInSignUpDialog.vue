<template>
  <q-dialog ref="dialogRef" padding>
    <q-card class="row no-wrap" style="min-width: 600px; max-width: 800px">
      <!-- Image section -->
      <div class="col-4">
        <img src="src/assets/apples.jpg" alt="Apples" class="full-height full-width"
          style="object-fit: cover; border-radius: 4px 0 0 4px;" />
      </div>

      <!-- Form section -->
      <div class="col-8">
        <q-card-section class="bg-secondary text-white shadow-0">
          <div class="text-h6 text-center">Logga in</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form ref="form" @submit.prevent="onSubmit" class="full-width">
            <q-input v-model="email" label="E-post" type="email" outlined class="q-mb-md"
              :error="r$.email.$errors.length > 0" :error-message="r$.email.$errors[0]" no-error-icon />

            <q-input v-model="password" label="Lösenord" type="password" outlined no-error-icon
              :error="r$.password.$errors.length > 0" :error-message="r$.password.$errors[0]" />

            <div v-if="error" class="text-negative q-mb-md">{{ error }}</div>

            <div class="row justify-between q-my-md">
              <q-btn color="primary" type="submit" :loading="loading">
                Logga in
              </q-btn>
              <q-btn color="secondary" flat @click="cancel">
                Avbryt
              </q-btn>
            </div>
          </q-form>
        </q-card-section>

        <q-separator />
        <q-card-section class="q-pt-none text-center q-mt-lg">
          <div class="column q-gutter-y-md">
            <q-btn flat no-caps color="green-8" label="Har du inget konto? Skapa konto" @click="goToRegister" />
            <q-btn flat no-caps color="grey-7" label="Glömt lösenord?" @click="goToForgotPassword" />
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from 'src/features/auth/authStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useRegle } from '@regle/core';
import { required } from '@regle/rules';
import { useDialogPluginComponent } from 'quasar';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const $q = useQuasar();
const authStore = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Validation rules
const rules = {
  email: {
    required: required,
    email: email,
  },
  password: {
    required: required,
  }
};

const { r$ } = useRegle({
  email,
  password
}, rules);

const goToRegister = async () => {
  onDialogCancel();
  await router.push('/register');
};

const goToForgotPassword = async () => {
  onDialogCancel();
  await router.push('/auth/forgot-password');
};

const cancel = () => {
  onDialogCancel();
};

const onSubmit = async () => {
  // Validate form
  const result = await r$.$validate();
  if (!result.valid) {
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const success = await authStore.signIn(email.value, password.value);
    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Inloggad!',
      });
      onDialogOK();
    } else {
      error.value = 'Felaktiga inloggningsuppgifter. Kontrollera dina uppgifter och försök igen.';
    }
  } catch (err: unknown) {
    error.value = 'Ett fel uppstod. Kontrollera dina uppgifter och försök igen.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

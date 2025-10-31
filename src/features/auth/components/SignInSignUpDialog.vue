<template>
  <q-dialog ref="dialogRef" :maximized="$q.screen.lt.md" :padding="!$q.screen.lt.md">
    <q-card class="row" :class="$q.screen.lt.md ? 'full-width full-height' : 'no-wrap'"
      :style="$q.screen.lt.md ? 'border-radius: 4px;' : 'min-width: 600px; max-width: 800px; border-radius: 4px;'">
      <!-- Image section -->
      <div class="col-4 gt-sm">
        <img :src="applesImage" alt="Apples" class="full-height full-width"
          style="object-fit: cover; border-radius: 4px 0 0 4px;" />
      </div>

      <!-- Form section -->
      <div :class="$q.screen.lt.md ? 'col-12' : 'col-8'">
        <q-card-section class="bg-primary text-white shadow-0">
          <div class="text-h6 text-center">Inloggning</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form ref="form" @submit.prevent="onSubmit" class="full-width">
            <q-input v-model="email" label="E-post" type="email" outlined class="q-mb-md" :error="r$.email.$error"
              error-message="Måste vara en giltig e-postadress" no-error-icon />

            <q-input v-model="password" label="Lösenord" type="password" outlined no-error-icon
              :error="r$.password.$error" error-message="Måste vara minst 6 tecken långt" />

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
import { required, email as emailRule } from '@regle/rules';
import { useDialogPluginComponent } from 'quasar';
import applesImage from 'src/assets/apples.jpg';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const $q = useQuasar();
const authStore = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Validation rules with per-field modifiers
const rules = {
  email: {
    required: required,
    email: emailRule
  },
  password: {
    required: required,
  }
};

const { r$ } = useRegle({
  email,
  password
}, rules, {
  silent: true
});

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
    if (err instanceof Error && err.message === 'Email not verified') {
      error.value = 'E-post inte verifierad. Kontrollera din e-post för verifieringslänk.';
    } else {
      error.value = 'Ett fel uppstod. Kontrollera dina uppgifter och försök igen.';
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

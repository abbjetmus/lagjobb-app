<template>
  <q-page class="column">
    <div class="col flex justify-center items-center">
      <div class="column items-center full-width full-height q-pa-md">
        <div class="col flex flex-center">
          <div class="column items-center">
            <!-- <img src="~assets/logo_256.png" width="120" /> -->
            <p class="text-primary text-h4">
              <span class="text-weight-bold">Lagjobb</span>
            </p>
            <p class="text-white text-h6 q-mt-sm">Skapa ditt konto</p>
          </div>
        </div>

        <div class="col" style="max-width: 500px; width: 100%">
          <div style="width: 100%" class="row justify-center">
            <q-form ref="registerForm" @submit.prevent="onRegister" class="q-mt-md" greedy
              style="max-width: 500px; width: 100%">
              <span v-if="authError" class="block text-center text-red">{{
                authErrorMessage
                }}</span>

              <div class="column q-gutter-y-sm">
                <span v-if="!validInputs" class="text-red text-center">Ett fel uppstod vid registrering. Kontrollera
                  dina uppgifter.</span>

                <q-input no-error-icon v-model="name" bg-color="white" class="q-pa-none" outlined square
                  :error="r$.name.$errors.length > 0" :error-message="r$.name.$errors[0]" placeholder="Namn" />

                <q-input no-error-icon v-model="email" bg-color="white" class="q-pa-none" outlined square
                  :error="r$.email.$errors.length > 0" :error-message="r$.email.$errors[0]" placeholder="E-post" />

                <q-input no-error-icon v-model="password" bg-color="white" class="q-pa-none" outlined square
                  :type="isPassword ? 'password' : 'text'" :error="r$.password.$errors.length > 0"
                  :error-message="r$.password.$errors[0]" placeholder="Lösenord">
                  <template v-slot:append>
                    <q-icon @click="isPassword = !isPassword"
                      :name="isPassword ? 'visibility_off' : 'visibility'"></q-icon>
                  </template>
                </q-input>

                <q-input no-error-icon v-model="confirmPassword" bg-color="white" class="q-pa-none" outlined square
                  :type="isConfirmPassword ? 'password' : 'text'" :error="r$.confirmPassword.$errors.length > 0"
                  :error-message="r$.confirmPassword.$errors[0]" placeholder="Bekräfta lösenord">
                  <template v-slot:append>
                    <q-icon @click="isConfirmPassword = !isConfirmPassword"
                      :name="isConfirmPassword ? 'visibility_off' : 'visibility'"></q-icon>
                  </template>
                </q-input>

                <div class="q-mt-sm row justify-between">
                  <q-btn type="submit" color="primary" label="Skapa konto" no-caps unelevated class="full-width"
                    :loading="loading" square />
                </div>
              </div>

              <div class="row justify-center q-mt-lg">
                <q-btn @click="goToLogin()" flat color="white">Har du redan ett konto? Logga in</q-btn>
              </div>
            </q-form>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QForm } from 'quasar';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useAuth } from 'src/features/auth/authStore';
import { useRegle } from '@regle/core';
import { required, email as emailRule, minLength, sameAs } from '@regle/rules';
import { useQuasar } from 'quasar';

const authStore = useAuth();
const router = useRouter();
const $q = useQuasar();

// Form fields
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isPassword = ref(true);
const isConfirmPassword = ref(true);

// Common fields
const loading = ref(false);
const validInputs = ref(true);
const authError = ref(false);
const authErrorMessage = ref('');

const rules = {
  name: {
    required: required,
  },
  email: {
    required: required,
    email: emailRule,
  },
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
  name,
  email,
  password,
  confirmPassword
}, rules);

const onRegister = async () => {
  const result = await r$.$validate();
  validInputs.value = result.valid;

  if (validInputs.value) {
    loading.value = true;
    try {
      const userData = {
        name: name.value,
        email: email.value,
        password: password.value,
      } as any;

      const success = await authStore.signUp(userData);
      if (success) {
        $q.notify({
          type: 'positive',
          message: 'Konto skapat! Du är nu inloggad.',
        });
        await router.replace('/');
      } else {
        validInputs.value = false;
        authError.value = true;
        authErrorMessage.value = 'Registrering misslyckades. Kontrollera dina uppgifter.';
      }
    } catch (error) {
      validInputs.value = false;
      authError.value = true;
      authErrorMessage.value = 'Ett fel uppstod vid registrering.';
    }
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/auth/login');
};
</script>

<style scoped>
.background-turquoise-dark {
  background: linear-gradient(135deg, #26a69a 0%, #00695c 100%);
}
</style>

<template>
  <q-page class="column bg-grey-3">
    <div class="col flex justify-center items-center">
      <div class="column items-center full-width full-height q-pa-md">
        <div class="col flex flex-center">
          <div class="column items-center">
            <!-- <img src="~assets/logo_256.png" width="120" /> -->
            <p class="text-secondary text-h4">
              <span class="text-weight-bold">Lagjobb</span>
            </p>
            <p class="text-secondary text-h6 q-mt-sm">Skapa ditt konto</p>
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

                <q-input no-error-icon v-model="phone" bg-color="white" class="q-pa-none" outlined square
                  :error="r$.phone.$errors.length > 0" :error-message="r$.phone.$errors[0]" placeholder="Telefon" />

                <div class="q-mb-sm">
                  <div class="text-caption text-grey-7 q-mb-xs">Välj <strong>"Uppdragsgivare"</strong> om du vill skapa
                    uppdrag, eller
                    <strong>"Uppdragsutförare"</strong> om du vill utföra uppdrag på kontotyp.
                  </div>
                  <q-select no-error-icon v-model="accountType" bg-color="white" class="q-pa-none" outlined square
                    :error="r$.accountType.$errors.length > 0" :error-message="r$.accountType.$errors[0]"
                    :options="accountTypeOptions" label="Kontotyp" />
                </div>

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
                  <q-btn type="submit" color="secondary" label="Skapa konto" no-caps unelevated class="full-width"
                    :loading="loading" square />
                </div>
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
import { ref } from 'vue';
import { useAuth } from 'src/features/auth/authStore';
import { useRegle } from '@regle/core';
import { required, email as emailRule, minLength, sameAs } from '@regle/rules';
import { useQuasar } from 'quasar';
import type { UsersRecord } from 'app/pocketbase-types';
import { UsersUserAccountTypeOptions } from 'app/pocketbase-types';

const authStore = useAuth();
const router = useRouter();
const $q = useQuasar();

// Form fields
const name = ref('');
const email = ref('');
const phone = ref('');
const accountType = ref('');
const password = ref('');
const confirmPassword = ref('');
const isPassword = ref(true);
const isConfirmPassword = ref(true);

// Account type options
const accountTypeOptions = Object.values(UsersUserAccountTypeOptions);

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
  phone: {
    required: required,
  },
  accountType: {
    required: required,
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
  phone,
  accountType,
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
        phone: phone.value,
        accountType: accountType.value,
        password: password.value,
      } as Partial<UsersRecord>;

      const success = await authStore.signUp(userData as UsersRecord);
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
    } catch {
      validInputs.value = false;
      authError.value = true;
      authErrorMessage.value = 'Ett fel uppstod vid registrering.';
    }
    loading.value = false;
  }
};
</script>

<style scoped>
.background-turquoise-dark {
  background: linear-gradient(135deg, #26a69a 0%, #00695c 100%);
}
</style>

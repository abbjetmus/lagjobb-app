<template>
  <q-page class="column page-background-pattern">
    <div class="col flex justify-center items-center">
      <div class="column items-center full-width full-height q-pa-md">
        <div class="col flex flex-center">
          <div class="column items-center">
            <!-- <img src="~assets/logo_256.png" width="120" /> -->
            <div class="text-primary text-h4">
              <span class="text-weight-bold">Lagjobb</span>
            </div>
            <div class="text-primary text-h6">Skapa ditt konto</div>
          </div>
        </div>

        <div class="col" style="max-width: 500px; width: 100%">
          <div style="width: 100%" class="row justify-center">
            <q-form ref="registerForm" @submit.prevent="onRegister" class="q-mt-md" greedy
              style="max-width: 500px; width: 100%">
              <span v-if="authError" class="block text-center text-red">{{
                authErrorMessage
                }}</span>

              <div class="column q-gutter-y-lg">
                <span v-if="!validInputs" class="text-red text-center">Ett fel uppstod vid registrering. Kontrollera
                  dina uppgifter.</span>

                <q-input no-error-icon v-model="name" bg-color="secondary" class="q-pa-none" outlined square
                  :error="r$.name.$error" error-message="Namn inte ifyllt korrekt" placeholder="Namn" />

                <q-input no-error-icon v-model="email" bg-color="secondary" class="q-pa-none" outlined square
                  :error="r$.email.$error" error-message="E-post inte ifyllt korrekt" placeholder="E-post" />

                <q-input no-error-icon v-model="phone" bg-color="secondary" class="q-pa-none" outlined square
                  :error="r$.phone.$error" error-message="Telefon inte ifyllt korrekt" placeholder="Telefon" />

                <div class="q-mb-sm">
                  <div class=" q-mb-xs">Välj <strong>"Uppdragsgivare"</strong> om du vill skapa
                    uppdrag, eller
                    <strong>"Uppdragsutförare"</strong> om du vill utföra uppdrag på kontotyp.
                  </div>
                  <q-select no-error-icon v-model="userAccountType" bg-color="secondary" class="q-pa-none" outlined
                    square :error="r$.userAccountType.$errors.length > 0" :error-message="r$.userAccountType.$errors[0]"
                    :options="userAccountTypeOptions" label="Kontotyp" />
                </div>

                <q-input no-error-icon v-model="password" bg-color="secondary" class="q-pa-none" outlined square
                  :type="isPassword ? 'password' : 'text'" :error="r$.password.$error"
                  error-message="Lösenord inte ifyllt korrekt" placeholder="Lösenord">
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
                  <q-btn type="submit" color="primary" label="Skapa konto" no-caps unelevated class="full-width"
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
const userAccountType = ref('');
const password = ref('');
const confirmPassword = ref('');
const isPassword = ref(true);
const isConfirmPassword = ref(true);

// Account type options
const userAccountTypeOptions = Object.values(UsersUserAccountTypeOptions);

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
  userAccountType: {
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
  userAccountType,
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
        userAccountType: userAccountType.value,
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

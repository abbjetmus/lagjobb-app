<template>
  <q-page class="column background-turquoise-dark">
    <div class="col flex justify-center items-center">
      <div class="column items-center full-width full-height q-pa-md">
        <div class="col flex flex-center">
          <div class="column items-center">
            <!-- <img src="~assets/logo_256.png" width="120" /> -->
            <p class="text-primary text-h4">
              <span class="text-weight-bold">Lagjobb</span>
            </p>
          </div>
        </div>

        <div class="col" style="max-width: 500px; width: 100%">
          <q-tabs v-model="activeTab" class="text-white" active-color="white" indicator-color="white">
            <q-tab name="signin" label="Logga in" />
            <q-tab name="signup" label="Registrera" />
          </q-tabs>

          <q-tab-panels v-model="activeTab" animated>
            <!-- Sign In Panel -->
            <q-tab-panel name="signin">
              <div style="width: 100%" class="row justify-center">
                <q-form ref="signInForm" @submit.prevent="onSignIn" class="q-mt-md" greedy
                  style="max-width: 500px; width: 100%">
                  <span v-if="authError" class="block text-center text-red">{{
                    authErrorMessage
                    }}</span>

                  <div class="column q-gutter-y-sm">
                    <span v-if="!validInputs" class="text-red text-center">E-post eller användarnamn eller lösenord
                      matchar
                      inget
                      konto</span>
                    <q-input no-error-icon v-model="emailUsername" bg-color="white" class="q-pa-none" outlined square
                      :error="r$.emailUsername.$errors.length > 0" :error-message="r$.emailUsername.$errors[0]"
                      placeholder="E-post eller användarnamn" />

                    <q-input no-error-icon v-model="password" bg-color="white" class="q-pa-none" outlined square
                      :type="isPassword ? 'password' : 'text'" :error="r$.password.$errors.length > 0"
                      :error-message="r$.password.$errors[0]" placeholder="Lösenord">
                      <template v-slot:append>
                        <q-icon @click="isPassword = !isPassword"
                          :name="isPassword ? 'visibility_off' : 'visibility'"></q-icon>
                      </template>
                    </q-input>

                    <div class="q-mt-sm row justify-between">
                      <q-btn type="submit" color="secondary" label="Logga in" no-caps unelevated class="full-width"
                        :loading="loading" square />
                    </div>
                  </div>

                  <div class="row justify-between q-mt-lg">
                    <div></div>
                    <q-btn @click="forgotPassword()" flat color="white">Glömt lösenord?</q-btn>
                  </div>
                </q-form>
              </div>
            </q-tab-panel>

            <!-- Sign Up Panel -->
            <q-tab-panel name="signup">
              <div style="width: 100%" class="row justify-center">
                <q-form ref="signUpForm" @submit.prevent="onSignUp" class="q-mt-md" greedy
                  style="max-width: 500px; width: 100%">
                  <span v-if="authError" class="block text-center text-red">{{
                    authErrorMessage
                    }}</span>

                  <div class="column q-gutter-y-sm">
                    <span v-if="!validInputs" class="text-red text-center">E-post eller användarnamn eller lösenord
                      matchar
                      inget
                      konto</span>

                    <q-input no-error-icon v-model="signUpName" bg-color="white" class="q-pa-none" outlined square
                      :error="r$.signUpName.$errors.length > 0" :error-message="r$.signUpName.$errors[0]"
                      placeholder="Namn" />

                    <q-input no-error-icon v-model="signUpEmail" bg-color="white" class="q-pa-none" outlined square
                      :error="r$.signUpEmail.$errors.length > 0" :error-message="r$.signUpEmail.$errors[0]"
                      placeholder="E-post" />

                    <q-input no-error-icon v-model="signUpPassword" bg-color="white" class="q-pa-none" outlined square
                      :type="isSignUpPassword ? 'password' : 'text'" :error="r$.signUpPassword.$errors.length > 0"
                      :error-message="r$.signUpPassword.$errors[0]" placeholder="Lösenord">
                      <template v-slot:append>
                        <q-icon @click="isSignUpPassword = !isSignUpPassword"
                          :name="isSignUpPassword ? 'visibility_off' : 'visibility'"></q-icon>
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
                      <q-btn type="submit" color="secondary" label="Registrera" no-caps unelevated class="full-width"
                        :loading="loading" square />
                    </div>
                  </div>
                </q-form>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QForm } from 'quasar';
import { useRouter } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { useAuth } from 'src/features/auth/authStore';
import { useRegle } from '@regle/core';
import { required, email, minLength, sameAs } from '@regle/rules';

const authStore = useAuth();
const router = useRouter();

// Tab management
const activeTab = ref('signin');

// Sign In fields
const emailUsername = ref('');
const password = ref('');
const isPassword = ref(true);

// Sign Up fields
const signUpName = ref('');
const signUpEmail = ref('');
const signUpPassword = ref('');
const confirmPassword = ref('');
const isSignUpPassword = ref(true);
const isConfirmPassword = ref(true);

// Common fields
const loading = ref(false);
const validInputs = ref(true);
const authError = ref(false);
const authErrorMessage = ref('');

// Add watcher for activeTab
watch(activeTab, (newValue) => {
  console.log('🔵 [LoginPage] Tab changed to:', newValue);
  // Clear form data when switching tabs
  clearFormData();
});

const clearFormData = () => {
  emailUsername.value = '';
  password.value = '';
  signUpName.value = '';
  signUpEmail.value = '';
  signUpPassword.value = '';
  confirmPassword.value = '';
  authError.value = false;
  authErrorMessage.value = '';
  validInputs.value = true;
};

const rules = computed(() => ({
  emailUsername: {
    required: required,
  },
  password: {
    required: required,
  },
  signUpName: {
    required: required,
  },
  signUpEmail: {
    required: required,
    email: email,
  },
  signUpPassword: {
    required: required,
    minLength: minLength(6),
  },
  confirmPassword: {
    required: required,
    sameAs: sameAs(signUpPassword),
  }
}));

const { r$ } = useRegle({
  emailUsername,
  password,
  signUpName,
  signUpEmail,
  signUpPassword,
  confirmPassword
}, rules);

const onSignIn = async () => {
  const result = await r$.$validate();
  validInputs.value = result.valid;

  if (validInputs.value) {
    loading.value = true;
    try {
      const success = await authStore.signIn(emailUsername.value, password.value);
      if (success) {
        await router.replace('/');
      } else {
        validInputs.value = false;
        authError.value = true;
        authErrorMessage.value = 'Inloggning misslyckades. Kontrollera dina uppgifter.';
      }
    } catch (error) {
      validInputs.value = false;
      authError.value = true;
      authErrorMessage.value = 'Ett fel uppstod vid inloggning.';
    }
    loading.value = false;
  }
};

const onSignUp = async () => {
  const result = await r$.$validate();
  validInputs.value = result.valid;

  if (validInputs.value) {
    loading.value = true;
    try {
      const userData = {
        name: signUpName.value,
        email: signUpEmail.value,
        password: signUpPassword.value,
      } as any;

      const success = await authStore.signUp(userData);
      if (success) {
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

const forgotPassword = async () => {
  await router.push('/auth/forgot-password');
};
</script>

<style scoped>
.background-turquoise-dark {
  background: linear-gradient(135deg, #26a69a 0%, #00695c 100%);
}
</style>

<template>
  <q-page class="column page-background-pattern">
    <div class="col flex justify-center items-center">
      <div class="column items-center full-width full-height q-pa-md">
        <div class="col flex flex-center">
          <div class="column items-center">
            <div class="text-primary text-h4">
              <span class="text-weight-bold">Lagjobb</span>
            </div>
            <div class="text-primary text-h6">Återställ lösenord</div>
          </div>
        </div>

        <div class="col" style="max-width: 500px; width: 100%">
          <div style="width: 100%" class="row justify-center">
            <div v-if="showSuccess" class="column items-center q-gutter-y-md" style="max-width: 500px; width: 100%">
              <q-icon name="email" color="primary" size="5em" />
              <p class="text-h6 text-center">Återställningslänk skickad!</p>
              <p class="text-body2 text-center">Vi har skickat en återställningslänk till din e-postadress.</p>
              <p class="text-body2 text-center">Klicka på länken i e-postmeddelandet för att återställa ditt lösenord.
              </p>
              <q-btn color="primary" label="Gå till startsidan" no-caps unelevated class="q-mt-md" to="/" />
            </div>

            <q-form v-else ref="form" @submit.prevent="onSubmit" class="q-mt-md" greedy
              style="max-width: 500px; width: 100%">
              <div class="column q-gutter-y-lg">
                <q-input no-error-icon v-model="email" bg-color="secondary" class="q-pa-none" outlined square
                  :error="v$.email.$errors.length > 0" :error-message="v$.email.$errors[0]?.$message?.toString()"
                  placeholder="E-post" />

                <div class="q-mt-sm row justify-between">
                  <q-btn type="submit" color="primary" label="Skicka återställningsmejl" no-caps unelevated
                    class="full-width" :loading="loading" square />
                </div>
              </div>
            </q-form>
          </div>
          <div v-if="!showSuccess" class="q-mt-lg text-center">
            <q-btn label="Tillbaka" color="grey-7" flat dense to="/" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { QForm } from 'quasar'
import { ref, computed } from 'vue'
import { useAuth } from 'src/features/auth/authStore';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';

const $q = useQuasar()
const authStore = useAuth()

const email = ref('');
const loading = ref(false);
const showSuccess = ref(false);
const userEmail = ref('');

const email_test = /^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

const rules = computed(() => ({
  email: {
    required: helpers.withMessage('E-post är obligatorisk', required),
    format: helpers.withMessage('Ogiltig e-postadress', (value: string) => email_test.test(value))
  }
}));

const v$ = useVuelidate(rules, { email });

const onSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    loading.value = true;
    const success = await authStore.forgotPassword(email.value);
    if (success) {
      showSuccess.value = true;
      userEmail.value = email.value;
    } else {
      $q.notify({
        color: 'negative',
        position: 'bottom',
        message: `Ett fel uppstod vid skickande av återställningsmejl.`,
      });
    }
    loading.value = false;
  }
}
</script>

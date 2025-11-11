<template>
  <q-page class="column page-background-pattern">
    <div class="col flex justify-center items-center">
      <div class="column items-center full-width q-pa-md">
        <div class="flex flex-center q-mb-md">
          <div class="column items-center">
            <div class="text-primary text-h4">
              <span class="text-weight-bold">Lagjobb</span>
            </div>
            <div class="text-primary text-h6">Återställ lösenord</div>
          </div>
        </div>

        <div style="max-width: 500px; width: 100%">
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
                  :error="r$.email.$errors.length > 0" :error-message="r$.email.$errors[0]" placeholder="E-post" />

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
import { useRegle } from '@regle/core';
import { required, email as emailRule } from '@regle/rules';

const $q = useQuasar()
const authStore = useAuth()

const email = ref('');
const loading = ref(false);
const showSuccess = ref(false);

const rules = computed(() => ({
  email: {
    required: required,
    email: emailRule,
  }
}));

const { r$ } = useRegle({ email }, rules);

const onSubmit = async () => {
  const result = await r$.$validate();
  if (result.valid) {
    loading.value = true;
    const success = await authStore.forgotPassword(email.value);
    if (success) {
      showSuccess.value = true;
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

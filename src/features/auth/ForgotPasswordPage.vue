<template>
  <q-page>
    <div style="width: 100%" class="row justify-center">
      <div style="max-width: 500px; width: 100%">
        <q-form ref="form" @submit.prevent="onSubmit" class="q-mt-md" greedy>
          <div class="column q-gutter-y-sm">
            <q-input no-error-icon v-model="email" class="q-pa-none q-mb-lg" outlined
              :error="v$.email.$errors.length > 0" :error-message="v$.email.$errors[0]?.$message?.toString()"
              placeholder="E-post" />

            <div class="q-mt-sm row justify-between">
              <q-btn type="submit" color="primary" label="Skicka återställningsmejl" no-caps unelevated
                class="full-width" :loading="loading" />
            </div>
          </div>
        </q-form>
        <div class="q-mt-lg">
          <q-btn label="Till Login" color="grey-7" flat dense to="/auth/login" />
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
      $q.notify({
        color: 'primary',
        position: 'bottom',
        message: `Återställningsmejl har skickat till ${email.value}!`,
      });
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

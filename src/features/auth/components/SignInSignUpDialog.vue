<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ isSignIn ? 'Logga in' : 'Skapa konto' }}</div>
      </q-card-section>

      <q-card-section>
        <q-input v-if="!isSignIn" v-model="name" label="Namn" outlined class="q-mb-md"
          :error="r$.name.$errors.length > 0" :error-message="r$.name.$errors[0]" />

        <q-input v-model="email" label="E-post" type="email" outlined class="q-mb-md"
          :error="r$.email.$errors.length > 0" :error-message="r$.email.$errors[0]" />

        <q-input v-model="password" label="Lösenord" :type="isPwd ? 'password' : 'text'" outlined class="q-mb-md"
          :error="r$.password.$errors.length > 0" :error-message="r$.password.$errors[0]">
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>

        <div v-if="error" class="text-negative q-mb-md">{{ error }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Avbryt" color="primary" v-close-popup />
        <q-btn flat :label="isSignIn ? 'Logga in' : 'Skapa konto'" color="primary" @click="submit" :loading="loading" />
      </q-card-actions>

      <q-card-section class="q-pt-none">
        <q-btn flat no-caps color="primary" label="Skapa konto istället" @click="goToRegister" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuth } from 'src/features/auth/authStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useRegle } from '@regle/core';
import { required, email as emailRule } from '@regle/rules';

defineProps<{
  modelValue: boolean;
  toReturnAfterCancel?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'returnAfterCancel': [value: string];
}>();

const $q = useQuasar();
const authStore = useAuth();
const router = useRouter();

const isSignIn = ref(true);
const name = ref('');
const email = ref('');
const password = ref('');
const isPwd = ref(true);
const loading = ref(false);
const error = ref('');

// Validation rules
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
  }
};

const { r$ } = useRegle({
  name,
  email,
  password
}, rules);

const goToRegister = () => {
  emit('update:modelValue', false);
  router.push('/register');
};

const submit = async () => {
  // Validate form
  const result = await r$.$validate();
  if (!result.valid) {
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    if (isSignIn.value) {
      const success = await authStore.signIn(email.value, password.value);
      if (success) {
        $q.notify({
          type: 'positive',
          message: 'Inloggad!',
        });
        emit('update:modelValue', false);
        emit('returnAfterCancel', '');
      } else {
        error.value = 'Felaktiga inloggningsuppgifter. Kontrollera dina uppgifter och försök igen.';
      }
    } else {
      // Redirect to register page instead of handling signup here
      emit('update:modelValue', false);
      router.push('/auth/register');
    }
  } catch (err: unknown) {
    error.value = 'Ett fel uppstod. Kontrollera dina uppgifter och försök igen.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

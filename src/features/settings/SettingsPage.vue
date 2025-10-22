<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Inställningar</div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Kontoinformation</div>

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>Namn</q-item-label>
              <q-item-label caption>{{ user?.name || 'Ej angivet' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round icon="edit" @click="editName" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item>
            <q-item-section>
              <q-item-label>E-post</q-item-label>
              <q-item-label caption>{{ user?.email }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round icon="edit" @click="editEmail" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item>
            <q-item-section>
              <q-item-label>Telefon</q-item-label>
              <q-item-label caption>{{ user?.phone || 'Ej angivet' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round icon="edit" @click="editPhone" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Notifikationer</div>

        <q-list>
          <q-item tag="label">
            <q-item-section>
              <q-item-label>Intressemeddelanden</q-item-label>
              <q-item-label caption>Få notifikationer när någon visar intresse</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="settingsStore.interestMessageNotification" @update:model-value="saveSettings" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item tag="label">
            <q-item-section>
              <q-item-label>Nya uppdrag</q-item-label>
              <q-item-label caption>Få notifikationer om nya uppdrag</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="settingsStore.uppdragCreatedNotification" @update:model-value="saveSettings" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">Autofyll</div>

        <q-list>
          <q-item tag="label">
            <q-item-section>
              <q-item-label>Namn</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="settingsStore.autofillName" @update:model-value="saveSettings" />
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>E-post</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="settingsStore.autofillEmail" @update:model-value="saveSettings" />
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section>
              <q-item-label>Telefon</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="settingsStore.autofillPhone" @update:model-value="saveSettings" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md text-negative">Farlig zon</div>
        <q-btn color="negative" label="Ta bort konto" @click="confirmDeleteAccount" outline />
      </q-card-section>
    </q-card>

    <q-dialog v-model="showEditDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editDialogTitle }}</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="editValue" :label="editDialogTitle" outlined />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Avbryt" color="primary" v-close-popup />
          <q-btn flat label="Spara" color="primary" @click="saveEdit" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuth } from 'src/features/auth/authStore';
import { useSettings } from 'src/stores/settings';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { UsersRecord } from 'app/pocketbase-types';

const authStore = useAuth();
const settingsStore = useSettings();
const $q = useQuasar();
const router = useRouter();

const user = computed(() => authStore.currentUser);

const showEditDialog = ref(false);
const editDialogTitle = ref('');
const editValue = ref('');
const editField = ref('');
const saving = ref(false);

const editName = () => {
  editDialogTitle.value = 'Namn';
  editValue.value = user.value?.name || '';
  editField.value = 'name';
  showEditDialog.value = true;
};

const editEmail = () => {
  editDialogTitle.value = 'E-post';
  editValue.value = user.value?.email || '';
  editField.value = 'email';
  showEditDialog.value = true;
};

const editPhone = () => {
  editDialogTitle.value = 'Telefon';
  editValue.value = user.value?.phone || '';
  editField.value = 'phone';
  showEditDialog.value = true;
};

const saveEdit = async () => {
  saving.value = true;
  await authStore.updateUser({ [editField.value as keyof UsersRecord]: editValue.value as string } as unknown as UsersRecord);
  showEditDialog.value = false;
};

const saveSettings = async () => {
  if (!user.value) return;
  try {
    await settingsStore.saveSettings(user.value.id);
  } catch (error) {
    console.error('Save settings error:', error);
  }
};

const confirmDeleteAccount = () => {
  $q.dialog({
    title: 'Ta bort konto',
    message: 'Är du säker på att du vill ta bort ditt konto? Detta kan inte ångras.',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await authStore.signOut();
      $q.notify({
        type: 'info',
        message: 'Kontakta support för att ta bort ditt konto.',
      });
      router.push('/');
    } catch (error) {
      console.error('Delete account error:', error);
    }
  });
};

onMounted(async () => {
  if (user.value) {
    await settingsStore.loadSettings(user.value.id);
  }
});
</script>

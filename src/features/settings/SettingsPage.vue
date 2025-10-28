<template>
  <q-page class="q-pa-md page-background-pattern">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="currentUser" style="max-width: 600px; margin: 0 auto;" class="q-py-lg">
      <div class="full-width">
        <div class="text-center">
          <ImageThumbnail @file-selected="fileSelected" size="160px" class="q-pa-lg"
            :photoUrl="currentUser.avatar ? getImageUrl() : null" />
        </div>

        <q-list bordered separator class="q-mt-xl bg-secondary">
          <q-item>
            <q-item-section>
              <q-item-label caption>Namn</q-item-label>
              <q-item-label class="text-subtitle1">{{ currentUser.name || 'Ej angivet' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn unelevated icon="more_vert" flat color="grey-8">
                <q-menu>
                  <q-item clickable v-close-popup class="flex flex-center" @click="editName">
                    <q-item-label>Ändra namn</q-item-label>
                  </q-item>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>E-post</q-item-label>
              <q-item-label class="text-subtitle1">{{ currentUser.email }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn unelevated icon="more_vert" flat color="grey-8">
                <q-menu>
                  <q-item clickable v-close-popup class="flex flex-center" @click="editEmail">
                    <q-item-label>Ändra e-post</q-item-label>
                  </q-item>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Telefon</q-item-label>
              <q-item-label class="text-subtitle1">{{ currentUser.phone || '' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn unelevated icon="more_vert" flat color="grey-8">
                <q-menu>
                  <q-item clickable v-close-popup class="flex flex-center" @click="editPhone">
                    <q-item-label>Ändra telefon</q-item-label>
                  </q-item>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Lösenord</q-item-label>
              <q-item-label class="text-subtitle1">********</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn unelevated icon="more_vert" flat color="grey-8">
                <q-menu>
                  <q-item clickable v-close-popup class="flex flex-center" @click="editPassword">
                    <q-item-label>Ändra lösenord</q-item-label>
                  </q-item>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>

        <q-btn unelevated class="full-width q-mt-xl" color="primary" @click="signOut">Logga ut</q-btn>
      </div>

      <div class="text-center q-my-xl full-width">
        <q-btn unelevated color="red-5" class="full-width q-my-md" label="Radera konto" no-caps
          @click="confirmDeleteAccount" />
      </div>
    </div>

    <EditNameDialog :show="showNameDialog" :currentName="currentUser?.name || ''" @update:show="showNameDialog = $event"
      @updateName="handleUpdateName" />

    <EditEmailDialog :show="showEmailDialog" :currentEmail="currentUser?.email || ''"
      @update:show="showEmailDialog = $event" @updateEmail="handleUpdateEmail" />

    <EditPhoneDialog :show="showPhoneDialog" :currentPhone="currentUser?.phone || ''"
      @update:show="showPhoneDialog = $event" @updatePhone="handleUpdatePhone" />

    <EditPasswordDialog :show="showPasswordDialog" @update:show="showPasswordDialog = $event"
      @updatePassword="handleUpdatePassword" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from 'src/features/auth/authStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import ImageThumbnail from 'src/components/ImageThumbnail.vue';
import EditNameDialog from './components/EditNameDialog.vue';
import EditEmailDialog from './components/EditEmailDialog.vue';
import EditPhoneDialog from './components/EditPhoneDialog.vue';
import EditPasswordDialog from './components/EditPasswordDialog.vue';
import { storeToRefs } from 'pinia';

const authStore = useAuth();
const $q = useQuasar();
const router = useRouter();

const { currentUser } = storeToRefs(authStore);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;

  if (!authStore.authModel && pb.authStore.record) {
    authStore.authModel = pb.authStore.record;
  }

  if (!currentUser.value && authStore.isAuthenticated) {
    await authStore.getUser();
  }

  loading.value = false;
});
const showNameDialog = ref(false);
const showEmailDialog = ref(false);
const showPhoneDialog = ref(false);
const showPasswordDialog = ref(false);

const getImageUrl = () => {
  if (!currentUser.value?.avatar) return null;
  return pb.files.getURL(currentUser.value, currentUser.value.avatar);
};

const fileSelected = async (file: File | null) => {
  if (!file) {
    const success = await authStore.updateUserImage([]);
    if (success) {
      $q.notify({
        message: 'Bilden har tagits bort',
        color: 'primary',
        position: 'bottom',
      });
    }
    return;
  }

  const success = await authStore.updateUserImage(file);
  if (success) {
    $q.notify({
      message: 'Bilden har uppdaterats',
      color: 'primary',
      position: 'bottom',
    });
  } else {
    $q.notify({
      message: 'Bilden kunde inte uppdateras',
      color: 'negative',
      position: 'bottom',
    });
  }
};

const editName = () => {
  showNameDialog.value = true;
};

const editEmail = () => {
  showEmailDialog.value = true;
};

const editPhone = () => {
  showPhoneDialog.value = true;
};

const editPassword = () => {
  showPasswordDialog.value = true;
};

const handleUpdateName = async (name: string) => {
  const success = await authStore.updateUserName(name);
  if (success) {
    $q.notify({
      message: 'Namnet har uppdaterats',
      color: 'primary',
      position: 'bottom',
    });
  } else {
    $q.notify({
      message: 'Namnet kunde inte uppdateras',
      color: 'negative',
      icon: 'error',
      position: 'bottom',
    });
  }
};

const handleUpdateEmail = async (email: string) => {
  const success = await authStore.updateUserEmail(email);
  if (success) {
    $q.notify({
      message: 'E-postadressen har uppdaterats',
      color: 'primary',
      position: 'bottom',
    });
  } else {
    $q.notify({
      message: 'E-postadressen kunde inte uppdateras',
      color: 'negative',
      icon: 'error',
      position: 'bottom',
    });
  }
};

const handleUpdatePhone = async (phone: string) => {
  const success = await authStore.updateUserPhone(phone);
  if (success) {
    $q.notify({
      message: 'Telefonnumret har uppdaterats',
      color: 'primary',
      position: 'bottom',
    });
  } else {
    $q.notify({
      message: 'Telefonnumret kunde inte uppdateras',
      color: 'negative',
      icon: 'error',
      position: 'bottom',
    });
  }
};

const handleUpdatePassword = async (data: { oldPassword: string; password: string; passwordConfirm: string }) => {
  const success = await authStore.updateUserPassword(data);
  if (success) {
    $q.notify({
      message: 'Lösenordet har uppdaterats',
      color: 'primary',
      position: 'bottom',
    });
  } else {
    $q.notify({
      message: 'Lösenordet kunde inte uppdateras',
      color: 'negative',
      icon: 'error',
      position: 'bottom',
    });
  }
};

const signOut = () => {
  authStore.signOut();
  void router.replace('/');
};

const confirmDeleteAccount = () => {
  $q.dialog({
    title: 'Bekräfta borttagning',
    message: 'Är du säker på att du vill ta bort ditt konto? Detta kan inte ångras.',
    cancel: {
      label: 'Avbryt',
      color: 'primary',
      flat: true,
    },
    ok: {
      label: 'Ja, ta bort',
      color: 'primary',
      unelevated: true,
    },
    persistent: true,
  }).onOk(() => {
    void (async () => {
      const success = await authStore.deleteUser();
      if (success) {
        $q.notify({
          message: 'Ditt konto har tagits bort',
          color: 'primary',
          position: 'bottom',
        });
        authStore.signOut();
        void router.replace('/');
      } else {
        $q.notify({
          message: 'Ditt konto kunde inte tas bort',
          color: 'negative',
          position: 'bottom',
        });
      }
    })();
  });
};
</script>

<template>
  <q-page class="full-height bg-grey-2" style="display: flex; flex-direction: column;">
    <div v-if="!$q.platform.is.mobile" class="row items-center q-pa-sm bg-primary q-mb-md">
      <q-btn unelevated color="secondary" text-color="primary" icon="add" label="Skapa grupp" to="/skapa-grupp" />
      <q-space />
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="groups.length === 0" class="flex flex-center" style="flex: 1;">
      <div class="text-center q-gutter-md">
        <div class="text-h6">
          Du har inga grupper
        </div>
        <div>
          <q-btn to="/skapa-grupp" unelevated rounded size="lg" no-caps style="font-size: 1rem; width: 240px"
            color="primary">Skapa grupp</q-btn>
          <div v-if="$q.platform.is.mobile" class="q-mt-md">Eller använd knappen <q-badge rounded
              color="primary">+</q-badge> nedan för att
            skapa grupper.</div>
        </div>
      </div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="group in groups" :key="group.id" class="col-xs-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ group.name }}</div>
            <q-chip v-if="group.verified" color="positive" text-color="white" size="sm">
              Verifierad
            </q-chip>
          </q-card-section>

          <q-card-section v-if="group.description">
            <div class="text-body2">{{ truncate(group.description, 100) }}</div>
          </q-card-section>

          <q-card-actions>
            <q-btn flat color="primary" label="Visa" :to="`/mina-grupper/${group.id}`" />
            <q-btn flat color="primary" label="Redigera" :to="`/redigera-grupp/${group.id}`" />
            <q-space />
            <q-btn flat color="negative" icon="delete" @click="confirmDelete(group.id)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-page-sticky v-if="$q.platform.is.mobile" position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="primary" to="/skapa-grupp" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { pb } from 'src/boot/pocketbase';
import { useAuth } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import type { GroupsRecord } from 'app/pocketbase-types';

const authStore = useAuth();
const $q = useQuasar();

const groups = ref<GroupsRecord[]>([]);
const loading = ref(true);

const truncate = (text: string, length: number) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const loadGroups = async () => {
  if (!authStore.currentUser) return;

  try {
    const records = await pb.collection('groups').getList(1, 50, {
      filter: `creatorId="${authStore.currentUser.id}"`,
      sort: '-created',
    });

    groups.value = records.items as unknown as GroupsRecord[];
  } catch (error) {
    console.error('Load groups error:', error);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (id: string) => {
  $q.dialog({
    title: 'Bekräfta borttagning',
    message: 'Är du säker på att du vill ta bort denna grupp?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      try {
        await pb.collection('groups').delete(id);
        groups.value = groups.value.filter(g => g.id !== id);
        $q.notify({
          type: 'positive',
          message: 'Grupp borttagen!',
        });
      } catch (error) {
        console.error('Delete error:', error);
        $q.notify({
          type: 'negative',
          message: 'Kunde inte ta bort grupp.',
        });
      }
    })();
  });
};

onMounted(() => {
  void loadGroups();
});
</script>

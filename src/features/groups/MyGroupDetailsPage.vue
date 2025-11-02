<template>
  <q-page class="page-background-pattern">
    <div v-if="loading" class="flex flex-center">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="group">
      <div v-if="!$q.platform.is.mobile" class="row items-center q-pa-md bg-primary q-gutter-md">
        <q-btn unelevated color="secondary" text-color="primary" icon="edit" label="Redigera"
          :to="`/redigera-grupp/${group.id}`" />
        <q-btn unelevated color="secondary" text-color="primary" icon="more_vert">
          <q-menu>
            <q-list>
              <q-item clickable v-close-popup @click="confirmDelete">
                <q-item-section>Radera grupp</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-space />
      </div>

      <div class="q-pa-md">
        <group-details :group="group" :show-status="true" />
      </div>

      <q-page-sticky v-if="$q.platform.is.mobile" position="bottom-right" :offset="[20, 20]">
        <q-btn fab icon="edit" color="primary" :to="`/redigera-grupp/${group.id}`" />
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { pb } from 'src/boot/pocketbase';
import GroupDetails from './components/GroupDetails.vue';
import { useGroups } from './groupsStore';
import type { GroupsRecord } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import { useQuasar } from 'quasar';
import { Collections } from 'app/pocketbase-types';
import type { GroupsExpand } from 'app/expanded-pocketbase-types';

const route = useRoute();
const router = useRouter();
const groupsStore = useGroups();
const $q = useQuasar();
const loading = ref(true);
const group = ref<(WithId<GroupsRecord> & { expand?: GroupsExpand }) | null>(null);

const groupId = computed(() => route.params.id as string);

const confirmDelete = () => {
  void $q.dialog({
    title: 'Bekräfta borttagning',
    message: 'Är du säker på att du vill ta bort denna grupp?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    if (!group.value) return;

    void (async () => {
      try {
        await groupsStore.deleteGroup(group.value!.id);
        $q.notify({
          type: 'positive',
          message: 'Grupp borttagen!',
        });
        void router.push('/mina-grupper-lista');
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

onMounted(async () => {
  const id = groupId.value;
  group.value = await pb.collection(Collections.Groups).getOne(id, { expand: 'city,createdBy' }) as unknown as WithId<GroupsRecord, GroupsExpand>;
  loading.value = false;
});
</script>

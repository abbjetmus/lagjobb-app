<template>
  <q-page class="q-pa-md page-background-pattern">
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="group">
      <div class="q-pa-md">
        <group-details :group="group" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGroups } from 'src/features/groups/groupsStore';
import type { GroupsRecord } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import type { GroupsExpand } from 'app/expanded-pocketbase-types';
import GroupDetails from 'src/features/groups/components/GroupDetails.vue';

const groupsStore = useGroups();
const route = useRoute();
const group = ref<WithId<GroupsRecord, GroupsExpand> | null>(null);
const loading = ref(true);
const groupId = computed(() => route.params.id as string);

onMounted(async () => {
  group.value = await groupsStore.getGroupById(groupId.value);
  loading.value = false;
});
</script>

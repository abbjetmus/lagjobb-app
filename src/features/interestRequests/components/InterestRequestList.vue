<template>
  <div class="q-pa-md">
    <q-list separator bordered class="rounded-borders">
      <q-expansion-item expand-separator>
        <template v-slot:header>
          <q-item-section>
            Godkänt
          </q-item-section>
          <q-item-section side>
            <q-badge color="primary" :label="approvedRequests.length" />
          </q-item-section>
        </template>
        <q-card>
          <q-card-section class="q-pa-none q-ma-none">
            <q-list separator>
              <interest-request-list-item v-for="request in approvedRequests" :key="request.id"
                :interest-request="request" :selected="selectedId === request.id"
                @click="$emit('select', request.id)" />
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item expand-separator>
        <template v-slot:header>
          <q-item-section>
            Ej besvarade
          </q-item-section>
          <q-item-section side>
            <q-badge color="primary" :label="noResponseRequests.length" />
          </q-item-section>
        </template>
        <q-card>
          <q-card-section class="q-pa-none q-ma-none">
            <q-list separator>
              <interest-request-list-item v-for="request in noResponseRequests" :key="request.id"
                :interest-request="request" :selected="selectedId === request.id"
                @click="$emit('select', request.id)" />
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item expand-separator>
        <template v-slot:header>
          <q-item-section>
            Nekade
          </q-item-section>
          <q-item-section side>
            <q-badge color="primary" :label="declinedRequests.length" />
          </q-item-section>
        </template>
        <q-card>
          <q-card-section class="q-pa-none q-ma-none">
            <q-list separator>
              <interest-request-list-item v-for="request in declinedRequests" :key="request.id"
                :interest-request="request" :selected="selectedId === request.id" @click="emitSelect(request.id)" />
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useInterestRequests } from 'src/features/interestRequests/interestRequestsStore';
import type { GroupsRecord, InterestRequestsRecord } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import { InterestRequestsStatusOptions } from 'app/pocketbase-types';
import InterestRequestListItem from './InterestRequestListItem.vue';

interface Props {
  jobId: string;
  selectedId: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  select: [id: string];
}>();

const emitSelect = (id: string) => {
  emit('select', id);
};

const interestRequestsStore = useInterestRequests();
const interestRequests = ref<(WithId<InterestRequestsRecord> & { expand?: { group?: WithId<GroupsRecord> } })[]>([]);

onMounted(async () => {
  const requests = await interestRequestsStore.getInterestRequestsForJob(props.jobId);
  interestRequests.value = requests as (WithId<InterestRequestsRecord> & { expand?: { group?: WithId<GroupsRecord> } })[];
});

const approvedRequests = computed(() =>
  interestRequests.value.filter(r => r.status === InterestRequestsStatusOptions.Godkänd || (r.approvedAt && r.status === InterestRequestsStatusOptions.Nekad))
);

const noResponseRequests = computed(() =>
  interestRequests.value.filter(r => r.status === InterestRequestsStatusOptions.Förfrågan && !r.approvedAt && !r.responseAt)
);

const declinedRequests = computed(() =>
  interestRequests.value.filter(r => r.status === InterestRequestsStatusOptions.Nekad && r.responseAt && !r.approvedAt)
);

</script>

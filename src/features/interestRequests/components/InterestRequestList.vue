<template>
  <div class="q-pa-md">
    <q-list separator bordered class="rounded-borders">
      <q-expansion-item expand-separator label="Godkänt">
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

      <q-expansion-item expand-separator label="Ej besvarade">
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

      <q-expansion-item expand-separator label="Nekade">
        <q-card>
          <q-card-section class="q-pa-none q-ma-none">
            <q-list separator>
              <interest-request-list-item v-for="request in declinedRequests" :key="request.id"
                :interest-request="request" :selected="selectedId === request.id"
                @click="$emit('select', request.id)" />
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useJobs } from 'src/features/jobs/jobsStore';
import type { InterestRequestsRecord } from 'app/pocketbase-types';
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

const jobsStore = useJobs();
const interestRequests = ref<(WithId<InterestRequestsRecord> & { expand?: { group?: any } })[]>([]);

onMounted(async () => {
  const requests = await jobsStore.getInterestRequestsForJob(props.jobId);
  interestRequests.value = requests as (WithId<InterestRequestsRecord> & { expand?: { group?: any } })[];
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

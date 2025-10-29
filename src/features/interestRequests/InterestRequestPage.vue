<template>
  <q-page class="page-background-pattern">
    <div v-if="loading" class="flex flex-center">
      <q-spinner color="secondary" size="3em" />
    </div>

    <div v-else-if="jobId">
      <div v-if="isUppdragsgivare" class="row q-col-gutter-md q-pa-md">
        <div class="col-12 col-md-4">
          <div class="text-center text-grey">
            Välj en förfrågan från listan
          </div>
          <interest-request-list :job-id="jobId" :selected-id="selectedInterestRequestId"
            @select="selectedInterestRequestId = $event" />
        </div>
        <div class="col-12 col-md-8">
          <interest-request-process-stepper v-if="selectedInterestRequestId"
            :interest-request-id="selectedInterestRequestId" :job-id="jobId" />
        </div>
      </div>

      <div v-else-if="isUppdragsutforare" class="q-pa-md">
        <interest-request-group-stepper :job-id="jobId" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from 'src/stores/auth';
import { UsersUserAccountTypeOptions } from 'app/pocketbase-types';
import InterestRequestList from './components/InterestRequestList.vue';
import InterestRequestProcessStepper from './components/InterestRequestProcessStepper.vue';
import InterestRequestGroupStepper from './components/InterestRequestGroupStepper.vue';

const route = useRoute();
const authStore = useAuth();

const loading = ref(true);
const selectedInterestRequestId = ref<string | null>(null);

const jobId = computed(() => route.query.jobId as string | undefined);

const isUppdragsgivare = computed(() =>
  authStore.currentUser?.userAccountType === UsersUserAccountTypeOptions.Uppdragsgivare
);

const isUppdragsutforare = computed(() =>
  authStore.currentUser?.userAccountType === UsersUserAccountTypeOptions.Uppdragsutförare
);

onMounted(async () => {
  loading.value = false;
});
</script>

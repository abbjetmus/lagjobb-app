import { defineStore } from 'pinia';
import { pb } from 'src/boot/pocketbase';
import type { InterestRequestsRecord } from 'app/pocketbase-types';
import { Collections } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import type { InterestRequestWithExpand } from 'app/expanded-pocketbase-types';
import { useInterestRequestNotifications } from 'src/composables/useInterestRequestNotifications';

interface InterestRequestsState {
  interestRequests: WithId<InterestRequestsRecord>[];
}

export const useInterestRequests = defineStore('interest-requests-module', {
  state() {
    return {
      interestRequests: [],
    } as InterestRequestsState;
  },
  actions: {
    async getInterestRequestById(id: string): Promise<InterestRequestWithExpand | null> {
      return pb
        .collection(Collections.InterestRequests)
        .getOne(id, {
          expand: 'group,group.createdBy,job,job.createdBy',
        })
        .then((res) => {
          return res as unknown as InterestRequestWithExpand;
        })
        .catch((e) => {
          console.error('Get interest request by id error:', e);
          return null;
        });
    },
    async getInterestRequestsForJob(jobId: string): Promise<WithId<InterestRequestsRecord>[]> {
      return pb
        .collection(Collections.InterestRequests)
        .getFullList({
          filter: `job="${jobId}"`,
          expand: 'group',
          sort: '-created',
        })
        .then((res) => {
          return res as unknown as WithId<InterestRequestsRecord>[];
        })
        .catch((e) => {
          console.error('Get interest requests error:', e);
          return [];
        });
    },
    async getInterestRequestForJobAndGroup(
      jobId: string,
      groupId: string
    ): Promise<WithId<InterestRequestsRecord> | null> {
      return pb
        .collection(Collections.InterestRequests)
        .getFirstListItem(`job="${jobId}" && group="${groupId}"`, {
          expand: 'group,job',
        })
        .then((res) => {
          return res as unknown as WithId<InterestRequestsRecord>;
        })
        .catch((e) => {
          console.error('Get interest request error:', e);
          return null;
        });
    },
    async sendInterestRequest(interestRequest: InterestRequestsRecord): Promise<boolean> {
      return pb
        .collection(Collections.InterestRequests)
        .create(interestRequest)
        .then(async (createdRequest) => {
          const { sendNotification } = useInterestRequestNotifications();
          await sendNotification({
            interestRequestId: createdRequest.id,
            action: 'new_request',
          });
          return true;
        })
        .catch((e) => {
          console.error('Send interest request error:', e);
          return false;
        });
    },
    async updateInterestRequest(id: string, data: Partial<InterestRequestsRecord>): Promise<boolean> {
      return pb
        .collection(Collections.InterestRequests)
        .update(id, data)
        .then(() => {
          return true;
        })
        .catch((e) => {
          console.error('Update interest request error:', e);
          return false;
        });
    },
  },
});


import { defineStore } from 'pinia';
import { pb } from 'src/boot/pocketbase'
import type { CountiesRecord, InterestRequestsRecord, JobCategoriesRecord, InterestRequestsJobsViewRecord } from 'app/pocketbase-types';
import { Collections, type JobsRecord } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import type { CountiesExpand, JobCategoriesExpand, JobsExpand } from 'app/expanded-pocketbase-types';
import { useAuth } from 'src/features/auth/authStore';
import type { Attachment } from 'src/models/attachment';
import { FileAction } from 'src/models/enums';

interface JobsState {
  jobs: WithId<JobsRecord>[],
  myJobs: (WithId<InterestRequestsJobsViewRecord>)[],
  savedJobs: WithId<JobsRecord>[],
  categories: (WithId<JobCategoriesRecord> & { expand?: JobCategoriesExpand })[],
  counties: (WithId<CountiesRecord> & { expand?: CountiesExpand })[],
  createdJobs: (WithId<JobsRecord> & { expand?: JobsExpand })[],
}

export const useJobs = defineStore('jobs-module', {
  state() {
    return {
      jobs: [],
      myJobs: [],
      createdJobs: [],
      savedJobs: [],
      categories: [],
      counties: [],
    } as JobsState;
  },
  actions: {
    async getAllJobs(): Promise<boolean> {
      return pb.collection(Collections.Jobs).getFullList({ expand: "jobSubcategories_via_job, cities_via_job" }).then(res => {
        this.jobs = res as unknown as WithId<JobsRecord>[]
        return true
      })
    },
    async getAllJobCategories(): Promise<boolean> {
      return pb.collection(Collections.JobCategories).getFullList({ expand: "jobSubcategories_via_category" }).then(res => {
        this.categories = res as unknown as (WithId<JobCategoriesRecord> & { expand?: JobCategoriesExpand })[]
        return true
      })
    },
    async getAllCounties(): Promise<boolean> {
      return pb.collection(Collections.Counties).getFullList({ expand: "cities_via_county" }).then(res => {
        this.counties = res as unknown as (WithId<CountiesRecord> & { expand?: CountiesExpand })[]
        return true
      })
    },
    async createJob(job: JobsRecord, images: Attachment[]): Promise<boolean> {
      const jobToCreate = {
        ...job,
        'images': images.filter(a => a.fileAction === FileAction.Add).map(a => a.file),
      }
      return pb.collection(Collections.Jobs).create(jobToCreate).then(res => {
        this.jobs = [...this.jobs, res as unknown as WithId<JobsRecord>]
        return true
      })
    },
    async getJobById(id: string): Promise<WithId<JobsRecord> & { expand?: JobsExpand } | null> {
      return pb.collection(Collections.Jobs).getOne(id, { expand: "jobSubcategories,city,createdBy" }).then(res => {
        return res as unknown as WithId<JobsRecord, JobsExpand>
      }).catch(e => {
        console.error(e)
        return null
      })
    },
    async updateJob(job: JobsRecord, images: Attachment[]): Promise<boolean> {
      const jobToUpdate = {
        ...job,
        'images-': images.filter(a => a.fileAction === FileAction.Delete).map(a => a.name),
        'images+': images.filter(a => a.fileAction === FileAction.Add).map(a => a.file),
      }
      return pb.collection(Collections.Jobs).update(job.id, jobToUpdate).then(res => {
        this.jobs = this.jobs.map(j => j.id === job.id ? res as unknown as WithId<JobsRecord> : j)
        return true
      })
    },
    async deleteJob(id: string): Promise<boolean> {
      return pb.collection(Collections.Jobs).delete(id).then(() => {
        this.jobs = this.jobs.filter(j => j.id !== id)
        return true
      })
    },
    async getMyJobs(): Promise<boolean> {
      const authStore = useAuth();
      return pb.collection(Collections.InterestRequestsJobsView).getFullList({
        filter: `groupCreatedBy="${authStore.currentUser?.id}"`,
        sort: '-created',
      }).then(res => {
        console.log(res)
        this.myJobs = res as unknown as (WithId<InterestRequestsJobsViewRecord>)[]
        return true
      }).catch(e => {
        console.error('Load my jobs error:', e)
        return false
      })
    },
    async getCreatedJobs(): Promise<boolean> {
      const authStore = useAuth();
      return pb.collection(Collections.Jobs).getFullList({
        filter: `createdBy="${authStore.currentUser?.id}"`,
        sort: '-created',
        expand: 'city',
      }).then(res => {
        this.createdJobs = res as unknown as (WithId<JobsRecord> & { expand?: JobsExpand })[]
        return true
      }).catch(e => {
        console.error('Load created jobs error:', e)
        return false
      })
    },
    async sendInterestRequest(interestRequest: InterestRequestsRecord): Promise<boolean> {
      return pb.collection(Collections.InterestRequests).create(interestRequest).then(() => {
        return true
      }).catch(e => {
        console.error('Send interest request error:', e)
        return false
      })
    },
    async getInterestRequestsForJob(jobId: string): Promise<WithId<InterestRequestsRecord>[]> {
      return pb.collection(Collections.InterestRequests).getFullList({
        filter: `job="${jobId}"`,
        expand: 'group',
        sort: '-created',
      }).then(res => {
        return res as unknown as WithId<InterestRequestsRecord>[]
      }).catch(e => {
        console.error('Get interest requests error:', e)
        return []
      })
    },
    async getInterestRequestForJobAndGroup(jobId: string, groupId: string): Promise<WithId<InterestRequestsRecord> | null> {
      return pb.collection(Collections.InterestRequests).getFirstListItem(
        `job="${jobId}" && group="${groupId}"`,
        { expand: 'group,job' }
      ).then(res => {
        return res as unknown as WithId<InterestRequestsRecord>
      }).catch(e => {
        console.error('Get interest request error:', e)
        return null
      })
    },
    async updateInterestRequest(id: string, data: Partial<InterestRequestsRecord>): Promise<boolean> {
      return pb.collection(Collections.InterestRequests).update(id, data).then(() => {
        return true
      }).catch(e => {
        console.error('Update interest request error:', e)
        return false
      })
    }
  }
})

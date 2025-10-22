import { defineStore } from 'pinia';
import { pb } from 'src/boot/pocketbase'
import type { CountiesRecord, JobCategoriesRecord } from 'app/pocketbase-types';
import { Collections, type JobsRecord } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import type { CountiesExpand, JobCategoriesExpand, JobsExpand } from 'app/expanded-pocketbase-types';

interface JobsState {
  jobs: WithId<JobsRecord>[],
  myJobs: WithId<JobsRecord>[],
  savedJobs: WithId<JobsRecord>[],
  categories: (WithId<JobCategoriesRecord> & { expand?: JobCategoriesExpand })[],
  counties: (WithId<CountiesRecord> & { expand?: CountiesExpand })[],
}

export const useJobs = defineStore('jobs-module', {
  state() {
    return {
      jobs: [],
      myJobs: [],
      savedJobs: [],
      categories: [],
      counties: [],
    } as JobsState;
  },
  actions: {
    async getAllJobs(): Promise<boolean> {
      return pb.collection(Collections.Jobs).getFullList().then(res => {
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
    async createJob(job: JobsRecord): Promise<boolean> {
      return pb.collection(Collections.Jobs).create(job).then(res => {
        this.jobs = [...this.jobs, res as unknown as WithId<JobsRecord>]
        return true
      })
    },
    async getJobById(id: string): Promise<WithId<JobsRecord> & { expand?: JobsExpand } | null> {
      return pb.collection(Collections.Jobs).getOne(id, { expand: "locations,createdBy" }).then(res => {
        return res as unknown as WithId<JobsRecord, JobsExpand>
      }).catch(e => {
        console.error(e)
        return null
      })
    },
    async updateJob(job: JobsRecord): Promise<boolean> {
      return pb.collection(Collections.Jobs).update(job.id, job).then(res => {
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
  }
})

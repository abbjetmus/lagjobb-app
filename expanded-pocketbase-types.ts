import type { WithId } from "src/models/withIdType";
import type { UsersRecord, JobLocationsRecord, JobSubcategoriesRecord, CitiesRecord } from "./pocketbase-types";

export interface JobsExpand {
  locations: WithId<JobLocationsRecord>[];
  createdBy: WithId<UsersRecord>;
}

export interface JobCategoriesExpand {
  jobSubcategories_via_category: WithId<JobSubcategoriesRecord>[];
}

export interface CountiesExpand {
  cities_via_county: WithId<CitiesRecord>[];
}

import { GroupsPublicationStatusOptions, JobsPublicationStatusOptions, SearchJobsViewPublicationStatusOptions } from 'app/pocketbase-types';

export const getGroupStatusColor = (status?: GroupsPublicationStatusOptions): string => {
  switch (status) {
    case GroupsPublicationStatusOptions.Publicerad:
      return 'positive';
    case GroupsPublicationStatusOptions.Granskning:
      return 'warning';
    case GroupsPublicationStatusOptions.Uppdatering:
      return 'info';
    case GroupsPublicationStatusOptions.Nekad:
      return 'negative';
    default:
      return 'grey';
  }
};

export const getJobStatusColor = (status?: JobsPublicationStatusOptions | SearchJobsViewPublicationStatusOptions | string): string => {
  switch (status) {
    case JobsPublicationStatusOptions.Publicerad:
    case SearchJobsViewPublicationStatusOptions.Publicerad:
    case 'Publicerad':
      return 'positive';
    case JobsPublicationStatusOptions.Granskning:
    case SearchJobsViewPublicationStatusOptions.Granskning:
    case 'Granskning':
      return 'warning';
    case JobsPublicationStatusOptions.Uppdatering:
    case SearchJobsViewPublicationStatusOptions.Uppdatering:
    case 'Uppdatering':
      return 'info';
    case JobsPublicationStatusOptions.Nekad:
    case SearchJobsViewPublicationStatusOptions.Nekad:
    case 'Nekad':
      return 'negative';
    default:
      return 'grey';
  }
};

import { GroupsPublicationStatusOptions, JobsPublicationStatusOptions } from 'app/pocketbase-types';

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

export const getJobStatusColor = (status?: JobsPublicationStatusOptions): string => {
  switch (status) {
    case JobsPublicationStatusOptions.Publicerad:
      return 'positive';
    case JobsPublicationStatusOptions.Granskning:
      return 'warning';
    case JobsPublicationStatusOptions.Uppdatering:
      return 'info';
    case JobsPublicationStatusOptions.Nekad:
      return 'negative';
    default:
      return 'grey';
  }
};

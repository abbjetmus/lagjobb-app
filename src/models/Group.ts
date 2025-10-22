export interface Group {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  name: string;
  description?: string;
  groupTypeId: number;
  creatorId: string;
  locationId?: string;
  contactEmail?: string;
  contactPhone?: string;
  images?: string[];
  workers?: Worker[];
  verified: boolean;
}

export interface GroupType {
  id: number;
  name: string;
  label: string;
}

export interface Worker {
  id: string;
  name: string;
  age?: number;
  description?: string;
}

export interface WorkersList {
  id: string;
  groupId: string;
  title: string;
  items: WorkersListItem[];
}

export interface WorkersListItem {
  id: string;
  workersListId: string;
  description: string;
  price?: number;
}


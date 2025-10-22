export interface Uppdrag {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  creatorId: string;
  name: string;
  email: string;
  phone: string;
  contactHours?: string;
  hidePhone: boolean;
  title: string;
  description: string;
  price?: number;
  desiredDate?: string;
  desiredTime?: string;
  desiredNumberOfPeople?: number;
  estimatedHours?: number;
  locationId?: string;
  images?: string[];
  types?: string[];
  status?: string;
}

export interface UppdragType {
  id: string;
  name: string;
  categoryId: string;
  label: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  value: string;
  color: string;
  uppdragTypes?: UppdragType[];
}

export interface InterestMessage {
  id: string;
  uppdragId: string;
  groupId: string;
  message: string;
  created: string;
  status?: string;
}


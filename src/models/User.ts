export interface User {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  email: string;
  verified: boolean;
  name?: string;
  phone?: string;
  locationId?: string;
}

export interface Location {
  id: string;
  street?: string;
  city?: string;
  postalCode?: string;
  county?: string;
  lat?: number;
  lng?: number;
}


import type { IsoDateString } from "app/pocketbase-types";

export type WithId<T, E = unknown> = T & {
  id?: string,
  created?: IsoDateString,
  updated?: IsoDateString,
  expand?: E
};

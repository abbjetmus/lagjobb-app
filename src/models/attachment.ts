import type { FileAction } from "./enums";

export interface Attachment {
  file: File,
  name: string,
  fileAction: FileAction,
  fromServer: boolean
}

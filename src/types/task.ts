import type { ContactDetails } from "./contact";

export type Task = {
  id?: number;
  imageUri?: string | null;
  responsibleContact?: ContactDetails | null;
  title: string;
  todo: string;
  isDone: boolean;
  withNotification: boolean;
  notificationDate: Date;
  notificationId?: string | null;
};

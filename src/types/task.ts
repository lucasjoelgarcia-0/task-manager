import type { ContactDetails } from "./contact";

export type Task = {
  completionDate?: Date | null;
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

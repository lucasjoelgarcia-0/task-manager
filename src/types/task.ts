import type { ContactDetails } from "./contact";
import type { LocationDetails } from "../services/device-apis/location/location";

export type Task = {
  completionDate?: Date | null;
  id?: number;
  imageUri?: string | null;
  location?: LocationDetails | null;
  responsibleContact?: ContactDetails | null;
  title: string;
  todo: string;
  isDone: boolean;
  withNotification: boolean;
  notificationDate: Date;
  notificationId?: string | null;
};

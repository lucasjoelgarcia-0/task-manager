export type Task = {
  id?: number;
  imageUri?: string | null;
  title: string;
  todo: string;
  isDone: boolean;
  withNotification: boolean;
  notificationDate: Date;
  notificationId?: string | null;
};

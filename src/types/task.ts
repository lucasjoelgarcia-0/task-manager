export type Task = {
  id?: number;
  todo: string;
  isDone: boolean;
  withNotification: boolean;
  notificationDate: Date;
};

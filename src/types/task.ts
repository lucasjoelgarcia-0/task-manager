export type Task = {
  id?: number;
  title: string;
  todo: string;
  isDone: boolean;
  withNotification: boolean;
  notificationDate: Date;
};

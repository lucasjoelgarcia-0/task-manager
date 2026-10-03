import { Task } from "../types/task";

export function hasCompletedTasks(tasks: Task[]): boolean {
  return tasks.some((task) => task.isDone);
}

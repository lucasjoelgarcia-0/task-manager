import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoredUser } from "../types/auth";

const USERS_KEY = "istea_task_manager_users";
const SESSION_KEY = "istea_task_manager_session";

async function getUsers(): Promise<StoredUser[]> {
  const users = await AsyncStorage.getItem(USERS_KEY);

  if (!users) {
    return [];
  }

  return JSON.parse(users) as StoredUser[];
}

export async function registerUser(user: StoredUser): Promise<boolean> {
  const users = await getUsers();
  const userAlreadyExists = users.some((storedUser) => storedUser.email === user.email);

  if (userAlreadyExists) {
    return false;
  }

  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return true;
}

export async function validateUser(user: StoredUser): Promise<boolean> {
  const users = await getUsers();
  return users.some(
    (storedUser) => storedUser.email === user.email && storedUser.password === user.password,
  );
}

export async function startSession(email: string): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, email);
}

export async function hasActiveSession(): Promise<boolean> {
  const session = await AsyncStorage.getItem(SESSION_KEY);
  return Boolean(session);
}

export async function closeSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

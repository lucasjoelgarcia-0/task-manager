import { Camera } from "expo-camera";

export async function isCameraPermissionGranted(): Promise<boolean> {
  const permission = await Camera.getCameraPermissionsAsync();

  return permission.granted;
}

export async function requestCameraPermission(): Promise<boolean> {
  const permission = await Camera.requestCameraPermissionsAsync();

  return permission.granted;
}

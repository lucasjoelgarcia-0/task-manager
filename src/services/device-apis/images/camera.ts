import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export async function isCameraPermissionGranted(): Promise<boolean> {
  const permission = await Camera.getCameraPermissionsAsync();

  return permission.granted;
}

export async function requestCameraPermission(): Promise<boolean> {
  const permission = await Camera.requestCameraPermissionsAsync();

  return permission.granted;
}

export async function takePhoto(): Promise<string | null> {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0]?.uri ?? null;
}

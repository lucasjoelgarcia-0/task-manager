import * as ImagePicker from "expo-image-picker";

export async function isGalleryPermissionGranted(): Promise<boolean> {
  const permission = await ImagePicker.getMediaLibraryPermissionsAsync(false);

  return permission.granted;
}

export async function requestGalleryPermission(): Promise<boolean> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync(false);

  return permission.granted;
}

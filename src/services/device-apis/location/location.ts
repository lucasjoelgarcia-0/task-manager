import * as Location from "expo-location";

export type LocationDetails = {
  country: string;
  province: string;
};

export async function isLocationPermissionGranted(): Promise<boolean> {
  const permission = await Location.getForegroundPermissionsAsync();

  return permission.granted;
}

export async function requestLocationPermission(): Promise<boolean> {
  const permission = await Location.requestForegroundPermissionsAsync();

  return permission.granted;
}

export async function getCurrentLocationDetails(): Promise<LocationDetails | null> {
  if (!(await Location.hasServicesEnabledAsync())) {
    return null;
  }

  const currentLocation = await new Promise<Location.LocationObject>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Location request timed out"));
    }, 10000);

    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      .then(resolve, reject)
      .finally(() => clearTimeout(timeoutId));
  });
  const [address] = await Location.reverseGeocodeAsync({
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
  });

  if (!address) {
    return null;
  }

  const country = address.country ?? "";
  const province = address.region ?? address.subregion ?? "";

  if (!country && !province) {
    return null;
  }

  return { country, province };
}

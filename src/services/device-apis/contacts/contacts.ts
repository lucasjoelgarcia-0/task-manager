import * as Contacts from "expo-contacts";
import { Contact, ContactField } from "expo-contacts";
import type { ContactDetails } from "../../../types/contact";

export async function isContactsPermissionGranted(): Promise<boolean> {
  const permission = await Contacts.getPermissionsAsync();

  return permission.granted;
}

export async function requestContactsPermission(): Promise<boolean> {
  const permission = await Contacts.requestPermissionsAsync();

  return permission.granted;
}

export async function selectContactDetails(): Promise<ContactDetails | null> {
  const contact = await Contact.presentPicker();

  if (!contact) {
    return null;
  }

  const details = await contact.getDetails([
    ContactField.GIVEN_NAME,
    ContactField.FAMILY_NAME,
    ContactField.EMAILS,
  ]);

  return {
    email: details.emails?.[0]?.address ?? "",
    firstName: details.givenName ?? "",
    lastName: details.familyName ?? "",
  };
}

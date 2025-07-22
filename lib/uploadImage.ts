import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./firebase"; // make sure firebase.ts exports `storage`

export async function uploadImage(file: File): Promise<string> {
  const imageRef = ref(storage, `images/${uuidv4()}-${file.name}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}
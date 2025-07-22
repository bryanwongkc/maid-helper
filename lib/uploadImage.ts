import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { app } from "./firebase";

const storage = getStorage(app);

export async function uploadImage(file: File): Promise<string> {
  const imageRef = ref(storage, `images/${uuidv4()}-${file.name}`);
  await uploadBytes(imageRef, file);
  const url = await getDownloadURL(imageRef);
  return url;
}
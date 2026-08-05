// ============================================================
// Firebase Storage Helpers
// ============================================================
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from 'firebase/storage';
import { storage } from './config';

export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);

  if (onProgress) {
    return new Promise((resolve, reject) => {
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        reject,
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  }

  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteFile(url: string): Promise<void> {
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
}

export function getStoragePath(folder: string, filename: string): string {
  const timestamp = Date.now();
  const ext = filename.split('.').pop();
  const safeName = filename.replace(/[^a-zA-Z0-9]/g, '_');
  return `${folder}/${timestamp}_${safeName}.${ext}`;
}

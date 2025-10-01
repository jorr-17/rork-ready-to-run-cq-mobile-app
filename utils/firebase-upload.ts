// utils/firebase-upload.ts
// Works in Expo (EAS) + React Native.
// Uploads local iOS/Android file:// URIs to Firebase Storage with metadata.

import { getApp, initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  UploadMetadata,
} from "firebase/storage";

// Expo fetch can read file:// URIs and return a Blob
// (No need for expo-file-system unless you prefer it.)
//
// If you DO prefer expo-file-system, you can swap fetch(uri) for:
//   const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
//   const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
//   await uploadBytes(fileRef, bytes, { ... })

// ---- Ensure Firebase is initialized (safe if already done elsewhere)
function ensureFirebase() {
  try {
    return getApp();
  } catch {
    // If your app is already initialized in another file, you can delete this block.
    return initializeApp({
      apiKey: "YOUR_API_KEY",
      authDomain: "ready-to-run-cq-app.firebaseapp.com",
      projectId: "ready-to-run-cq-app",
      storageBucket: "ready-to-run-cq-app.firebasestorage.app",
      appId: "1:XXXX:web:XXXX"
    });
  }
}

function safeSlug(s: string, max = 32) {
  return (s || "").toString().trim().replace(/\s+/g, "-").slice(0, max);
}

function buildObjectPath(folder: string, refCode: string, opts: { machine?: string; issue_type?: string; ext?: string; index?: number }) {
  const base = `${safeSlug(opts.machine || "machine")}_${safeSlug(opts.issue_type || "issue")}`;
  const ext = opts.ext || "jpg";
  const fileIndex = opts.index !== undefined ? `_${opts.index + 1}` : "";
  return `${folder}/${refCode}/${base}${fileIndex}.${ext}`;
}

export type UploadResult = {
  ok: true;
  path: string;         // storage path (fullPath)
  bucket: string;       // bucket name
  downloadUrl: string;  // gs -> https URL
};

type UploadMultipleArgs = {
  bucketFolder: "snap-send" | "gps-problems";
  refCode: string;
  imageUris: string[];   // e.g., ["file://...", "content://...", "data:..."]
  meta: {
    full_name?: string;
    phone?: string;
    machine?: string;   // for GPS we'll map system -> machine automatically
    system?: string;    // (so you don't HAVE to rename in callers)
    issue_type?: string;
    issue?: string;
    refCode?: string;
  };
};

async function uploadOneFromUri(bucketFolder: "snap-send" | "gps-problems", refCode: string, uri: string, meta: UploadMultipleArgs["meta"], index: number): Promise<UploadResult> {
  ensureFirebase();
  const storage = getStorage();

  // 1) Get a Blob from the URI (works in Expo for file://, content://, data:, http)
  const resp = await fetch(uri);
  if (!resp.ok) throw new Error(`Failed to read file at URI: ${uri}`);
  const blob = await resp.blob();

  // Guess extension from blob.type or from URI
  const contentType = (blob as any).type || "image/jpeg";
  const guessedExt = contentType.includes("/") ? contentType.split("/").pop() : "jpg";

  // 2) Build a nice path (folders auto-create)
  const objectPath = buildObjectPath(bucketFolder, refCode, {
    machine: meta.machine || meta.system,   // map system→machine if needed
    issue_type: meta.issue_type,
    ext: guessedExt || "jpg",
    index: index,
  });

  const fileRef = ref(storage, objectPath);

  // 3) Upload with metadata your Cloud Run function reads
  const uploadMeta: UploadMetadata = {
    contentType,
    customMetadata: {
      full_name: meta.full_name || "",
      phone: meta.phone || "",
      machine: meta.machine || meta.system || "",  // ensure "machine" always present
      issue_type: meta.issue_type || "",
      issue: meta.issue || "",
      refCode: meta.refCode || refCode,
    },
  };

  await uploadBytes(fileRef, blob, uploadMeta);
  const downloadUrl = await getDownloadURL(fileRef);

  // 4) Return info (useful for receipts/UI)
  return {
    ok: true,
    path: (fileRef as any).fullPath ?? objectPath,
    bucket: (fileRef as any)._location?.bucket ?? "ready-to-run-cq-app.firebasestorage.app",
    downloadUrl,
  };
}

export async function uploadMultipleIssueFiles(args: UploadMultipleArgs): Promise<UploadResult[]> {
  const { bucketFolder, refCode, imageUris, meta } = args;

  const validUris = (imageUris || []).filter(u =>
    typeof u === "string" &&
    u.trim().length > 0 &&
    u !== "undefined" &&
    u !== "null"
  );

  const results = await Promise.allSettled(
    validUris.map((uri, index) => uploadOneFromUri(bucketFolder, refCode, uri, meta, index))
  );

  const successes: UploadResult[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      successes.push(r.value);
    } else {
      console.warn(`⚠️ Upload failed for index ${i}:`, r.reason);
    }
  });

  return successes;
}

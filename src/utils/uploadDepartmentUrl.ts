import { getAuth } from "firebase/auth";

export type UploadResult = {
  kind: "image" | "video";
  path: string;
  publicUrl: string;
  mime?: string;
  size?: number;
};

export async function uploadDepartmentMediaToApi(file: File): Promise<UploadResult> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken(true);
  if (!token) throw new Error("No estás autenticado en Firebase.");

  const base = import.meta.env.VITE_API_URL;
  if (!base) throw new Error("Falta configurar VITE_API_URL.");

  const fd = new FormData();
  fd.append("file", file);

  // ✅ OJO: sin /api, y usando el endpoint nuevo
  const res = await fetch(`${base}/upload/department-media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  // Si el server devolvió HTML u otra cosa, lo exponemos para debug
  if (!contentType.includes("application/json")) {
    throw new Error(`Respuesta no-JSON (${res.status}). ${raw.slice(0, 200)}`);
  }

  const json = JSON.parse(raw);

  if (!res.ok) {
    throw new Error(json?.error || `Upload error (${res.status})`);
  }

  return json as UploadResult;
}


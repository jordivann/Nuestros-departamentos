import { getAuth } from "firebase/auth";

export async function uploadDepartmentImageToApi(file: File) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No estás autenticado en Firebase.");

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/department-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Upload error");

  return json as { path: string; publicUrl: string };
}

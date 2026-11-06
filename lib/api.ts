export type ApiResponse<T> = { data: T; status: number; message: string };

export type User = {
  id: number;
  name: string;
  email: string;
  career: string;
  semester: number;
  avatarUrl: string | null;
  points: number;
  notesCount: number;
};

export type Subject = { id: string; name: string; professor: string; color: string };
export type Chat = {
  id: string;
  subjectId: string;
  subjectName: string;
  professor: string;
  unreadCount: number;
  lastMessage: ChatMessage | null;
};
export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: "student" | "professor";
  text: string;
  sentAt: string;
  read: boolean;
};
export type NotificationSettings = {
  messages: boolean;
  groups: boolean;
  sharedNotes: boolean;
  sound: boolean;
  messagePreview: boolean;
  vibration: boolean;
};
export type PrivacySettings = {
  lastSeen: "everyone" | "contacts" | "nobody";
  profilePhoto: "everyone" | "contacts" | "nobody";
  info: "everyone" | "contacts" | "nobody";
  whoCanAddToGroups: "everyone" | "contacts";
  readReceipts: boolean;
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1").replace(/\/$/, "");

export async function apiRequest<T>(path: string, options: RequestInit = {}, userId?: number) {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (userId) headers.set("x-user-id", String(userId));

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers, cache: "no-store" });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté activo.");
  }

  const result = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !result) {
    throw new Error(result?.message ?? "Ocurrió un error al procesar la solicitud.");
  }
  return result;
}

export function jsonBody(value: unknown) {
  return JSON.stringify(value);
}

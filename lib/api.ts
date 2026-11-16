export type ApiResponse<T> = { data: T; status: number; message: string };

export type User = {
  id: number;
  name: string;
  role: "student" | "professor";
  email: string;
  career: string;
  semester: number | null;
  avatarUrl: string | null;
  points: number;
  notesCount: number;
};
export type AuthResult = { user: User; accessToken: string };
export const SESSION_STORAGE_KEY = "conectate-jave-user";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored) as { accessToken?: string };
    return session.accessToken ?? null;
  } catch {
    return null;
  }
}

export type Subject = {
  id: string;
  code?: string;
  name: string;
  professor: string;
  professorId?: number;
  color: string;
};
export type Note = {
  id: string;
  subjectId: string;
  authorId: string;
  authorName: string;
  title: string;
  fileName: string;
  fileUrl: string;
  averageRating: number;
  ratingsCount: number;
  myRating: number;
  createdAt: string;
  bookmarked: boolean;
};
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
  senderName: string;
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

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, userId?: number) {
  // Conserva el parámetro por compatibilidad con las llamadas existentes; la identidad ahora viene del token.
  void userId;
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const accessToken = getAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

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

"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/components/Elements";
import { useSession } from "@/components/SessionProvider";
import { apiRequest, jsonBody, type NotificationSettings } from "@/lib/api";

const labels: { key: keyof NotificationSettings; title: string }[] = [
  { key: "messages", title: "Mensajes" },
  { key: "groups", title: "Grupos" },
  { key: "sharedNotes", title: "Apuntes compartidos" },
  { key: "sound", title: "Sonido" },
  { key: "messagePreview", title: "Vista previa de mensajes" },
  { key: "vibration", title: "Vibración" },
];

export default function NotificationsPage() {
  const { user } = useSession();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    apiRequest<NotificationSettings>(
      "/users/me/notification-settings",
      {},
      user.id,
    )
      .then((result) => setSettings(result.data))
      .catch((cause) => setError(cause.message));
  }, [user]);

  async function toggle(key: keyof NotificationSettings) {
    if (!settings || !user) return;

    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    setError("");

    try {
      const result = await apiRequest<NotificationSettings>(
        "/users/me/notification-settings",
        { method: "PUT", body: jsonBody(next) },
        user.id,
      );
      setSettings(result.data);
    } catch (cause) {
      setSettings(settings);
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudieron guardar los cambios.",
      );
    }
  }

  return (
    <>
      <Heading title="Notificaciones" />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="settings settings-page">
        {labels.map(({ key, title }) => (
          <label className="setting toggle-row" key={key}>
            <span>{title}</span>
            <input
              type="checkbox"
              checked={settings?.[key] ?? false}
              disabled={!settings}
              onChange={() => toggle(key)}
            />
            <span className="switch" aria-hidden="true" />
          </label>
        ))}
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/components/Elements";
import { useSession } from "@/components/SessionProvider";
import { apiRequest, jsonBody, type PrivacySettings } from "@/lib/api";

const fields: {
  key: "lastSeen" | "profilePhoto" | "info" | "whoCanAddToGroups";
  title: string;
  contactsOnly?: boolean;
}[] = [
  { key: "lastSeen", title: "Última vez y en línea" },
  { key: "profilePhoto", title: "Foto de perfil" },
  { key: "info", title: "Info" },
  {
    key: "whoCanAddToGroups",
    title: "Quién puede añadirme a grupos",
    contactsOnly: true,
  },
];

export default function PrivacyPage() {
  const { user } = useSession();
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    apiRequest<PrivacySettings>("/users/me/privacy-settings", {}, user.id)
      .then((result) => setSettings(result.data))
      .catch((cause) => setError(cause.message));
  }, [user]);

  async function update(changes: Partial<PrivacySettings>) {
    if (!settings || !user) return;

    const previous = settings;
    const next = { ...settings, ...changes };
    setSettings(next);
    setError("");

    try {
      const result = await apiRequest<PrivacySettings>(
        "/users/me/privacy-settings",
        { method: "PUT", body: jsonBody(next) },
        user.id,
      );
      setSettings(result.data);
    } catch (cause) {
      setSettings(previous);
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudieron guardar los cambios.",
      );
    }
  }

  return (
    <>
      <Heading title="Privacidad" />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="settings settings-page">
        {fields.map(({ key, title, contactsOnly }) => (
          <label className="setting privacy" key={key}>
            {title}
            <select
              disabled={!settings}
              value={settings?.[key] ?? ""}
              onChange={(event) =>
                update({ [key]: event.target.value } as Partial<PrivacySettings>)
              }
            >
              <option value="everyone">Todos</option>
              <option value="contacts">Mis contactos</option>
              {!contactsOnly && <option value="nobody">Nadie</option>}
            </select>
          </label>
        ))}
        <label className="setting toggle-row">
          <span>Confirmaciones de lectura</span>
          <input
            type="checkbox"
            checked={settings?.readReceipts ?? false}
            disabled={!settings}
            onChange={(event) =>
              update({ readReceipts: event.target.checked })
            }
          />
          <span className="switch" aria-hidden="true" />
        </label>
      </div>
    </>
  );
}

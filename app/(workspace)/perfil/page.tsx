"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, Heading, Setting } from "@/components/Elements";
import { useSession } from "@/components/SessionProvider";
import { apiRequest, type User } from "@/lib/api";

export default function ProfilePage() {
  const { user, signOut } = useSession();
  const [profile, setProfile] = useState<User | null>(user);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    apiRequest<User>("/users/me", {}, user.id)
      .then((result) => setProfile(result.data))
      .catch((cause) => setError(cause.message));
  }, [user]);

  return (
    <>
      <Heading title="Mi perfil" />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="profile-layout">
        <section className="profile-card">
          <Avatar large>
            {profile?.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("") ?? "?"}
          </Avatar>
          <h2>{profile?.name}</h2>
          <p>
            {profile?.career} · {profile?.semester}° semestre
          </p>
          <div className="stats">
            <span>🏆 {profile?.points ?? 0} puntos</span>
          </div>
          <Link className="outline" href="/ajustes">
            Editar perfil
          </Link>
        </section>

        <section className="settings">
          <h2>Cuenta</h2>
          <Setting
            title="Ajustes"
            description="Tema, idioma, preferencias"
            href="/ajustes"
          />
          <Setting
            title="Notificaciones"
            description="Mensajes, grupos, sonido"
            href="/ajustes/notificaciones"
          />
          <Setting
            title="Privacidad"
            description="Última vez, foto de perfil"
            href="/ajustes/privacidad"
          />
          <button className="setting signout" onClick={signOut}>
            Cerrar sesión
          </button>
        </section>
      </div>
    </>
  );
}

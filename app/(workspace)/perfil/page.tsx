import Link from "next/link";
import { Avatar, Heading, Setting } from "@/components/Elements";

export default function ProfilePage() {
  return (
    <>
      <Heading title="Mi perfil" />

      <div className="profile-layout">
        <section className="profile-card">
          <Avatar large>JP</Avatar>
          <h2>Juan Pérez López</h2>
          <p>Ingeniería de Sistemas · 6to semestre</p>

          <div className="stats">
            <span>🏆 245 puntos</span>
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
          <Link className="setting signout" href="/">
            Cerrar sesión
          </Link>
        </section>
      </div>
    </>
  );
}

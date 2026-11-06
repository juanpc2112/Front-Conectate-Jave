import Link from "next/link";
import { Heading, Setting } from "@/components/Elements";

const settings = [
  {
    title: "Cuenta",
    description: "Nombre, correo, programa académico",
    href: "/perfil",
  },
  {
    title: "Privacidad",
    description: "Última vez, foto de perfil, info",
    href: "/ajustes/privacidad",
  },
  {
    title: "Notificaciones",
    description: "Mensajes, grupos, sonido",
    href: "/ajustes/notificaciones",
  },
  {
    title: "Chats",
    description: "Tema, fondo, historial",
    href: "/chats",
  },
  {
    title: "Ayuda",
    description: "Centro de ayuda, contacto",
    href: "/perfil",
  },
];

export default function SettingsPage() {
  return (
    <>
      <Heading title="Ajustes" />
      <div className="settings settings-page">
        {settings.map((setting) => (
          <Setting key={setting.title} {...setting} />
        ))}
        <Link className="setting signout" href="/">
          Cerrar sesión
        </Link>
      </div>
    </>
  );
}

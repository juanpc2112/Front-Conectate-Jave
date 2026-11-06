import { Heading, Toggle } from "@/components/Elements";

const notifications = [
  { title: "Mensajes", on: true },
  { title: "Grupos", on: true },
  { title: "Sonido", on: false },
  { title: "Vista previa de mensajes", on: true },
  { title: "Vibración", on: false },
];

export default function NotificationsPage() {
  return (
    <>
      <Heading title="Notificaciones" />
      <div className="settings settings-page">
        {notifications.map((notification) => (
          <Toggle
            key={notification.title}
            title={notification.title}
            on={notification.on}
          />
        ))}
      </div>
    </>
  );
}

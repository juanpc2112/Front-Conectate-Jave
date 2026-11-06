import { Heading, Toggle } from "@/components/Elements";

const privacyOptions = [
  { title: "Última vez y en línea", value: "Todos" },
  { title: "Foto de perfil", value: "Mis contactos" },
  { title: "Info", value: "Todos" },
  { title: "Quién puede añadirme a grupos", value: "Mis contactos" },
];

export default function PrivacyPage() {
  return (
    <>
      <Heading title="Privacidad" />
      <div className="settings settings-page">
        {privacyOptions.map((option) => (
          <label className="setting privacy" key={option.title}>
            {option.title}
            <select defaultValue={option.value}>
              <option>Todos</option>
              <option>Mis contactos</option>
              <option>Nadie</option>
            </select>
          </label>
        ))}
        <Toggle title="Confirmaciones de lectura" on />
      </div>
    </>
  );
}

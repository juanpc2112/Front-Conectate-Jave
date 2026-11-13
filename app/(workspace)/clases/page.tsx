"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Heading } from "@/components/Elements";
import { useSession } from "@/components/SessionProvider";
import { apiRequest, jsonBody, type Subject } from "@/lib/api";

export default function ClassesPage() {
  const { user } = useSession();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadSubjects = useCallback(async () => {
    if (!user) return;
    try {
      const result = await apiRequest<Subject[]>("/subjects", {}, user.id);
      setSubjects(result.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar las clases.");
    }
  }, [user]);

  useEffect(() => {
    // La carga asíncrona actualiza el estado cuando responde la API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSubjects();
  }, [loadSubjects]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      if (user.role === "professor") {
        const result = await apiRequest<Subject>(
          "/subjects",
          { method: "POST", body: jsonBody({ name: form.get("name") }) },
          user.id,
        );
        setMessage(`Clase creada. Código para tus estudiantes: ${result.data.code}`);
      } else {
        const result = await apiRequest<Subject>(
          "/subjects/join",
          { method: "POST", body: jsonBody({ code: form.get("code") }) },
          user.id,
        );
        setMessage(`Te uniste a ${result.data.name}.`);
      }
      event.currentTarget.reset();
      await loadSubjects();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo completar la operación.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="classroom-page">
      <Heading title="Mis clases" />
      <section className="classroom-panel">
        <h2>{user?.role === "professor" ? "Crear una clase" : "Unirme a una clase"}</h2>
        <p>
          {user?.role === "professor"
            ? "Crea una materia y comparte el código con tus estudiantes."
            : "Ingresa el código que te compartió tu profesor para acceder al grupo, chats y apuntes."}
        </p>
        <form className="classroom-form" onSubmit={submit}>
          {user?.role === "professor" ? (
            <input name="name" placeholder="Nombre de la materia" required />
          ) : (
            <input name="code" placeholder="Código de la clase" maxLength={6} required />
          )}
          <button className="submit" type="submit" disabled={busy}>
            {busy ? "Procesando…" : user?.role === "professor" ? "Crear clase" : "Unirme"}
          </button>
        </form>
        {message && <p className="success-message" role="status">{message}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>

      <section className="classroom-list">
        <h2>{subjects.length ? "Clases disponibles para ti" : "Todavía no tienes clases"}</h2>
        {subjects.length === 0 && (
          <p className="muted-copy">
            {user?.role === "professor"
              ? "Crea tu primera clase para compartirla con tus estudiantes."
              : "Únete a una clase con el código de tu profesor."}
          </p>
        )}
        {subjects.map((subject) => (
          <article className="classroom-card" key={subject.id}>
            <span className="avatar">{subject.name.slice(0, 1).toUpperCase()}</span>
            <span>
              <b>{subject.name}</b>
              <small>{subject.professor}</small>
            </span>
            {user?.role === "professor" && subject.code && (
              <code className="class-code">{subject.code}</code>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

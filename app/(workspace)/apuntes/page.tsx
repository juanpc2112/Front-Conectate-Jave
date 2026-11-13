"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Avatar } from "@/components/Elements";
import { useSession } from "@/components/SessionProvider";
import { apiRequest, apiUrl, getAccessToken, jsonBody, type Note, type Subject } from "@/lib/api";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

export default function NotesPage() {
  const { user } = useSession();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selected, setSelected] = useState<Subject | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadSubjects = useCallback(async () => {
    if (!user) return;
    try {
      const result = await apiRequest<Subject[]>("/subjects", {}, user.id);
      setSubjects(result.data);
      setSelected((current) => current ?? result.data[0] ?? null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar las materias.");
    }
  }, [user]);

  useEffect(() => {
    // La carga asíncrona actualiza el estado cuando responde la API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSubjects();
  }, [loadSubjects]);

  const loadNotes = useCallback(async () => {
    if (!user || !selected) {
      setNotes([]);
      return;
    }
    try {
      const result = await apiRequest<Note[]>(
        `/subjects/${encodeURIComponent(selected.id)}/notes`,
        {},
        user.id,
      );
      setNotes(result.data);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar los apuntes.");
    }
  }, [selected, user]);

  useEffect(() => {
    // La carga asíncrona actualiza el estado cuando responde la API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNotes();
  }, [loadNotes]);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !selected || !file) {
      setError("Selecciona un archivo PDF para compartir.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El PDF no puede superar 10 MB.");
      return;
    }

    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const fileData = await fileToDataUrl(file);
      const result = await apiRequest<Note>(
        `/subjects/${encodeURIComponent(selected.id)}/notes`,
        {
          method: "POST",
          body: jsonBody({
            title: form.get("title"),
            fileName: file.name,
            fileData,
          }),
        },
        user.id,
      );
      setNotes((current) => [result.data, ...current]);
      setShowUpload(false);
      setFile(null);
      event.currentTarget.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo subir el apunte.");
    } finally {
      setBusy(false);
    }
  }

  async function rate(note: Note, stars: number) {
    if (!user) return;
    try {
      const result = await apiRequest<Note>(
        `/notes/${encodeURIComponent(note.id)}/ratings`,
        { method: "POST", body: jsonBody({ stars }) },
        user.id,
      );
      setNotes((current) => current.map((item) => item.id === note.id ? result.data : item));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar la calificación.");
    }
  }

  async function openPdf(note: Note) {
    if (!user) return;
    const pdfWindow = window.open("about:blank", "_blank");
    if (!pdfWindow) {
      setError("Permite las ventanas emergentes para abrir el PDF.");
      return;
    }
    try {
      const response = await fetch(apiUrl(note.fileUrl), {
        headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
      });
      if (!response.ok) throw new Error("No se pudo abrir el PDF.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      pdfWindow.location.replace(url);
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (cause) {
      pdfWindow.close();
      setError(cause instanceof Error ? cause.message : "No se pudo abrir el PDF.");
    }
  }

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  return (
    <div className="notes-layout">
      <section className="notes-subjects">
        <header className="notes-heading">
          <h1>Apuntes</h1>
          {user?.role === "student" && selected && (
            <button
              className="add-note-button"
              type="button"
              aria-label="Compartir apunte"
              title="Compartir apunte"
              onClick={() => setShowUpload((visible) => !visible)}
            >
              +
            </button>
          )}
        </header>
        <label className="search">
          <span aria-hidden="true">⌕</span>
          <input
            placeholder="Buscar apuntes..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="notes-subject-list">
          {filteredSubjects.map((subject, index) => (
            <button
              className={`chat-choice note-subject ${selected?.id === subject.id ? "selected" : ""}`}
              key={subject.id}
              onClick={() => setSelected(subject)}
              type="button"
            >
              <Avatar color={index}>{subject.name.slice(0, 1).toUpperCase()}</Avatar>
              <span>
                <b>Apuntes de {subject.name}</b>
                <small>{subject.professor}</small>
              </span>
            </button>
          ))}
          {subjects.length === 0 && (
            <p className="muted-copy">Únete a una clase para ver y compartir apuntes.</p>
          )}
        </div>
      </section>

      <section className="note-detail">
        {selected ? (
          <>
            <header className="note-detail-heading">
              <div>
                <h2>Apuntes de {selected.name}</h2>
                <p>{selected.professor}</p>
              </div>
              {user?.role === "student" && (
                <button
                  className="add-note-button mobile-add-note"
                  type="button"
                  aria-label="Compartir apunte"
                  onClick={() => setShowUpload((visible) => !visible)}
                >
                  +
                </button>
              )}
            </header>

            {showUpload && user?.role === "student" && (
              <form className="note-upload-form" onSubmit={upload}>
                <label>
                  Nombre del apunte
                  <input name="title" placeholder="Ej. Resumen del tema 1" required />
                </label>
                <label>
                  Archivo PDF (máximo 10 MB)
                  <input type="file" accept="application/pdf,.pdf" onChange={selectFile} required />
                </label>
                {file && <small className="muted-copy">{file.name}</small>}
                <button className="submit" type="submit" disabled={busy || !file}>
                  {busy ? "Subiendo…" : "Compartir apunte"}
                </button>
              </form>
            )}

            {error && <p className="form-error" role="alert">{error}</p>}

            <div className="note-list">
              {notes.map((note, index) => (
                <article className="note-card" key={note.id}>
                  <Avatar color={index}>{note.authorName.slice(0, 1).toUpperCase()}</Avatar>
                  <div className="note-card-copy">
                    <b>{note.title}</b>
                    <small>Apuntes de {note.authorName} · {note.fileName}</small>
                  </div>
                  <div className="note-rating" aria-label={`Calificación promedio ${note.averageRating} de 5`}>
                    <span className="note-average">
                      {note.averageRating ? note.averageRating.toFixed(1) : "Nuevo"}
                    </span>
                    <div className="rating-stars" role="group" aria-label="Calificar apunte">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          className={stars <= note.myRating ? "star active" : "star"}
                          onClick={() => rate(note, stars)}
                          disabled={note.authorId === String(user?.id)}
                          aria-label={`Calificar con ${stars} estrellas`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <small>{note.ratingsCount} calificaciones</small>
                  </div>
                  <button className="open-note" type="button" onClick={() => openPdf(note)}>
                    Ver PDF
                  </button>
                </article>
              ))}
              {notes.length === 0 && !error && (
                <p className="empty-notes">Aún no hay apuntes en esta materia. ¡Comparte el primero!</p>
              )}
            </div>
          </>
        ) : (
          <p className="empty-notes">Primero únete a una clase para consultar sus apuntes.</p>
        )}
      </section>
    </div>
  );
}

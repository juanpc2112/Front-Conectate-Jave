"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, jsonBody, type User } from "@/lib/api";
import { useSession } from "@/components/SessionProvider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { signIn } = useSession();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const payload: Record<string, FormDataEntryValue | number> = Object.fromEntries(form.entries());
    if (mode === "register") payload.semester = Number(payload.semester);
    try {
      const result = await apiRequest<User>(`/auth/${mode}`, { method: "POST", body: jsonBody(payload) });
      signIn(result.data);
      router.replace("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo completar la solicitud.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      {mode === "register" && <>
        <label>Nombre completo<input name="name" autoComplete="name" required /></label>
        <label>Carrera<input name="career" required /></label>
        <label>Semestre<input name="semester" type="number" min="1" required /></label>
      </>}
      <label>Correo electrónico<input name="email" type="email" placeholder="nombre@javerianacali.edu.co" autoComplete="email" required /></label>
      <label>Contraseña<input name="password" type="password" placeholder="Contraseña" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "register" ? 8 : undefined} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="submit" type="submit" disabled={busy}>{busy ? "Enviando…" : mode === "login" ? "Ingresar" : "Crear cuenta"}</button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setError("");
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    try {
      const result = await apiRequest<null>("/auth/forgot-password", { method: "POST", body: jsonBody({ email }) });
      setMessage(result.message);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo completar la solicitud."); }
  }
  return <form onSubmit={submit}><label>Correo electrónico<input name="email" type="email" required /></label>{error && <p className="form-error">{error}</p>}{message && <p>{message}</p>}<button className="submit">Enviar solicitud</button></form>;
}

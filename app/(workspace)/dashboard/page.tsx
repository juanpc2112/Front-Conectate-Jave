"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, Course, Heading } from "@/components/Elements";
import { apiRequest, type Chat, type Subject } from "@/lib/api";
import { useSession } from "@/components/SessionProvider";

export default function DashboardPage() {
  const { user } = useSession();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Chat[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    Promise.all([apiRequest<Subject[]>("/subjects", {}, user.id), apiRequest<Chat[]>("/chats", {}, user.id)])
      .then(([subjectResult, chatResult]) => { setSubjects(subjectResult.data); setChats(chatResult.data); })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "No se pudieron cargar los datos."));
  }, [user]);
  useEffect(() => {
    if (!user || !query.trim()) { setMatches(null); return; }
    const timer = setTimeout(() => {
      apiRequest<{ chats: Chat[]; notes: unknown }>(`/search?q=${encodeURIComponent(query)}&type=chats`, {}, user.id)
        .then((result) => setMatches(result.data.chats))
        .catch((cause) => setError(cause.message));
    }, 250);
    return () => clearTimeout(timer);
  }, [query, user]);
  const displayedChats = matches ?? chats;
  return <>
    <Heading title={`Bienvenido, ${user?.name.split(" ")[0] ?? ""} 👋`}>
      <Link className="points" href="/perfil">
        {user?.points ?? 0} pts
        <Avatar>{user?.name.slice(0, 1) ?? "?"}</Avatar>
      </Link>
    </Heading>
    {error && <p className="form-error" role="alert">{error}</p>}
    <label className="search"><span aria-hidden="true">⌕</span><input placeholder="Buscar chats..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <section className="block">
      <h2>Tus materias</h2>
      <div className="course-grid">
        {subjects.map((subject, index) => (
          <Course
            key={subject.id}
            title={subject.name}
            professor={subject.professor}
            color={index}
          />
        ))}
      </div>
    </section>
    <section className="block">
      <h2>{query ? "Resultados de búsqueda" : "Chats recientes"}</h2>
      {displayedChats.map((chat, index) => (
        <Link className="row" href="/chats" key={chat.id}>
          <Avatar color={index}>P</Avatar>
          <span>
            <b>{chat.subjectName}</b>
            <small>{chat.lastMessage?.text ?? chat.professor}</small>
          </span>
        </Link>
      ))}
    </section>
  </>;
}

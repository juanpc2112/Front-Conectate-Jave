"use client";

import { FormEvent, useEffect, useState } from "react";
import { Avatar } from "@/components/Elements";
import { useSession } from "@/components/SessionProvider";
import { apiRequest, jsonBody, type Chat, type ChatMessage } from "@/lib/api";

export default function ChatsPage() {
  const { user } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selected, setSelected] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    apiRequest<Chat[]>("/chats", {}, user.id)
      .then((result) => {
        setChats(result.data);
        setSelected(result.data[0] ?? null);
      })
      .catch((cause) => setError(cause.message));
  }, [user]);

  useEffect(() => {
    if (!user || !selected) {
      setMessages([]);
      return;
    }

    apiRequest<ChatMessage[]>(
      `/chats/${encodeURIComponent(selected.id)}/messages`,
      {},
      user.id,
    )
      .then((result) => setMessages([...result.data].reverse()))
      .catch((cause) => setError(cause.message));
  }, [selected, user]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !selected || !text.trim()) return;

    try {
      const result = await apiRequest<ChatMessage>(
        `/chats/${encodeURIComponent(selected.id)}/messages`,
        { method: "POST", body: jsonBody({ text }) },
        user.id,
      );
      setMessages((current) => [...current, result.data]);
      setText("");
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo enviar el mensaje.",
      );
    }
  }

  const visibleChats = chats.filter((chat) =>
    `${chat.subjectName} ${chat.professor}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );

  return (
    <div className="chat-layout">
      <section className="chat-list">
        <h1>Chats</h1>
        <label className="search">
          <span aria-hidden="true">⌕</span>
          <input
            placeholder="Buscar chats..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        {visibleChats.map((chat, index) => (
          <button
            className={`chat-choice ${selected?.id === chat.id ? "selected" : ""}`}
            onClick={() => setSelected(chat)}
            key={chat.id}
          >
            <Avatar color={index}>P</Avatar>
            <span>
              <b>{chat.subjectName}</b>
              <small>{chat.professor}</small>
            </span>
          </button>
        ))}
      </section>

      <section className="chat-view">
        {selected ? (
          <>
            <header>
              <Avatar>{selected.subjectName.slice(0, 1)}</Avatar>
              <b>{selected.subjectName}</b>
            </header>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="messages">
              {messages.map((message) => (
                <p
                  className={
                    message.senderId === String(user?.id) ? "mine" : "theirs"
                  }
                  key={message.id}
                >
                  {message.text}
                  <small>
                    {new Date(message.sentAt).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </p>
              ))}
            </div>
            <form className="composer" onSubmit={send}>
              <input
                placeholder="Escribe un mensaje..."
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
              <button type="submit" aria-label="Enviar mensaje">
                ➤
              </button>
            </form>
          </>
        ) : (
          <p>{error || "No tienes chats disponibles."}</p>
        )}
      </section>
    </div>
  );
}

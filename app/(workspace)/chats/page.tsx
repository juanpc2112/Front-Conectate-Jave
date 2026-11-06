"use client";

import { useState } from "react";
import { Avatar, Search } from "@/components/Elements";

const chats = [
  "Programación Computacional",
  "Probabilidad y Estadística",
  "Cuidado de la Casa Común",
];

const messages = [
  [
    "Hola profe que veremos hoy?",
    "Hola chicos veremos diseño web.",
    "¿Qué toca traer para la próxima clase?",
    "Trae tu compu con Python.",
    "Listo profe, muchas gracias.",
  ],
  ["¿Alguien tiene el ejercicio de hoy?", "Sí, lo revisamos en el grupo."],
  ["Recuerden la actividad del viernes."],
];

const professors = ["Horacio Gómez", "Sara Martínez", "Andrés Ruiz"];

export default function ChatsPage() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="chat-layout">
      <section className="chat-list">
        <h1>Chats</h1>
        <Search placeholder="Buscar chats..." />

        {chats.map((chat, index) => (
          <button
            className={`chat-choice ${selected === index ? "selected" : ""}`}
            onClick={() => setSelected(index)}
            key={chat}
          >
            <Avatar color={index}>P</Avatar>
            <span>
              <b>{chat}</b>
              <small>Prof. {professors[index]}</small>
            </span>
          </button>
        ))}
      </section>

      <section className="chat-view">
        <header>
          <Avatar color={selected}>P</Avatar>
          <b>{chats[selected]}</b>
        </header>

        <div className="messages">
          {messages[selected].map((message, index) => (
            <p
              className={index % 2 === 0 ? "mine" : "theirs"}
              key={`${message}-${index}`}
            >
              {message}
              <small>11:{43 + index}</small>
            </p>
          ))}
        </div>

        <form className="composer">
          <input placeholder="Escribe un mensaje..." />
          <button type="button" aria-label="Enviar mensaje">
            ➤
          </button>
        </form>
      </section>
    </div>
  );
}

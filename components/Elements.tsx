import type { ReactNode } from "react";

export function Avatar({
  children,
  color = 0,
  large = false,
}: {
  children: ReactNode;
  color?: number;
  large?: boolean;
}) {
  const colorClass = `c${color % 3}`;

  return (
    <span className={`avatar ${colorClass} ${large ? "large" : ""}`}>
      {children}
    </span>
  );
}

export function Heading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="heading">
      <h1>{title}</h1>
      {children}
    </header>
  );
}

export function Search({ placeholder }: { placeholder: string }) {
  return (
    <label className="search">
      <span aria-hidden="true">⌕</span>
      <input placeholder={placeholder} />
    </label>
  );
}

export function Course({
  title,
  professor,
  color = 0,
}: {
  title: string;
  professor: string;
  color?: number;
}) {
  return (
    <article className="course">
      <Avatar color={color}>P</Avatar>
      <div>
        <b>{title}</b>
        <small>{professor}</small>
        <a href="/chats">Ver chat</a>
      </div>
    </article>
  );
}

export function Setting({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a className="setting" href={href}>
      <span>
        <b>{title}</b>
        <small>{description}</small>
      </span>
      <i aria-hidden="true">›</i>
    </a>
  );
}

export function Toggle({
  title,
  on = false,
}: {
  title: string;
  on?: boolean;
}) {
  return (
    <label className="setting toggle-row">
      <span>{title}</span>
      <input type="checkbox" defaultChecked={on} />
      <span className="switch" aria-hidden="true" />
    </label>
  );
}

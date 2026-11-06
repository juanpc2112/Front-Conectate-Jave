"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Inicio", icon: "⌂" },
  { href: "/chats", label: "Chats", icon: "▱" },
  { href: "/apuntes", label: "Apuntes", icon: "▤" },
  { href: "/perfil", label: "Perfil", icon: "♙" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand" href="/dashboard">
        <Image
          src="/logo-javeriana-cali.png"
          alt="Pontificia Universidad Javeriana Cali"
          width={100}
          height={124}
          className="university-logo"
        />
      </Link>

      <nav aria-label="Navegación principal">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <i aria-hidden="true">{link.icon}</i>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link href="/perfil" className="points">
        🏆 245 puntos
      </Link>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  );
}

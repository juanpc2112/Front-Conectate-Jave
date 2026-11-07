import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="login-layout">
      <section className="login-brand">
        <div className="brand">
          <Image
            src="/logo-javeriana-cali.png"
            alt="Pontificia Universidad Javeriana Cali"
            width={130}
            height={161}
            className="university-logo"
            priority
          />
        </div>
        <div className="wordmark">
          <b>conectate</b>
          <strong>jave</strong>
        </div>
        <footer>
          <b>Conéctate Jave</b>
          <small>Únete a la comunidad Javeriana Cali.</small>
        </footer>
      </section>

      <section className="login-content">
        <div className="login-card">
          <h1>Crear cuenta</h1>
          <p>Regístrate con tu correo institucional.</p>
          <AuthForm mode="register" />
          <p className="signup">
            ¿Ya tienes cuenta? <Link href="/">Iniciar sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

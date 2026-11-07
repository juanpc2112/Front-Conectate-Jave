import Image from "next/image";
import Link from "next/link";
import { AuthForm, ForgotPasswordForm } from "@/components/AuthForm";

export default function LoginPage() {
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
          <small>
            Chats con tus profesores y compañeros,
            <br />
            en un solo lugar.
          </small>
        </footer>
      </section>

      <section className="login-content">
        <div className="login-card">
          <h1>Iniciar sesión</h1>
          <p>Ingresa con tu correo institucional.</p>
          <AuthForm mode="login" />
          <details className="forgot">
            <summary>¿Olvidaste tu contraseña?</summary>
            <ForgotPasswordForm />
          </details>
          <div className="divider">
            <span />o<span />
          </div>
          <p className="signup">
            ¿No tienes una cuenta? <Link href="/registro">Regístrate</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

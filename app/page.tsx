import Link from "next/link";
import Image from "next/image";
export default function Login() {
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

                    <form>
                        <label>
                            Correo electrónico
                            <input placeholder="nombre@javeriana.edu.co" />
                        </label>

                        <label>
                            Contraseña
                            <input placeholder="Contraseña" />
                        </label>

                        <a className="forgot" href="#">
                            ¿Olvidaste tu contraseña?
                        </a>

                        <Link className="submit" href="/dashboard">
                            Ingresar
                        </Link>
                    </form>

                    <div className="divider">
                        <span />
                        o
                        <span />
                    </div>

                    <p className="signup">
                        ¿No tienes una cuenta? <a href="#">Regístrate</a>
                    </p>
                </div>
            </section>
        </main>
    );
}

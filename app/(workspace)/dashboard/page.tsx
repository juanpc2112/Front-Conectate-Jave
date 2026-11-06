import Link from "next/link";
import { Avatar, Course, Heading, Search } from "@/components/Elements";

const courses = [
  { title: "Plataformas Computacionales", professor: "Prof. Horacio Gómez" },
  { title: "Probabilidad y Estadística", professor: "Prof. Sara Martínez" },
  { title: "Cuidado de la Casa Común", professor: "Prof. Andrés Ruiz" },
];

export default function DashboardPage() {
  return (
    <>
      <Heading title="Bienvenido, Juan 👋">
        <Link className="points" href="/perfil">
          245 pts <Avatar>JP</Avatar>
        </Link>
      </Heading>
      <Search placeholder="Buscar chats..." />

      <section className="block">
        <h2>Tus materias</h2>
        <div className="course-grid">
          {courses.map((course, index) => (
            <Course key={course.title} {...course} color={index} />
          ))}
        </div>
      </section>

      <section className="block">
        <h2>Chats recientes</h2>
        {courses.map((course, index) => (
          <Link className="row" href="/chats" key={course.title}>
            <Avatar color={index}>P</Avatar>
            <span>
              <b>{course.title}</b>
              <small>{course.professor}</small>
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}

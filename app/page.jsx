import Link from "next/link";
import Header from "@/app/Components/header";

export default function Home() {
  return (
    <nav className="navbar">
     
      <Header />
     

      <div className="nav-links">
        <Link href="/">Inicio</Link>
        <Link href="/elementos">Elementos</Link>
        <Link href="/vuelos">Vuelos</Link>
      </div>
    </nav>
  );
}

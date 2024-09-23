import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-violet-900 p-6">
      <div className="flex justify-between">
        <h1 className="text-white text-xl">Mi Garage</h1>
        <div>
          <Link href="/login" className="text-white hover:underline">Iniciar sesión</Link>
          <span className="mx-2 text-white">|</span>
          <Link href="/register" className="text-white hover:underline">Registrarse</Link>
        </div>
      </div>
    </nav>
  );
}
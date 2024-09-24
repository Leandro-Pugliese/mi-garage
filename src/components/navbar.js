import Link from 'next/link';
import { cookies } from 'next/headers';

export default function Navbar() {

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <nav className="bg-violet-900 p-6">
      <div className="flex justify-between">
        <h1 className="text-white text-xl">Mi Garage</h1>
        {
          (token) &&
          <div>
            <Link href="#" className="text-white hover:underline">Agregar Vehículo</Link>
            <span className="mx-2 text-white">|</span>
            <Link href="#" className="text-white hover:underline">Mis Datos</Link>
          </div>
        }
        {
          (!token) &&
          <div>
            <Link href="/login" className="text-white hover:underline">Iniciar sesión</Link>
            <span className="mx-2 text-white">|</span>
            <Link href="/register" className="text-white hover:underline">Registrarse</Link>
          </div>
        }
      </div>
    </nav>
  );
}
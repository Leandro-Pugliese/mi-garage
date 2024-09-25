import Link from 'next/link';
import { cookies } from 'next/headers';
import LogOut from './logOut';
import 'bootstrap-icons/font/bootstrap-icons.css';


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
            <Link href="/vehicles" className="text-white hover:underline">
              <i className="bi bi-car-front-fill mx-1"/>
              Mis Vehículos
            </Link>
            <span className="mx-3 text-white">|</span>
            <Link href="#" className="text-white hover:underline">
              <i className="bi bi-person-fill mx-1"/>
              Mis Datos
            </Link>
            <span className="mx-3 text-white">|</span>
            <Link href="#" className="text-white hover:underline">
              <i className="bi bi-bell-fill mx-1"/>
              Notficaciones
            </Link>
            <span className="mx-3 text-white">|</span>
            <LogOut />
          </div>
        }
        {
          (!token) &&
          <div>
            <Link href="/user/login" className="text-white hover:underline">Iniciar sesión</Link>
            <span className="mx-2 text-white">|</span>
            <Link href="/user/register" className="text-white hover:underline">Registrarse</Link>
          </div>
        }
      </div>
    </nav>
  );
}
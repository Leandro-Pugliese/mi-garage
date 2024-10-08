import Link from 'next/link';
import { cookies } from 'next/headers';
import LogOut from './logOut';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Image from 'next/image';


export default function Navbar() {

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <nav className="bg-violet-900 p-2">
      <div className="flex justify-between items-center">
        <Image
          src="/images/Logo.png"
          alt="Logo navbar"
          width={80}
          height={30}
        />
        {
          (token) &&
          <div>
            <Link href="/vehicles" className="text-white hover:underline">
              <i className="bi bi-car-front-fill mx-1"/>
              Mis Vehículos
            </Link>
            <span className="mx-3 text-white">|</span>
            <Link href="/user/data" className="text-white hover:underline">
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
            <Link href="/user/login" className="text-white hover:underline">
              <i className="bi bi-box-arrow-in-right mx-1"/>
              Iniciar sesión
            </Link>
            <span className="mx-2 text-white">|</span>
            <Link href="/user/register" className="text-white hover:underline pr-2">
              <i className="bi bi-clipboard2-check mx-1"/>
              Registrarse
            </Link>
          </div>
        }
      </div>
    </nav>
  );
}
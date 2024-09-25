'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function LogOut() {
    const router = useRouter();

    const handleLogout = () => {
        // Elimino la cookie
        Cookies.remove('token');
        // Redirijo al usuario
        router.push('/');
        // Refresco la página para actualizar la navbar
        router.refresh();
    };

    return (
        <button onClick={handleLogout} className="text-white hover:underline">
            <i className='bi bi-person-x-fill mx-1'/>
            Cerrar sesión
        </button>
    );
}

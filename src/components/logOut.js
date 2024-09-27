'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function LogOut() {
    const router = useRouter();

    const handleLogout = () => {
        // Elimino la cookie
        Cookies.remove('token');
        //Chequeo si estoy en ya en inicio o no
        if (window.location.pathname === "/") {
            //Si estoy en inicio, tengo que recargar toda la pagina para que renderice de nuevo todo
            window.location.reload();
        } else {
            //Si estoy en otra ruta directamente hago el push a inicio y refresco la navbar para actualizarla
            router.push('/');
            router.refresh();
        }
        
       
    };

    return (
        <button onClick={handleLogout} className="text-white hover:underline pr-2">
            <i className='bi bi-person-x-fill mx-1'/>
            Cerrar sesión
        </button>
    );
}

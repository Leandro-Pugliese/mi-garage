"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Loader from '@/components/loader';
import Message from '@/components/message';
import DeleteUserPopUp from '@/components/deleteUserPopUp';

export default function UserData() {

    const router = useRouter();
    const [token, setToken] = useState(null)
    //Verificación de sesión.
    const isSession = () => {
        // Recupero el token de la cookie
        const hayToken = Cookies.get('token');
        // Si no hay token, redirigijo al usuario al login
        if (!hayToken) {
            router.push('/user/login');
            return
        }
        setToken(hayToken)
    }
    useEffect(() => {
        isSession();
    }, []);

    //Hook para loader
    const [loader, setLoader] = useState(true);

    //Hooks para msj
    const [mensaje, setMensaje] = useState("");
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);

    //Hook para usuario
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const config = {
                method: "get",
                url: `/user/data`,
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setUser(response.data)
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            setMensaje(error.response.data);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al obtener usuario:', error);
            setLoader(false)
        }
    }
    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    //Hook para popUp de eliminar cuenta.
    const [showPopUp, setShowPopUp] = useState(false)
    const modifyShowPopUp = (indicador) => {
        setShowPopUp(false);
        if (indicador === "Reload") {
            window.location.reload()
        }
    }

    return (
        <div className="container min-h-screen mx-auto px-4 py-6 bg-gray-800">
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader && !showErrorMsj) &&
                <div>
                    <h1 className="text-2xl font-bold mb-6 text-white">Mis Datos</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        <div className="bg-violet-800 shadow-md rounded-lg p-5">
                            <p className="text-white"><strong>Email: </strong>{user.email}</p>
                            <p className="text-white">
                                <strong>Premium: </strong>
                                {user.premium ? `Sí (Hasta el ${new Date(user.premiumExpiration).toLocaleDateString()})` : "No"}
                            </p>
                            <p className="text-white"><strong>País: </strong>{user.country}</p>
                            <p className="text-white"><strong>Provincia: </strong>{user.province}</p>
                            <p className="text-white mb-3"><strong>Teléfono: </strong>{user.phone !== 0 ? user.phone : "No tiene"}</p>
                            <div className='flex w-full justify-between mb-4'>
                                <Link href='/user/update' className='text-center bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600 min-w-[48%]'>
                                    Modificar Datos
                                </Link>
                                <button onClick={() => setShowPopUp(true)} className='text-center bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600 min-w-[48%]'>
                                    Eliminar Cuenta
                                </button>
                            </div>
                            <div className='flex w-full justify-between'>
                                <Link href='/user/update/password' className='text-center bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600 min-w-[48%]'>
                                    Modificar Contraseña
                                </Link>
                                <Link href='/user/update/categories' className='text-center bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600 min-w-[48%]'>
                                    Modificar Categorias
                                </Link>
                            </div>
                            {
                                (!user.premium) &&
                                <div className='flex w-full'>
                                    <Link href={`#`} className='flex items-center justify-center mt-4 bg-pink-700 text-white cursor-pointer p-2 w-full rounded hover:bg-pink-600'>
                                        Activar Premium
                                    </Link>
                                </div>
                            }
                            {
                                (user.premium) &&
                                <div className='flex w-full'>
                                    <Link href={`#`} className='flex items-center justify-center mt-4 bg-pink-700 text-white cursor-pointer p-2 w-full rounded hover:bg-pink-600'>
                                        Renovar Premium
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                    {
                        (!loader && showPopUp) &&
                        <DeleteUserPopUp 
                            modifyShowPopUp={modifyShowPopUp}
                            token={token}
                        />
                    }
                </div>
            }
            {
                (!loader && showErrorMsj) &&
                <div className='bg-white p-3 mt-5 rounded font-bold text-center'>
                    <Message 
                        mensaje={mensaje}
                        showMsj={showMsj}
                        showErrorMsj={showErrorMsj}
                    />
                </div>
            }
        </div>
    );
}
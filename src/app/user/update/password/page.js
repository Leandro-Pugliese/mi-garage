"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation'
import Loader from '@/components/loader';
import Message from '@/components/message';
import MessagePopup from '@/components/messagePopUp';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function ChangePassword() {

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
    const [loader, setLoader] = useState(false);

    //Hooks para msj
    const [mensaje, setMensaje] = useState("");
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [message, setMessage] = useState("");
    const severity = "success";

    //Hooks para info usuario
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            if (oldPassword === "" || newPassword === "" || newPassword2 === "") {
                setMensaje("Debes completar todos los campos.");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            if (newPassword !== newPassword2) {
                setMensaje("Las nuevas contraseñas no coinciden.");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            setLoader(true)
            const config = {
                method: "put",
                url: "/user/update-password",
                data: { oldPassword, newPassword },
                headers: {
                "Content-Type": "application/json",
                "Authorization": token
                },
            };
            const response = await axios(config);
            setMessage(response.data);
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            setMensaje("Error al modificar la contraseña");
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al modificar la contraseña:', error.response.data);
            setLoader(false)
        }
    }

    const closePopUp = () => {
        router.push('/user/data');
    }

    //Hook para boton ver password
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-800">
            <form className="p-8 w-96">
                <h2 className="text-2xl font-bold mb-4 text-white">Modificar contraseña</h2>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 text-white">Contraseña actual</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                            placeholder="Contraseña actual..."
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                        >
                            {showPassword ? ( <EyeSlashIcon className="h-5 w-5"/>) : (<EyeIcon className="h-5 w-5"/>)}
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 text-white">Nueva contraseña</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                            placeholder="Nueva contraseña..."
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="password2" className="block mb-1 text-white">Repetir nueva contraseña</label>
                    <input 
                        type={showPassword ? 'text' : 'password'}
                        id="password2"
                        onChange={(e) => setNewPassword2(e.target.value)}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Repetir nueva contraseña..."
                    />
                </div>
                {
                    (!loader) &&
                    <button onClick={handleSubmit} className="mt-3 bg-violet-800 text-white py-2 px-4 w-full rounded hover:cursor-pointer hover:bg-violet-700">
                        Modificar
                    </button>
                }
                {
                    (loader) &&
                    <Loader />
                }
            </form>
            {
                ((showErrorMsj && !loader) || (showMsj && !loader)) && 
                <Message 
                    mensaje={mensaje}
                    showErrorMsj={showErrorMsj}
                    showMsj={showMsj}
                />
            }
            <MessagePopup message={message} severity={severity} onClose={closePopUp} />
        </div>
    );
}
'use client';
import axios from "@/app/utils/axios";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MessagePopup from "@/components/messagePopUp";
import Loader from "@/components/loader";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import Cookies from 'js-cookie';
import Message from "@/components/message";


export default function ResetPassword() {

    const router = useRouter();
    //Verificación de sesión.
    const isSession = () => {
        // Recupero el token de la cookie
        const hayToken = Cookies.get('token');
        // Si hay token, redirijo al usuario a inicio
        if (hayToken) {
            router.push('/');
            return
        }
    }
    useEffect(() => {
        isSession();
    }, []);
    
    //Hook para loader
    const [loader, setLoader] = useState(false);

    //Hooks para msj
    const [mensaje, setMensaje] = useState('');
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [message, setMessage] = useState('');
    const severity = 'success';

    //Hooks para info usuario
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    //Recupero token por params
    const {token} = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            if (password === "" || password2 === "") {
                setMensaje("Debes completar todos los campos.");
                setMessage('');
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            if (password !== password2) {
                setMensaje("Las contraseñas no coinciden.");
                setMessage('');
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            if (password.length <= 7) {
                setMensaje("La contraseña debe tener al menos 8 caracteres.");
                setMessage('');
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            setLoader(true)
            const config = {
                method: "put",
                url: `/user/forgot-password/${token}`,
                data: {password},
                headers: {
                "Content-Type": "application/json"
                },
            };
            const response = await axios(config);
            setMessage(response.data);
            setMensaje('')
            setShowMsj(false);
            setShowErrorMsj(false);
        } catch (error) {
            setMensaje(error.response.data);
            if (error.response.data === 'jwt expired') {
                setMensaje('Este link expiró, debes solicitar otro.');
            }
            setShowMsj(false);
            setShowErrorMsj(true);
            setMessage('');
            console.error('Error al generar contraseña:', error);
            setLoader(false)
        }
    }

     //Hook para boton ver password
    const [showPassword, setShowPassword] = useState(false);

    //Hook para cerrar popUp
    const closePopUp = () => {
        router.push('/user/login');
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-800">
            <form className="p-8 w-96 pb-2">
                <h2 className="text-2xl font-bold mb-4 text-white">Restablecer contraseña</h2>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 text-white">Contraseña</label>
                    <div className="relative">
                        <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Contraseña..."
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                        >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="password2" className="block mb-1 text-white">Repetir contraseña</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password2"
                        onChange={(e) => setPassword2(e.target.value)}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Repetir contraseña..."
                    />
                </div>
                {
                    (!loader) &&
                    <button 
                        onClick={handleSubmit} 
                        className="bg-violet-800 text-white py-2 px-4 w-full rounded hover:cursor-pointer hover:bg-violet-700"
                    >
                        Restablecer
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
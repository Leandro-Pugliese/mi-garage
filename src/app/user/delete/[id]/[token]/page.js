'use client'
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from '@/app/utils/axios'
import Loader from '@/components/loader';
import Message from '@/components/message';

export default function DeleteUser() {
    
    //Hook para loader
    const [loader, setLoader] = useState(false);

    //Hooks para msj
    const [mensaje, setMensaje] = useState('');
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);

    //Hook para consentimiento
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    //Recupero token por params
    const {token} = useParams();

    const deleteUser = async () => {
        setMensaje('');
        setShowMsj(false);
        setShowErrorMsj(false);
        if (!acceptedTerms) {
            setMensaje("¡Debes dar el consentimiento, marcando 'Lo entiendo'!");
            setShowMsj(false);
            setShowErrorMsj(true);
            return;
        }
        try {
            setLoader(true)
            const config = {
                method: "delete",
                url: `/user/delete/${token}`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
            };
            const response = await axios(config);
            setMensaje(response.data);
            setShowMsj(true);
            setShowErrorMsj(false);
            setLoader(false);
            setTimeout(function () {
                // Elimino la cookie
                Cookies.remove('token');
                //Redirijo al usuario a inicio
                const router = useRouter();
                router.push('/');
            }, 1500);
        } catch (error) {
            const errorMsj = error.response.data.message
            if (errorMsj === "jwt expired") {
                setMensaje("Este link expiró, debes pedir un nuevo link")
                setShowErrorMsj(true);
                setShowMsj(false);
                console.error('Error:', error);
            } else { 
                setMensaje(error.response.data.message);
                setShowErrorMsj(true);
                setShowMsj(false);
                console.error('Error:', error);
            }
            setLoader(false)
        }
    }

    return (
        <div className="flex flex-col items-center container min-h-screen mx-auto px-4 py-6 bg-gray-800 ">
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader && !showMsj) &&
                <div className='text-white flex flex-col w-6/12 items-center'>
                    <strong>¡ATENCIÓN!</strong>
                    <p className='mt-3'>¡Una vez eliminada <strong>NO</strong> tienes forma de recuperar tu cuenta!</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={acceptedTerms}
                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                        />
                        <label htmlFor="terms" className="text-white cursor-pointer">
                            Lo entiendo.
                        </label>
                    </div>
                    <button onClick={deleteUser} className='mt-5 text-center bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600 min-w-[48%]'>
                        Eliminar Cuenta
                    </button>
                </div>
            }
            {
                ((!loader && showMsj) || (!loader && showErrorMsj)) &&
                <div className='bg-white p-3 mt-5 rounded font-bold'>
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
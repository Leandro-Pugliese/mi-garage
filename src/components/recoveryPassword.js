import { useState } from 'react';
import axios from '@/app/utils/axios';
import Loader from './loader';
import Message from './message';

export default function RecoveryPasswordPopUp({ modifyShowPopUp })  {
    
    //Hooks
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    

    const handleClose = () => {
        setIsOpen(false);
        modifyShowPopUp();
    };

    const sendRecoveryPassword = async() => {
        try {
            setLoader(true)
            const config = {
                method: "post",
                url: `/user/forgot-password`,
                data: {email},
                headers: {
                  "Content-Type": "application/json"
                },
            };
            const response = await axios(config);
            setMensaje(response.data);
            setShowMsj(true);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            setMensaje(error.response.data);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error:', error);
            setLoader(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {
                (loader) &&
                <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
                    <Loader />
                </div>
            }
            {
                (!showMsj && !loader) &&
                <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Recuperar contraseña</h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 font-bold">Email</label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent border border-violet-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-violet-600"
                            placeholder="Ingresa tu email..."
                        />
                    </div>
                    <div className="flex justify-between mb-4">
                        <button className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-600" onClick={sendRecoveryPassword}>
                            Recuperar
                        </button>
                        <button className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-500" onClick={() => handleClose()}>
                            Cancelar
                        </button>
                    </div>
                    {
                        (showErrorMsj) &&
                        <Message 
                            mensaje={mensaje}
                            showErrorMsj={showErrorMsj}
                            showMsj={showMsj}
                        />
                    }
                </div>
            }
            {
                (showMsj && !loader) &&
                <div className="flex flex-col items-center bg-white rounded-lg p-6 w-1/3 shadow-lg">
                    <Message
                        mensaje={mensaje}
                        showErrorMsj={showErrorMsj}
                        showMsj={showMsj}
                    />
                    <button 
                        className="text-white bg-violet-700 mt-3 px-4 py-2 w-9/12 rounded hover:bg-violet-600"
                        onClick={() => handleClose()}>
                        Aceptar
                    </button>
                </div>
            }
        </div>
    );
};
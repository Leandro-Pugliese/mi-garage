import { useState } from 'react';
import axios from '@/app/utils/axios'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import Loader from './loader';
import Message from './message';

export default function SendTransferVehiclePopUp({ vehicleId, brand, model, patente, modifyShowPopUp, token})  {

    //Hooks
    const [password, setPassword] = useState("");
    const [newOwnerEmail, setNewOwnerEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loader, setLoader] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    

    const handleClose = (indicador) => {
        setIsOpen(false);
        modifyShowPopUp(indicador);
    };

    const handleSendTransferVehicle = async() => {
        try {
            setLoader(true)
            const config = {
                method: "post",
                url: `/vehicle/transfer/send/${vehicleId}`,
                data: {newOwnerEmail, password},
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
                    <h2 className="text-lg font-bold mb-4">Solicitud de transferencia</h2>
                    <p className="text-gray-700 mb-4">
                        ¡Estas a punto de solicitar la transferencia de tu vehículo <strong>{brand} {model} dominio: {patente}</strong>!
                        <br/>
                        Una vez transferido, no podras volver a acceder a los datos del vehículo nunca más.
                        <br/>
                        Si deseas continuar con la transferencia del vehículo ingresa tu contraseña y el email del nuevo dueño.
                    </p>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 font-semibold">Contraseña</label>
                        <div className="relative mb-4">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-transparent border border-violet-400 p-2 w-full rounded focus:border-violet-700 focus:outline-none"
                                placeholder="Contraseña..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-violet-500"
                            >
                            {
                                showPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)
                            }
                            </button>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="emailNewOwner" className="block mb-1 font-semibold">Email nuevo dueño</label>
                            <input
                                type='email'
                                id="emailNewOwner"
                                onChange={(e) => setNewOwnerEmail(e.target.value)}
                                className="bg-transparent border border-violet-400 p-2 w-full rounded focus:border-violet-700 focus:outline-none"
                                placeholder="Email nuevo dueño..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-600" onClick={handleSendTransferVehicle}>
                            Enviar
                        </button>
                        <button className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-500" onClick={() => handleClose("Close")}>
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
                    <button className="text-white bg-violet-700 mt-3 px-4 py-2 w-9/12 rounded hover:bg-violet-600" onClick={() => handleClose("Reload")}>
                        Aceptar
                    </button>
                </div>
            }
        </div>
    );
};
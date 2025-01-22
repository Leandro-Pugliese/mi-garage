"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
import Loader from '@/components/loader';
import Message from '@/components/message';


export default function TransferVehicle() {
    
    const router = useRouter();
    const [token, setToken] = useState(null)
    
    //Verificación de sesión.
    const isSession = () => {
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

    // Token para ruta dinámica
    const {tokenOperation} = useParams();

    //Hook para data transfer
    const [dataTransfer, setDataTransfer] = useState(null);

    //Función para obtener datos de la trasnferencia
    const transferData = async() => {
        try {
            const config = {
                method: "get",
                url: `/vehicle/transfer/data/${tokenOperation}`,
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            }
            const response = await axios(config);
            setShowMsj(false)
            setShowErrorMsj(false)
            setDataTransfer(response.data);
            setLoader(false);
        } catch (error) {
            setMensaje(error.response.data);
            console.log(error)
            setShowErrorMsj(true);
            setShowMsj(false);
            setLoader(false);
        }
    } 
    useEffect(() => {
        if (token && tokenOperation) {
            transferData();
        }
    }, [token]);

    const responseOperation = async(accepted) => {
        try {
            setLoader(true);
            const config = {
                method: "put",
                url: `/vehicle/transfer/${tokenOperation}`,
                data: {accepted},
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            }
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
    }

    return (
        <div className='container flex justify-center min-h-screen mx-auto px-4 py-6 bg-gray-800'>
            <form className="p-8 w-2/3">
            {
                (dataTransfer) &&
                <div className='flex flex-col justify-center items-center text-white mb-6'>
                    <p className='mb-4'>
                        {`El usuario ${dataTransfer.owner} solicitó transferirte el vehículo ${dataTransfer.vehicle.brand} ${dataTransfer.vehicle.model}, dominio ${dataTransfer.vehicle.patente}`}
                    </p>
                    <p className='mb-4'>¿Qué quieres hacer?</p>
                </div>
            }
                   
            {
                (!loader && !mensaje) &&
                <div className='flex justify-between'>
                    <button onClick={() => responseOperation(true)} className="bg-violet-800 w-5/12 text-white py-2 px-4 w-full rounded cursor-pointer hover:bg-violet-700"> Aceptar </button>
                    <button onClick={() => responseOperation(false)} className="bg-red-600 w-5/12 text-white py-2 px-4 w-full rounded cursor-pointer hover:bg-red-700"> Rechazar </button>
                </div>
            }
            {
                (!loader && mensaje) &&
                <div className='bg-white p-3 mt-5 rounded font-bold text-center'>
                    <Message 
                        mensaje={mensaje}
                        showMsj={showMsj}
                        showErrorMsj={showErrorMsj}
                    />
                </div>
            }
            {
                (loader) &&
                <Loader />
            }
            </form>
        </div>
    )
}
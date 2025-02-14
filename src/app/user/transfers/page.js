'use client'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation'
import Loader from '@/components/loader';
import Message from '@/components/message';
import { jwtDecode } from "jwt-decode";
import CancelTransferPopUp from '@/components/cancelTransferPopUp';



export default function Transfers() {

    const router = useRouter();
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
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
        try {
            const decoded = jwtDecode(hayToken);
            setUser(decoded.email);
        } catch (error) {
            console.error("Error decodificando el token:", error);
        }
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

    //Hook para transfers
    const [transfers, setTransfers] = useState([]);

    const getTransfers = async () => {
        try {
            const config = {
                method: "get",
                url: `/user/transfers`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
            };
            const response = await axios(config);
            setTransfers(response.data);
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            setMensaje('Ups, algo salió mal.');
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al obtener usuario:', error);
            setLoader(false);
        }
    }
    useEffect(() => {
        if (token) {
            getTransfers();
        }
    }, [token]);

    //Objeto para mapear el estado de la transferencia.
    const statusMapping = {
        Active: "Activa",
        Complete: "Completada",
        Rejected: "Rechazada",
        Canceled: "Canelada"
    };

    //Hook para popUp
    const [showPopUp, setShowPopUp] = useState(false)
    const modifyShowPopUp = (indicador) => {
        setShowPopUp(false);
        if (indicador === "Reload") {
            window.location.reload();
        }
    }
    const [selectedTransfer, setSelectedTransfer] = useState(null)
    const cancelTransfer = (transfer) => {
        setShowPopUp(true);
        setSelectedTransfer(transfer)
    }


    return (
        <div className="container min-h-screen mx-auto px-4 py-6 bg-gray-800">
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader) &&
                <div>
                    <h1 className="text-2xl font-bold mb-6 text-white">Mis Transferencias</h1>
                    {
                        transfers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {transfers.map((transfer) => (
                                <div key={transfer._id} className="bg-violet-800 shadow-md rounded-lg p-5">
                                    <div className='flex w-full justify-between items-center'>
                                        <h2 className="text-white text-xl font-bold">{transfer.vehicle.brand} {transfer.vehicle.model}</h2>
                                        {
                                            (transfer.status === "Active" && transfer.owner === user) &&
                                            <button 
                                                onClick={() => cancelTransfer(transfer)} 
                                                className='bg-pink-700 text-white text-center cursor-pointer p-2 rounded hover:bg-pink-600 min-w-[30%]'
                                            >
                                                Cancelar
                                            </button>
                                        }
                                    </div>
                                    <p className="text-white"><strong>Dominio:</strong> {transfer.vehicle.patente}</p>
                                    <p className="text-white"><strong>Solicitante:</strong> {transfer.owner}</p>
                                    <p className="text-white"><strong>Receptor:</strong> {transfer.newOwner}</p>
                                    <p className="text-white"><strong>Fecha:</strong> {new Date(transfer.date).toLocaleDateString()}</p>
                                    <p className="text-white"><strong>Estado:</strong> {statusMapping[transfer.status]}</p>
                                    <p className="text-white"><strong>Última actualización:</strong> {new Date(transfer.updated).toLocaleDateString()}</p>
                                    {
                                        (!loader && showPopUp) &&
                                        <CancelTransferPopUp 
                                            transfer={selectedTransfer}
                                            modifyShowPopUp={modifyShowPopUp}
                                            token={token}
                                        />
                                    }
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div>
                                <p className="text-white mb-5">Todavía no participaste en ninguna transferencia.</p>
                            </div>
                        )
                    }
                </div>
            }
        </div>
    )
}
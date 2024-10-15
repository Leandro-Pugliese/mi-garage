"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '../utils/axios';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Loader from '@/components/loader';
import Message from '@/components/message';
import DeleteVehiclePopUp from '@/components/deleteVehiclePopUp';

export default function Vehicles() {
    
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

    //Hook para loader
    const [loader, setLoader] = useState(true);

    //Hook para popUp
    const [showPopUp, setShowPopUp] = useState(false)
    const modifyShowPopUp = (indicador) => {
        setShowPopUp(false);
        if (indicador === "Reload") {
            window.location.reload()
        }
    }

    //Hooks para msj
    const [mensaje, setMensaje] = useState("");
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    
    //Hook para vehiculos
    const [vehicles, setVehicles] = useState([]);
    
    const getVehicles = async () => {
        try {
            setLoader(true)
            const config = {
                method: "get",
                url: "/vehicle/list",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setVehicles(response.data)
            setLoader(false)
        } catch (error) {
            setMensaje(error.response.data);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al cargar vehiculos:', error);
            setLoader(false)
        }
    }
    
    useEffect(() => {
        isSession();
    }, []);

    useEffect(() => {
        if (token) {
            getVehicles();
        }
    }, [token]);

    return (
        <div className="container min-h-screen mx-auto px-4 py-6 bg-gray-800">
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader && !showErrorMsj) &&
                <>
                    <h1 className="text-2xl font-bold mb-6 text-white">Mis Vehículos</h1>
                    {
                        vehicles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {vehicles.map((vehicle) => (
                                <div key={vehicle._id} className="bg-violet-800 shadow-md rounded-lg p-5">
                                    <h2 className="text-white text-xl font-bold mb-2">{vehicle.brand} {vehicle.model} ({vehicle.year})</h2>
                                    <p className="text-white"><strong>Patente:</strong> {vehicle.patente}</p>
                                    <p className="text-white"><strong>Combustible:</strong> {vehicle.fuel}</p>
                                    <p className="text-white"><strong>GNC:</strong> {vehicle.gnc ? 'SI' : 'NO'}</p>
                                    <p className="text-white"><strong>Seguro:</strong> {vehicle.seguro.aseguradora}</p>
                                    <p className="text-white"><strong>Cobertura:</strong> {vehicle.seguro.cobertura}</p>
                                    <p className="text-white"><strong>Uso:</strong> {vehicle.use}</p>
                                    <p className="text-white"><strong>Kilometraje:</strong> {vehicle.km} km</p>
                                    <p className="text-white mb-3"><strong>Última actualización:</strong> {new Date(vehicle.updatedKm).toLocaleDateString()}</p>
                                    <div className='flex w-full justify-between'>
                                        <Link href={`/vehicles/update/${vehicle._id}`} className=' bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600'>
                                            Modificar Datos
                                        </Link>
                                        <button onClick={() => setShowPopUp(true)} className=' bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600'>
                                            Eliminar Vehículo
                                        </button>
                                    </div>
                                    <div className='flex w-full'>
                                        <Link href={`/activities/${vehicle._id}`} className='flex items-center justify-center mt-5 bg-pink-700 text-white cursor-pointer p-2 w-full rounded hover:bg-pink-600'>
                                            Actividades
                                        </Link>
                                    </div>
                                    {
                                        (!loader && showPopUp) &&
                                        <DeleteVehiclePopUp 
                                            vehicleId={vehicle._id}
                                            brand={vehicle.brand}
                                            model={vehicle.model}
                                            patente={vehicle.patente}
                                            modifyShowPopUp={modifyShowPopUp}
                                            token={token}
                                        />
                                    }
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div>
                                <p className="text-white mb-5">No tienes vehículos cargados.</p>
                            </div>
                        )
                    }
                    <Link href="/vehicles/add" className='bg-pink-700 text-white cursor-pointer p-2 mb-5 w-full rounded hover:bg-pink-600'>
                        Agregar Vehículo
                    </Link>
                </>
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
};


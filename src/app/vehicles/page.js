"use client";

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '../utils/axios';
//import { useRouter } from 'next/router'; // Si uso este tengo que usarlo directo como useRouter().push()
import { useRouter } from 'next/navigation' //Asi puedo usarlo como constante.
import Link from 'next/link';

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
            setMensaje(error);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al registrar el usuario:', error);
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
                            <Link href={`/vehicles/update/${vehicle._id}`} className=' bg-pink-700 text-white cursor-pointer p-2 w-full rounded hover:bg-pink-600'>
                                Modificar Vehículo
                            </Link>
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
        </div>
    );
};


"use client";

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '../utils/axios';
//import { useRouter } from 'next/router'; // Si uso este tengo que usarlo directo como useRouter().push()
import { useRouter } from 'next/navigation' //Asi puedo usarlo como constante.

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
    const [loader, setLoader] = useState(false);

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
        <div className="container mx-auto px-4 py-6 bg-gray-800">
            <h1 className="text-2xl font-bold mb-6">Mis Vehículos</h1>
            {
                vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle._id} className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-2">{vehicle.marca} {vehicle.modelo} ({vehicle.year})</h2>
                        <p className="text-white"><strong>Patente:</strong> {vehicle.patente}</p>
                        <p className="text-white"><strong>Combustible:</strong> {vehicle.combustible}</p>
                        <p className="text-white"><strong>GNC:</strong> {vehicle.gnc ? 'Sí' : 'No'}</p>
                        <p className="text-white"><strong>Seguro:</strong> {vehicle.seguro.nombre}</p>
                        <p className="text-white"><strong>Uso:</strong> {vehicle.uso}</p>
                        <p className="text-white"><strong>Kilometraje:</strong> {vehicle.kilometraje} km</p>
                        <p className="text-white"><strong>Última actualización:</strong> {new Date(vehicle.kilometrajeActualizado).toLocaleDateString()}</p>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-white">No tienes vehículos cargados.</p>
                )
            }
        </div>
    );
};


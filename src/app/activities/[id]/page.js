"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link';
import Loader from '@/components/loader';

export default function Activities() {
    
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
    const [loader, setLoader] = useState(true);

    //Hooks para msj
    const [mensaje, setMensaje] = useState("");
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);

    //Hook para actividades
    const [activities, setActivities] = useState([]);
    
    //id para ruta dinámica
    const { id } = useParams();
    
    const getActivities = async () => {
        try {
            setLoader(true)
            const config = {
                method: "get",
                url: `/activity/list/${id}`,
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setActivities(response.data)
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false)
        } catch (error) {
            setMensaje("ERROR");
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al obtener actividades:', error);
            setLoader(false)
        }
    }

    //Hook para vehiculo
    const [vehicle, setVehicle] = useState(null);

    const getVehicle = async () => {
        try {
            setLoader(true)
            const config = {
                method: "get",
                url: `/vehicle/data/${id}`,
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setVehicle(response.data)
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false)
        } catch (error) {
            setMensaje("ERROR");
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al obtener vehiculo:', error);
            setLoader(false)
        }
    }

    useEffect(() => {
        if (token) {
            getVehicle();
            getActivities();
        }
    }, [token]);
    
    return (
        <div className="container min-h-screen mx-auto px-4 py-6 bg-gray-800">
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader) &&
                <>
                    <h1 className="text-2xl font-bold mb-6 text-white">Actividades del dominio: {vehicle.patente}</h1>
                    {
                        activities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {activities.map((activity) => (
                                <div key={activity._id} className="bg-violet-800 shadow-md rounded-lg p-5">
                                    <h2 className="text-white text-xl font-bold mb-2">{activity.type}</h2>
                                    <p className="text-white mb-2"><strong>{activity.description}</strong></p>
                                    <p className="text-white"><strong>Fecha:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                                    <p className="text-white"><strong>Kilometraje:</strong> {activity.km}</p>
                                    {
                                        (activity.image.url) &&
                                        <p className="text-white"><strong>Ver Imagen:</strong> {activity.image.url}</p>
                                    }
                                    
                                        <p className="text-white"><strong>Próxima fecha:</strong> {new Date(activity.nextDate.date).toLocaleDateString() || "NO"}</p>
                                    
                                    
                                        <p className="text-white"><strong>Próximo kilometraje:</strong> {`${activity.nextKm.km}km` || "NO"}</p>
                                    
                                    <p className="text-white"><strong>Activa:</strong> {activity.active ? 'SI' : 'NO'}</p>
                                    <div className='flex w-full justify-between mt-4'>
                                        <Link href={`/activities/update/${activity._id}`} className=' bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600'>
                                            Modificar Datos
                                        </Link>
                                        <button className=' bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600'>
                                            Eliminar Actividad
                                        </button>
                                    </div>
                                    {/*
                                        (!loader && showPopUp) &&
                                        <DeleteVehiclePopUp 
                                            vehicleId={vehicle._id}
                                            brand={vehicle.brand}
                                            model={vehicle.model}
                                            patente={vehicle.patente}
                                            modifyShowPopUp={modifyShowPopUp}
                                            token={token}
                                        />
                                    */}
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div>
                                <p className="text-white mb-5">El vehículo no tiene actividades cargadas.</p>
                            </div>
                        )
                    }
                    <Link href={`/activities/add/${id}`} className='bg-pink-700 text-white cursor-pointer p-2 mb-5 w-full rounded hover:bg-pink-600'>
                        Agregar Actividad
                    </Link>
                </>
            }
        </div>
    );
}
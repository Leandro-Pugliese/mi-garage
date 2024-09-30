"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
import Loader from '@/components/loader';

export default function UpdateVehicle() {

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
    
    //Hook para data vehiculo
    const [vehicle, setVehicle] = useState(null);
    const [vehicleUpdated, setVehicleUpdated] = useState(null)

    //id para ruta dinámica
    const { id } = useParams();

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
            setVehicle(response.data);
            setShowMsj(false);
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

    useEffect(() => {
        if (token) {
            getVehicle();
        }
    }, [token]);

    const updateVehicle = async () => {
        try {
            setLoader(true)
            const config = {
                method: "put",
                url: `/vehicle/update/${id}`,
                data: {},
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setVehicle(response.data);
            setShowMsj(false);
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
        <div className='container min-h-screen mx-auto px-4 py-6 bg-gray-800'>
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader) &&
                <div className='text-white font-bold'>
                    <p>{vehicle.brand} / {vehicle.model}</p>
                </div>
            }
        </div>
    );
};
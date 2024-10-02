"use client";
import { useState, useEffect } from 'react';
import axios from '@/app/utils/axios'
import Cookies from 'js-cookie';
import { useRouter, useParams } from 'next/navigation'
import Message from '@/components/message';
import Loader from '@/components/loader';


export default function AddVehicles() {

    const router = useRouter();
    const [token, setToken] = useState(null)
    //Verificación de sesión.
    const isSession = () => {
        const hayToken = Cookies.get('token');
        if (!hayToken) {
            router.push('/user/login');
            return
        }
        setToken(hayToken)
        setLoader(false)
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

    //Hook para info de los inputs
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [km, setKm] = useState(0);
    const [date, setDate] = useState("");
    const [isNextDate, setIsNextDate] = useState(false);
    const [nextDate, setNextDate] = useState("");
    const [isNextKm, setIsNextKm] = useState(false);
    const [nextKm, setNextKm] = useState(0);

    //id para ruta dinámica
    const { id } = useParams();
    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            if (type === "" || description === "" ||  date === "" || isNextDate === "" || isNextKm === "") {
                setMensaje("Debes completar todos los campos obligatorios.");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            if (km <= 0) {
                setMensaje("El kilometraje del vehículo no puede ser negativo o cero.");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            if (isNextKm === "SI" && nextKm <= 0) {
                setMensaje("El kilometraje próximo del vehículo no puede ser negativo o cero.");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            if (isNextDate === "SI" && nextDate === "") {
                setMensaje("Debes completar la próxima fecha de realización de la actividad.");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            setLoader(true);
            const config = {
                method: "post",
                url: `/activity/create/${id}`,
                data: { type, description, km, date, isNextDate, nextDate, isNextKm, nextKm},
                headers: {
                "Content-Type": "application/json",
                "Authorization": token
                },
            };
            const response = await axios(config);
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
            router.push(`/activities/${response.data.activity.vehicle}`);
        } catch (error) {
            setMensaje("Error");
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al cargar actividad:', error);
            setLoader(false)
        }
    }


    const [userData, setUserData] = useState([]);

    const getUser = async () => {
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            setLoader(true);
            const config = {
                method: "get",
                url: "/user/data",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
            };
            const response = await axios(config);
            console.log(response.data)
            setUserData(response.data.categories)
            setLoader(false)
        } catch (error) {
            setMensaje("Error");
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al obtener datos del usuario:', error);
            setLoader(false)
        }
    }

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    return (
        <div className='flex flex-col items-center justify-center'>
            <form className="p-8 w-96">
                <h2 className="text-2xl font-bold mb-4 text-white">Cargar Actividad</h2>
                <div className="mb-4">
                    <label htmlFor="type" className="block mb-1 text-white">Tipo de actividad</label>
                    { userData.length > 0 &&
                    <select
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option className="bg-violet-600" value="-">-</option>
                        {
                            userData.map((element, index) => (
                                <option className="bg-violet-600" key={index} value={element}>
                                    {element}
                                </option>
                            ))
                        }
                    </select>
                    }
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-1 text-white">Descripción</label>
                    <input
                        type="text"
                        id="description"
                        onChange={(e) => setDescription(e.target.value.toUpperCase())}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Descripción..."
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="km" className="block mb-1 text-white">Kilometraje del vehículo</label>
                    <input
                        type="number"
                        id="km"
                        onChange={(e) => setKm(Number(e.target.value))}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Ej 63000..."
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block mb-1 text-white">Fecha</label>
                    <input
                        type="date"
                        id="date"
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                    />
                </div>
                <div className="flex items-center justify-left space-x-2 mb-4">
                    <input
                        type="checkbox"
                        id="isNextDate"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={isNextDate}
                        onChange={() => setIsNextDate(!isNextDate)}
                    />
                    <label htmlFor="isNextDate" className="text-white text-sm">
                        ¿Tiene Próxima fecha de realización?
                    </label>
                </div>
                {   
                    (isNextDate) &&
                    <div className="mb-4">
                        <label htmlFor="nextDate" className="block mb-1 text-white">¿Cuándo?</label>
                        <input
                            type="date"
                            id="nextDate"
                            onChange={(e) => setNextDate(e.target.value)}
                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white cursor-pointer"
                            disabled={!isNextDate}
                        />
                    </div>
                }
                <div className="flex items-center justify-left space-x-2 mb-4">
                    <input
                        type="checkbox"
                        id="isNextKm"
                        className="w-4 h-4 bg-gray-100 border-violet-300 rounded focus:ring-violet-500"
                        checked={isNextKm}
                        onChange={() => setIsNextKm(!isNextKm)}
                    />
                    <label htmlFor="isNextKm" className="text-white text-sm">
                        ¿Tiene Próximo kilometraje de realización?
                    </label>
                </div>
                {
                    (isNextKm) &&
                    <div className="mb-4">
                        <label htmlFor="nextKm" className="block mb-1 text-white">¿En qué kilometraje?</label>
                        <input
                            type="number"
                            id="nextKm"
                            onChange={(e) => setNextKm(Number(e.target.value))}
                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                            placeholder="Ej 73000..."
                            disabled={!isNextKm}
                        />
                    </div>
                }
                {
                    (!loader) &&
                    <button onClick={handleSubmit} className="bg-violet-800 text-white py-2 px-4 w-full rounded cursor-pointer hover:bg-violet-700">Cargar</button>
                }
                {
                    (loader) &&
                    <Loader />
                }
            </form>
            {
                ((showErrorMsj && !loader) || (showMsj && !loader)) && 
                <Message 
                    mensaje={mensaje}
                    showErrorMsj={showErrorMsj}
                    showMsj={showMsj}
                />
            }
        </div>
    );
};
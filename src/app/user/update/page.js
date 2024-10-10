'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation'
import Loader from '@/components/loader';
import Message from '@/components/message';
import MessagePopup from '@/components/messagePopUp';
import paisesv2 from "@/app/utils/paisesv2";

export default function UpdateData() {

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
    const [message, setMessage] = useState("");
    const [severity, setSeverity ] = useState("success");

    //Hook para data usuario
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            setLoader(true)
            const config = {
                method: "get",
                url: `/user/data`,
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setUser(response.data);
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            setMensaje(error.response.data);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error:', error.response.data);
            setLoader(false);
        }
    }
    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    //Hooks para desplegables pais y prvincia
    const [selectedCountry, setSelectedCountry] = useState('');
    const [otherCountry, setOtherCountry] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [showOtherFields, setShowOtherFields] = useState(false);
    
    //Seleccion de pais
    const handleCountryChange = (e) => {
        const country = e.target.value;
        if (country === 'Otro') {
            setShowOtherFields(true);
            setProvinces([]);
            setSelectedCountry(country);
        } else {
            console.log(country)
            setShowOtherFields(false);
            setSelectedCountry(country);
            setSelectedProvince(undefined);
            //Cargo las provincias del país seleccionado
            if (country) {
                setProvinces(paisesv2[country].provinces);
            } else {
                setProvinces([]);
            }
        }
    };

    //Hooks para info a modificar
    const [phone, setPhone] = useState(null);

    //Hooks para renderizar info o input para modificar info.
    const [modifyCountry, setModifyCountry] = useState(false);
    const [modifyPhone, setModifyPhone] = useState(false);
    
    const cancelCountry = () => {
        setSelectedCountry(null);
        setSelectedProvince(null);
        setOtherCountry(null);
        setModifyCountry(false);
    }
    const cancelPhone = () => {
        setPhone(null);
        setModifyPhone(false);
    }

    const updateUser = async (e) => {
        e.preventDefault();
        try {
            setLoader(true)
            let country = selectedCountry;
            if (selectedCountry === "Otro") {
                if (otherCountry === "") {
                    setMensaje("Debes completar el país.");
                    setShowMsj(false);
                    setShowErrorMsj(true);
                    setLoader(false);
                    return 
                } else if (selectedProvince === '') {
                    setMensaje("Debes completar la provincia.");
                    setShowMsj(false);
                    setShowErrorMsj(true);
                    setLoader(false);
                    return 
                }
                country = otherCountry
            }
            const province = selectedProvince;
            const onlyNumbers = /^\d+$/;
            if (!onlyNumbers.test(phone)) {
                setMensaje("Teléfono inválido.");
                setShowMsj(false);
                setShowErrorMsj(true);
                setLoader(false);
                return 
            }
            if (!modifyCountry && !modifyPhone) {
                setMensaje("No modificaste ningun dato.");
                setShowMsj(false);
                setShowErrorMsj(true);
                setLoader(false);
                return 
            }
            const config = {
                method: "put",
                url: `/user/update-user`,
                data: {country, province, phone},
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setMessage(response.data);
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

    //Hook para evitar cambio del valor en input tipo number
    useEffect(() => {
        if (modifyPhone) {
            // Agarro todos los inputs de tipo number.
            const inputs = document.querySelectorAll('input[type="number"]');
            const preventScroll = (event) => {
            event.preventDefault();
            };
            inputs.forEach((input) => {
            input.addEventListener('wheel', preventScroll);
            });
            // Hago un cleanup al desmontar el componente
            return () => {
            inputs.forEach((input) => {
                input.removeEventListener('wheel', preventScroll);
            });
            };
        }
    }, [modifyPhone]);

    const closePopUp = () => {
        router.push('/user/data');
    }

    return (
        <div className='flex flex-col items-center min-h-screen bg-gray-800'>
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader) &&
                <>
                    {
                        user ? (
                            <form className="flex flex-col p-6 w-6/12 text-center items-center">
                                <h2 className="text-2xl font-bold mb-4 text-white">Modificar datos</h2>
                                {
                                    (!modifyCountry) &&
                                    <>
                                        <div className='flex items-center w-9/12'>
                                            <label className="block text-white">País</label>
                                        </div>
                                        <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                            <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                                {user.country ? user.country : '-'}
                                            </p>
                                            <button 
                                                onClick={() => setModifyCountry(!modifyCountry)}
                                                className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                            >
                                                Modificar
                                            </button>
                                        </div>
                                        <div className='flex items-center w-9/12'>
                                            <label htmlFor="phone" className="block text-white">Provincia / Estado</label>
                                        </div>
                                        <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                            <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                                {user.province ? user.province : '-'}
                                            </p>
                                            <button 
                                                onClick={() => setModifyCountry(!modifyCountry)}
                                                className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                            >
                                                Modificar
                                            </button>
                                        </div>
                                    </>
                                }
                                {
                                    (modifyCountry) &&
                                    <>
                                        <div className='flex items-center w-9/12'>
                                            <label htmlFor="pais" className="block text-white">País</label>
                                        </div>
                                        <div className="flex w-9/12 mb-4 min-h-16 items-center justify-between">
                                            <select 
                                                className="bg-transparent border border-violet-300 p-2 w-full rounded text-white cursor-pointer" 
                                                id="pais" 
                                                value={selectedCountry}
                                                onChange={handleCountryChange}
                                            >
                                                <option className='bg-violet-600' value=''>-</option>
                                                {Object.keys(paisesv2).map((country) => (
                                                    <option className='bg-violet-600' key={country} value={country}>{country}</option>
                                                ))}
                                            </select>
                                            <button 
                                                onClick={cancelCountry}    
                                                className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                        {
                                            (!showOtherFields) &&
                                            <>
                                                <div className='flex items-center w-9/12'>
                                                    <label htmlFor="provincia" className="block mb-1 text-white">Provincia / Estado</label>
                                                </div>
                                                <div className="flex w-9/12 mb-4 min-h-16 items-center justify-between">
                                                    <select 
                                                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white" 
                                                        id="provincia" 
                                                        value={selectedProvince}
                                                        onChange={(e) => setSelectedProvince(e.target.value)}
                                                        disabled={!selectedCountry}
                                                    >
                                                        <option className='bg-violet-600' value=''>-</option>
                                                        {provinces.map((province) => (
                                                            <option className='bg-violet-600' key={province} value={province}>{province}</option>
                                                        ))}
                                                    </select>
                                                    <button 
                                                        onClick={cancelCountry}    
                                                        className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </>
                                        }
                                        {
                                            (showOtherFields) &&
                                            <>
                                                <div className='flex items-center w-9/12'>
                                                    <label htmlFor="otherCountry" className="block text-white">País (otro)</label>
                                                </div>
                                                <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                                    <input
                                                        id="otherCountry"
                                                        type="text"
                                                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                                        placeholder="Ingrese el país"
                                                        onChange={(e) => setOtherCountry(e.target.value)}
                                                    />
                                                    <button 
                                                        onClick={cancelCountry}    
                                                        className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                                <div className='flex items-center w-9/12'>
                                                    <label htmlFor="otherProvince" className="block text-white">Provincia</label>
                                                </div>
                                                <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                                    <input
                                                        id="otherProvince"
                                                        type="text"
                                                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                                        placeholder="Ingrese la provincia/estado"
                                                        onChange={(e) => setSelectedProvince(e.target.value)}
                                                    />
                                                    <button 
                                                        onClick={cancelCountry}    
                                                        className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </>
                                        }
                                    </>
                                }
                                <div className='flex items-center w-9/12'>
                                    <label htmlFor="phone" className="block text-white">Teléfono (solo números)</label>
                                </div>
                                {
                                    (!modifyPhone) &&
                                    <div className='flex w-9/12 mb-5 min-h-16 items-center justify-between'>
                                        <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                            {user.phone ? user.phone : 'No tiene'}
                                        </p>
                                        <button 
                                            onClick={() => setModifyPhone(!modifyPhone)}
                                            className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                        >
                                            Modificar
                                        </button>
                                    </div>
                                }
                                {
                                    (modifyPhone) &&
                                    <div className="flex w-9/12 mb-5 min-h-16 items-center justify-between">
                                        <input 
                                            type="number" 
                                            id="phone" 
                                            onChange={(e) => setPhone(Number(e.target.value))}
                                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white" 
                                            placeholder="Ej: 5491130443355 (sin el +)" 
                                        />
                                        <button 
                                            onClick={cancelPhone}    
                                            className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                }
                                <button 
                                    className="bg-violet-800 text-white py-2 px-4 w-9/12 rounded hover:cursor-pointer hover:bg-violet-700" 
                                    onClick={updateUser}
                                >
                                    Guardar
                                </button>
                                {
                                    ((showErrorMsj && !loader) || (showMsj && !loader)) && 
                                    <Message 
                                        mensaje={mensaje}
                                        showErrorMsj={showErrorMsj}
                                        showMsj={showMsj}
                                    />
                                }
                            </form>
                        ) : (
                            <div>
                                Lo sentimos, no es posible recuperar la información del usuario, vuelve a intentarlo más tarde.
                            </div>
                        )
                    }
                </>
            }
            <MessagePopup message={message} severity={severity} onClose={closePopUp} />
        </div>
    );
}
"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
import Loader from '@/components/loader';
import Message from '@/components/message';

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

    //Hooks para info a modificar
    const [type, setType] = useState(undefined);
    const [brand, setBrand] = useState(null);
    const [model, setModel] = useState(null);
    const [year, setYear] = useState(null);
    const [patente, setPatente] = useState(null);
    const [fuel, setFuel] = useState(undefined);
    const [gnc, setGnc] = useState(undefined);
    const [company, setCompany] = useState(null);
    const [coverage, setCoverage] = useState(null);
    const [use, setUse] = useState(undefined);
    const [km, setKm] = useState(null);

    //Hooks para renderizar info o input para modificar info.
    const [modifyType, setModifyType] = useState(false);
    const [modifyBrand, setModifyBrand] = useState(false);
    const [modifyModel, setModifyModel] = useState(false);
    const [modifyYear, setModifyYear] = useState(false);
    const [modifyPatente, setModifyPatente] = useState(false);
    const [modifyFuel, setModifyFuel] = useState(false);
    const [modifyGnc, setModifyGnc] = useState(false);
    const [modifyCompany, setModifyCompany] = useState(false);
    const [modifyCoverage, setModifyCoverage] = useState(false);
    const [modifyUse, setModifyUse] = useState(false);
    const [modifyKm, setModifyKm] = useState(false);


    const cancelType = () => {
        setType(undefined);
        setModifyType(false);
    }
    const cancelBrand = () => {
        setBrand(null);
        setModifyBrand(false);
    }
    const cancelModel = () => {
        setModel(null);
        setModifyModel(false);
    }
    const cancelYear = () => {
        setYear(null);
        setModifyYear(false);
    }
    const cancelPatente = () => {
        setPatente(null);
        setModifyPatente(false);
    }
    const cancelFuel = () => {
        setFuel(undefined);
        setModifyFuel(false);
    }
    const cancelGnc = () => {
        setGnc(undefined);
        setModifyGnc(false);
    }
    const cancelCompany = () => {
        setCompany(null);
        setModifyCompany(false);
    }
    const cancelCoverage = () => {
        setCoverage(null);
        setModifyCoverage(false);
    }
    const cancelUse = () => {
        setUse(undefined);
        setModifyUse(false);
    }
    const cancelKm = () => {
        setKm(null);
        setModifyKm(false);
    }

    const updateVehicle = async () => {
        try {
            setLoader(true)
            const config = {
                method: "put",
                url: `/vehicle/update/${id}`,
                data: {type, brand, model, year, patente, fuel, gnc, company, coverage, use, km},
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            await axios(config);
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
            router.push("/vehicles")
        } catch (error) {
            setMensaje(error.response.data);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error:', error);
            setLoader(false);
        }
    }

    //Hook para evitar cambio del valor del input en input tipo number y date.
    useEffect(() => {
        // Agarro todos los inputs de tipo number y date
        const inputs = document.querySelectorAll('input[type="number"], input[type="date"]');
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
    }, []);


    return (
        <div className='flex justify-center container min-h-screen mx-auto px-4 py-6 bg-gray-800'>
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader) &&
                <div className='text-white font-bold w-3/6'>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='flex items-center w-9/12'>
                            <label className="text-white pl-1 text-left">Tipo de vehiculo</label>
                        </div>
                        {
                            (!modifyType) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.type}
                                </p>
                                <button 
                                    onClick={() => setModifyType(!modifyType)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyType) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <select
                                    className="bg-transparent border border-violet-300 py-2 px-3 w-full rounded text-white cursor-pointer"
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option className='bg-violet-600' value="">-</option>
                                    <option className='bg-violet-600' value="AUTOMÓVIL">Automóvil</option>
                                    <option className='bg-violet-600' value="MOTOCICLETA">Motocicleta</option>
                                    <option className='bg-violet-600' value="CAMIÓN">Camión</option>
                                    <option className='bg-violet-600' value="OTRO">Otro</option>
                                </select>
                                <button 
                                    onClick={cancelType}
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label htmlFor="brand" className="block text-white">Marca</label>
                        </div>
                        {
                            (!modifyBrand) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.brand}
                                </p>
                                <button 
                                    onClick={() => setModifyBrand(!modifyBrand)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyBrand) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="text"
                                    id="brand"
                                    onChange={(e) => setBrand(e.target.value.toUpperCase())}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Marca..."
                                />
                                <button 
                                    onClick={cancelBrand}
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label htmlFor="model" className="block mb-1 text-white">Modelo</label>
                        </div>
                        {
                            (!modifyModel) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.model}
                                </p>
                                <button 
                                    onClick={() => setModifyModel(!modifyModel)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyModel) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="text"
                                    id="model"
                                    onChange={(e) => setModel(e.target.value.toUpperCase())}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="modelo..."
                                />
                                <button 
                                    onClick={cancelModel}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label htmlFor="model" className="block text-white">Año</label>
                        </div>
                        {
                            (!modifyYear) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.year}
                                </p>
                                <button 
                                    onClick={() => setModifyYear(!modifyYear)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyYear) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="number"
                                    id="model"
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Año..."
                                />
                                <button 
                                    onClick={cancelYear}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">Patente / Dominio</label>
                        </div>
                        {
                            (!modifyPatente) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.patente}
                                </p>
                                <button 
                                    onClick={() => setModifyPatente(!modifyPatente)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyPatente) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="text"
                                    id="model"
                                    onChange={(e) => setPatente((e.target.value.toLocaleUpperCase()))}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Patente / Dominio..."
                                />
                                <button 
                                    onClick={cancelPatente}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">Combustible</label>
                        </div>
                        {
                            (!modifyFuel) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.fuel}
                                </p>
                                <button 
                                    onClick={() => setModifyFuel(!modifyFuel)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyFuel) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <select
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white cursor-pointer"
                                    id="fuel"
                                    value={fuel}
                                    onChange={(e) => setFuel(e.target.value)}
                                >
                                    <option className='bg-violet-600' value="">-</option>
                                    <option className='bg-violet-600' value="NAFTA">Nafta</option>
                                    <option className='bg-violet-600' value="GASOIL">Gasoil</option>
                                    <option className='bg-violet-600' value="HIBRIDO">Hibrido</option>
                                    <option className='bg-violet-600' value="ELECTRICO">Electrico</option>
                                    <option className='bg-violet-600' value="OTRO">Otro</option>
                                </select>
                                <button 
                                    onClick={cancelFuel}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">GNC</label>
                        </div>
                        {
                            (!modifyGnc) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                {
                                    (vehicle.gnc) &&
                                    <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                        SI
                                    </p>
                                }
                                {
                                    (!vehicle.gnc) &&
                                    <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                        NO
                                    </p>
                                }
                                <button 
                                    onClick={() => setModifyGnc(!modifyGnc)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyGnc) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <select
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white cursor-pointer"
                                    id="fuel"
                                    value={gnc}
                                    onChange={(e) => setGnc(e.target.value)}
                                >
                                    <option className='bg-violet-600' value="">-</option>
                                    <option className='bg-violet-600' value="SI">SI</option>
                                    <option className='bg-violet-600' value="NO">NO</option>
                                </select>
                                <button 
                                    onClick={cancelGnc}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">Compañia de seguro</label>
                        </div>
                        {
                            (!modifyCompany) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.seguro.aseguradora}
                                </p>
                                <button 
                                    onClick={() => setModifyCompany(!modifyCompany)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyCompany) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="text"
                                    id="company"
                                    onChange={(e) => setCompany((e.target.value.toUpperCase()))}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Compañia..."
                                />
                                <button 
                                    onClick={cancelCompany}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">Cobertura</label>
                        </div>
                        {
                            (!modifyCoverage) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.seguro.cobertura}
                                </p>
                                <button 
                                    onClick={() => setModifyCoverage(!modifyCoverage)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyCoverage) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <select
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    id="coverage"
                                    value={coverage}
                                    onChange={(e) => setCoverage(e.target.value)}
                                >
                                    <option className='bg-violet-600' value="">-</option>
                                    <option className='bg-violet-600' value="RESP. CIVIL">Resp. Civil</option>
                                    <option className='bg-violet-600' value="TERCEROS COMPLETO">Terceros completo</option>
                                    <option className='bg-violet-600' value="TERCEROS COMPLETO GRANIZO">Terceros completo con granizo</option>
                                    <option className='bg-violet-600' value="TODO RIESGO">Todo Riesgo</option>
                                </select>
                                <button 
                                    onClick={cancelCoverage}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">Tipo de uso</label>
                        </div>
                        {
                            (!modifyUse) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.use}
                                </p>
                                <button 
                                    onClick={() => setModifyUse(!modifyUse)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyUse) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <select
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    id="use"
                                    value={use}
                                    onChange={(e) => setUse(e.target.value)}
                                >
                                    <option className='bg-violet-600' value="">-</option>
                                    <option className='bg-violet-600' value="PARTICULAR">Particular</option>
                                    <option className='bg-violet-600' value="COMERCIAL">Comercial</option>
                                </select>
                                <button 
                                    onClick={cancelUse}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">Kilometraje</label>
                        </div>
                        {
                            (!modifyKm) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {vehicle.km}
                                </p>
                                <button 
                                    onClick={() => setModifyKm(!modifyKm)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyKm) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="number"
                                    id="km"
                                    onChange={(e) => setKm(Number(e.target.value))}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Kilometraje..."
                                />
                                <button 
                                    onClick={cancelKm}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <button 
                            className="bg-violet-800 text-white py-2 px-4 w-9/12 rounded hover:cursor-pointer hover:bg-violet-700" 
                            onClick={updateVehicle}
                            >
                            Guardar
                        </button>
                    </div>
                    {
                        (showErrorMsj || showMsj) && 
                        <Message 
                            mensaje={mensaje}
                            showErrorMsj={showErrorMsj}
                            showMsj={showMsj}
                        />
                    }
                </div>
            }
        </div>
    );
};
"use client";
import { useState, useEffect } from 'react';
import axios from '@/app/utils/axios'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
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
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState(0);
    const [patente, setPatente] = useState("");
    const [fuel, setFuel] = useState("");
    const [gnc, setGnc] = useState("");
    const [company, setCompany] = useState("");
    const [coverage, setCoverage] = useState("");
    const [use, setUse] = useState("");
    const [km, setKm] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setShowMsj(false);
        setShowErrorMsj(false);
        setLoader(true)
        try {
            if (type === "" || brand === "" || model === "" || patente === "" || fuel === "" || gnc === "" || use === "") {
                setMensaje("Debes completar todos los campos obligatorios.");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            if (km < 0) {
                setMensaje("El kilometraje del vehículo no puede ser negativo.");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            setLoader(true);
            let seguro = {
                aseguradora: "",
                cobertura: ""
            }
            if (company !== "") {
                seguro = {
                    aseguradora: company,
                    cobertura: coverage
                }
            }
            const config = {
                method: "post",
                url: "/vehicle/create",
                data: { type, brand, model, year, patente, fuel, gnc, seguro, use, km },
                headers: {
                "Content-Type": "application/json",
                "Authorization": token
                },
            };
            const response = await axios(config);
            setMensaje(response.data.msj);
            setShowMsj(true);
            setShowErrorMsj(false);
            setLoader(false);
            router.push('/vehicles');
        } catch (error) {
            setMensaje(error.response.data);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al registrar el usuario:', error.response.data);
            setLoader(false)
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
        <div className='flex flex-col items-center justify-center'>
            <form className="p-8 w-96">
                <h2 className="text-2xl font-bold mb-4 text-white">Agregar vehículo</h2>
                <div className="mb-4">
                    <label htmlFor="type" className="block mb-1 text-white">Tipo de vehiculo</label>
                    <select
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
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
                </div>
                <div className="mb-4">
                    <label htmlFor="brand" className="block mb-1 text-white">Marca</label>
                    <input
                        type="text"
                        id="brand"
                        onChange={(e) => setBrand(e.target.value.toUpperCase())}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Peugeot, Ford, etc..."
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="model" className="block mb-1 text-white">Modelo</label>
                    <input
                        type="text"
                        id="model"
                        onChange={(e) => setModel(e.target.value.toUpperCase())}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="modelo..."
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="year" className="block mb-1 text-white">Año</label>
                    <input
                        type="number"
                        id="year"
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Año..."
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="patente" className="block mb-1 text-white">Patente / Dominio</label>
                    <input
                        type="text"
                        id="patente"
                        onChange={(e) => setPatente(e.target.value.toUpperCase())}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Patente/Dominio..."
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fuel" className="block mb-1 text-white">Combustible</label>
                    <select
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
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
                </div>
                <div className="mb-4">
                    <label htmlFor="gnc" className="block mb-1 text-white">GNC</label>
                    <select
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        id="gnc"
                        value={gnc}
                        onChange={(e) => setGnc(e.target.value)}
                    >
                        <option className='bg-violet-600' value="">-</option>
                        <option className='bg-violet-600' value="SI">SI</option>
                        <option className='bg-violet-600' value="NO">NO</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="company" className="block mb-1 text-white">Compañia de seguro (Si no tiene dejar vacío)</label>
                    <input
                        type="text"
                        id="company"
                        onChange={(e) => setCompany(e.target.value.toUpperCase())}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="La caja, Sancor, etc..."
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="coverage" className="block mb-1 text-white">Cobertura</label>
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
                </div>
                <div className="mb-4">
                    <label htmlFor="use" className="block mb-1 text-white">Tipo de uso</label>
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
                </div>
                <div className="mb-4">
                    <label htmlFor="km" className="block mb-1 text-white">Kilometraje (Si no lo recuerdas pon 0 puedes modificarlo despues)</label>
                    <input
                        type="number"
                        id="km"
                        onChange={(e) => setKm(Number(e.target.value))}
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Ej 63000..."
                    />
                </div>
                {
                    (!loader) &&
                    <button onClick={handleSubmit} className="bg-violet-800 text-white py-2 px-4 w-full rounded cursor-pointer hover:bg-violet-700">Agregar</button>
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
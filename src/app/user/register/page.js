"use client";

import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import axios from '@/app/utils/axios';
import paisesv2 from "@/app/utils/paisesv2";
import Message from '@/components/message';
import Cookies from 'js-cookie';
import Loader from '@/components/loader';

export default function Register() {
    //Hooks para desplegables pais, prvincia, localidad
    const [selectedCountry, setSelectedCountry] = useState('');
    const [otherCountry, setOtherCountry] = useState("");
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
            setShowOtherFields(false);
            setSelectedCountry(country);
            setSelectedProvince('');
            //Cargo las provincias del país seleccionado
            if (country) {
                setProvinces(paisesv2[country].provinces);
            } else {
                setProvinces([]);
            }
        }
    };

    //Hooks para resto de info usuario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [phone, setPhone] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    //Hooks para msj
    const [mensaje, setMensaje] = useState("");
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);

    //Hook para loader
    const [loader, setLoader] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            if (!acceptedTerms) {
                setMensaje("¡Debes aceptar los términos y condiciones para crear un usuario!");
                setShowMsj(false);
                setShowErrorMsj(true);
                return;
              }
            if (email === "" || selectedCountry === "" || selectedProvince === "" || password === "" || password2 === "") {
                setMensaje("¡Debes completar todos los campos obligatorios!");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            if (password !== password2) {
                setMensaje("¡Las contraseñas ingresadas no coinciden!");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            if (password.length <= 7 ) {
                setMensaje("¡La contraseña debe tener al menos 8 caracteres!");
                setShowMsj(false);
                setShowErrorMsj(true);
                return
            }
            let country = selectedCountry;
            if (selectedCountry === "Otro") {
                if (otherCountry === "") {
                    setMensaje("¡Debes completar el país!");
                    setShowMsj(false);
                    setShowErrorMsj(true);
                    return 
                }
                country = otherCountry
            }
            const province = selectedProvince;
            setLoader(true)
            const config = {
                method: "post",
                url: "/user/create",
                data: { email, country, province, phone, password },
                headers: {
                  "Content-Type": "application/json",
                },
            };
            // llamado axios con la config lista.
            const response = await axios(config);
             // Guardo el token en una cookie
            Cookies.set('token', response.data.token);
            // Redirijo al usuario al panel general.
            window.location.href = "/"
        } catch (error) {
            setMensaje("Lo sentimos algo salió mal, intenta nuevamente o comunicate con soporte.");
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al registrar el usuario:', error.response.data);
            setLoader(false)
        }
    }

    //Hook para boton ver password
    const [showPassword, setShowPassword] = useState(false);

    //Hook para evvitar cambio del valor del input en input tipo number
    useEffect(() => {
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
      }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-800">
            {
                (loader) &&
                <Loader />
            }
            {

                (!loader) &&
                <form className="p-8 w-96">
                    <h2 className="text-2xl font-bold mb-4 text-white">Registrarse</h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-white">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white" 
                            placeholder="Email..." 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="pais" className="block mb-1 text-white">País</label>
                        <select 
                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white" 
                            id="pais" 
                            value={selectedCountry}
                            onChange={handleCountryChange}
                        >
                            <option className='bg-violet-600' value="">-</option>
                            {Object.keys(paisesv2).map((country) => (
                                <option className='bg-violet-600' key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    {
                        (!showOtherFields) &&
                        <div className="mb-4">
                            <label htmlFor="provincia" className="block mb-1 text-white">Provincia / Estado</label>
                            <select 
                                className="bg-transparent border border-violet-300 p-2 w-full rounded text-white" 
                                id="provincia" 
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                disabled={!selectedCountry}
                            >
                                <option className='bg-violet-600' value="">-</option>
                                {provinces.map((province) => (
                                    <option className='bg-violet-600' key={province} value={province}>{province}</option>
                                ))}
                            </select>
                        </div>
                    }
                    {
                        (showOtherFields) &&
                        <>
                            <div className='mb-4'>
                                <label htmlFor="otherCountry" className="block text-white">País (otro)</label>
                                <input
                                    id="otherCountry"
                                    type="text"
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Ingrese el país"
                                    onChange={(e) => setOtherCountry(e.target.value)}
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor="otherProvince" className="block text-white">Provincia</label>
                                <input
                                    id="otherProvince"
                                    type="text"
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Ingrese la provincia/estado"
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                />
                            </div>
                        </>
                    }
                    <div className="mb-4">
                        <label htmlFor="phone" className="block mb-1 text-white">Teléfono (opcional)</label>
                        <input 
                            type="number" 
                            id="phone" 
                            onChange={(e) => setPhone(Number(e.target.value))}
                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white" 
                            placeholder="Ej: 5491130443355 (sin el +)" 
                        />
                    </div>
                    <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 text-white">Contraseña</label>
                    <div className="relative mb-4">
                            <input
                                type={showPassword ? 'text' : 'password'}
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                            placeholder="Contraseña..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                            >
                            {
                                showPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)
                            }
                            </button>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password2" className="block mb-1 text-white">Repetir contraseña</label>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            id="password2"
                            onChange={(e) => setPassword2(e.target.value)}
                            className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                            placeholder="Repetir contraseña..."
                        />
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            checked={acceptedTerms}
                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                        />
                        <label htmlFor="terms" className="text-white">
                            Acepto los <a href="/terms" className="text-violet-300 underline ">términos y condiciones</a>
                        </label>
                    </div>
                    </div>
                    <button 
                        className="bg-violet-800 text-white py-2 px-4 w-full rounded hover:cursor-pointer hover:bg-violet-700" 
                        onClick={handleSubmit}
                        >
                        Registrarse
                    </button>
                </form>
            }
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
}
"use client";

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import axios from '../utils/axios';
import paises from "../utils/paises";

export default function Register() {
    //Hooks para desplegables pais, prvincia, localidad
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [showOtherFields, setShowOtherFields] = useState(false);
    
    //Seleccion de pais
    const handleCountryChange = (e) => {
        const country = e.target.value;
        if (country === 'Otro') {
            setShowOtherFields(true);
            setProvinces([]);
        } else {
            setShowOtherFields(false);
            setSelectedCountry(country);
            setSelectedProvince('');
            setSelectedCity('');
            //Cargo las provincias del país seleccionado
            if (country) {
                setProvinces(Object.keys(paises[country].provinces));
            } else {
                setProvinces([]);
            }
            setCities([]);
        }
    };
    //Seleccion de provincia
    const handleProvinceChange = (e) => {
        const province = e.target.value;
        setSelectedProvince(province);
        setSelectedCity('');
        if (province && selectedCountry) {
          setCities(paises[selectedCountry].provinces[province]);
        } else {
          setCities([]);
        }
    };

    //Hooks para resto de info usuario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            if (email === "" || selectedCountry === "" || selectedProvince === "" || selectedCity === "" || password === "" || password2 === "") {
                return console.log("¡Debes completar todos los campos!")
            }
            if (password !== password2) {
                return console.log("¡Las contraseñas ingresadas no coinciden!")
            }
            if (password.length <= 7 ) {
                return console.log("¡La contraseña debe tener al menos 8 caracteres!")
            }
            const pais = selectedCountry;
            const provincia = selectedProvince;
            const localidad = selectedCity;
            const config = {
                method: "post",
                url: "/user/create",
                data: { email, pais, provincia, localidad, password },
                headers: {
                  "Content-Type": "application/json",
                },
            };
            // llamado axios con la config lista.
            const response = await axios(config);
            console.log('Respuesta:', response.data);
        } catch (error) {
            console.error('Error al registrar el usuario:', error.response.data);
        }
    }

    //Hook para boton ver password
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex justify-center min-h-screen bg-gray-800">
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
                {Object.keys(paises).map((country) => (
                    <option className='bg-violet-600' key={country} value={country}>{country}</option>
                ))}
            </select>
        </div>
        {
            (!showOtherFields) &&
            <>
                <div className="mb-4">
                    <label htmlFor="provincia" className="block mb-1 text-white">Provincia / Estado</label>
                    <select 
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white" 
                        id="provincia" 
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        disabled={!selectedCountry}
                    >
                        <option className='bg-violet-600' value="">-</option>
                        {provinces.map((province) => (
                            <option className='bg-violet-600' key={province} value={province}>{province}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="city" className="block mb-1 text-white">Ciudad / Localidad</label>
                    <select 
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white" 
                        id="city" 
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedProvince}
                    >
                        <option className='bg-violet-600' value="">-</option>
                        {cities.map((city) => (
                            <option className='bg-violet-600' key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            </>
        }
        {
            (showOtherFields) &&
            <>
                <div className='mb-4'>
                    <label htmlFor="otherProvince" className="block text-white">Provincia</label>
                    <input
                        id="otherProvince"
                        type="text"
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Ingrese la provincia"
                        onChange={(e) => setSelectedProvince(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="otherCity" className="block text-white">Ciudad / Localidad</label>
                    <input
                        id="otherCity"
                        type="text"
                        className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                        placeholder="Ingrese la ciudad / localidad"
                        onChange={(e) => setSelectedCity(e.target.value)}
                    />
                </div>
            </>
        }
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
        </div>
        <button className="bg-violet-800 text-white py-2 px-4 w-full rounded" onClick={handleSubmit}>Registrarse</button>
      </form>
    </div>
  );
}
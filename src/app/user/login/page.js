"use client";

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import axios from '@/app/utils/axios'
import Cookies from 'js-cookie';
import Message from '@/components/message';
import Loader from '@/components/loader';

export default function Login() {

  //Hook para loader
  const [loader, setLoader] = useState(false);

  //Hooks para msj
  const [mensaje, setMensaje] = useState("");
  const [showMsj, setShowMsj] = useState(false);
  const [showErrorMsj, setShowErrorMsj] = useState(false);

  //Hooks para info usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setShowMsj(false);
    setShowErrorMsj(false);
    try {
      if (email === "" || password === "") {
        setMensaje("Debes completar todos los campos.");
        setShowMsj(false);
        setShowErrorMsj(true);
        return
      }
      setLoader(true)
      const config = {
        method: "post",
        url: "/user/login",
        data: { email, password },
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
      setMensaje(error.response.data);
      setShowMsj(false);
      setShowErrorMsj(true);
      console.error('Error al registrar el usuario:', error.response.data);
      setLoader(false)
    }
  }
  
  //Hook para boton ver password
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800">
      <form className="p-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Iniciar sesión</h2>
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
          <label htmlFor="password" className="block mb-1 text-white">Contraseña</label>
          <div className="relative">
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
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {
          (!loader) &&
          <button onClick={handleSubmit} className="bg-violet-800 text-white py-2 px-4 w-full rounded hover:cursor-pointer hover:bg-violet-700">Ingresar</button>
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
}
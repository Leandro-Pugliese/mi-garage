"use client";

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex justify-center min-h-screen bg-gray-800">
      <form className="p-8 w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Iniciar sesión</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-white">Email</label>
          <input 
            type="email" 
            id="email" 
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
        <button type="submit" className="bg-violet-800 text-white py-2 px-4 w-full rounded">Ingresar</button>
      </form>
    </div>
  );
}
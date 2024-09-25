'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifico si el uso de cookies fue aceptado
    const acceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!acceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div className="fixed bottom-0 left-0 w-full bg-gray-500 text-white p-4 z-50 flex justify-between items-center">
        <p>
            Este sitio web utiliza cookies esenciales para el funcionamiento básico, como la autenticación de usuario. 
            Al continuar navegando, aceptas el uso de estas cookies. 
            Lee nuestra <a href="/cookies" className="underline">Política de Cookies</a> para más información.
        </p>
        <button
          onClick={handleAcceptCookies}
          className="ml-4 bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded">
          Aceptar
        </button>
      </div>
    )
  );
}

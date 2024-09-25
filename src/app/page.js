"use client";

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from './utils/axios';
import VerifyEmailPopup from "@/components/verifyEmail";
import { useRouter } from 'next/navigation'
import MessagePopup from '@/components/messagePopUp';


export default function Home() {
  //Verificación de sesión.
  const router = useRouter();
  const [token, setToken] = useState(null)
  const isSession = () => {
    // Recupero el token de la cookie
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

  //Hooks para Mensaje popup
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  //Verificacción de email
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const verifyEmail = async () => {
    try {
      const config = {
        method: "get",
        url: "/user/data",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      };
      const response = await axios(config);
      setIsEmailVerified(response.data.verificado)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) {
      verifyEmail()
    }
  }, [token]);

  const handleSendVerificationEmail = async () => {
    try {
      const config = {
        method: "get",
        url: "/user/send-validation",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      };
      const response = await axios(config);
      setMessage(response.data)
    } catch (error) {
      console.log(error)
      setMessage(error.data)
      setSeverity("error")
    }
  }

  const handleClosePopup = () => {
    setMessage(''); //Limpio el msj para cerrar el popUp
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center flex-col">
      {
        (!token) &&
        <div>
          <p className='text-white'>No hay token</p>
        </div>
      }
      {
        (token) &&
        <div>
          {
            (!isEmailVerified) &&
            <VerifyEmailPopup onSendEmail={handleSendVerificationEmail} />
          }
          <MessagePopup message={message} severity={severity} onClose={handleClosePopup} />
        </div>
      }
    </div>
  );
}

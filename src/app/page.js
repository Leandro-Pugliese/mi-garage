"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from './utils/axios';
import VerifyEmailPopup from "@/components/verifyEmail";
import MessagePopup from '@/components/messagePopUp';
import Loader from '@/components/loader';
import { useNotifications } from "@/context/NotificationsContext";


export default function Home() {

  //Hook para loader
  const [loader, setLoader] = useState(true);

  //Verificación de sesión.
  const [token, setToken] = useState(null)

  const isSession = () => {
    // Recupero el token de la cookie
    const hayToken = Cookies.get('token');
    // Si no hay token, lo dejo null
    if (!hayToken) {
      setLoader(false)
      return
    }
    setToken(hayToken)
    setLoader(false)
  }

  useEffect(() => {
    isSession();
  }, []);

  // Contexto para las notificaciones
  const {notifications, areNotificationsLoaded } = useNotifications();

  useEffect(() => {
    if (token) {
      console.log(areNotificationsLoaded)
    };
  }, [token]);
  // Hooks para Mensaje popup
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  // Verificacción de email
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
      setIsEmailVerified(response.data.verify)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) {
      verifyEmail();
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
        (loader) &&
        <Loader />
      }
      {
        (!token && !loader) &&
        <div>
          <p className='text-white'>No hay token</p>
        </div>
      }
      {
        (token && !loader) &&
        <div>
          {
            (!isEmailVerified) &&
            <VerifyEmailPopup onSendEmail={handleSendVerificationEmail} />
          }
          <MessagePopup message={message} severity={severity} onClose={handleClosePopup} />
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification._id} className="mb-4 bg-violet-800 shadow-md rounded-lg p-5">
                <p className="text-white"><strong>{notification.title}</strong> </p>
                <p className="text-white">{notification.message}</p>
              </div>
            ))
          ) : (
            <p className="text-white">No hay notificaciones</p>
          )}
          
          <p className='text-white'>Estoy verificado</p>
        </div>
      }
    </div>
  );
}

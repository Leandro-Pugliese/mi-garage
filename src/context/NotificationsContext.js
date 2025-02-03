'use client'
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';

const NotificationsContext = createContext();

export function useNotifications() { 
   return useContext(NotificationsContext)
};

export function NotificationsProvider({ children }) {

    const [token, setToken] = useState(null)
    //Verificación de sesión.
    const isSession = () => {
        // Recupero el token de la cookie
        const hayToken = Cookies.get('token');
        // Si no hay token, redirigijo al usuario al login
        if (!hayToken) {
            return
        }
        setToken(hayToken);
    }

    useEffect(() => {
        isSession();
    }, []);

    const [notifications, setNotifications] = useState([]);
    const [areNotificationsLoaded, setAreNotificationsLoaded] = useState(false); //Si uso este state no hace flata usar las cookies.

    const getNotifications = async () => {
        try {
            if (areNotificationsLoaded === false) {
                const config = {
                    method: "get",
                    url: "/notifications",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                };
                const response = await axios(config);
                //Cookies.set('notificationsLoaded', 'true', {expires: 1, path: '/'}) // Cookie con expiración de 1 día.
                setNotifications(response.data);
                setAreNotificationsLoaded(true);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (token) {
            getNotifications();
        }
      }, [token]);

    // Función para marcar como leída una o más notificaciones
    const markAsRead = async (notificationsList) => {
        try {
            const config = {
                method: "put",
                url: "/notification/read",
                data: {notificationsList},
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }
            const response = await axios(config);
            if (response.status === 200) {
                setNotifications((prev) =>
                    prev.map((notif) =>
                        notificationsList.includes(notif._id) ? { ...notif, read: true } : notif
                    )
                );
            }
        } catch (error) {
            console.error("Error al marcar notificaciones como leídas:", error);
        }
    };


    return (
        <NotificationsContext.Provider value={{ notifications, areNotificationsLoaded, markAsRead }}>
            {children}
        </NotificationsContext.Provider>
    );
};

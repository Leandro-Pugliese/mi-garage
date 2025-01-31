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
    const [areNotificationsLoaded, setAreNotificationsLoaded] = useState(false);

    const getNotifications = async () => {
        try {
            const config = {
            method: "get",
            url: "/notifications",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
            };
            const response = await axios(config);
            Cookies.set('notificationsLoaded', 'true', {expires: 1, path: '/'}) // Cookie con expiración de 1 día.
            setNotifications(response.data);
            setAreNotificationsLoaded(true);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log(token)
        if (token) {
            getNotifications();
        }
      }, [token]);

    // Función para marcar como leída una o más notificaciones
    // const markAsRead = async (ids) => {
    //     try {
    //         const res = await fetch("/api/notifications/read", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ notificationsList: ids }),
    //         });

    //         if (res.ok) {
    //             setNotifications((prev) =>
    //                 prev.map((notif) =>
    //                     ids.includes(notif._id) ? { ...notif, read: true } : notif
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Error al marcar notificaciones como leídas:", error);
    //     }
    // };


    return (
        <NotificationsContext.Provider value={{ notifications, areNotificationsLoaded }}>
            {children}
        </NotificationsContext.Provider>
    );
};

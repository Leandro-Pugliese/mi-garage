'use client'
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const NotificationsContext = createContext();

export function useNotifications() { 
   return useContext(NotificationsContext)
};

export function NotificationsProvider({ children }) {

    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null);

    //Verificación de sesión: obtengo el token y decodifico el userId
    const isSession = () => {
        // Recupero el token de la cookie
        const hayToken = Cookies.get('token');
        // Si no hay token, redirigijo al usuario al login
        if (!hayToken) {
            return
        }
        setToken(hayToken);
        try {
            const decoded = jwtDecode(hayToken);
            setUserId(decoded._id);
        } catch (error) {
            console.error("Error decodificando el token:", error);
        }
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

    // Integro Socket.IO para recibir notificaciones en tiempo real.
    useEffect(() => {
        // Me aseguro de tener el userId para unirse a la sala.
        if (!userId) return;

        // Conecto al servidor de Socket.IO.
        // Asegúrarse de que NEXT_PUBLIC_BACKEND_URL apunte al backend.
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000");

        // Uno el usuario a la sala correspondiente al userId.
        socket.emit("join", userId);

        // Escucho el evento "newNotification" y se actualiza el estado.
        socket.on("newNotification", (data) => {
            console.log("Nueva notificación recibida:", data);
            setNotifications(prev => [...prev, data]);
        });

        // Limpieza de la conexión al desmontar el componente.
        return () => {
            socket.disconnect();
        }
    }, [userId]);

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

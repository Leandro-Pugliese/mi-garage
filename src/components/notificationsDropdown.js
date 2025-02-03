'use client'
import { useState, useEffect } from "react";
import { useNotifications } from "@/context/NotificationsContext";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NotificationsDropdown = ({}) => {
    const { notifications, markAsRead } = useNotifications();
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [pendingReadNotifications, setPendingReadNotifications] = useState([]);

    const openNotification = (notification) => {
        setSelectedNotification(notification);
        setPendingReadNotifications((prev) => {
            // Si la notificación ya está en la lista, no hago nada
            if (notification.read || prev.includes(notification._id)) return prev;
            
            return [...prev, notification._id];
        });
    };
    
    const closeDropdown = () => {
        console.log(pendingReadNotifications)
        if (pendingReadNotifications.length > 0) {
            markAsRead(pendingReadNotifications);
            setPendingReadNotifications([]); // Limpio la lista después de marcarlas como leídas. 
        }
        setSelectedNotification(null);
    };

    // Cierro el dropdown si se hace clic fuera de él.
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (!event.target.closest(".notifications-dropdown")) {
            closeDropdown();
        }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
        document.removeEventListener("click", handleClickOutside);
        };
    }, [selectedNotification]);

    return (
        <div className="relative">
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-72">
                {notifications.slice(0, 4).map((notif) => (
                    <div
                        key={notif._id}
                        className={`p-2 cursor-pointer ${
                            notif.read ? "text-gray-500" : "text-black font-bold"
                        }`}
                        onClick={() => openNotification(notif)}
                    >
                        {notif.title}
                    </div>
                ))}
                <Link href="#" className="block text-blue-500 p-2 text-center">
                    Ver todas
                </Link>
            </div>

            {/* PopUp de la notificación */}
            {selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold">{selectedNotification.title}</h3>
                        <p className="mt-2">{selectedNotification.message}</p>
                        <button
                            onClick={closeDropdown}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;

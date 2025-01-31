'use client'
import { useState } from "react";
import { useNotifications } from "@/context/NotificationsContext";

const NotificationsDropdown = () => {
    const { notifications, markAsRead } = useNotifications();
    const [selectedNotification, setSelectedNotification] = useState(null);

    const openNotification = (notification) => {
        setSelectedNotification(notification);
        if (!notification.read) {
            markAsRead([notification._id]);
        }
    };

    return (
        <div className="relative">
            <button className="bg-gray-800 text-white p-2 rounded">🔔</button>
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-72">
                {notifications.slice(0, 6).map((notif) => (
                    <div
                        key={notif._id}
                        className={`p-2 cursor-pointer ${
                            notif.read ? "text-gray-500" : "text-black font-bold"
                        }`}
                        onClick={() => openNotification(notif)}
                    >
                        {notif.message}
                    </div>
                ))}
                <a href="/notifications" className="block text-blue-500 p-2 text-center">
                    Ver todas
                </a>
            </div>

            {/* PopUp de la notificación */}
            {selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold">{selectedNotification.message}</h3>
                        <p className="mt-2">{selectedNotification.details}</p>
                        <button
                            onClick={() => setSelectedNotification(null)}
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

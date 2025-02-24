'use client'
import { useState, useEffect } from "react";
import { useNotifications } from "@/context/NotificationsContext";
import axios from "@/app/utils/axios";
import 'bootstrap-icons/font/bootstrap-icons.css';

const NotificationsDropdown = ({}) => {
    const { notifications, markAsRead, token } = useNotifications();
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [pendingReadNotifications, setPendingReadNotifications] = useState([]);
    const [selectedForDeletion, setSelectedForDeletion] = useState([]);

    const openNotification = (notification) => {
        setSelectedNotification(notification);
        setPendingReadNotifications((prev) => {
            // Si la notificación ya está en la lista, no hago nada
            if (notification.read || prev.includes(notification._id)) return prev;
            return [...prev, notification._id];
        });
    };

    const handleDeletionCheckbox = (notifId) => {
        if (selectedForDeletion.includes(notifId)) {
          setSelectedForDeletion(selectedForDeletion.filter(id => id !== notifId));
        } else {
          setSelectedForDeletion([...selectedForDeletion, notifId]);
        }
    };

    const handleDeleteSelected = async() => {
        if (selectedForDeletion.length > 0) {
          try {
            const config = {
                method: "delete",
                url: `/notification/delete`,
                data: {selectedForDeletion},
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            console.log(response);
            alert(response.data)
          } catch (error) {
            console.log(error);
          }
          
          // Luego de la eliminación, limpia la lista de seleccionadas
          setSelectedForDeletion([]);
        }
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
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-72 max-h-[300px] overflow-y-auto">
                {selectedForDeletion.length > 0 && (
                    <div className="">
                        <button
                            onClick={handleDeleteSelected}
                            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Eliminar seleccionadas
                        </button>
                    </div>
                )}
                {notifications.map((notif) => (
                    <div key={notif._id} className="flex justify-between cursor-pointer hover:bg-gray-300 hover:rounded-lg">
                        <div
                            className={`w-5/6 p-2 ${notif.read ? "text-gray-600" : "text-black font-bold"}`}
                            onClick={() => openNotification(notif)}
                        >
                            {notif.title}
                        </div>
                        {notif.read ? (
                            <div className="flex w-1/6 p-2">
                                <i className='bi bi-trash3'/>
                                <input
                                    type="checkbox"
                                    checked={selectedForDeletion.includes(notif._id)}
                                    onChange={() => handleDeletionCheckbox(notif._id)}
                                    className="cursor-pointer"
                                />
                            </div>
                        ) : (
                            <button className=" w-1/6 p-2" onClick={() => openNotification(notif)}>
                                <i className='bi bi-cone-striped'/>
                            </button>
                        )}
                    </div>
                ))}
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

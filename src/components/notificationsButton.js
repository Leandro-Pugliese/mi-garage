"use client";
import { useState, useEffect, useRef } from "react";
import NotificationsDropdown from "./notificationsDropdown";
import { useNotifications } from "@/context/NotificationsContext";

export default function NotificationsButton() {
  const { notReadNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Cierro el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {
        (notReadNotifications === 0) &&
        <button onClick={toggleNotifications} className="text-white hover:underline">
          <i className="bi bi-bell-fill mx-1" />
          Notificaciones
        </button>
      }
      {
        (notReadNotifications >= 1) &&
        <button onClick={toggleNotifications} className="flex text-yellow-300 hover:underline">
          <i className="bi bi-bell-fill mx-1" />
          Notificaciones
          <p className="ml-1">({notReadNotifications})</p>
        </button>
      }
      {showNotifications && <NotificationsDropdown />}
    </div>
  );
}

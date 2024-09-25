import { useState } from 'react';

export default function VerifyEmailPopup({ onSendEmail })  {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSendEmail = () => {
        onSendEmail();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Verificación de Email</h2>
                <p className="text-gray-700 mb-4">
                    Tu email no está verificado. Tienes que verificarlo para poder recibir alertas sobre tus proximas actividades.
                </p>
                <div className="flex justify-between">
                    <button className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-600" onClick={handleSendEmail}>
                        Enviar Email
                    </button>
                    <button className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-500" onClick={handleClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};


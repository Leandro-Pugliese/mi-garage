"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/app/utils/axios'
import Loader from '@/components/loader';
import Message from '@/components/message';

export default function emailVerificated() {

    //Hook para loader
    const [loader, setLoader] = useState(false);

    //Hooks para msj
    const [mensaje, setMensaje] = useState("");
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    
    const { id, token } = useParams();

    const emailVerification = async () => {
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            setLoader(true)
            const config = {
                method: "put",
                url: `/user/validation/${id}/${token}`,
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await axios(config);
            setMensaje(response.data);
            setShowMsj(true);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            const errorMsj = error.response.data
            if (errorMsj === "jwt expired") {
                setMensaje("Este link expiró, debes pedir un nuevo link")
                setShowErrorMsj(true);
                setShowMsj(false);
                console.error('Error:', error);
            } else { 
                setMensaje("Lo sentimos no fue posible restablecer tu contraseña, debes pedir un nuevo link.");
                setShowErrorMsj(true);
                setShowMsj(false);
                console.error('Error:', error);
            }
            setLoader(false)
        }
    }

    useEffect(() => {
        emailVerification();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-800">
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader) &&
                <Message 
                    mensaje={mensaje}
                    showErrorMsj={showErrorMsj}
                    showMsj={showMsj}
                />
            }
        </div>
    );
}
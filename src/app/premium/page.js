"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation'
import Loader from '@/components/loader';
import MessagePopup from '@/components/messagePopUp';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function BuyPremium() {

    const router = useRouter();
    const [token, setToken] = useState(null)
    //Verificación de sesión.
    const isSession = () => {
        // Recupero el token de la cookie
        const hayToken = Cookies.get('token');
        // Si no hay token, redirigijo al usuario al login
        if (!hayToken) {
            router.push('/user/login');
            return
        }
        setToken(hayToken)
    }
    useEffect(() => {
        isSession();
    }, []);

    //Hook para loader
    const [loader, setLoader] = useState(true);

    //Hooks para msj
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success')
    
    //Hook para cerrar popUp
    const closePopUp = () => {
        setMessage('');
    }

    //Hook para usuario y planes
    const [user, setUser] = useState(null);
    const [plans, setPlans] = useState([]);

    const getUser = async () => {
        try {
            const config = {
                method: "get",
                url: `/user/data`,
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setUser(response.data)
            setLoader(false);
        } catch (error) {
            setMessage(error.response.data);
            setSeverity('error');
            console.error('Error al obtener usuario:', error);
            setLoader(false)
        }
    }

    const getPlans = async () => {
        try {
            const config = {
                method: "get",
                url: `/plans`,
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setPlans(response.data);
            setLoader(false);
        } catch (error) {
            setMessage(error.response.data);
            setSeverity('error');
            console.error('Error al obtener planes premium:', error);
            setLoader(false);
        }
    }

    useEffect(() => {
        if (token) {
            getUser();
            getPlans();
        }
    }, [token]);

    //Funcion para crear preferencia de pago para premium
    const buyPremium = async (planName, planType) => {
        if (planType === "Basic" && user.premiumType === "Plus") {
            setSeverity('success');
            setMessage(
                `Actualmente estás disfrutando de todas las ventajas de nuestro plan PLUS. 
                Una vez que este termine, podrás optar por un plan más básico.
                ¡Gracias por ser parte de Mi Garage!`
            );
            return
        }
        try {
            const email = user.email
            const config = {
                method: "post",
                url: `/buy/premium`,
                data: {email, planName},
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            console.log(response.data.init_point)
            window.open(response.data.init_point, '_blank');
        } catch (error) {
            setMessage('error');
            setSeverity('error');
            console.error('Error al crear preferencia de pago:', error);
        }
    }

    // Función para formatear número a moneda.
    const formateoMoneda = (valor) => {
        return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    }

    return (
        <div className="container min-h-screen mx-auto px-4 py-6 bg-gray-800">
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader) &&
                <div>
                    <div className='flex w-full justify-between'>
                        <h1 className="text-2xl font-bold mb-6 text-white">Planes Premium</h1>
                        {
                            (user.premium) &&
                            <h2 className='text-2xl font-bold mb-6 text-white ml-4'>(Tu plan actual es: {user.premiumType} hasta {new Date(user.premiumExpiration).toLocaleDateString()})</h2>
                        }
                        
                    </div>
                    {
                        plans.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
                            {plans.map((plan) => (
                                <div key={plan._id} className="bg-violet-800 shadow-md rounded-lg p-5">
                                    <div className='flex items-center justify-between mb-4'>
                                        <h2 className="text-white text-xl font-bold mb-2">{plan.name}</h2>
                                        <button 
                                            className='flex items-center justify-center w-1/3 bg-pink-700 text-white cursor-pointer px-4 py-2 rounded hover:bg-pink-600'
                                            onClick={() => buyPremium(plan.name, plan.type)}
                                        >
                                            Obtener
                                        </button>
                                    </div>
                                    <p className="text-white"><strong>Producto:</strong> {plan.description}</p>
                                    <p className="text-white"><strong>Precio:</strong> {formateoMoneda(plan.amount)} (ARS)</p>
                                    <p className="text-white"><strong>Incluye: </strong> 
                                        {
                                            plan.includes.length > 0 ? (
                                                plan.includes.map((item, index) => (
                                                    <div key={index}>
                                                        <i className="bi bi-check-circle-fill mx-1"/> {item}
                                                    </div>
                                                ))
                                            ) : (
                                                <p> - </p>
                                            )
                                        }
                                    </p>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div>No hay planes disponiles en este momento.</div>
                        )
                    }
                </div>
            }
            <MessagePopup message={message} severity={severity} onClose={closePopUp} />
        </div>
    );
}
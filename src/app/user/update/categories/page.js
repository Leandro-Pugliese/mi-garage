"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import { useRouter } from 'next/navigation'
import Loader from '@/components/loader';
import Message from '@/components/message';
import MessagePopup from '@/components/messagePopUp';

export default function UpdateCategories() {

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
    const [mensaje, setMensaje] = useState("");
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity ] = useState("success");

    //Hook para nueva categoria
    const [newCategory, setNewCategory] = useState("");

    const addCategory = async (e) => {
        e.preventDefault(); 
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            setLoader(true)
            if (newCategory === "" || newCategory === " ") {
                setMensaje("Nueva categoría inválida.")
                setShowErrorMsj(true);
                setLoader(false);
                return
            }
            const operation = "ADD"
            const category = newCategory
            const config = {
                method: "put",
                url: "/user/update-categories",
                data: {operation, category},
                headers: {
                "Content-Type": "application/json",
                "Authorization": token
                },
            };
            const response = await axios(config);
            setMessage(response.data);
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            setMensaje(error.response.data);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al modificar la contraseña:', error.response.data);
            setLoader(false)
        }
    }

    const deleteCategory = async (category) => {
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            setLoader(true)
            const operation = "REMOVE"
            const config = {
                method: "put",
                url: "/user/update-categories",
                data: {operation, category},
                headers: {
                "Content-Type": "application/json",
                "Authorization": token
                },
            };
            const response = await axios(config);
            setMessage(response.data);
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            setSeverity("fail");
            setMessage(error.response.data);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al modificar la contraseña:', error.response.data);
            setLoader(false)
        }
    }

    const closePopUp = () => {
        window.location.reload();
    }

    //Hook para categorias
    const [categories, setCategories] = useState(null);

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
            setCategories(response.data.categories);
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            setMensaje("ERROR");
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al obtener usuario:', error);
            setLoader(false)
        }
    }
    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-800">
            {
                (!loader) &&
                <>
                    <form className="p-8 w-96">
                        <h2 className="text-2xl font-bold mb-4 text-white">Categorías</h2>
                        <div className="mb-3">
                            <label htmlFor="category" className="block mb-1 text-white">Agregar Categoría</label>
                            <input
                                type="text"
                                id="category"
                                onChange={(e) => setNewCategory((e.target.value).toUpperCase())}
                                className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                placeholder="Nueva categoría..."
                            />
                        </div>
                        <button onClick={addCategory} className="mb-3 bg-violet-800 text-white py-2 px-4 w-full rounded hover:cursor-pointer hover:bg-violet-700">
                            Agregar
                        </button>
                        {
                            ((showErrorMsj && !loader) || (showMsj && !loader)) && 
                            <Message 
                                mensaje={mensaje}
                                showErrorMsj={showErrorMsj}
                                showMsj={showMsj}
                            />
                        }
                    </form>
                    {
                        categories ? (
                            <div className="flex flex-col w-full items-center">
                                <h1 className="text-white">Mis Categorías</h1>
                                {
                                    categories.map((element, index) => (
                                        <div key={index} className="mb-2 flex w-4/12 justify-between min-h-16 items-center border-b-2 border-violet-500">
                                            <p className="text-white">{element}</p>
                                            <button 
                                                onClick={() => deleteCategory(element)}
                                                className="text-center bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600"
                                            > 
                                                Eliminar 
                                            </button> 
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <p className="text-white">No se encontraron categorías</p>
                        )
                    }
                </>
            }
            {
                (loader) &&
                <Loader />
            }
            <MessagePopup message={message} severity={severity} onClose={closePopUp} />
        </div>
    );
}


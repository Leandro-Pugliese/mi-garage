"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from '@/app/utils/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
import Loader from '@/components/loader';
import Message from '@/components/message';

export default function UpdateActivity() {

    const router = useRouter();
    const [token, setToken] = useState(null)
    //Verificación de sesión.
    const isSession = () => {
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

    //Hook para info del usuario
    const [userPremium, setUserPremium] = useState(false);
    const [userCategories, setUserCategories] = useState(["-"])
    
    const getUser = async () => {
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            setLoader(true);
            const config = {
                method: "get",
                url: "/user/data",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
            };
            const response = await axios(config);
            setUserPremium(response.data.premium);
            setUserCategories(response.data.categories);
        } catch (error) {
            setMensaje("Error");
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error al obtener datos del usuario:', error);
            setLoader(false)
        }
    }

    //Hook para data actividad
    const [activity, setActivity] = useState(null);

    //id para ruta dinámica
    const { id } = useParams();

    const getActivity = async () => {
        try {
            const config = {
                method: "get",
                url: `/activity/data/${id}`,
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": token
                },
            };
            const response = await axios(config);
            setActivity(response.data);
            setChangeStateNextDate(response.data.nextDate.tiene);
            setChangeStateNextKm(response.data.nextKm.tiene);
            setActive(response.data.active);
            setShowMsj(false);
            setShowErrorMsj(false);
            setLoader(false);
        } catch (error) {
            setMensaje("Error");
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error:', error);
            setLoader(false);
        }
    }

    useEffect(() => {
        if (token) {
            getUser();
            getActivity();
        }
    }, [token]);

    //Hooks para info a modificar
    const [type, setType] = useState(undefined);
    const [description, setDescription] = useState(null);
    const [km, setKm] = useState(null);
    const [date, setDate] = useState(null);
    const [isNextDate, setIsNextDate] = useState(null);
    const [nextDate, setNextDate] = useState(null);
    const [isNextKm, setIsNextKm] = useState(null);
    const [nextKm, setNextKm] = useState(null);
    const [deleteImage, setDeleteImage] = useState(false);
    const [active, setActive] = useState(null);
    //Hooks para subir imagen y boton cargar imagen
    const [selectedFile, setSelectedFile] = useState(null);
    const [changeFile, setChangeFile] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const handleFileChange = (event) => {
        const file = event.target.files[0]
        setSelectedFile(file);
        if (file) {
            setChangeFile("Cambiar Imagen")
            setSelectedFileName(`(${file.name})`);
        }
    };
    //Hooks para eliminar imagen
    const [showImageField, setShowImageField] = useState(true);
    const deletingImage = () => {
        setDeleteImage(!deleteImage);
        setShowImageField(!showImageField);
    }

    //Hooks para renderizar info o input para modificar info.
    const [modifyType, setModifyType] = useState(false);
    const [modifyDescription, setModifyDescription] = useState(false);
    const [modifyKm, setModifyKm] = useState(false);
    const [modifyDate, setModifyDate] = useState(false);
    const [modifyIsNextDate, setModifyIsNextDate] = useState(false);
    const [modifyNextDate, setModifyNextDate] = useState(false);
    const [changeStateNextDate, setChangeStateNextDate] = useState(false);
    const [changeStateNextKm, setChangeStateNextKm] = useState(false);
    const [modifyNextKm, setModifyNextKm] = useState(false);
    const [modifyIsNextKm, setModifyIsNextKm] = useState(false);
    const [modifySelectedFile, setModifySelectedFile] = useState(false);
    const [modifyActive, setModifyActive] = useState(false);
    
    const cancelType = () => {
        setType(undefined);
        setModifyType(false);
    }
    const cancelDescription = () => {
        setDescription(null);
        setModifyDescription(false);
    }
    const cancelKm = () => {
        setKm(null);
        setModifyKm(false);
    }
    const cancelDate = () => {
        setDate(null);
        setModifyDate(false);
    }
    const cambiarIsNextDate = () => {
        setIsNextDate(!activity.nextDate.tiene);
        setModifyIsNextDate(true);
        setChangeStateNextDate(!changeStateNextDate);
    }
    const cancelIsNextDate = () => {
        setIsNextDate(null);
        setNextDate(null);
        setModifyIsNextDate(false);
        setChangeStateNextDate(!changeStateNextDate);
    }
    const cancelNextDate = () => {
        setNextDate(null);
        setModifyNextDate(false);
    }
    const cambiarIsNextKm = () => {
        setIsNextKm(!activity.nextKm.tiene);
        setModifyIsNextKm(true);
        setChangeStateNextKm(!changeStateNextKm);
    }
    const cancelIsNextKm = () => {
        setIsNextKm(null);
        setNextKm(null);
        setModifyIsNextKm(false);
        setChangeStateNextKm(!changeStateNextKm)
    }
    const cancelNextKm = () => {
        setNextKm(null);
        setModifyNextKm(false);
    }
    const cancelSelectedFile = () => {
        setSelectedFile(null);
        setModifySelectedFile(false);
        setChangeFile('');
        setSelectedFileName('');
    }
    const changeActive = () => {
        setActive(!activity.active);
        setModifyActive(true);
    }
    const cancelActive = () => {
        setActive(activity.active);
        setModifyActive(false);
    }
    
    const updateActivity = async () => {
        if (isNextDate && !nextDate) {
            setMensaje("Próxima fecha de realización inválida.")
            setShowMsj(false);
            setShowErrorMsj(true);
            return
        }
        const onlyNumbers = /^\d+$/; //Verifico que el value de km solo contenga numeros.
        if (!km && !onlyNumbers.test(km) || !km && km < 0) {
            setMensaje("Kilometraje inválido.")
            setShowMsj(false);
            setShowErrorMsj(true);
            return
        }
        if (isNextKm && !nextKm || isNextKm && nextKm <= 0 || isNextKm && !onlyNumbers.test(nextKm)) {
            setMensaje("Próximo kilometraje inválido.")
            setShowMsj(false);
            setShowErrorMsj(true);
            return
        }
        try {
            setLoader(true)
            if (userPremium) {
                const formData = new FormData();
                formData.append('imagen', selectedFile);
                formData.append('type', type);
                formData.append('description', description);
                formData.append('km', km);
                formData.append('date', date);
                formData.append('isNextDate', isNextDate);
                formData.append('nextDate', nextDate);
                formData.append('isNextKm', isNextKm);
                formData.append('nextKm', nextKm);
                formData.append('deleteImage', deleteImage);
                formData.append('active', active);
                const config = {
                    method: "put",
                    url: `/activity/update-premium/${id}`,
                    data: formData,
                    headers: {
                      "Content-Type": "multipart/form-data",
                      "Authorization": token
                    },
                };
                await axios(config);
                setShowMsj(false);
                setShowErrorMsj(false);
                setLoader(false);
                router.push(`/activities/${activity.vehicle}`);
            } else if (!userPremium) {
                const config = {
                    method: "put",
                    url: `/activity/update/${id}`,
                    data: {type, description, km, date, isNextDate, nextDate, isNextKm, nextKm, active, deleteImage},
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": token
                    },
                };
                await axios(config);
                setShowMsj(false);
                setShowErrorMsj(false);
                setLoader(false);
                router.push(`/activities/${activity.vehicle}`);
            } else {
                setMensaje("Tipo de usuario no difinido.");
                setShowMsj(false);
                setShowErrorMsj(true);
            }
        } catch (error) {
            setMensaje(error.response.data);
            setShowMsj(false);
            setShowErrorMsj(true);
            console.error('Error:', error);
            setLoader(false);
        }
    }

    //Hook para evitar cambio del valor del input en input tipo number y date.
    useEffect(() => {
        if (modifyNextKm || modifyKm || modifyNextDate || modifyDate) {
            // Agarro todos los inputs de tipo number y date
            const inputs = document.querySelectorAll('input[type="number"], input[type="date"]');
            const preventScroll = (event) => {
            event.preventDefault();
            };
            inputs.forEach((input) => {
            input.addEventListener('wheel', preventScroll);
            });
            // Hago un cleanup al desmontar el componente
            return () => {
            inputs.forEach((input) => {
                input.removeEventListener('wheel', preventScroll);
            });
            };
        }
    }, [modifyNextKm, modifyKm, modifyNextDate, modifyDate]);


    return (
        <div className='flex justify-center container min-h-screen mx-auto px-4 py-6 bg-gray-800'>
            {
                (loader) &&
                <Loader />
            }
            {
                (!loader) &&
                <div className='text-white font-bold w-3/6'>
                    <div className='flex flex-col justify-center items-center'>
                        <h2 className="text-2xl font-bold mb-4 text-white">Modificar Actividad</h2>
                        <div className='flex items-center w-9/12'>
                            <label className="text-white pl-1 text-left">Tipo de actividad</label>
                        </div>
                        {
                            (!modifyType) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {activity.type}
                                </p>
                                <button 
                                    onClick={() => setModifyType(!modifyType)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyType) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <select
                                    className="bg-transparent border border-violet-300 py-2 px-3 w-full rounded text-white cursor-pointer"
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option className='bg-violet-600' value="">-</option>
                                    {
                                        userCategories.map((element, index) => (
                                            <option className="bg-violet-600" key={index} value={element}>
                                                {element}
                                            </option>
                                        ))
                                    }
                                </select>
                                <button 
                                    onClick={cancelType}
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label htmlFor="desc" className="block text-white">Descripción</label>
                        </div>
                        {
                            (!modifyDescription) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {activity.description}
                                </p>
                                <button 
                                    onClick={() => setModifyDescription(!modifyDescription)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyDescription) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="text"
                                    id="desc"
                                    onChange={(e) => setDescription(e.target.value.toUpperCase())}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Nueva descripción..."
                                />
                                <button 
                                    onClick={cancelDescription}
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">Kilometraje</label>
                        </div>
                        {
                            (!modifyKm) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {activity.km}
                                </p>
                                <button 
                                    onClick={() => setModifyKm(!modifyKm)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyKm) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="number"
                                    id="km"
                                    onChange={(e) => setKm(Number(e.target.value))}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Ej 63000 (sin comas ni puntos)..."
                                />
                                <button 
                                    onClick={cancelKm}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label htmlFor="date" className="block mb-1 text-white">Fecha</label>
                        </div>
                        {
                            (!modifyDate) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {new Date(activity.date).toLocaleDateString()}
                                </p>
                                <button 
                                    onClick={() => setModifyDate(!modifyDate)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyDate) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="date"
                                    id="date"
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                />
                                <button 
                                    onClick={cancelDate}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">¿Tiene próxima fecha de realización?</label>
                        </div>
                        {
                            (!modifyIsNextDate) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {activity.nextDate.tiene ? "Sí" : "No"}
                                </p>
                                <button 
                                    onClick={cambiarIsNextDate}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyIsNextDate) &&
                            <div className="flex w-9/12 mb-4 min-h-16 items-center justify-between">
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {isNextDate ? "Sí" : "No"}
                                </p>
                                <button 
                                    onClick={cancelIsNextDate}    
                                    className='bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        {
                            (changeStateNextDate) &&
                            <div className='flex items-center w-9/12'>
                                <label className="block text-white">¿Cuándo?</label>
                            </div>
                        }
                        {
                            (!modifyNextDate && changeStateNextDate) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {activity.nextDate.tiene ? new Date(activity.nextDate.date).toLocaleDateString() : "Agregar fecha"}
                                </p>
                                <button 
                                    onClick={() => setModifyNextDate(!modifyNextDate)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    {activity.nextDate.tiene ? "Modificar" : "Agregar"}
                                </button>
                            </div>
                        }
                        {
                            (modifyNextDate && changeStateNextDate) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type='date'
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white cursor-pointer"
                                    id="nextDate"
                                    onChange={(e) => setNextDate(e.target.value)}
                                />
                                <button 
                                    onClick={cancelNextDate}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">¿Tiene próximo kilometraje de realización?</label>
                        </div>
                        {
                            (!modifyIsNextKm) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {activity.nextKm.tiene ? "Sí" : "No"}
                                </p>
                                <button 
                                    onClick={cambiarIsNextKm}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyIsNextKm) &&
                            <div className="flex w-9/12 mb-4 min-h-16 items-center justify-between">
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {isNextKm ? "Sí" : "No"}
                                </p>
                                <button 
                                    onClick={cancelIsNextKm}    
                                    className='bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        {
                            (changeStateNextKm) &&
                            <div className='flex items-center w-9/12'>
                                <label htmlFor="nextKm" className="block text-white">Próximo kilometraje</label>
                            </div>
                        }
                        {
                            (!modifyNextKm && changeStateNextKm) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {activity.nextKm.tiene ? activity.nextKm.km : "Agregar kilometraje"}
                                </p>
                                <button 
                                    onClick={() => setModifyNextKm(!modifyNextKm)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    {activity.nextKm.tiene ? "Modificar" : "Agregar"}
                                </button>
                            </div>
                        }
                        {
                            (modifyNextKm && changeStateNextKm) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <input
                                    type="number"
                                    id="nextKm"
                                    onChange={(e) => setNextKm(Number(e.target.value))}
                                    className="bg-transparent border border-violet-300 p-2 w-full rounded text-white"
                                    placeholder="Ej 63000..."
                                />
                                <button 
                                    onClick={cancelNextKm}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        {
                            (userPremium && showImageField) &&
                            <div className='flex items-center w-9/12'>
                                <label className="flex text-white">
                                    Imagen
                                    <p className='ml-2 text-white'>{selectedFileName}</p>
                                </label>
                            </div>
                        }
                        {
                            (!modifySelectedFile && userPremium && showImageField) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                {
                                    (activity.image.url !== "") &&
                                    
                                    <Link
                                        href={activity.image.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full text-center cursor-pointer bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 mr-3 rounded"
                                    >
                                        Ver imagen
                                     </Link>
                                    
                                }
                                {
                                    (activity.image.url === "") &&
                                    <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                        Sin imagen
                                    </p>
                                }
                                <button 
                                    onClick={() => setModifySelectedFile(!modifySelectedFile)}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    {activity.image.url !== "" ? "Modificar" : "Agregar"}
                                </button>
                            </div>
                        }
                        {
                            (modifySelectedFile && userPremium && showImageField) &&
                            <div className="flex mb-4 min-h-16 items-center w-9/12">
                                <div className="flex items-center justify-left w-9/12 space-x-4">
                                    <label
                                        htmlFor="fileInput"
                                        className="w-full text-center cursor-pointer bg-pink-800 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {changeFile || 'Seleccionar Imagen'}
                                    </label>
                                    <input type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        id="fileInput" 
                                        className="hidden"
                                    />
                                </div>
                                <button 
                                    onClick={cancelSelectedFile}    
                                    className='ml-3 bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        {
                            (activity.image.url !== "") &&
                            <div className="flex w-9/12 items-center justify-left space-x-2 mb-4">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    checked={deleteImage}
                                    onChange={deletingImage}
                                />
                                <label htmlFor="terms" className="text-white">
                                    ¿Eliminar imagen? (No puedes recupearla luego)
                                </label>
                            </div>
                        }
                        <div className='flex items-center w-9/12'>
                            <label className="block text-white">Activa</label>
                        </div>
                        {
                            (!modifyActive) &&
                            <div className='flex w-9/12 mb-4 min-h-16 items-center justify-between'>
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {activity.active ? "Sí" : "No"}
                                </p>
                                <button 
                                    onClick={changeActive}
                                    className='bg-pink-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-pink-600 min-w-[25%]'
                                >
                                    Modificar
                                </button>
                            </div>
                        }
                        {
                            (modifyActive) &&
                            <div className="flex w-9/12 mb-4 min-h-16 items-center justify-between">
                                <p className='bg-transparent border border-violet-300 rounded w-full mr-3 py-2 px-3 text-white'>
                                    {active ? "Sí" : "No"}
                                </p>
                                <button 
                                    onClick={cancelActive}    
                                    className='bg-red-700 text-white cursor-pointer py-2 px-4 rounded hover:bg-red-600 min-w-[25%]'
                                >
                                    Cancelar
                                </button>
                            </div>
                        }
                        <button 
                            className="bg-violet-800 text-white py-2 px-4 w-9/12 rounded hover:cursor-pointer hover:bg-violet-700" 
                            onClick={updateActivity}
                            >
                            Guardar
                        </button>
                    </div>
                    {
                        (showErrorMsj || showMsj) && 
                        <Message 
                            mensaje={mensaje}
                            showErrorMsj={showErrorMsj}
                            showMsj={showMsj}
                        />
                    }
                </div>
            }
        </div>
    );
};
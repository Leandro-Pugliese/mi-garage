import { useParams } from 'next/navigation';
import axios from '@/app/utils/axios'
import Loader from '@/components/loader';
import Message from '@/components/message';

export default function DeleteUser() {
    
    //Hook para loader
    const [loader, setLoader] = useState(false);

    //Hooks para msj
    const [mensaje, setMensaje] = useState('');
    const [showMsj, setShowMsj] = useState(false);
    const [showErrorMsj, setShowErrorMsj] = useState(false);

    //Recupero id y token por params
    const {token} = useParams();

    const deleteUser = async () => {
        setMensaje('');
        setShowMsj(false);
        setShowErrorMsj(false);
        try {
            setLoader(true)
            const config = {
                method: "delete",
                url: `/user/delete/${token}`,
                headers: {
                    "Content-Type": "application/json"
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
                setMensaje(error.response.data);
                setShowErrorMsj(true);
                setShowMsj(false);
                console.error('Error:', error);
            }
            setLoader(false)
        }
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
                    <p><strong>¡ATENCION!</strong>Una vez eliminada no hay forma de recuperar la cuenta.</p>
                    <button onClick={deleteUser} className='text-center bg-pink-700 text-white cursor-pointer p-2 rounded hover:bg-pink-600 min-w-[48%]'>
                        Eliminar Cuenta
                    </button>
                </div>
            }
            {
                ((!loader && showMsj) || (!loader && showErrorMsj)) &&
                <Message 
                    mensaje={mensaje}
                    showMsj={showMsj}
                    showErrorMsj={showErrorMsj}
                />
            }
        </div>
    );
}
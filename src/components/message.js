export default function Message({mensaje, showMsj, showErrorMsj}) {

    return (
        <div className="container__mensajes">
            {
                (showErrorMsj) &&
                <div className="text-red-600">
                    {mensaje}
                </div>
            }
            {
                (showMsj) &&
                <div className="text-green-600">
                    {mensaje}
                </div>
            }
        </div>
    );
}
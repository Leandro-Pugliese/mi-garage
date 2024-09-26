export default function Message({mensaje, showMsj, showErrorMsj}) {

    return (
        <div>
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
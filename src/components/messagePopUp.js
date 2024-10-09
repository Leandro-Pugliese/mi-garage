
export default function MessagePopup({ message, severity, onClose }) {
  
  if (!message) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-center items-center">
        {/* Popup */}
        <div
          className={`relative z-50 p-4 rounded shadow-lg ${
            severity === 'success' ? 'text-green-700' : 'text-red-500'
          } bg-white max-w-sm w-full`}
        >
          <div className="flex flex-col justify-between items-center">
            <span>{message}</span>
            <button onClick={onClose} className="mt-2 bg-violet-800 text-white py-2 px-4 w-full rounded hover:cursor-pointer hover:bg-violet-700">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </>
  );
  
}

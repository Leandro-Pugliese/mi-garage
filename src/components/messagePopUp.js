
export default function MessagePopup({ message, severity, onClose }) {
  
  if (!message) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg ${
        severity === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4">
          ✕
        </button>
      </div>
    </div>
  );
}

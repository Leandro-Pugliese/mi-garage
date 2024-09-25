
export default function CookiesPolicy() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-800 text-white">
        <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
        <p className="mb-4">
          En nuestro sitio web utilizamos cookies para mejorar tu experiencia y asegurar que el sitio funcione correctamente. A continuación, te explicamos qué tipos de cookies usamos y para qué fines.
        </p>
  
        <h2 className="text-2xl font-semibold mb-4">Cookies Esenciales</h2>
        <p className="mb-4">
          Las cookies esenciales son necesarias para que el sitio funcione correctamente y no pueden desactivarse en nuestros sistemas. Estas cookies suelen estar configuradas solo en respuesta a acciones realizadas por ti, como iniciar sesión, completar formularios o recordar tus preferencias de privacidad.
        </p>
  
        <h3 className="text-xl font-medium mb-2">session_cookie</h3>
        <ul className="list-disc ml-5 mb-6">
          <li><strong>Propósito:</strong> Mantener la autenticación de usuario durante la sesión. Esta cookie asegura que puedas acceder a tu cuenta de usuario y navegar por las páginas de usuario autenticadas.</li>
          <li><strong>Duración:</strong> Se elimina al cerrar el navegador o después de un período de inactividad.</li>
          <li><strong>Esencial:</strong> Sí, esta cookie es esencial para el funcionamiento del sitio y no puede ser deshabilitada sin afectar al uso del sitio.</li>
        </ul>
  
        <h2 className="text-2xl font-semibold mb-4">Cookies Opcionales</h2>
        <p className="mb-4">
          En algunos casos, también utilizamos cookies opcionales, como las de análisis o marketing. Estas cookies solo se utilizan si das tu consentimiento. Actualmente no estamos utilizando cookies opcionales, pero esta sección se actualizará si decidimos hacerlo en el futuro.
        </p>
  
        <h2 className="text-2xl font-semibold mb-4">Cómo Controlar las Cookies</h2>
        <p className="mb-4">
          Puedes configurar tu navegador para bloquear o alertarte sobre estas cookies, pero algunas partes del sitio no funcionarán correctamente sin ellas. Si tienes alguna duda sobre nuestras cookies, por favor <a href="/contacto" className="underline">contáctanos</a>.
        </p>
      </div>
    );
  }
  
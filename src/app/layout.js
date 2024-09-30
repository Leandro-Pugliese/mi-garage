import localFont from "next/font/local";
import "./globals.css";
import Navbar from '../components/navbar';
import Footer from "@/components/footer";
import CookieBanner from "@/components/cookiesBanner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Mi Garage",
  description: "Alertas para el mantenimiento de tu vehículo",
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-800">
        <Navbar />
        <main>{children}</main>
        <CookieBanner />
        <Footer />
      </body>
    </html>
  );
}

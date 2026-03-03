import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Opcional: CDN de Tailwind si no funciona localmente */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
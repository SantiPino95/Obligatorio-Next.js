import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'GastroApp - Rutas del Sabor',
  description: 'Descubre los mejores lugares y platos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
import Head from 'next/head';
import { useEffect } from 'react';

export default function Checkout() {
  useEffect(() => {
    window.location.href = '/checkout.html';
  }, []);

  return (
    <html lang="es">
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="refresh" content="0; url=/checkout.html" />
        <title>Checkout - SkyRoutes</title>
      </Head>
      <body style={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ color: '#4A4A4A', marginBottom: '10px' }}>Cargando Checkout 💳</h2>
          <p style={{ color: '#666' }}>Por favor espera un momento...</p>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '20px' }}>Si no eres redirigido, <a href="/checkout.html" style={{ color: '#007AFF' }}>haz clic aquí</a></p>
        </div>
      </body>
    </html>
  );
}
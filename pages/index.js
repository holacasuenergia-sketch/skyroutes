import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SkyRoutes - Redirigiendo...</title>
      </Head>
      <body>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2 style={{ color: '#4A4A4A' }}>Redirigiendo...</h2>
          <p style={{ color: '#666' }}>Por favor espera un momento...</p>
          <p style={{ color: '#999', fontSize: '12px', marginTop: '20px' }}>
            Si no eres redirigido, <a href="/index.html" style={{ color: '#007AFF' }}>haz clic aquí</a>
          </p>
        </div>
      </body>
    </>
  );
}
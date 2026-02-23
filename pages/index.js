import Head from 'next/head';

export default function HomePage() {
  // Redirect to the HTML file in public/
  if (typeof window !== 'undefined') {
    window.location.href = '/index.html';
  }

  return (
    <div>
      <Head>
        <title>Redirecting...</title>
      </Head>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>
          <h2>Loading SkyRoutes...</h2>
          <p>Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
}
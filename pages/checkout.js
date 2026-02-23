import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Checkout() {
  const [flightData, setFlightData] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Get flight data from URL
    const flight = new URLSearchParams(window.location.search).get('flight');
    const originParam = new URLSearchParams(window.location.search).get('origin');
    const destinationParam = new URLSearchParams(window.location.search).get('destination');

    if (flight) {
      try {
        setFlightData(JSON.parse(decodeURIComponent(flight)));
        setOrigin(originParam || 'Origen');
        setDestination(destinationParam || 'Destino');
        setLoading(false);
      } catch (error) {
        console.error('Error parsing flight data:', error);
        setLoading(false);
      }
    }
  }, []);

  const handleBookNow = () => {
    setProcessing(true);
    // Simulate processing
    setTimeout(() => {
      window.location.href = '/success';
    }, 1500);
  };

  const handleWhatsAppBooking = () => {
    if (flightData) {
      const message = `Hola! Quiero reservar vuelo: ${flightData.airline} ${origin} → ${destination}, ${flightData.departure_time} → ${flightData.arrival_time}, Precio: €${flightData.skyroutes_price}`;
      window.open(`https://wa.me/34610243061?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <div>Cargando detalle del vuelo...</div>
      </div>
    );
  }

  if (!flightData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif', flexDirection: 'column', gap: '20px' }}>
        <h2>Vuelo no encontrado</h2>
        <a href="/" style={{ padding: '12px 24px', background: '#0EA5E9', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: '600' }}>Volver al Inicio</a>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Checkout - SkyRoutes</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </Head>

      <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', paddingTop: '80px' }}>
        {/* Header */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#ffffff', zIndex: 1000, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>✈️</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>Sky<span style={{ color: '#0EA5E9' }}>Routes</span></div>
            </a>
          </div>
        </div>

        {/* Checkout Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>Checkout de Reserva</h1>

          {/* Flight Card */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#0F172A' }}>Detalle del Vuelo</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A' }}>{flightData.airline} ({flightData.flight_number})</h3>
                <p style={{ color: '#64748B', fontSize: '14px' }}>{origin} → {destination}</p>
              </div>
              <div style={{ background: '#E0F2FE', padding: '8px 16px', borderRadius: '8px', color: '#0284C7', fontSize: '14px', fontWeight: 600 }}>
                Directo
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
              <div>
                <p style={{ color: '#64748B', fontSize: '14px' }}>Precio SkyRoutes</p>
                <p style={{ fontSize: '28px', fontWeight: 800, color: '#0EA5E9' }}>€{flightData.skyroutes_price}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#64748B', fontSize: '14px' }}>Precio Original</p>
                <p style={{ fontSize: '20px', fontWeight: 600, color: '#64748B', textDecoration: 'line-through' }}>€{flightData.original_price}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#0F172A' }}>Información de Pasajero</h2>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>Nombre Completo</label>
                <input type="text" placeholder="Juan Pérez" required style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '16px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>Email</label>
                <input type="email" placeholder="juan@ejemplo.com" required style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '16px' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '14px', color: '#0F172A' }}>Teléfono</label>
                <input type="tel" placeholder="+34 600 000 000" required style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '16px' }} />
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#0F172A', marginTop: '32px' }}>Método de Pago</h2>

              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ flex: 1, padding: '16px', border: '2px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: 600, color: '#0F172A' }}>
                  <input type="radio" name="payment" value="card" defaultChecked style={{ marginRight: '8px' }} />
                  Tarjeta de Crédito
                </label>
                <label style={{ flex: 1, padding: '16px', border: '2px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: 600, color: '#0F172A' }}>
                  <input type="radio" name="payment" value="whatsapp" style={{ marginRight: '8px' }} />
                  WhatsApp
                </label>
              </div>

              <button type="button" onClick={handleBookNow} disabled={processing} style={{ marginTop: '24px', padding: '16px 32px', background: processing ? '#94A3B8' : '#0EA5E9', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 600, cursor: processing ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                {processing ? 'Procesando...' : `Confirmar Reserva - €${flightData.skyroutes_price}`}
              </button>

              <button type="button" onClick={handleWhatsAppBooking} style={{ padding: '16px 32px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600', cursor: 'pointer', transition: 'all 0.2s' }}>
                💬 Reservar por WhatsApp
              </button>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px', color: '#64748B', fontSize: '14px' }}>
            <a href="/" style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600' }}>← Volver al Inicio</a>
          </div>
        </div>
      </div>
    </>
  );
}
import Head from 'next/head';
import { useEffect, useState } from 'react';

interface Booking {
  id: string;
  type: 'flight' | 'hotel';
  status: 'pending' | 'in_progress' | 'confirmed' | 'paid' | 'completed';
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  route?: string;
  tripType?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  airline?: string;
  flightNumber?: string;
  basePrice?: number;
  finalPrice?: number;
  hotelName?: string;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  stripeLink?: string;
}

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/bookings?status=${filterStatus}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminPassword')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      } else {
        alert('Error fetching bookings: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/bookings', {
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
      });
      if (response.ok) {
        localStorage.setItem('adminPassword', adminPassword);
        setAuthenticated(true);
        fetchBookings();
      } else {
        alert('Contrasñeña incorrecta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in');
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/update-booking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminPassword')}`,
        },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Estado actualizado exitosamente');
        fetchBookings();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error actualizando estado');
    }
  };

  const handleGeneratePaymentLink = async (booking: Booking) => {
    try {
      const response = await fetch('/api/admin/payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminPassword')}`,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.finalPrice,
          description: booking.type === 'flight'
            ? `Vuelo ${booking.airline} ${booking.route}`
            : `Hotel ${booking.hotelName} en ${booking.location}`,
          clientEmail: booking.clientEmail,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Stripe link generado: ${data.paymentUrl}`);
        // Copy to clipboard
        navigator.clipboard.writeText(data.paymentUrl);
        fetchBookings();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generando link de pago');
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchBookings();
    }
  }, [authenticated, filterStatus]);

  if (!authenticated) {
    return (
      <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>PANEL ADMIN - SkyRoutes</title>
          <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        </Head>

        <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxWidth: '400px', width: '100%' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>Panel de Administración</h1>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Contrasñeña</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Contrasñeña admin"
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                />
              </div>
              <button
                type="submit"
                style={{ padding: '12px 24px', background: '#0EA5E9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Acceder
              </button>
            </form>
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <a href="/" style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}>← Volver al sitio</a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PANEL ADMIN - SkyRoutes</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </Head>

      <div style={{ fontFamily: 'Inter, sans-serif', background: '#F8FAFC', minHeight: '100vh', paddingTop: '20px' }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Panel de Administración</h1>
              <p style={{ color: '#64748B', margin: '4px 0 0 0' }}>SkyRoutes Travel Agency</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="/" style={{ padding: '12px 24px', background: 'transparent', color: '#0EA5E9', border: '1px solid #0EA5E9', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Volver al sitio</a>
              <button onClick={() => { localStorage.removeItem('adminPassword'); window.location.reload(); }} style={{ padding: '12px 24px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cerrar Sesión</button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 24px' }}>
          {/* Filters */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Filtrar por estado:</span>
            {['pending', 'in_progress', 'confirmed', 'paid', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
                style={{
                  padding: '8px 16px',
                  background: filterStatus === status ? '#0EA5E9' : 'white',
                  color: filterStatus === status ? 'white' : '#0EA5E9',
                  border: '1px solid #0EA5E9',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
            <button
              onClick={() => setFilterStatus('all')}
              style={{ padding: '8px 16px', background: 'transparent', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Mostrar todos
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {['pending', 'in_progress', 'confirmed', 'paid', 'completed'].map(status => (
              <div key={status} style={{ background: 'white', padding: '20px', borderRadius: '8px', borderLeft: `4px solid ${
                status === 'pending' ? '#F59E0B' :
                status === 'in_progress' ? '#0EA5E9' :
                status === 'confirmed' ? '#10B981' :
                status === 'paid' ? '#8B5CF6' : '#059669'
              }` }}>
                <div style={{ color: '#64748B', fontSize: '14px', marginBottom: '4px' }}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700 }}>
                  {bookings.filter(b => b.status === status).length}
                </div>
              </div>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
              No hay solicitudes pendientes
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {bookings.map(booking => (
                <div key={booking.id} style={{ background: 'white', padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${
                  booking.status === 'pending' ? '#F59E0B' :
                  booking.status === 'in_progress' ? '#0EA5E9' :
                  booking.status === 'confirmed' ? '#10B981' :
                  booking.status === 'paid' ? '#8B5CF6' : '#059669'
                }` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
                      {booking.type === 'flight' ? '✈️ Vuelo' : '🏨 Hotel'} - {booking.id}
                    </h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600',
                      background: booking.status === 'pending' ? '#FEF3C7' :
                        booking.status === 'in_progress' ? '#DBEAFE' :
                        booking.status === 'confirmed' ? '#D1FAE5' :
                        booking.status === 'paid' ? '#E9D5FF' : '#D1FAE5',
                      color: booking.status === 'pending' ? '#92400E' :
                        booking.status === 'in_progress' ? '#1E40AF' :
                        booking.status === 'confirmed' ? '#065F46' :
                        booking.status === 'paid' ? '#6B21A8' : '#065F46'
                    }}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <div style={{ color: '#64748B', fontSize: '14px', marginBottom: '4px' }}>Cliente</div>
                      <div style={{ fontWeight: 600 }}>{booking.clientName}</div>
                      <div style={{ color: '#0EA5E9', fontSize: '14px' }}>{booking.clientEmail}</div>
                      <div style={{ color: '#64748B', fontSize: '14px' }}>{booking.clientPhone}</div>
                    </div>

                    {booking.type === 'flight' ? (
                      <div>
                        <div style={{ color: '#64748B', fontSize: '14px', marginBottom: '4px' }}>Vuelo</div>
                        <div style={{ fontWeight: 600 }}>{booking.airline} ({booking.flightNumber})</div>
                        <div>{booking.route}</div>
                        <div>{booking.tripType === 'oneway' ? 'Solo Ida' : 'Ida y Vuelta'}</div>
                        <div>{booking.passengers} pasajero(s)</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ color: '#64748B', fontSize: '14px', marginBottom: '4px' }}>Hotel</div>
                        <div style={{ fontWeight: 600 }}>{booking.hotelName}</div>
                        <div>{booking.location}</div>
                        <div>{booking.guests} huésped(s)</div>
                      </div>
                    )}

                    <div>
                      <div style={{ color: '#64748B', fontSize: '14px', marginBottom: '4px' }}>Precio</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#0EA5E9' }}>€{booking.finalPrice?.toLocaleString()}</div>
                      <div style={{ color: '#64748B', fontSize: '14px' }}>
                        Base: €{booking.basePrice?.toLocaleString()} + {booking.type === 'flight' ? '15%' : '20%'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['in_progress', 'confirmed', 'paid', 'completed'].map(status => (
                      booking.status !== status && (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(booking.id, status)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            background: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      )
                    ))}

                    {!booking.stripeLink && booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleGeneratePaymentLink(booking)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          background: '#6366F1',
                          color: 'white',
                          border: 'none',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Generar Link Pago
                      </button>
                    )}

                    {booking.stripeLink && (
                      <a
                        href={booking.stripeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          background: '#10B981',
                          color: 'white',
 textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '14px'
                        }}
                      >
                        Abrir Pago Stripe
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
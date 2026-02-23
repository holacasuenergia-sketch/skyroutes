import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SkyRoutes - Vuelos a Europa al mejor precio</title>
      </Head>

      <div dangerouslySetInnerHTML={{ __html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SkyRoutes - Vuelos Latinoamérica ↔ Europa | Mejores Precios</title>
          <link rel="icon" href="/logo.png" type="image/png">

          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">

          <!-- Flatpickr for date picker -->
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/airbnb.css">

          <style>
            :root {
              --primary: #0EA5E9;
              --primary-dark: #0284C7;
              --secondary: #F59E0B;
              --dark: #0F172A;
              --gray-50: #F8FAFC;
              --gray-500: #64748B;
              --success: #10B981;
              --white: #FFFFFF;
            }

            * { margin: 0; padding: 0; box-sizing: border-box; }
            html { scroll-behavior: smooth; }
            body { font-family: 'Inter', sans-serif; background: var(--gray-50); color: var(--dark); line-height: 1.6; padding-top: 72px; }
            .header { position: fixed; top: 0; left: 0; right: 0; background: #ffffff; z-index: 1000; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .header-container { max-width: 1400px; margin: 0 auto; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 28px; font-weight: 800; color: var(--primary); display: flex; align-items: center; gap: 8px; text-decoration: none !important; }
            .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 24px; text-align: center; }
            .hero h1 { font-size: 48px; font-weight: 800; margin-bottom: 16px; }
            .hero p { font-size: 18px; opacity: 0.9; margin-bottom: 32px; }
            .search-form { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
            .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
            .form-group { display: flex; flex-direction: column; }
            .form-group label { font-weight: 500; margin-bottom: 8px; font-size: 14px; color: var(--dark); }
            .form-group input, .form-group select { padding: 12px; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 16px; }
            .search-button { background: var(--primary); color: white; padding: 16px 32px; border: none; border-radius: 8px; font-size: 18px; font-weight: 600; cursor: pointer; width: 100%; }
            .search-button:hover { background: var(--primary-dark); }
            .flights-section { max-width: 1400px; margin: 60px auto; padding: 0 24px; }
            .flights-section h2 { font-size: 32px; font-weight: 700; margin-bottom: 32px; }
            .flight-card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
            .flight-airline { display: flex; align-items: center; gap: 16px; }
            .flight-airline-logo { width: 64px; height: 64px; background: var(--gray-50); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
            .flight-info h3 { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
            .flight-time { font-size: 14px; color: var(--gray-500); }
            .flight-price { text-align: right; }
            .flight-price .price { font-size: 28px; font-weight: 800; color: var(--primary); }
            .flight-price .duration { font-size: 14px; color: var(--gray-500); margin-bottom: 8px; }
            .book-button { display: inline-block; background: var(--primary); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .book-button:hover { background: var(--primary-dark); color: white; text-decoration: none; }
            .whatsapp-button { background: var(--success); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
            .whatsapp-button:hover { background: #059669; }

            @media (max-width: 768px) {
              .hero h1 { font-size: 32px; }
              .form-grid { grid-template-columns: 1fr; }
              .flight-card { flex-direction: column; text-align: center; }
              .flight-price { text-align: center; margin-top: 16px; }
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <div class="header-container">
              <a href="/" class="logo">⭐ SkyRoutes</a>
            </div>
          </div>

          <!-- Hero Section -->
          <div class="hero">
            <h1>Vuelos Latinoamérica ↔ Europa</h1>
            <p>Encuentra los mejores vuelos al mejor precio</p>
          </div>

          <!-- Search Form -->
          <div style="margin-top: -40px; padding: 0 24px;">
            <div class="search-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Origen</label>
                  <input type="text" placeholder="Madrid" value="Madrid">
                </div>
                <div class="form-group">
                  <label>Destino</label>
                  <input type="text" placeholder="Barcelona" value="Barcelona">
                </div>
                <div class="form-group">
                  <label>Fecha</label>
                  <input type="date" placeholder="Seleccionar fecha">
                </div>
                <div class="form-group">
                  <label>Pasajeros</label>
                  <select>
                    <option value="1">1 pasajero</option>
                    <option value="2">2 pasajeros</option>
                    <option value="3">3 pasajeros</option>
                    <option value="4">4+ pasajeros</option>
                  </select>
                </div>
              </div>
              <button class="search-button">Buscar Vuelos ✈️</button>
            </div>
          </div>

          <!-- Flights Results -->
          <div class="flights-section">
            <h2>Resultados de búsqueda</h2>

            <!-- Flight 1 -->
            <div class="flight-card">
              <div class="flight-airline">
                <div class="flight-airline-logo">✈️</div>
                <div class="flight-info">
                  <h3>Ryanair</h3>
                  <div class="flight-time">Madrid → Barcelona | 08:30-10:45 (2h 15min)</div>
                </div>
              </div>
              <div class="flight-price">
                <div class="duration">2h 15min</div>
                <div class="price">€50</div>
                <a href="/checkout.html" class="book-button">Reservar</a>
              </div>
            </div>

            <!-- Flight 2 -->
            <div class="flight-card">
              <div class="flight-airline">
                <div class="flight-airline-logo">🛩️</div>
                <div class="flight-info">
                  <h3>EasyJet</h3>
                  <div class="flight-time">Madrid → Barcelona | 12:00-14:30 (2h 30min)</div>
                </div>
              </div>
              <div class="flight-price">
                <div class="duration">2h 30min</div>
                <div class="price">€60</div>
                <a href="/checkout.html" class="book-button">Reservar</a>
              </div>
            </div>

            <!-- Flight 3 -->
            <div class="flight-card">
              <div class="flight-airline">
                <div class="flight-airline-logo">✈️</div>
                <div class="flight-info">
                  <h3>Vueling</h3>
                  <div class="flight-time">Madrid → Barcelona | 16:30-18:45 (2h 15min)</div>
                </div>
              </div>
              <div class="flight-price">
                <div class="duration">2h 15min</div>
                <div class="price">€66</div>
                <a href="/checkout.html" class="book-button">Reservar</a>
              </div>
            </div>

            <!-- WhatsApp Button -->
            <div style="text-align: center; margin-top: 32px; padding: 24px; background: white; border-radius: 16px;">
              <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Ver Todas las Opciones en WhatsApp ✈️</h3>
              <p style="color: var(--gray-500); margin-bottom: 24px;">Recibe todos los vuelos comparados en un solo mensaje</p>
              <button class="whatsapp-button" onclick="window.open('https://wa.me/34610243061?text=Hola!%20Veo%20los%20vuelos%20de%20SkyRoutes%20y%20me%20gustaría%20ver%20todas%20las%20opciones.', '_blank')">
                💬 Contactar por WhatsApp
              </button>
            </div>
          </div>

          <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
        </body>
        </html>
      ` }} />
    </>
  );
}
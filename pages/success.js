<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reserva Exitosa - SkyRoutes</title>
    <link rel="icon" href="/logo.svg" type="image/svg+xml">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary: #0EA5E9;
            --primary-dark: #0284C7;
            --success: #10B981;
            --dark: #0F172A;
            --gray-50: #F8FAFC;
            --gray-500: #64748B;
            --white: #FFFFFF;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; background: var(--gray-50); color: var(--dark); line-height: 1.6; }

        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            z-index: 1000;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo-text { font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 700; color: var(--dark); }
        .logo-text span { color: var(--primary); }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
        }

        .success-container {
            max-width: 600px;
            margin: 80px auto 40px;
            padding: 0 24px;
            text-align: center;
        }

        .success-icon {
            width: 120px;
            height: 120px;
            margin: 0 auto 32px;
            background: var(--success);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 64px;
            color: white;
            animation: scaleIn 0.5s ease;
        }

        @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .success-title {
            font-size: 32px;
            font-weight: 700;
            color: var(--dark);
            margin-bottom: 16px;
        }

        .success-message {
            font-size: 18px;
            color: var(--gray-500);
            margin-bottom: 32px;
        }

        .booking-details {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            margin-bottom: 32px;
            text-align: left;
        }

        .booking-details h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: var(--dark);
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #E2E8F0;
        }

        .detail-row:last-child { border-bottom: none; }

        .detail-label { color: var(--gray-500); font-weight: 500; }
        .detail-value { font-weight: 600; color: var(--dark); }

        .back-btn {
            display: inline-block;
            background: var(--primary);
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s;
        }

        .back-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }

        .whatsapp-btn {
            display: block;
            background: var(--success);
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 16px;
            transition: all 0.2s;
        }

        .whatsapp-btn:hover {
            background: #059669;
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .success-title { font-size: 24px; }
            .success-message { font-size: 16px; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-container">
            <a href="/" class="logo">
                <div class="logo-icon">✈️</div>
                <div class="logo-text">Sky<span>Routes</span></div>
            </a>
        </div>
    </div>

    <!-- Success Content -->
    <div class="success-container">
        <div class="success-icon">✓</div>
        <h1 class="success-title">¡Reserva Exitosa! 🎉</h1>
        <p class="success-message">Tu reserva ha sido procesada correctamente</p>

        <div class="booking-details">
            <h3>Detalles de la Reserva</h3>

            <div class="detail-row">
                <span class="detail-label">Número de Reserva</span>
                <span class="detail-value" id="reservation-id">SKR-XXXXXXX</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Aerolínea</span>
                <span class="detail-value" id="airline-name">-</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Ruta</span>
                <span class="detail-value" id="route-info">-</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Fechas</span>
                <span class="detail-value" id="dates-info">-</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Precio Total</span>
                <span class="detail-value" id="total-price">-</span>
            </div>
        </div>

        <a href="/" class="back-btn">Volver al Inicio</a>
        <a href="https://wa.me/34610243061" class="whatsapp-btn">
            💬 Contactar por WhatsApp
        </a>
    </div>

    <script>
        // Get reservation details from URL
        const urlParams = new URLSearchParams(window.location.search);
        const flight = urlParams.get('flight');
        const origin = urlParams.get('origin');
        const destination = urlParams.get('destination');

        if (flight) {
            const flightData = JSON.parse(decodeURIComponent(flight));
            document.getElementById('reservation-id').textContent = `SKR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
            document.getElementById('airline-name').textContent = flightData.airline;
            document.getElementById('route-info').textContent = `${origin} → ${destination}`;
            document.getElementById('dates-info').textContent = '09/03/2026 - 15/03/2026';
            document.getElementById('total-price').textContent = `€${flightData.skyroutes_price}`;
        }

        // Auto redirect to WhatsApp after showing details
        setTimeout(() => {
            // Uncomment to auto-redirect:
            // window.location.href = `https://wa.me/34610243061?text=${encodeURIComponent('Hola! Mi reserva ' + document.getElementById('reservation-id').textContent + ' confirmada.')}`;
        }, 3000);
    </script>
</body>
</html>
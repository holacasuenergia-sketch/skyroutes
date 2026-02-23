// Payment processing with Stripe

// Your Stripe publishable key (use test key for development)
const stripe = Stripe('pk_test_51T3iST...'); // Replace with your actual publishable key

let paymentIntentId = null;
let clientSecret = null;
let selectedFlight = null;

// DOM elements
const form = document.getElementById('payment-form');
const cardElement = document.getElementById('card-element');
const payButton = document.getElementById('pay-button');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// Initialize Stripe Elements
const elements = stripe.elements();
const card = elements.create('card', {
    style: {
        base: {
            color: '#0F172A',
            fontFamily: 'Inter, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#94A3B8'
            }
        },
        invalid: {
            color: '#EF4444',
            iconColor: '#EF4444'
        }
    }
});

card.mount('#card-element');

// Handle real-time validation errors
card.on('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Parse URL parameters to get flight data
function getFlightFromURL() {
    const params = new URLSearchParams(window.location.search);
    const flightParam = params.get('flight');

    if (flightParam) {
        try {
            return JSON.parse(decodeURIComponent(flightParam));
        } catch (e) {
            console.error('Error parsing flight data:', e);
            return null;
        }
    }
    return null;
}

// Populate flight details in UI
function displayFlightDetails(flight) {
    if (!flight) {
        window.location.href = 'index.html';
        return;
    }

    selectedFlight = flight;

    // Update left section
    document.getElementById('flight-airline').textContent = flight.airline;
    document.getElementById('flight-number').textContent = flight.flight_number;

    // Update times
    document.getElementById('departure-time').textContent = flight.departure_time;
    document.getElementById('departure-date').textContent = flight.departure_date;
    document.getElementById('arrival-time').textContent = flight.arrival_time;
    document.getElementById('arrival-date').textContent = flight.departure_date;

    // Update duration and stops
    const hours = Math.floor(flight.duration_minutes / 60);
    const minutes = flight.duration_minutes % 60;
    document.getElementById('flight-duration').textContent = `${hours}h ${minutes}m`;
    document.getElementById('flight-stops').textContent = flight.stops === 0 ? 'DIRECTO' : `${flight.stops} ESCALA${flight.stops > 1 ? 'S' : ''}`;

    // Update route display (origin and destination from URL or flight object)
    const origin = params.get('origin') || 'Madrid';
    const destination = params.get('destination') || 'Barcelona';
    document.getElementById('route-display').textContent = `${origin} → ${destination}`;

    // Update prices
    document.getElementById('original-price').textContent = `€${flight.original_price.toFixed(2)}`;
    document.getElementById('markup-price').textContent = `+€${(flight.skyroutes_price - flight.original_price).toFixed(2)} (${flight.markup_percent}%)`;
    document.getElementById('total-price').textContent = `€${flight.skyroutes_price.toFixed(2)}`;

    // Update pay button
    payButton.textContent = `Pagar €${flight.skyroutes_price.toFixed(2)}`;
}

// Create Payment Intent
async function createPaymentIntent() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (!firstName || !lastName || !email || !phone || !selectedFlight) {
        showError('Por favor, completa todos los campos obligatorios');
        return false;
    }

    payButton.disabled = true;
    payButton.textContent = 'Procesando...';
    hideError();

    try {
        const response = await fetch('/api/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                flight: selectedFlight,
                passenger: {
                    firstName,
                    lastName,
                    email,
                    phone
                }
            })
        });

        const data = await response.json();

        if (data.success) {
            clientSecret = data.clientSecret;
            paymentIntentId = data.paymentIntentId;
            return true;
        } else {
            showError(data.error || 'Error al crear el pago');
            payButton.disabled = false;
            payButton.textContent = `Pagar €${selectedFlight.skyroutes_price.toFixed(2)}`;
            return false;
        }

    } catch (error) {
        console.error('Payment intent error:', error);
        showError('Error de conexión. Por favor, intenta nuevamente.');
        payButton.disabled = false;
        payButton.textContent = `Pagar €${selectedFlight.skyroutes_price.toFixed(2)}`;
        return false;
    }
}

// Process payment
async function processPayment(event) {
    event.preventDefault();

    // First, create payment intent
    const paymentIntentCreated = await createPaymentIntent();
    if (!paymentIntentCreated) {
        return;
    }

    // Confirm card payment
    payButton.textContent = 'Confirmando pago...';

    try {
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value
                }
            }
        });

        if (error) {
            showError(error.message);
            payButton.disabled = false;
            payButton.textContent = `Pagar €${selectedFlight.skyroutes_price.toFixed(2)}`;
        } else {
            // Payment successful!
            showSuccess('¡Pago completado con éxito!');
            payButton.textContent = '✓ Pago Exitoso';

            // Wait 2 seconds then redirect to success page
            setTimeout(() => {
                window.location.href = `success.html?payment_intent=${paymentIntent.id}&flight=${encodeURIComponent(JSON.stringify(selectedFlight))}`;
            }, 2000);
        }

    } catch (error) {
        console.error('Payment confirmation error:', error);
        showError('Error al confirmar el pago. Por favor, intenta nuevamente.');
        payButton.disabled = false;
        payButton.textContent = `Pagar €${selectedFlight.skyroutes_price.toFixed(2)}`;
    }
}

// Display functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
}

// Event listeners
form.addEventListener('submit', processPayment);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const flight = getFlightFromURL();
    displayFlightDetails(flight);
});
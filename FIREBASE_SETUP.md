# Firebase Configuration for SkyRoutes

## Firebase Setup

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/

### 2. Create New Project
- Project Name: SkyRoutes
- Location: Choose closest to your users
- Enable Google Analytics: Optional

### 3. Create Firestore Database
- Go to: Build → Firestore Database
- Click: "Create Database"
- Location: Choose region (Europe-west1 for Spain)
- Start in: Test mode (will change to production later)
- Rules: Start with test rules, will tighten in production

### 4. Create Authentication
- Go to: Build → Authentication
- Click: "Get Started"
- Enable: Email/Password provider
- Create admin account with email: skyroutes.eu@gmail.com
- Password: (choose strong password)

### 5. Get Firebase Config
- Go to: Project Settings (⚙️ icon)
- Scroll to: "Your apps"
- Click: Web app (</>)
- Copy the config object
- Add to environment variables

---

## Firebase Environment Variables

Add to Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=skyroutes.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=skyroutes
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=skyroutes.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
FIREBASE_ADMIN_PRIVATE_KEY=your_admin_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=skyroutes.firebaseapp.com@skyroutes.iam.gserviceaccount.com
```

---

## Firestore Collections

### bookings Collection
```javascript
// bookings/{bookingId}
{
  id: "SOL-20260223-001",
  type: "flight" | "hotel",
  status: "pending" | "in_progress" | "confirmed" | "paid" | "completed",
  createdAt: "2026-02-23T14:30:00Z",
  updatedAt: "2026-02-23T14:30:00Z",

  // Cliente
  clientName: "Juan Pérez",
  clientEmail: "juan@ejemplo.com",
  clientPhone: "+34 600 000 000",

  // Vuelo (si type="flight")
  route: "Lima → Barcelona",
  tripType: "oneway" | "roundtrip",
  departureDate: "2026-03-09",
  returnDate: "2026-03-15",
  passengers: 1,
  airline: "LATAM",
  flightNumber: "LA1234",
  departureTime: "08:30",
  arrivalTime: "22:30",
  duration: 660, // minutes
  basePrice: 1300,
  finalPrice: 1495, // basePrice * 1.15
  stripeLink: null, // Admin genera esto
  stripePaymentId: null,

  // Hotel (si type="hotel")
  hotelName: "Hotel Example",
  hotelImage: "https://example.com/hotel.jpg",
  location: "Barcelona Centro",
  checkIn: "2026-03-09",
  checkOut: "2026-03-15",
  guests: 1,
  basePricePerNight: 100,
  totalNights: 6,
  finalPrice: 720, // basePricePerNight * totalNights * 1.20
  stripeLink: null,
  stripePaymentId: null
}
```

---

## Firestore Security Rules (For Development)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /bookings/{bookingId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null;
    }
  }
}
```

---

## Next Steps

1. ✅ Create Firebase project (if not exists)
2. ✅ Enable Firestore Database
3. ✅ Enable Authentication (Email/Password)
4. ✅ Create admin account (skyroutes.eu@gmail.com)
5. ✅ Copy Firebase config to environment variables
6. ✅ Implement Firebase admin SDK init in serverless functions
7. ✅ Create API endpoints for:
   - Submit flight booking
   - Submit hotel booking
   - Get all bookings (admin)
   - Update booking status
   - Generate Stripe payment link
8. ✅ Create admin UI for booking management
9. ✅ Implement email notifications (SendGrid)
10. ✅ Test end-to-end flow

---

## Important Notes

- ⚠️ Change Firestore rules to production rules before going live
- ⚠️ Use service account key for admin operations only
- ⚠️ Keep Firebase credentials secure (use environment variables)
- ⚠️ Never commit service account key to git
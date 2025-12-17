# Lionlink - Study Accountability & Partnership Matching

A study accountability and partnership matching platform for Columbia University students. Find study partners, join sessions, and track your accountability goals.

## Features

- **User Authentication** - Secure login with Columbia University credentials
- **Study Session Feed** - Browse and join upcoming study sessions
- **Partner Matching** - Find accountability partners based on shared courses, goals, and availability
- **Smart Recommendations** - Algorithm matches you with the most relevant sessions and partners
- **Profile Management** - Customize your courses, study goals, and availability
- **Real-time Updates** - Live synchronization with Firebase backend

## Tech Stack

- **Frontend**: React 19.2 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Email/Password Authentication**
3. Create a **Firestore Database** (start in production mode)
4. Copy your Firebase configuration from Project Settings
5. Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Set Up Firestore Security Rules

In your Firebase Console, go to Firestore Database > Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Sessions collection
    match /sessions/{sessionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.createdBy == request.auth.uid;

      // Session interest subcollection
      match /interested/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:5173/](http://localhost:5173/)

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
lionlink/
├── src/
│   ├── components/          # React components
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── FindPartnersScreen.tsx
│   │   ├── SessionsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── BottomNavigation.tsx
│   ├── lib/                 # Utilities and Firebase services
│   │   ├── firebase.ts      # Firebase initialization
│   │   ├── auth.ts          # Authentication functions
│   │   ├── profiles.ts      # User profile management
│   │   ├── sessions.ts      # Session queries
│   │   ├── partners.ts      # Partner discovery
│   │   └── match.ts         # Matching algorithm
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env                     # Environment variables (not in git)
├── .env.example             # Example environment variables
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.cjs      # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Data Models

### User Profile
```typescript
{
  uid: string
  email: string
  name: string
  major: string
  year: string
  courses: string[]
  goals: string[]
  availability: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Study Session
```typescript
{
  courseCode: string
  courseName: string
  hostName: string
  location: string
  startAt: Timestamp
  endAt: Timestamp
  interestedCount: number
  createdBy: string
  interested: { [userId: string]: { createdAt: Timestamp } }
}
```

## Features Overview

### Home Screen
- Browse upcoming study sessions
- Sessions sorted by relevance using matching algorithm
- Express interest in sessions with one tap
- See who else is interested

### Find Partners Screen
- Discover study partners by course
- Filter partners based on shared courses
- View partner profiles (courses, goals, availability)
- Match with accountability partners

### Sessions Screen
- View your created sessions
- Track sessions you've expressed interest in
- Monitor session participation

### Profile Screen
- Update your name, major, and year
- Add/remove courses
- Set study goals (Accountability, Focus, Learn Together, etc.)
- Configure availability (weekdays, weekends, evenings)

## Matching Algorithm

The app uses a weighted scoring system to recommend:
- Sessions that match your courses (highest weight)
- Partners with similar goals and availability
- Mutual course overlaps for better collaboration

## Development Notes

- Built with React 19 and modern TypeScript
- Uses strict mode for type safety
- Mobile-first responsive design (optimized for 500px width)
- Real-time listeners for live data updates
- Error boundaries for graceful error handling

## Firebase Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Email/Password Authentication
- [ ] Create Firestore Database
- [ ] Configure Firestore security rules
- [ ] Add Firebase config to `.env` file
- [ ] Verify Authentication works
- [ ] Test creating sessions and profiles

## Support

For issues or questions, please check the Firebase Console and ensure:
1. Your `.env` file has valid Firebase credentials
2. Authentication is enabled in Firebase Console
3. Firestore database is created
4. Security rules are properly configured

## License

MIT

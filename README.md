# Omi Web Client

This is the web client for the Omi memory app, allowing users to sign up, sign in, and view their memories stored in Firestore.

## Features

- User authentication (email/password and Google Sign-In)
- Memory dashboard with filtering options
- Password reset functionality
- Mobile-friendly responsive design
- Integration with the Omi API server

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Running Omi API server (configured in the `.env` file)

### Installation

1. Clone the repository
2. Navigate to the client directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file with your Firebase configuration and API URL:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

5. Start the development server:

```bash
npm start
```

### Building for Production

```bash
npm run build
```

## Handling App Integration

This web client is designed to integrate with the Omi mobile app. When a user clicks on a link from the mobile app, the `uid` will be appended as a query parameter. The web client will:

1. Detect this `uid` parameter during signup
2. Link the new web account with the existing mobile user's data
3. Allow access to the user's memories stored in Firestore

## Authentication

The application uses Firebase Authentication for user management:

- Email/password signup and login
- Google authentication
- Password reset via email

## Firestore Integration

The client connects to Firestore through the Omi API server to:

1. Retrieve and display memories
2. Filter memories by category
3. Show action items associated with memories

## Project Structure

- `/src/components` - React components
- `/src/contexts` - Context providers (Auth)
- `/src/services` - API services
- `/src/firebase.ts` - Firebase configuration

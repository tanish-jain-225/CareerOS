# Installation & Setup Guide

This guide provides detailed instructions for setting up the CareerOS environment for development and production.

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Firebase Account**: Access to the Firebase Console
- **Vercel Account**: (Optional) For deployment

## 🛠 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CareerOS.git
cd CareerOS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

Create a project in the [Firebase Console](https://console.firebase.google.com/).

1. Enable **Authentication** (Google sign-in).
2. Enable **Cloud Firestore** in test mode.
3. Create a Web App and copy the configuration.

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Run Firebase Emulators (Optional but Recommended)

For local database testing without hitting your production quota:

```bash
npm run emulators
```

### 6. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` to access the CareerOS interface.

## 🧪 Running Tests

We use **Vitest** for unit and component testing.

### Run all tests:

```bash
npm run test
```

### Run with coverage report:

```bash
npm run test:coverage
```

## 🏗 Production Build

To verify the production build locally:

```bash
npm run build
npm run start
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add the environment variables from `.env.local` to the Vercel project settings.
4. Vercel will automatically detect the Next.js project and deploy.

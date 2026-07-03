# 3D Developer Portfolio with Admin Panel

A stunning, interactive 3D developer portfolio featuring a fully functional backend Admin Panel. Built with React, Three.js, Tailwind CSS, and Firebase. This portfolio allows you to manage all your content dynamically without ever touching the code!

## 🔋 Features

👉 **Interactive 3D Elements**: Uses Three.js and React Three Fiber for a captivating 3D experience (Avatar, Stars, Earth, etc.).
👉 **Dynamic Admin Panel**: A secure, beautifully designed admin dashboard located at `/admin` to manage all portfolio data.
👉 **Real-time Updates**: Changes made in the admin panel are instantly reflected on the live site using Firestore real-time listeners.
👉 **Fallback Mechanism**: Automatically falls back to hardcoded data if the Firebase connection is unavailable, ensuring zero downtime.
👉 **Customizable Sections**: Manage your Hero text, About text, Projects, Experiences, Testimonials, Services, and Social Links directly from the UI.
👉 **Responsive Design**: Flawless experience across desktop, tablet, and mobile devices.
👉 **Email Integration**: Integrated with Nodemailer for secure contact form submissions.

## ⚙️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Backend / Database**: Firebase (Auth, Firestore, Storage)
- **API**: Node.js / Serverless API for Email functionality

## 🛠️ Setup & Installation

Follow these steps to set up the project locally.

### 1. Clone & Install
```bash
git clone https://github.com/meetukani34-prog/Portfolio.git
cd Portfolio
npm install
```

### 2. Firebase Configuration
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password) and create an Admin user.
3. Enable **Firestore Database** (Start in Test Mode).
4. Enable **Storage** (Start in Test Mode).
5. Add a Web App to your Firebase project and copy the configuration object.

### 3. Environment Variables
Create a `.env` file in the root directory and add your Firebase and Email configuration:

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Firebase Config
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Seed Initial Data (One-Time)
Start the development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Open the Developer Tools Console (`F12`) and run the following command to push the initial static data to your Firebase database:

```javascript
import('/src/utils/seedFirestore.js').then(m => m.seedAllData())
```

### 5. Access the Admin Panel
Navigate to `http://localhost:5173/admin` and log in using the credentials you created in Step 2. You can now manage all your portfolio content dynamically!

## 🚀 Deployment
This project is optimized for deployment on Vercel. 
Simply connect your GitHub repository to Vercel, and ensure you add all the Environment Variables from your `.env` file into the Vercel Project Settings.

---
*Built with passion by Meet Ukani. Code is poetry, AI is the canvas.*

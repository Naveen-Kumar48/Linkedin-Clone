# Linked Clone - Professional Networking Platform

A full-stack social networking application inspired by LinkedIn, designed to facilitate professional connections, profile management, and interactive content sharing. This project connects users through a robust backend and a responsive, dynamic frontend.

## 🚀 Live Demo
**[Insert Your Live Link Here]**

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture & Flow](#-architecture--flow)
- [🔌 API Endpoints](#-api-endpoints)
- [🚀 Getting Started](#-getting-started)
- [📸 Screenshots](#-screenshots)

---

## 🌐 Project Overview
Linked Clone is a comprehensive web application that replicates core functionalities of professional networking sites. It allows users to create detailed profiles, build a network of connections, share updates via posts (with media support), and interact with others through likes and comments. The platform is built with a focus on a seamless user experience, featuring responsive design for mobile and desktop.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure sign-up and sign-in processes using email and password.
- **Token-Based Auth**: Custom token implementation for maintaining user sessions securely.
- **Password Hashing**: BCrypt is used to hash passwords before storage.

### 👤 User Profile Management
- **Profile Customization**: Users can update their bio, current position, and basic info.
- **Work History**: A dedicated section to add and manage past work experiences.
- **Profile Picture**: Users can upload and update their profile pictures (stored locally).
- **Resume Generation**: Dynamically generate and download a PDF resume based on profile data.

### 🤝 Networking (Connections)
- **Connect with Peers**: Send connection requests to other users.
- **Request Management**: View sent and received connection requests.
- **Accept/Ignore**: Users can accept requests to form a connection or ignore them.
- **My Network**: View a list of all accepted professional connections.

### 📝 Posts & Interactions
- **Create Posts**: Share thoughts and updates with text and optional image uploads.
- **Rich Feed**: A dynamic feed displaying posts from the network and community.
- **Likes**: interactive like system (toggle functionality).
- **Comments**: Engage with posts by adding comments; users can see who commented.
- **Mobile Responsive**: Fully optimized layout for mobile devices, including a dedicated bottom navigation bar.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **State Management**: Redux (for auth and post state)
- **Styling**: CSS Modules (with responsive design interactions)
- **Routing**: Next.js Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **File Handling**: Multer (for image uploads)
- **PDF Generation**: PDFKit
- **Security**: CORS, BCrypt

---

## 🏗 Architecture & Flow

1.  **Auth Flow**:
    - User signs up -> Data saved to MongoDB (User & Profile models).
    - User logs in -> Server verifies credentials -> Returns a session token.
    - Token is stored in `localStorage` on the client and sent with subsequent API requests.

2.  **Profile & Resume**:
    - Profile data is fetched on load.
    - "Download Resume" triggers a backend endpoint that generates a PDF stream using `pdfkit` and sends it to the client.

3.  **Content & Social**:
    - **Posts**: Created with text/media. Images are uploaded to the `uploads/` directory on the server.
    - **Feed**: Fetches all posts, populating user details (name, avatar).
    - **Connections**: A request-response model. Status changes from `pending` to `accepted` upon approval.

---




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.


### Prerequisites
- Node.js installed
    cd linked-clone
    
    
    npm run dev
    

---

## 📸 Screenshots
*(Add screenshots of your Dashboard, Profile, and Login pages here)*

# Linked Clone - Professional Networking Platform

A full-stack social networking application inspired by LinkedIn, designed to facilitate professional connections, profile management, and interactive content sharing. This project connects users through a robust backend and a responsive, dynamic frontend.

## 🚀 Live Demo
(https://prolink-network.vercel.app)

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture & Flow](#-architecture--flow)
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

## 🚀 Getting Started

### Prerequisites
- Node.js installed
    cd linked-clone
    
    
    npm run dev
    

---

## 📸 Screenshots
HomePage Before Login
<img width="1919" height="926" alt="image" src="https://github.com/user-attachments/assets/8f8fad4d-c1cb-4265-8716-39d0622577cc" />
Login/SignupPage
<img width="1901" height="929" alt="image" src="https://github.com/user-attachments/assets/99c07aff-3308-4f3f-905a-96692c1157b8" />
Home page After Login 
<img width="1897" height="932" alt="image" src="https://github.com/user-attachments/assets/1ecb4873-1501-4fb3-8653-318360369bf5" />



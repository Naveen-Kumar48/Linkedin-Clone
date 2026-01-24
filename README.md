# Linked Clone Backend

This is the backend for the Linked Clone application, a social networking platform similar to LinkedIn. It is built using Node.js, Express, and MongoDB.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Flow & Features](#project-flow--features)
  - [Authentication](#authentication)
  - [User Profile Management](#user-profile-management)
  - [Networking (Connections)](#networking-connections)
  - [Posts & Interactions](#posts--interactions)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)

## Project Overview
The backend serves as the core logic handler, managing user data, authentication, social connections, and content creation (posts/comments). It exposes a RESTful API consumed by the frontend.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **File Uploads**: Multer
- **PDF Generation**: PDFKit (for resume generation)
- **Authentication**: Custom Token-based auth
- **Security**: BCrypt (Password hashing), CORS

## Project Flow & Features

### Authentication
1.  **Registration**: Users sign up with name, email, password, and username. This creates a `User` document and an empty `Profile` document.
2.  **Login**: Users authenticate with email and password. Upon success, a random hex token is generated, saved to the user's record, and returned to the client. This token is used for subsequent authenticated requests.

### User Profile Management
-   **Profile Data**: Users can update their bio, work experience, and educational details.
-   **Profile Picture**: Users can upload a profile picture which is stored locally in the `uploads/` directory.
-   **Resume Download**: The system can dynamically generate a PDF resume based on the user's profile data using `pdfkit`.

### Networking (Connections)
The platform allows users to build a professional network:
1.  **Send Request**: A user sends a connection request to another user.
2.  **Manage Requests**: Users can view incoming connection requests.
3.  **Accept/Ignore**: Users can accept requests (setting `status_accepted: true`) or ignore them.
4.  **View Network**: Users can view their list of connected peers.

### Posts & Interactions
-   **Create Post**: Users can create posts with text and optional media attachments.
-   **Feed**: A stream of posts is available for users to view.
-   **Interactions**:
    -   **Likes**: Users can like posts.
    -   **Comments**: Users can comment on posts and delete their comments.

## API Endpoints

### User Routes
-   `POST /register` - Register a new user
-   `POST /login` - Login user
-   `GET /user/get_allusers` - Get all user profiles
-   `GET /getuser_profile` - Get a specific user's profile
-   `POST /userupdate` - Update user basic info (username/email)
-   `POST /updateprofile_data` - Update extended profile info (bio, work, etc.)
-   `POST /uploadprofilepic` - Upload profile picture
-   `GET /user/download_resume` - Download user profile as PDF

### Connection Routes
-   `POST /user/send_connection_request` - Send a connection request
-   `GET /user/getConnectionRequest` - Get sent requests
-   `GET /user/user_connection_request` - Get received requests
-   `POST /user/accept_connection_request` - Accept or reject a request

### Post Routes
-   `POST /post` - Create a new post
-   `GET /posts` - Get all posts
-   `DELETE /delete_post` - Delete a post
-   `POST /increment_post_likes` - Like a post
-   `POST /comment` - Add a comment
-   `GET /get_comments` - Get comments for a post
-   `DELETE /delete_comment` - Delete a comment

## Usage

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Server**:
    ```bash
    npm start
    # or
    node server.js
    ```

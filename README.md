# Docify - Document Sharing Platform

Docify is a comprehensive document sharing platform, including web and mobile applications, allowing users to upload, view, and comment on documents such as PDF and DOC files.

## Key Features

### Web Application (Client)
- **Home Page**: Displays list of documents with search and filtering.
- **Login/Register**: User authentication.
- **Upload Documents**: Upload files up to 5MB (PDF, DOC).
- **Document Details**: View documents, comments, and ratings.
- **Admin Panel**: Dashboard for admins to manage documents and comments.
- **Contact**: Contact page.

### Mobile Application (Mobile)
- **Login**: User authentication.
- **Home**: List of documents.
- **Details**: View and comment on documents.

### Server (Backend)
- RESTful API for all functionalities.
- User, document, and comment management.
- File upload with Multer.
- MongoDB database.

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, Multer
- **Frontend Web**: React, Vite, React Router
- **Mobile**: React Native, Expo
- **Authentication**: Local storage (web), AsyncStorage (mobile)
- **Database**: MongoDB

## Prerequisites

See [requirements.md](requirements.md) for detailed system requirements and software dependencies.

## Installation and Running

### 1. Clone Repository
```bash
git clone https://github.com/HienVuu/Data_sharing_web.git
cd data_sharing
```

### 2. Install Dependencies for Each Part

#### Server
```bash
cd server
npm install
```

#### Client (Web)
```bash
cd ../client
npm install
```

#### Mobile
```bash
cd ../mobile
npm install
```

### 3. Run MongoDB
Ensure MongoDB is running on `mongodb://127.0.0.1:27017/docshare_db`

### 4. Run Applications

#### Server
```bash
cd server
npm run dev  # or npm start
```
Server will run on http://localhost:3000

#### Client (Web)
```bash
cd client
npm run dev
```
Web app will run on http://localhost:5173

#### Mobile
```bash
cd mobile
npm start
```
Then select platform (iOS, Android, Web) to run.

### 5. Access
- Web: http://localhost:5173
- API: http://localhost:3000
- Mobile: Follow Expo instructions

## Project Structure

```
data_sharing/
├── client/          # React web application
├── mobile/          # React Native mobile application
├── server/          # Node.js backend server
├── .gitignore       # Git ignore file
├── README.md        # This documentation
└── requirements.md  # System requirements and dependencies
```

## API Endpoints

### Authentication
- `POST /api/login` - Login
- `POST /api/register` - Register

### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents` - Get list
- `GET /api/documents/:id` - Document details

### Comments
- `POST /api/comments` - Add comment
- `GET /api/comments/:documentId` - Get comments

### Admin
- `GET /api/admin/stats` - Statistics
- `GET /api/admin/comments` - All comments
- `DELETE /api/admin/comments/:id` - Delete comment
- `DELETE /api/admin/documents/:id` - Delete document
- `PUT /api/admin/documents/:id` - Update document

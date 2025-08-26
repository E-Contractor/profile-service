# 🏗️ E-Contractor Profile Service

A microservice for managing client and contractor profiles in the **E-Contractor** platform. Built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## 📦 Tech Stack

* **TypeScript**
* **Express.js**
* **MongoDB / Mongoose**
* **JWT (JSON Web Tokens)** for authentication
* **ts-node-dev** for hot reloading
* **ESLint & Prettier** for code linting and formatting
* **CORS** middleware
* **dotenv** for environment configuration

---

## 🎯 Features

### **Profile Management**
- ✅ **Client Profiles**: Create, read, update client information
- ✅ **Contractor Profiles**: Manage contractor details, licenses, specialties, and trades
- ✅ **Profile Completion Tracking**: Calculate and track profile completion percentages
- ✅ **User Status Management**: Handle user verification status updates

### **Search & Discovery**
- 🔍 **Public Contractor Search**: Filter by location, specialty, trade, ratings
- 📊 **Advanced Filtering**: Search by general projects, trade projects, sub-specialties
- 📋 **Pagination Support**: Efficient data retrieval with pagination

### **Authentication & Security**
- 🔐 **JWT Authentication**: Secure user authentication middleware
- 🛡️ **Service-to-Service Auth**: Internal service communication security
- ✅ **License Validation**: Ensure unique contractor license numbers

---

## 📁 Folder Structure

```
├── src
│   ├── clients       # Service communication clients
│   ├── config        # MongoDB connection and environment setup
│   ├── controllers   # Route controllers (profile, search, completion)
│   ├── middleware    # Authentication middleware
│   ├── models        # Mongoose schemas (Client, Contractor)
│   ├── routes        # Express routes
│   ├── service       # Business logic services
│   ├── types         # TypeScript type definitions
│   └── index.ts      # App entry point
├── .env              # Environment variables
├── .eslintrc.json    # ESLint config
├── .prettierrc       # Prettier config
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

* Node.js ≥ 18
* npm
* MongoDB instance (local or cloud)

### Installation

```bash
cd profile-service
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/e-contractor
JWT_ACCESS_SECRET=your_jwt_access_secret
SERVICE_AUTH_SECRET=your_service_auth_secret
NODE_ENV=development
LOG_FILE_PATH=./logs/profile-service.log
```

### Run in Development

```bash
npm run dev
```

---

## 🔗 API Endpoints

### **Service-to-Service Endpoints**
```http
POST   /api/profiles/client           # Create client profile
POST   /api/profiles/contractor       # Create contractor profile
GET    /api/profiles/:userId/:role    # Get profile by user ID and role
PUT    /api/profiles/status/:userId   # Update user status
GET    /api/profiles/completion/:userId/:role  # Get profile completion
```

### **Authenticated User Endpoints**
```http
GET    /api/profiles/me/client        # Get my client profile
GET    /api/profiles/me/contractor    # Get my contractor profile
PUT    /api/profiles/me/client        # Update my client profile
PUT    /api/profiles/me/contractor    # Update my contractor profile
GET    /api/profiles/completion/client     # Get my client completion
GET    /api/profiles/completion/contractor # Get my contractor completion
```

### **Public Endpoints**
```http
GET    /api/contractors/search        # Search contractors
GET    /api/contractors/:contractorId # Get public contractor profile
```

---

## 🔍 Search Parameters

The contractor search endpoint supports these query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `general` | string[] | General project types |
| `trade` | string[] | Trade specializations |
| `specialty` | string[] | Specific specialties |
| `subSpecialty` | string[] | Sub-specialty categories |
| `city` | string | City location filter |
| `province` | string | Province location filter |
| `role` | string[] | Contractor role (general, trade, both) |
| `search` | string | Text search in name/description |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10, max: 50) |

---

## 🧾 Example Requests

### Create Contractor Profile
```http
POST /api/profiles/contractor
Content-Type: application/json
x-service-auth: your_service_secret

{
  "userId": "user_id_here",
  "companyName": "ABC Construction",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Search Contractors
```http
GET /api/contractors/search?trade=plumbing&city=Toronto&page=1&limit=20
```

---

## 🚀 Microservice Architecture

This service is part of the E-Contractor platform and communicates with:

- **Auth Service**: User authentication and validation
- **Other Services**: Via service-to-service authentication

---

## 📝 License

This project is part of the E-Contractor platform.
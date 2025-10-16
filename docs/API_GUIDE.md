# API Guide - EVS-LC Backend

**Version:** 1.0.0  
**Base URL:** `http://localhost:4000` (development)  
**Documentation:** `http://localhost:4000/api/docs` (Swagger UI)

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Examples](#examples)

## Getting Started

### Base Configuration

All API requests should be sent to:
```
Development: http://localhost:4000
Production: https://api.yourdomain.com
```

### Request Format

- **Content-Type**: `application/json`
- **Accept**: `application/json`
- **Authorization**: `Bearer <access_token>` (for protected routes)

### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "timestamp": "2025-10-16T14:45:27.867Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  },
  "timestamp": "2025-10-16T14:45:27.867Z"
}
```

## Authentication

### Register New User

**POST** `/auth/register`

Request:
```json
{
  "username": "player123",
  "email": "player@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "player123",
      "email": "player@example.com",
      "role": "player"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login

**POST** `/auth/login`

Request:
```json
{
  "username": "player123",
  "password": "SecurePass123!"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "player123",
      "email": "player@example.com",
      "role": "player",
      "totpEnabled": false
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login with 2FA

If user has 2FA enabled, first request returns:
```json
{
  "success": false,
  "requireTotp": true,
  "tempToken": "temp_token_here"
}
```

Then verify with:

**POST** `/auth/totp/verify`

Request:
```json
{
  "tempToken": "temp_token_here",
  "code": "123456"
}
```

### Setup 2FA

**POST** `/auth/totp/setup`

Request:
```json
{
  "userId": "uuid"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,iVBORw0KGgo...",
    "backupCodes": [
      "12345678",
      "87654321",
      ...
    ]
  }
}
```

### Refresh Token

**POST** `/auth/refresh`

Request:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## API Endpoints

### Users

#### Get Current User
**GET** `/users/me`  
**Auth**: Required

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "player123",
    "email": "player@example.com",
    "role": "player",
    "cashBalance": 1000,
    "totpEnabled": false,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Update User Profile
**PATCH** `/users/me`  
**Auth**: Required

Request:
```json
{
  "email": "newemail@example.com",
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

### Game Integration

#### Create Game Account
**POST** `/game/account/create`  
**Auth**: Required

Request:
```json
{
  "accountName": "gameaccount123",
  "password": "GamePass123!"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accountId": 12345,
    "accountName": "gameaccount123",
    "created": true
  }
}
```

#### Grant Cash (Admin Only)
**POST** `/game/cash/grant`  
**Auth**: Required (Admin role)

Request:
```json
{
  "userId": "uuid",
  "amount": 1000,
  "reason": "Promotional reward"
}
```

#### Get Characters
**GET** `/game/characters`  
**Auth**: Required

Query Parameters:
- `search`: Search by name
- `level`: Filter by level
- `class`: Filter by class
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

Response:
```json
{
  "success": true,
  "data": {
    "characters": [
      {
        "id": 1,
        "name": "CharName",
        "level": 99,
        "class": "Titan",
        "guild": "GuildName"
      }
    ],
    "total": 1000,
    "page": 1,
    "limit": 50
  }
}
```

#### Get Guilds
**GET** `/game/guilds`  
**Auth**: Required

#### Get Rankings
**GET** `/game/rankings/level`  
**Auth**: Required

Query Parameters:
- `limit`: Number of results (default: 100, max: 100)

### News

#### Get News Articles
**GET** `/news`  
**Auth**: Optional

Query Parameters:
- `category`: Filter by category
- `page`: Page number
- `limit`: Items per page

Response:
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "uuid",
        "title": "Server Update",
        "content": "...",
        "category": "update",
        "author": "admin",
        "publishedAt": "2025-10-16T00:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

#### Get Single Article
**GET** `/news/:id`  
**Auth**: Optional

### Support Tickets

#### Create Ticket
**POST** `/tickets`  
**Auth**: Required

Request:
```json
{
  "subject": "Login Issue",
  "message": "Cannot login to my account",
  "priority": "medium",
  "category": "account"
}
```

#### Get My Tickets
**GET** `/tickets`  
**Auth**: Required

Query Parameters:
- `status`: Filter by status (open, closed, resolved)
- `page`: Page number
- `limit`: Items per page

### Payments

#### Get Payment History
**GET** `/payments`  
**Auth**: Required

Query Parameters:
- `status`: Filter by status
- `from`: Start date (ISO 8601)
- `to`: End date (ISO 8601)
- `page`: Page number
- `limit`: Items per page

### Redeem Codes

#### Claim Code
**POST** `/redeem/claim`  
**Auth**: Required

Request:
```json
{
  "code": "PROMO2025"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "reward": {
      "type": "cash",
      "amount": 500
    },
    "message": "Code redeemed successfully"
  }
}
```

### Votes

#### Get Vote Sites
**GET** `/votes`  
**Auth**: Required

Response:
```json
{
  "success": true,
  "data": {
    "sites": [
      {
        "id": "uuid",
        "name": "TopMMO",
        "url": "https://topmmo.com/vote/...",
        "reward": 100,
        "cooldown": 86400,
        "lastVoted": "2025-10-15T14:45:27.867Z",
        "canVote": true
      }
    ]
  }
}
```

#### Register Vote
**POST** `/votes`  
**Auth**: Required

Request:
```json
{
  "siteId": "uuid"
}
```

### Health & Monitoring

#### Health Check
**GET** `/health`  
**Auth**: None

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-16T14:45:27.867Z",
  "uptime": 12345,
  "database": {
    "portal": "connected",
    "game": "connected"
  }
}
```

#### Readiness Check
**GET** `/health/ready`  
**Auth**: None

#### Version Info
**GET** `/health/version`  
**Auth**: None

Response:
```json
{
  "version": "1.0.0",
  "environment": "production",
  "node": "20.19.5"
}
```

## Error Handling

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `DUPLICATE_ERROR` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "password": "Password must be at least 8 characters"
    }
  },
  "timestamp": "2025-10-16T14:45:27.867Z"
}
```

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Authentication**: 10 login attempts per 15 minutes
- **Headers**: Rate limit info in response headers

Response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1697457927
```

## Examples

### Complete Authentication Flow (JavaScript)

```javascript
// 1. Register
const registerResponse = await fetch('http://localhost:4000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'player123',
    email: 'player@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  })
});

const { data: { access_token, refresh_token } } = await registerResponse.json();

// 2. Make authenticated request
const userResponse = await fetch('http://localhost:4000/users/me', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  }
});

const userData = await userResponse.json();

// 3. Refresh token when expired
const refreshResponse = await fetch('http://localhost:4000/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh_token })
});

const { data: { access_token: newAccessToken } } = await refreshResponse.json();
```

### Using Axios with Interceptors

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - add token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(
          'http://localhost:4000/auth/refresh',
          { refresh_token: refreshToken }
        );
        
        localStorage.setItem('access_token', data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Usage
const user = await api.get('/users/me');
const tickets = await api.get('/tickets?status=open');
```

---

**For interactive API documentation, visit the Swagger UI at `/api/docs` when the API is running.**

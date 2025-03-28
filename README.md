# News Aggregator API

## Overview

The News Aggregator API is a backend service built with Node.js and Express.js. It allows users to sign up, log in, set preferences, and fetch personalized news based on their preferences. The API also supports caching using Redis for improved performance.

## Features

- User authentication (signup and login).
- Fetch news based on user preferences.
- Fetch news by keywords.
- Caching with Redis for faster responses.
- Secure routes with JWT-based authentication.

## Prerequisites

- **Node.js v18+** ([Download Node.js](https://nodejs.org/))
- **Redis** ([Download Redis](https://redis.io/))

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/news-aggregator-api.git
cd news-aggregator-api-kunal2899
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
JWT_SECRET='your_jwt_secret'
NEWS_API_URL=https://newsapi.org/v2
NEWS_API_KEY=your_news_api_key
```

Replace `your_jwt_secret` and `your_news_api_key` with your own values.

### 4. Start Redis Server

Ensure Redis is running on your system. You can start Redis with:

```bash
redis-server
```

### 5. Start the Server

Run the server in development mode:

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

### 6. Run Tests

To run the test suite, use:

```bash
npm test
```

---

## API Endpoints

### 1. **User Routes**

#### **POST /v1/users/signup**

- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Response**:
  - **200 OK**: User registered successfully.
  - **400 Bad Request**: Invalid payload or user already exists.

#### **POST /v1/users/login**

- **Description**: Log in and receive a JWT token.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Response**:
  - **200 OK**: Returns a JWT token.
  - **401 Unauthorized**: Invalid credentials.

#### **GET /v1/users/preferences**

- **Description**: Fetch user preferences (requires authentication).
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response**:
  - **200 OK**: Returns user preferences.
  - **401 Unauthorized**: Missing or invalid token.

#### **PUT /v1/users/preferences**

- **Description**: Update user preferences (requires authentication).
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Request Body**:
  ```json
  {
    "preferences": ["movies", "sports"]
  }
  ```
- **Response**:
  - **200 OK**: Preferences updated successfully.
  - **400 Bad Request**: Invalid payload.

---

### 2. **News Routes**

#### **GET /v1/news**

- **Description**: Fetch news based on user preferences (requires authentication).
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response**:
  - **200 OK**: Returns news articles.
  - **401 Unauthorized**: Missing or invalid token.

#### **GET /v1/news/search**

- **Description**: Fetch news based on keywords (requires authentication).
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Query Parameters**:
  - `keywords`: Comma-separated list of keywords (e.g., `movies,sports`).
- **Response**:
  - **200 OK**: Returns news articles.
  - **400 Bad Request**: Missing or invalid query parameters.

---

## Project Structure

```
news-aggregator-api-kunal2899/
├── app.js                 # Entry point of the application
├── routes/                # API route definitions
├── controllers/           # Route handler logic
├── middlewares/           # Middleware functions
├── services/              # External service integrations (e.g., Redis, News API)
├── db/                    # Database logic and JSON files
├── utils/                 # Utility functions
├── test/                  # Test cases
├── .env                   # Environment variables
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```
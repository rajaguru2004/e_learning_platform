# Node.js Backend with Express, Prisma & PostgreSQL

This project is a production-ready Node.js backend using Express, PostgreSQL, Prisma ORM, and JWT authentication.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Prerequisites
- Node.js (Latest LTS)
- PostgreSQL Database

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and update the values:
    ```bash
    cp .env.example .env
    ```
    Update `DATABASE_URL` in `.env` with your PostgreSQL connection string.

3.  **Database Migration**
    Run the migration to create table in your database:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Run Application**
    - Development (with nodemon):
      ```bash
      npm run dev
      ```
    - Production:
      ```bash
      npm start
      ```

## Project Structure
```
backend/
 └── src/
     ├── Controllers/   # Request handlers
     ├── Services/      # Business logic
     ├── Routes/        # Route definitions
     ├── Middlewares/   # Custom middlewares (Auth)
     ├── Utils/         # Utility functions (Response)
     ├── Prisma/        # Prisma client instance
     └── app.js         # Entry point
```

## Scripts
- `npm start`: Runs the server (node src/app.js)
- `npm run dev`: Runs the server in watch mode (nodemon src/app.js)

## API Endpoints

### Authentication

#### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secretpassword",
    "role": "USER"
  }
  ```

#### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "secretpassword"
  }
  ```

## Testing with Curl

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name": "Test User", "email": "test@example.com", "password": "password123", "role": "USER"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "password123"}'
```

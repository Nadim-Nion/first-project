# First Project with TypeScript, Mongoose, and Express.js

This is my first project built using **TypeScript**, **Mongoose**, and **Express.js**. The project is a basic backend application that allows you to perform CRUD operations on student data. It implements a **modular design pattern** to keep the codebase clean and organized.

---

## Features

- Retrieve all students.
- Retrieve a specific student by ID.
- Add new student data.

---

## Technologies Used

- **TypeScript**: For strong typing and improved development experience.
- **Mongoose**: For seamless interaction with MongoDB.
- **Express.js**: For building a fast and robust backend API.

---

## Tools Used

- **Postman**: For API testing.
- **MongoDB Atlas**: For cloud database storage.
- **MongoDB Compass**: For local database exploration and management.

---

## API Endpoints

| Method | Endpoint                          | Description                 |
| ------ | --------------------------------- | --------------------------- |
| GET    | `/api/v1/students/`               | Get all student data        |
| GET    | `/api/v1/students/:studentId`     | Get specific student by ID  |
| POST   | `/api/v1/students/create-student` | Create a new student record |

---

## Modular Design

This project follows a **modular design pattern** to enhance maintainability and scalability. Each module handles specific functionality, making it easier to debug and add features in the future.

---

## Installation and Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/first-project-typescript-mongoose-express.git
   ```
2. Navigate to the project directory:
   ```bash
   cd first-project-typescript-mongoose-express
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables in a `.env` file:
   ```
   PORT=5000
   DATABASE_URL=<your-mongodb-atlas-uri>
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

---

## Folder Structure

```
src/
│
├── controllers/       # Handles business logic
├── models/            # Mongoose schemas
├── routes/            # API routes
├── utils/             # Utility functions
├── config/            # Configuration files (e.g., database)
├── middlewares/       # Middleware functions
├── app.ts             # Main Express application
├── server.ts          # Server entry point
```

---

## How to Test

1. Use **Postman** or any API client to test the endpoints.
2. Ensure MongoDB Atlas or Compass is connected for data storage.

---

## About Me

Hi, I am Nadim Mahmud Nion. I have recently concluded my graduation from the department of Computer Science and Engineering (CSE) at the Daffodil International University (DIU). I have been learning MERN Stack Web Development since 2022. I am expertise in the following skills:

- React

- Express.js

- TypeScript

- Mongoose

- Postman

- MongoDB Compass

- NoSQLBooster

- Node.js

- MongoDB Atlas

- JWT

- Stripe

- Vite

- React Router

- Firebase (Authentication & Hosting)

- Vercel

- JavaScript

- Advanced JavaScript

- Daisy UI

- Bootstrap

- Tailwind

- HTML5

- CSS3

- Media Query

I have built multiple projects using these skills. You are invited to my GitHub profile to know about my projects and don't forget to give a star to my projects.

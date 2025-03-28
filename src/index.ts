import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public-html')));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to User Management API",
    endpoints: {
      users: {
        create: "POST /api/users",
        list: "GET /api/users",
        getById: "GET /api/users/:id",
        update: "PUT /api/users/:id",
        delete: "DELETE /api/users/:id"
      }
    }
  });
});

// Routes
app.use("/api/users", userRoutes);

// Connect to database and start server
AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
      console.log("Open http://localhost:3000/index.html to use the form");
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  }); 
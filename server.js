// server.js
import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database!");
});

// ✅ Route for login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password); // debug

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("Database query error:", err); // this shows the real error
            return res.status(500).json({ message: "Server error", error: err });
        }

        console.log("Query result:", result); // debug

        if (result.length > 0) {
            res.status(200).json({ message: "Login successful", user: result[0] });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    });
});

// ✅ Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
console.log("Received login:", email, password);

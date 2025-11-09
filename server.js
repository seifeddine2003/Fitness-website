import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

let pool;

async function initDatabase() {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const connection = await pool.getConnection();
        console.log("✅ Connected to MySQL database!");

        const [autocommitStatus] = await connection.query("SELECT @@autocommit");
        console.log("📊 Autocommit status:", autocommitStatus);

        const [testResult] = await connection.query("SELECT 1 + 1 AS result");
        console.log("Test query result:", testResult);

        const [dbResult] = await connection.query("SELECT DATABASE() as db");
        console.log("🗄️ Current database:", dbResult[0].db);

        connection.release();
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
}

await initDatabase();

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    try {
        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        const [result] = await pool.query(sql, [email, password]);

        console.log("Query result count:", result.length);

        if (result.length > 0) {
            res.status(200).json({ message: "Login successful", user: result[0] });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("❌ Database query error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.post("/register", async (req, res) => {
    console.log("Incoming register data:", req.body);

    let {
        email, password, firstName, lastName, age, weight, height, phone, goalWeight, activityLevel
    } = req.body;

    age = Number(age);
    weight = Number(weight);
    height = Number(height);
    goalWeight = Number(goalWeight);

    console.log("📝 Processing registration for:", email);

    if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !age ||
        !weight ||
        !height ||
        !goalWeight ||
        !activityLevel
    ) {
        return res.status(400).json({ message: "Please fill in all required fields" });
    }

    try {
        const [existingUsers] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const sql = `
            INSERT INTO users
            (email, password, firstName, lastName, age, weight, height, phone, goalWeight, activityLevel)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [insertResult] = await pool.query(sql, [
            email, password, firstName, lastName, age, weight, height, phone, goalWeight, activityLevel
        ]);

        console.log("📊 Insert result:", insertResult);

        const [verifyResult] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: verifyResult[0]
        });

    } catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ message: "Failed to register user", error: err.message });
    }
});

app.get('/', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM users');
        res.json(results);
    } catch (err) {
        console.error('❌ Error fetching users:', err);
        res.status(500).json({ message: 'Database error', error: err.message });
    }
});

app.get('/status', (req, res) => {
    res.send('Server is running ✅');
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

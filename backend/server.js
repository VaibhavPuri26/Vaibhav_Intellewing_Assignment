require("dotenv").config(); 
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("working");
  return res.status(200).send("Server is up and running!");
});


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();
module.exports = db;


db.query("SELECT 1")
  .then(() => console.log("Database connected successfully"))
  .catch(console.error);

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
 
    const [results] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }


    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid Token" });
  }
};

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "You have access to this protected route", user: req.user });
});


const contactRoutes = require("./routes/contacts");
app.use("/api/contacts", contactRoutes);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

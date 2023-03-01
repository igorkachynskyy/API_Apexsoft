const os = require("os");
const { Pool } = require("pg");
const express = require("express");
const argon2 = require("argon2");
const crypto = require("crypto");
const app = express();
const body_parser = require("body-parser");
const IV = "5183666c72eec9e4";
const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b";
const pool = new Pool({
  user: "igork",
  password: "qwery3333",
  host: "localhost",
  database: "igork",
  port: 5432,
});
app.use(body_parser.json());
app.get("/api/v1/health", (req, res) => {
  res.status(200).send(JSON.stringify({ freeMemory: os.freemem() }));
});
app.post("/api/v1/auth/sign-up", (req, res) => {
  const hashed = argon2.hash(String(req.body.password));
  let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
  let encrypted = cipher.update(String(hashed), "utf8", "base64");
  encrypted += cipher.final("base64");
  try {
    pool.query(
      `insert into users(name_, password_, email, is_deleted) values('${req.name}', '${encrypted}', '${req.email}', false)`
    );
    return res.status(200).send(JSON.stringify(req.body));
  } catch {
    return res.status(401).send(JSON.stringify({ message: "Error" }));
  }
});
app.listen(3000);

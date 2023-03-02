const os = require('os')
const { Pool } = require('pg')
const express = require('express')
const argon2 = require('argon2')
const crypto = require('crypto')
const app = express()
const bodyParser = require('body-parser')
const IV = '5183666c72eec9e4'
const ENC_KEY = 'bf3c199c2470cb477d907b1e0917c17b'
require('dotenv').config()
console.log(process.env.USER + ' ' + process.env.PASSWORD)
const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: process.env.PORT
})
app.use(bodyParser.json())
app.get('/api/v1/health', async (req, res) => {
  res.status(200).send(await JSON.stringify({ freeMemory: os.freemem() }))
})
app.post('/api/v1/auth/sign-up', async (req, res) => {
  const hashed = argon2.hash(String(req.body.password))
  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV)
  let encrypted = cipher.update(String(hashed), 'utf8', 'base64')
  encrypted += cipher.final('base64')
  console.log(req.body.name)
  // try {
  await pool.query(
      `insert into users(name_, password_, email, is_deleted) values('${req.body.name}', '${encrypted}', '${req.body.email}', false)`
  )
  return res.status(200).send(await JSON.stringify(req.body))
  // } catch {
  //   return res.status(401).send(await JSON.stringify({ message: 'Error' }))
  // }
})
app.listen(3000)

const os = require("os");
const express = require("express");
const app = express();
const body_parser = require("body-parser");
app.use(body_parser.json());
app.get("/api/v1/health", (req, res) => {
  res.status(200).send(JSON.stringify({ freeMemory: os.freemem() }));
});
app.listen(3000);

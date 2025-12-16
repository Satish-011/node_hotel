const express = require("express");
const app = express();
const port = 8000;

// DB connection
const database = require("./db");

// Middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// routes
const personRoutes = require("./routes/Personroutes");
const Menuroutes = require("./routes/menuroutes");

// use the routes
app.use("/person", personRoutes);
app.use("/menu", Menuroutes);

app.listen(port, () => {
  console.log("server started!!!");
});

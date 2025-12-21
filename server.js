//express
const express = require("express");
const app = express();

//Dot env file
require("dotenv").config();

// DB connection
const database = require("./db");

// Middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//authentication'
const passport = require("./auth");
app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate("local", { session: false });

//Middleware Functions
const LogRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] Request Made to:${req.originalUrl}`
  );
  next(); // Move on the next phase
};
app.use(LogRequest);

// routes
const personRoutes = require("./routes/Personroutes");
const Menuroutes = require("./routes/menuroutes");

// use the routes
app.use("/person", localAuthMiddleware, personRoutes);
app.use("/menu", Menuroutes);

app.get("/", (req, res) => {
  res.send("welcome!!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server started!!!");
});

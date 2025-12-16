const mongoose = require("mongoose");

// define the mongodb connection
const mongoURL = "mongodb://localhost:27017/myDatabase";

// connect to mongodb
mongoose.connect(mongoURL);

// get the default connection
// mongoose maintains a default connection object
const db = mongoose.connection;

// define event listeners for database connection

// when mongodb is connected
db.on("connected", () => {
  console.log("MongoDB connected successfully");
});

// when there is any connection error
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// when mongodb server is stopped / disconnected
db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// export the database connection
module.exports = {
  db,
};

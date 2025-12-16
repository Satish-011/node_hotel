const mongoose = require("mongoose");

// Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // mltb name chahiye hi chahiye
  },
  age: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    enum: ["Chef", "Manager", "Waiter"], // allowed values
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
  },
});

// create person model
const Person = mongoose.model("Person", personSchema);

module.exports = Person;

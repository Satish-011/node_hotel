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
    enum: ["chef", "manager", "waiter"], // allowed values
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
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});
//password checking
personSchema.methods.comparePassword = async function (candidatePassword) {
  return this.password === candidatePassword;
};

// create person model
const Person = mongoose.models.Person || mongoose.model("Person", personSchema);

module.exports = Person;

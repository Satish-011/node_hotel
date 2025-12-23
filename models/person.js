const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  work: {
    type: String,
    enum: ["chef", "waiter", "manager"],
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  salary: {
    type: Number,
    required: true,
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

//bcrypting password
// This middleware runs BEFORE saving a person document
personSchema.pre("save", async function () {

  // 'this' refers to the current document being saved
  const person = this;

  // If password is NOT modified (e.g. updating name/email),
  // then skip hashing and continue saving
  if (!person.isModified("password")) return;

  // Generate salt for hashing (10 rounds is standard)
  const salt = await bcrypt.genSalt(10);

  // Hash the plain text password using the generated salt
  const hashedPassword = await bcrypt.hash(person.password, salt);

  // Replace plain password with hashed password
  person.password = hashedPassword;
});


//password verification
personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

// Create Person model
const Person = mongoose.model("Person", personSchema);
module.exports = Person;

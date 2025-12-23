const express = require("express");
const router = express.Router();

//jwtauth
const { jwtAuthMiddleware, generateToken } = require("../jwt");

//model
const Person = require("../models/person");

//signup
router.post("/signup", async (req, res) => {
  try {
    const newPerson = new Person(req.body);
    const savedPerson = await newPerson.save();

    //payload taking
    const payload = {
      id: savedPerson.id,
      user: savedPerson.username,
    };
    //payload printing
    console.log(JSON.stringify(payload));

    //token generation
    const token = generateToken(payload);
    console.log("Token is : ", token);

    res.status(200).json({
      response: savedPerson,
      token: token,
    });
  } catch (err) {
    console.log("🔥 REAL ERROR:", err);
    res.status(500).json({
      message: err.message,
      code: err.code,
      keyValue: err.keyValue,
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;

    // Find the user by username
    const user = await Person.findOne({ username: username });

    // If user does not exist or password does not match, return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    //generate token
    //step 1 payload
    //step 2 generation token

    const payload = {
      id: user.id,
      username: user.username,
    };

    const token = generateToken(payload);

    //return response as token
    res.status(201).json({ msg: "success", token: token });
  } catch (err) {
    res.status(500).send("server issues");
  }
});

//read
router.get("/", async (req, res) => {
  try {
    const data = await Person.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log("User Data: ", userData);

    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Parametirised Api
router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType; // Extract the work type from the URL parameter

    if (workType == "Chef" || workType == "manager" || workType == "waiter") {
      const response = await Person.find({ work: workType });
      console.log("response fetched");
      res.status(200).send(response);
    } else {
      res.status(404).json({ error: "Invalid work type" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//update
router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id; // Extract the id from the URL parameter
    const updatedPersonData = req.body; // Updated data for the person

    const savedData = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true, // Return the updated document into response
        runValidators: true, // Run Mongoose validation
      }
    );
    // agar person galat id daal tha aur savedData hua hi nahi mltb usme galat daal diya so mltb person exist hi nahi karta hai
    if (!savedData) {
      return res.status(404).json({ error: "Person not found" });
    }
    console.log("data updated");
    res.status(200).json({ msg: "sucess", savedData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id;

    const response = await Person.findByIdAndDelete(personId);
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
    console.log("data deleted");
    res.status(200).json({ msg: "deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server issues");
  }
});

module.exports = router;

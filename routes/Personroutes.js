const express = require("express");
const router = express.Router();

//model
const Person = require("../models/person");

//create
router.post("/", async (req, res) => {
  try {
    const newPerson = new Person(req.body);
    const savedPerson = await newPerson.save();

    res.status(201).json({
      msg: "success",
      data: savedPerson,
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

//read
router.get("/", async (req, res) => {
  try {
    const data = await Person.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
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

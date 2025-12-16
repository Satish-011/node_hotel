const express = require("express");
const router = express.Router();

// Models
const Menu = require("../models/menu");

router.post("/", async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    const savedMenu = await newMenu.save();

    res.status(201).json({
      msg: "success",
      data: savedMenu,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Menu.find();
    res.json(data);
  } catch (err) {
    res.status(500).json("error occured");
  }
});

router.get("/:taste", async (req, res) => {
  try {
    const taste = req.params.taste;
    if (taste == "sweet" || taste == "sour" || taste == "spicy") {
      const data = await Menu.find({ taste: taste });
      console.log("data fetched");
      res.json(data);
    } else {
      res.send("no match");
    }
  } catch (err) {
    res.status(500).json("error occured");
  }
});

module.exports = router;

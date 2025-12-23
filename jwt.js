const { json } = require("express");
const jwt = require("jsonwebtoken");

//function for cheking token
const jwtAuthMiddleware = (req, res, next) => {
  // first check request headers has authorization or not
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "token not found" });

  //Extract the jwt token from the request headers
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "unauthorised" });
  try {
    //verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //attach user information to request object
    req.user = decoded;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

//function for generating token
const generateToken = (userdata) => {
  //Generate a new token using userdata
  return jwt.sign(userdata, process.env.JWT_SECRET_KEY, { expiresIn: 3000 });
};

module.exports = { jwtAuthMiddleware, generateToken };

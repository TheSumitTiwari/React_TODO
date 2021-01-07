const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("config");
const bcrypt = require("bcryptjs");
const passportConf = require("../../middleware/passport");
const passportJWT = passport.authenticate("jwt", { session: false });
const passportLocal = passport.authenticate("local", { session: false });
const { check, validationResult } = require("express-validator/check");
const unirest = require("unirest");
const User = require("../../models/Users");


router.get("/", (req, res) => res.send("Auth Route"));

// Login route-----------------------------------------------------------------------------------
router.post(
    "/login",
  
    // For Input Validation with express validator(middleware)
    [
      check("email", "Please include a valid email").isEmail(),
      check("password", "Password is required").not().isEmpty(),
    ],
    // For PassportLocal User Validation(middleware)
    passportLocal,
    // Login logics
    async (req, res) => {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        // JWT token generation Process
        console.log(req.user.fname);
        //creating payload for jsonwebtoken
        const payload = {
          user: {
            id: req.user.id,
          },
        };
  
        //  Token Generation
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({ token }); // Return jsonwebtoken
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: "server error" }] });
      }
    }
  );

// after login for user-------------------------------
router.get("/secret", passportJWT, (req, res) => {
    console.log(req.user);
    res.json(req.user);
  });


// SignUp for users  
router.post(
  "/register",
  // For Input Validation with express validator
  [
    check("fname", "First Name is required").not().isEmpty(),
    check("lname", "Last Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);

    const { fname, lname, email, password} = req.body;

    try {
      // See if user exists
      let prevuser = await User.findOne({ email });
    
      if (prevuser) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      } 
      else {
        //registering new unverivied user
        const user = new User({
          fname,
          lname,
          email,
          password,
        });
        // Encrypt password and saving user in database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.save((err, module) => {
            if(err){
              res.status(500).json({ errors: [{ msg: err.message }] });
            }else{
              res.status(200).json(`User Registered succesfully`);
            }
          });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "server error" }] });
    }
  }
);

module.exports = router;
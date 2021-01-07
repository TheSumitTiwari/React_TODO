const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { ExtractJwt } = require("passport-jwt");
const config = require("config");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const JWT_SECRET = config.get("jwtSecret");


//for JwtStrategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // Find the user specified in token
        const user = await User.findById(payload.user.id);

        // If user doesn't exists, handle it
        if (!user) {
          return done(null, false);
        }
        // Otherwise, return the user
        done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);


// Local Stratagy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        // Find the user given the email
        const user = await User.findOne({ email });

        // If not, handle it
        if (!user) {
          return done(null, false);
        }

        // Check if the password is correct
        isMatched = async function (password) {
          try {
            return await bcrypt.compare(password, user.password);
          } catch (error) {
            throw new Error(error);
          }
        };

        const validPass = await isMatched(password);

        // If not, handle it
        if (!validPass) {
          return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

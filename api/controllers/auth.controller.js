import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  // getting the user model details from the page
  const { username, email, password } = req.body;

  // hashing the password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // creating a new user model
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    // save user details in the DB
    await newUser.save();

    // return the response
    res.status(201).json("User created successfully!!!");
  } catch (error) {
    // next(errorHandler(500, 'error from the function'));
    // above code for a customized error message
    next(error);
  }
};

export const signin = async (req, res, next) => {
  // getting the email and the password from the signin form
  const { email, password } = req.body;

  try {
    // checking is the credintails valid
    const validUser = await User.findOne({ email });
    // checking the User is valid
    if (!validUser) return next(errorHandler(404, "User not Found!"));
    // checking the password of the user from the database
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    // if is not
    if (!validPassword) return next(errorHandler(404, "Wrong Credentials"));

    // creating a jwt token for user login
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // removing the passwod before sending the details to the browser
    const { password: pass, ...rest } = validUser._doc;

    // saving the token as a cookie
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    // checking the user excist
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      // if the user email i means user exsist
      // create the sign in
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // when the passing data ignore the password
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      // when user log using the email there a no password for the user to log in
      // then we create a password for the db, bcz it is required
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      // hashing the password
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      // the save the user to the DB
      const user = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      // save new user
      await user.save();
      // so now registering the user to a cookie
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // Clear the cookie
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!!!");
  } catch (error) {
    next(error);
  }
};

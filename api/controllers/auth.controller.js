import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {

    // getting the user model details from the page
    const { username, email, password } = req.body;

    // hashing the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // creating a new user model
    const newUser = new User({ username, email, password: hashedPassword });

    try {
        // save user details in the DB
        await newUser.save()
    
        // return the response
        res.status(201).json("User created successfully!!!");

    }catch(error) {
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
        if (!validUser) return next(errorHandler(404, 'User not Found!'));
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
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
        
    } catch (error) {
        next(error);
    }
};
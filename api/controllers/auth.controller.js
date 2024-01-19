import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

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
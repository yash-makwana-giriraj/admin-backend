const bcrypt = require('bcrypt');
const jwt = require('../config/jwt');
const User = require('../models/User');

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (!username) {
            return res.status(400).json({ message: 'Please provide username' });
        }
        if (!email) {
            return res.status(400).json({ message: 'Please provide email' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Please provide password' });
        }
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // If email is unique, proceed to create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        const token = jwt(user._id);
        const message = "User Created Successfully";
        res.status(201).json({ user, token ,message});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt(user._id);
        const message = "User Login Successfully";
        res.json({ user, token ,message});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    signup,
    login,
};

const Auth = require("../models/Authmodel");
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await Auth.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        // Create user
        const user = new Auth({ name, email, password });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(req.body)
        const user = await Auth.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Token expires in 7 days
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};



module.exports = { registerUser, loginUser };

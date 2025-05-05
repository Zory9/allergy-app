const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require("../db");

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password, allergy } = req.body;

    if (!username || !email || !password || !allergy) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the user into the database
        const result = await pool.query(
            'INSERT INTO users (username, email, password, allergy) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, allergy]
        );

        res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the user exists
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUser = async (request, response) => {
    const salt = await bcrypt.genSalt(10);

    try {
        const id = request?.body.id;
        const email = request?.body.email;
       //const password = request?.body.password;
        const username = request?.body.username;
        const allergy = request?.body.allergy;

        //const hashedPassword = await bcrypt.hash(password, salt);

        if (!id) {
            return response.status(500).json({
                message: "Profile id should be provided in request body",
            });
        }

        await pool.query("UPDATE users SET email = $2, username = $3, allergy = $4 WHERE id = $1", [id, email, username, allergy])
      
        return response.status(200).json("Successfully updated user settings");

    }
    catch (err) {
        console.error(err.message)
        response.status(500).send(err.message)
    }
}

const getUserById = async (request, response) => {
    try {
        const id = request?.query.id;
        if (!id) {
            return response.status(500).json({
                message: "profile id should be provided in request body",
            });
        }

        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id])
        if (rows.length < 1) {
            return response.status(500).send(`User with id: ${id} not found`);
        }

        return response.status(200).json(rows[0])

    }
    catch (err) {
        console.error(err.message)
        response.status(500).send(err.message)
    }
}

module.exports = { registerUser, loginUser, updateUser, getUserById };
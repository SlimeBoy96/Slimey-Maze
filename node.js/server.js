const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 3000;
const usersFile = 'users.json';
const scoresFile = 'scores.json';

app.use(bodyParser.json());
app.use(cors());

// Helper function to read JSON file
function readJSONFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper function to write JSON file
function writeJSONFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = readJSONFile(usersFile);

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });
    writeJSONFile(usersFile, users);

    res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readJSONFile(usersFile);

    const user = users.find(user => user.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful' });
});

// Submit score endpoint
app.post('/submit-score', (req, res) => {
    const { username, score } = req.body;
    const scores = readJSONFile(scoresFile);

    scores.push({ username, score });
    writeJSONFile(scoresFile, scores);

    res.status(201).json({ message: 'Score submitted successfully' });
});

// Get scores endpoint
app.get('/scores', (req, res) => {
    const scores = readJSONFile(scoresFile);
    scores.sort((a, b) => b.score - a.score);
    res.status(200).json(scores);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

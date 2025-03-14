const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Store submitted numbers in a file
const DATA_FILE = "numbers.json";

// Ensure file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Handle form submission
app.post("/submit", (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    // Read existing numbers
    let numbers = JSON.parse(fs.readFileSync(DATA_FILE));

    // Add new number
    numbers.push({ phone, time: new Date().toISOString() });

    // Save back to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(numbers, null, 2));

    res.json({ message: "Phone number saved!" });
});

// View submitted numbers
app.get("/numbers", (req, res) => {
    const numbers = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(numbers);
});

// Serve the HTML form
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
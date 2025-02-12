// Backend - server.js (Express & MongoDB)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/dharisanam", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const RegistrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    temple: String,
    location: String,
    amount: Number,
});

const Registration = mongoose.model("Registration", RegistrationSchema);

app.post("/register", async (req, res) => {
    try {
        const newRegistration = new Registration(req.body);
        await newRegistration.save();
        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering", error });
    }
});

app.get("/temples", (req, res) => {
    res.json([
        { name: "Tirupati Balaji", location: "Andhra Pradesh", amount: 500 },
        { name: "Madurai Meenakshi", location: "Tamil Nadu", amount: 300 },
        { name: "Kashi Vishwanath", location: "Uttar Pradesh", amount: 700 },
        { name: "Vaishno Devi", location: "Jammu & Kashmir", amount: 1000 },
    ]);
});

app.listen(5000, () => console.log("Server running on port 5000"));

// Frontend - DharisanamBooking.js (React)
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DharisanamBooking() {
    const [temples, setTemples] = useState([]);
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/temples").then((response) => {
            setTemples(response.data);
        });
    }, []);

    const handleRegister = () => {
        if (selectedTemple && name && email) {
            axios.post("http://localhost:5000/register", {
                name,
                email,
                temple: selectedTemple.name,
                location: selectedTemple.location,
                amount: selectedTemple.amount,
            }).then((response) => {
                setMessage(response.data.message);
            }).catch((error) => {
                setMessage("Error registering");
            });
        }
    };

    return (
        <div>
            <h1>Special Dharisanam Registration</h1>
            <select onChange={(e) => setSelectedTemple(temples[e.target.value])}>
                <option value="">Select Temple</option>
                {temples.map((temple, index) => (
                    <option key={index} value={index}>{temple.name}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            {message && <p>{message}</p>}
        </div>
    );
}

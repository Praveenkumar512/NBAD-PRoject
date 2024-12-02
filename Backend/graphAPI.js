// LoginAPI.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { expressjwt: jwtMiddleware } = require('express-jwt');

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'praveen_final_project',
    database: 'praveen_final_project'
});

const secretKey = 'Praveen13425';

const jwtAuthMiddleware = jwtMiddleware({
    secret: secretKey,
    algorithms: ['HS256']
});

router.get('/api/aiModelEfficency', jwtAuthMiddleware, (req, res) => {
    const userId = req.auth.userId; // Assuming userId is in the JWT payload
    connection.query(
        'SELECT model, efficiency_score, computational_cost FROM model_efficiency',
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to get model efficiency data' });
            } else {
                res.json(results);
            }
        }
    );
});

router.get('/api/aiImplementationCost', jwtAuthMiddleware, (req, res) => {
    const userId = req.auth.userId; // Assuming userId is in the JWT payload

    connection.query(
        'SELECT industry, cost_2023, cost_2024 FROM ai_implementation_cost',
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to get implementation cost data' });
            } else {
                res.json(results);
            }
        }
    );
});

module.exports = router;

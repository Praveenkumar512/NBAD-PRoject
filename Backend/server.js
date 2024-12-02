const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'praveen_final_project',
    database: 'praveen_final_project'
});

app.use(express.json());

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

const closeMysqlConnection = () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        } else {
            console.log('MySQL connection closed');
        }
    });
};

const loginRoutes = require('./authentication');
app.use('/', loginRoutes);

const graphRoutes = require('./graphAPI');
app.use('/', graphRoutes);

app.get('/', async (req, res) => {
        res.status(200).json({success : true, message : 'Working Fine.!'});
});

const server = app.listen(port, () => {
    console.log(`Server on port ${port}`);
});

// Close the server and MySQL connection when the tests are finished
process.on('exit', () => {
    server.close();
    closeMysqlConnection();
    console.log('Server and MySQL connection closed');
});

module.exports = app;
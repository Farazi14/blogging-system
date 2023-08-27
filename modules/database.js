const mariadb = require("mariadb");


// Create a connection object with the connection details
const dbConnection = mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

console.log(process.env.DB_HOST);

// Connect to the database
if(dbConnection) {
    console.log("Connected to the database");
}else {
    console.log("Unable to connect to the database");
}

module.exports = dbConnection;
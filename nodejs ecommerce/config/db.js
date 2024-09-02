const mysql = require("mysql2");

const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
  });

  connection.connect((err) => {
    if (err) {
      console.log("Error connecting to Database");
    } else {
      console.log("Connected to MySQL Database");
    }
  });
  return connection;  
};

module.exports = connectDB;

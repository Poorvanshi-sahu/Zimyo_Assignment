const connectDB = require('../config/db');

const queryDatabase = (query, params = []) => {
  return new Promise((resolve, reject) => {
    const connection = connectDB();

    connection.query(query, params, (err, results) => {
      if (err) {
        reject(err); // Reject the Promise with the error
      } else {
        resolve(results); // Resolve the Promise with the results
      }

      // Close the connection after the query
      connection.end((endErr) => {
        if (endErr) {
          console.error('Error closing the connection:', endErr);
        } else {
          console.log('MySQL connection closed.');
        }
      });
    });
  });
};

module.exports = queryDatabase;

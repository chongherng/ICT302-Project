const mysql = require('mysql');

const setupDatabase = () => {
    var con = mysql.createConnection({
      // IMPORTANT: Please update the user and password accordingly
      host: "localhost",
      user: "root",
      password: "password",
    });

    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected to database!");
    });
}

module.exports = setupDatabase;
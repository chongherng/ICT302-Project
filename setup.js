const mysql = require("mysql");

const setupDatabase = () => {
  var con = mysql.createConnection({
    // IMPORTANT: Please update the user and password accordingly
    host: "localhost",
    user: "root",
    password: "password",
    database: "ICT302",
  });

  console.log("Setting up database...");

  // Connect to database
  con.connect(function (err) {
    if (err) {
      console.log("Error: Connecting to database");
      return;
    }

    console.log("Connected to database");

    // Create database
    con.query("CREATE DATABASE ICT302", function (err, result) {
      err ? console.log(err.sqlMessage) : console.log("Database created");
    });

    /** Create Tables */
    // Student Table
    var sql =
      "CREATE TABLE Student (s_ID VARCHAR(8) PRIMARY KEY, s_fname VARCHAR(50) NOT NULL, s_lname VARCHAR(30) NOT NULL, s_birthday DATE NOT NULL, s_email VARCHAR(100) NOT NULL, s_phoneNo VARCHAR(8) NOT NULL, s_listOfUnits VARCHAR(200) NOT NULL)";
    con.query(sql, function (err, result) {
      err ? console.log(err.sqlMessage) : console.log("Student table created");
    });

    // Request Table
    sql = "CREATE TABLE Request (r_ID VARCHAR(8) PRIMARY KEY, r_type VARCHAR(30) NOT NULL, r_description VARCHAR(100), r_documentpath VARCHAR(255) NOT NULL, r_dateofrequest DATE  NOT NULL, r_status VARCHAR(30) NOT NULL, r_duedate DATE NOT NULL, s_ID VARCHAR(8), sss_ID VARCHAR(8), sam_ID VARCHAR(10), as_ID VARCHAR(10), FOREIGN KEY (s_ID) REFERENCES Student(s_ID), FOREIGN KEY (sss_ID) REFERENCES StudentSupportStaff(sss_ID), FOREIGN KEY (sam_ID) REFERENCES SAM(sam_ID), FOREIGN KEY (as_ID) REFERENCES AcademicStaff(as_ID))";
    con.query(sql, function (err, result) {
      err ? console.log(err.sqlMessage) : console.log("Request table created");
    });

    // SAM Table
    sql = "CREATE TABLE SAM (sam_ID VARCHAR(10) PRIMARY KEY, sam_fname VARCHAR(50) NOT NULL, sam_lname VARCHAR(30) NOT NULL, sam_birthday DATE NOT NULL, sam_email VARCHAR(100) NOT NULL, sam_phoneNo VARCHAR(8) NOT NULL, sam_username VARCHAR(30) NOT NULL, sam_password VARCHAR(255) NOT NULL)";
    con.query(sql, function (err, result) {
      err ? console.log(err.sqlMessage) : console.log("SAM table created");
    });

    // Student Support Staff Table
    sql = "CREATE TABLE StudentSupportStaff (sss_ID VARCHAR(8) PRIMARY KEY, sss_fname VARCHAR(50) NOT NULL, sss_lname VARCHAR(30) NOT NULL)";
    con.query(sql, function (err, result) {
      err ? console.log(err.sqlMessage) : console.log("SSS table created");
    });

    // Academic Staff Table
    sql = "CREATE TABLE AcademicStaff (as_ID VARCHAR(10) PRIMARY KEY, as_fname VARCHAR(50) NOT NULL, as_lname VARCHAR(30) NOT NULL, as_birthday DATE NOT NULL, as_email VARCHAR(100) NOT NULL, as_phoneNo VARCHAR(8) NOT NULL)";
    con.query(sql, function (err, result) {
      err ? console.log(err.sqlMessage) : console.log("Academic Staff table created");
    });

    con.end();
  });
};

setupDatabase();

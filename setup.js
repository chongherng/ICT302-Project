const mysql = require("mysql");

var studentValues = [
  ["33457986", "Ember", "Thad", "1996-08-03", "ember_thad@gmail.com","87948875","ICT302, ICT167"],
  ["33896239", "Chua","Chong Herng", "1996-03-12", "chong_herng@hotmail.com", "98754621", "ICT302, ICT374"],
  ["33487596", "John", "Smith", "1994-11-03", "JohnSmith@gmail.com", "87457784", "ICT111"]
];

var supportStaffValues = [
  ["34612578", "Jake", "Crew"],
  ["34623154", "Sam", "Teo"]
]

// password for SAM1: password123
// password for SAM2: password321
var SAMValues = [
  [
    "3312345678",
    "Janice",
    "Teo",
    "1980-04-12",
    "JaniceTeo321@test.com",
    "87549965",
    "SAM",
    "$2b$10$hthekxa4i0qbNCr3zRtn8etgXw2W73GuAWxHqLoL.GzKN8mnRJuvG",
  ],
  [
    "3387654321",
    "John",
    "Doe",
    "1983-06-15",
    "JohnDoe@test.com",
    "87456235",
    "SAM",
    "$2b$10$E4uEZFH/gGWFbrZbu22TsuySzxFVii2Nh0XqRN/6uyakOaCEmhreO",
  ],
];

// password for AS1: aspassword123
// password for AS2: aspassword321
var ASValues = [
  [
    "3374875962",
    "Joey",
    "Lim",
    "1986-04-12",
    "JoeyLim@test.com",
    "87549925",
    "AS",
    "$2a$10$lxOMzrrKTPwRbq1C4ndg3.EcxnOTMSm92txV.akpatl.r1ou/SQNG",
  ],
  [
    "3387622321",
    "Jim",
    "Doe",
    "1985-06-15",
    "JimDoe@test.com",
    "87456211",
    "AS",
    "$2a$10$o9btt05HzBpF8KWVb/5cUeWQFNCdVDLZK.34wSSOnMiNvWULzYqc2",
  ],
];

const setupDatabase =  () => {
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

    // SAM Table
    sql =
      "CREATE TABLE SAM (sam_ID VARCHAR(10) PRIMARY KEY, sam_fname VARCHAR(50) NOT NULL, sam_lname VARCHAR(30) NOT NULL, sam_birthday DATE NOT NULL, sam_email VARCHAR(100) NOT NULL, sam_phoneNo VARCHAR(8) NOT NULL, role VARCHAR(10) NOT NULL, password VARCHAR(255) NOT NULL)";
    con.query(sql, function (err, result) {
      err ? console.log(err.sqlMessage) : console.log("SAM table created");
    });

    // Student Support Staff Table
    sql =
      "CREATE TABLE StudentSupportStaff (sss_ID VARCHAR(8) PRIMARY KEY, sss_fname VARCHAR(50) NOT NULL, sss_lname VARCHAR(30) NOT NULL)";
    con.query(sql, function (err, result) {
      err ? console.log(err.sqlMessage) : console.log("SSS table created");
    });

    // Academic Staff Table
    sql =
      "CREATE TABLE AcademicStaff (as_ID VARCHAR(10) PRIMARY KEY, as_fname VARCHAR(50) NOT NULL, as_lname VARCHAR(30) NOT NULL, as_birthday DATE NOT NULL, as_email VARCHAR(100) NOT NULL, as_phoneNo VARCHAR(8) NOT NULL, role VARCHAR(10) NOT NULL, password VARCHAR(255) NOT NULL)";
    con.query(sql, function (err, result) {
      err
        ? console.log(err.sqlMessage)
        : console.log("Academic Staff table created");
    });

    // Request Table
    sql =
      "CREATE TABLE Request (r_ID VARCHAR(8) PRIMARY KEY, r_type VARCHAR(30) NOT NULL, r_description VARCHAR(100), r_documentpath VARCHAR(255) NOT NULL, r_dateofrequest DATE  NOT NULL, r_status VARCHAR(30) NOT NULL, r_duedate DATE NOT NULL, r_comments VARCHAR(255), s_ID VARCHAR(8), sss_ID VARCHAR(8), sam_ID VARCHAR(10), as_ID VARCHAR(10), FOREIGN KEY (s_ID) REFERENCES Student(s_ID), FOREIGN KEY (sss_ID) REFERENCES StudentSupportStaff(sss_ID), FOREIGN KEY (sam_ID) REFERENCES SAM(sam_ID), FOREIGN KEY (as_ID) REFERENCES AcademicStaff(as_ID))";
    con.query(sql, function (err, result) {
      err ? console.log(err.sqlMessage) : console.log("Request table created");
    });

    // Insert students
    sql =
      "INSERT INTO Student VALUES ?";
    con.query(sql, [studentValues], function (err, result) {
      err
        ? console.log(err.sqlMessage)
        : console.log(
            "Number of student records inserted: " + result.affectedRows
          );
    });

    // Insert support staff
    sql =
      "INSERT INTO StudentSupportStaff VALUES ?";
    con.query(sql, [supportStaffValues], function (err, result) {
      err
        ? console.log(err.sqlMessage)
        : console.log(
            "Number of support staff records inserted: " + result.affectedRows
          );
    });

    // Insert SAM
    sql =
      "INSERT INTO SAM VALUES ?";
    con.query(sql, [SAMValues], function (err, result) {
      err
        ? console.log(err.sqlMessage)
        : console.log(
            "Number of SAM records inserted: " + result.affectedRows
          );
    });

    // Insert Academic Staff
    sql = "INSERT INTO AcademicStaff VALUES ?";
    con.query(sql, [ASValues], function (err, result) {
      err
        ? console.log(err.sqlMessage)
        : console.log("Number of Academic Staff records inserted: " + result.affectedRows);
    });

    con.end();
  });
};

setupDatabase();


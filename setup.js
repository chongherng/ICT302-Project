const mysql = require("mysql");

var studentValues = [
  ["33457986", "Ember", "Thad", "1996-08-03", "ember_thad@gmail.com","87948875","ICT302, ICT167"],
  ["33896239", "Chua","Chong Herng", "1996-03-12", "chong_herng@hotmail.com", "98754621", "ICT302, ICT374"],
  ["33487596", "John", "Smith", "1994-11-03", "JohnSmith@gmail.com", "87457784", "ICT111"],
  ["33334698", "Ava", "Smith", "1993-02-21", "Ava_smith@gmail.com", "98460507", "ICT101"],
  ["33333771", "Alexander", "Brown", "1992-06-23", "Alexander_brown@gmail.com", "98805134", "ICT102"],
  ["33333748", "Benjamin", "Jones", "1993-09-11", "Benjamin_jones@gmail.com", "98333798", "ICT113"],
  ["33338251", "Charlotte", "Lopez", "1991-04-03", "Charlotte_lopez@gmail.com","98217792", "ICT122"],
  ["33339217", "Carter", "Wills", "1990-07-16", "Carter_wills@gmail.com", "98595098", "ICT106"],
  ["33334796", "Daniel", "Walker", "1995-09-15", "Daniel_walker@gmail.com", "97447571", "ICT105"],
  ["33337558", "Emma", "Watsons", "1996-08-03", "Emma_watsons@gmail.com", "97169562", "ICT332, ICT334"],
  ["33339855", "Frey", "Green", "1997-11-04", "Frey_green@gmail.com", "97599600", "ICT305, ICT174"],
  ["33337768", "Ginna", "Turner", "1990-10-13", "Ginna_turner@gmail.com", "87450842", "ICT301, ICT364"],
  ["33336664", "Henry", "Baker", "1994-12-03", "Henry_baker@gmail.com", "87662632", "ICT202, IC2374"]
];

var supportStaffValues = [
  ["34612578", "Jake", "Crew"],
  ["34623154", "Sam", "Teo"]
  ["34920666", "Isabella", "Lim"],
  ["34684213", "Issac", "Tan"],
  ["34274014", "Joe", "Parker"],
  ["34799060", "James", "Lee"],
  ["34280966", "Jennifer", "Lawrence"],
  ["34394990", "Joseph", "Khoo"],
  ["34321527", "Kai", "Reyes"],
  ["34260675", "Linsey", "Sterling"],
  ["34895027", "Lionne", "Davinci"],
  ["34516640", "Moses", "Reed"]

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

// password for AS1: aspassword123 JoeyLim
// password for AS2: aspassword321 JimDoe
// password for AS3: aspassword333 LunaStriker
// password for AS4: aspassword444 LenaBloom
// password for AS5: aspassword555 MerlinWard
// password for AS6: aspassword666 NoellePrestige
// password for AS6: aspassword777 OliverBlue
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
  [
    "3317684451",
    "Luna",
    "Striker",
    "1984-12-15",
    "LunaStriker@test.com",
    "97228304",
    "AS",
    "$2a$10$ow9cDX5MUD96GUafEJn2ye/8n9WKNJsgmaGeYuXn3GNGBcD/X6fo2",
  ],
  [
    "3348669658",
    "Lena",
    "Bloom",
    "1987-10-03",
    "LenaBloom@test.com",
    "97219926",
    "AS",
    "$2a$10$B5PUO.XVOz4bVzzFT3X1leEmcntgsjeGDxtRBH7WUuPIILPKuLQNy",
  ],
  [
    "3370094047",
    "Merlin",
    "Ward",
    "1983-04-25",
    "MerlinWard@test.com",
    "97405537",
    "AS",
    "$2a$10$w9k.HbE3hRnur00neJbJj.ywJlqPHMquapchttDshkejDKh8dTjuO",
  ],
  [
    "3341909940",
    "Noelle",
    "Prestige",
    "1982-01-19",
    "NoellePrestige@test.com",
    "87243234",
    "AS",
    "$2a$10$CjdmbDyKckjGKpzjyXXvPOMCqKv1l1F3OKNAOqgipvWSTOQgv2oMS",
  ],
  [
    "3327148821",
    "Oliver",
    "Blue",
    "1981-08-08",
    "OliverBlue@test.com",
    "87790365",
    "AS",
    "$2a$10$fbmIQF9qB7Jjq7iCVAl3O.TTgYBU5urR43KtQuu.2f5zRBiJFFidm",
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


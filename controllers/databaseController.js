const mysql = require("mysql2/promise");

const findStudent = async (studentID) => {
  try {
    var con = await mysql.createConnection({
      // IMPORTANT: Please update the user and password accordingly
      host: "localhost",
      user: "root",
      password: "password",
      database: "ICT302",
    });

    var [rows, fields] = await con.query(
      "SELECT * FROM Student WHERE s_ID = " + mysql.escape(studentID)
    );
    return rows[0];
  } catch {}
};

const findStudentSupportStaff = async (studentSupportStaffID) => {
  try {
    var con = await mysql.createConnection({
      // IMPORTANT: Please update the user and password accordingly
      host: "localhost",
      user: "root",
      password: "password",
      database: "ICT302",
    });

    var [rows, fields] = await con.query(
      "SELECT * FROM StudentSupportStaff WHERE sss_ID = " + mysql.escape(studentSupportStaffID)
    );
    return rows[0];
  } catch {}
};


module.exports = {
  findStudent,
  findStudentSupportStaff,
};

const mysql = require("mysql2/promise");

// Update user and password accordingly
const databaseInfo = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "ICT302",
};

const findStudent = async (studentID) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM Student WHERE s_ID = " + mysql.escape(studentID)
    );
    return rows[0];
  } catch (err){
    console.log(err);
  }
};

const findStudentSupportStaff = async (studentSupportStaffID) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM StudentSupportStaff WHERE sss_ID = " +
        mysql.escape(studentSupportStaffID)
    );
    return rows[0];
  } catch (err){
    console.log(err);
  }
};

const findAcademicStaff = async (academicStaffID) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM AcademicStaff WHERE as_ID = " +
        mysql.escape(academicStaffID)
    );
    return rows[0];
  } catch (err){
    console.log(err);
  }
}

const getAllSAM = async () => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query("SELECT * FROM SAM");
    return rows;
  } catch (err) {
    console.log(err);
  }
}


const insertStudentRequest = async (
  studentID,
  requestType,
  description,
  documentPath,
  dateOfRequest,
  requestStatus,
  otherType
) => {
  var requestNo = getRequestPrefix(requestType);
  try {
    var con = await mysql.createConnection(databaseInfo);
    // Generate unique request number
    var [requestTypeDup, fields] = await con.query(
      "SELECT COUNT(r_type) as requestCount FROM Request WHERE r_type = " +
        mysql.escape(requestType)
    );
    requestNo =
      requestNo + (parseInt(requestTypeDup[0].requestCount) + 1).toString();
    // prepare values to insert
    await con.query(
      "INSERT INTO Request (s_ID, r_type, r_description, r_documentpath, r_otherType, r_dateofrequest, r_status, r_NO) VALUES (?,?,?,?,?,?,?,?)",
      [
        studentID,
        requestType,
        description,
        documentPath,
        otherType,
        dateOfRequest,
        requestStatus,
        requestNo,
      ]
    );
    return requestNo;
  } catch (err) {
    console.log(err);
  }
};

const insertStudentSupportStaffRequest = async (
  sssID,
  requestType,
  description,
  documentPath,
  dateOfRequest,
  requestStatus,
  otherType
) => {
  var requestNo = getRequestPrefix(requestType);
  try {
    var con = await mysql.createConnection(databaseInfo);
    // Generate unique request number
    var [requestTypeDup, fields] = await con.query(
      "SELECT COUNT(r_type) as requestCount FROM Request WHERE r_type = " +
        mysql.escape(requestType)
    );
    requestNo =
      requestNo + (parseInt(requestTypeDup[0].requestCount) + 1).toString();
    // prepare values to insert
    await con.query(
      "INSERT INTO Request (sss_ID, r_type, r_description, r_documentpath, r_otherType, r_dateofrequest, r_status, r_NO) VALUES (?,?,?,?,?,?,?,?)",
      [
        sssID,
        requestType,
        description,
        documentPath,
        otherType,
        dateOfRequest,
        requestStatus,
        requestNo,
      ]
    );
    return requestNo;
  } catch (err) {
    console.log(err);
  }
};

const getAllRequestWithStudent = async () => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query("SELECT * FROM Request INNER JOIN Student ON Request.s_ID=Student.s_ID");
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getAllRequestForAcademicStaff = async (academicStaffID) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM Request INNER JOIN Student ON Request.s_id=Student.s_id INNER JOIN Sam ON Request.sam_id=Sam.sam_id WHERE as_ID = '" + academicStaffID + "' AND r_status = 'Assigned Request'" 
    );
    return rows;
  } catch (err) {
    console.log(err);
  }
};


const getRequest = async (requestNo) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM Request INNER JOIN Student ON Request.s_id=Student.s_id WHERE r_NO = '" + requestNo + "';");
    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

const getAllAcademicStaff = async () => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM AcademicStaff");
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getRequestPrefix = (requestType) => {
  switch (requestType) {
    case "Study Plan":
      return "SP";
    case "Unit Exemption":
      return "UE";
    default:
      break;
  }
};


module.exports = {
  findStudent,
  findStudentSupportStaff,
  insertStudentRequest,
  insertStudentSupportStaffRequest,
  getAllSAM,
  getAllRequestWithStudent,
  getAllRequestForAcademicStaff,
  getRequest,
  getAllAcademicStaff,
  findAcademicStaff,
};

const mysql = require("mysql2/promise");

// Update user and password accordingly
const databaseInfo = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "ICT302",
};

// find user
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

const findSAM = async (samID) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM SAM WHERE sam_ID = " +
        mysql.escape(samID)
    );
    return rows[0];
  } catch (err){
    console.log(err);
  }
}

const findRequest = async (requestNo) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM Request WHERE r_NO = '" + requestNo + "';");
    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

// query
const getAllRequestWithStudent = async () => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query("SELECT * FROM Request INNER JOIN Student ON Request.s_ID=Student.s_ID");
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getRequestWithRequestNo = async (requestNo) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM Request INNER JOIN Student ON Request.s_id=Student.s_id WHERE r_NO = '" +
        requestNo +
        "';"
    );
    if (rows[0] == null) {
      [rows, fields] = await con.query(
        "SELECT * FROM Request INNER JOIN StudentSupportStaff sss ON Request.sss_id=sss.sss_id WHERE r_NO = '" +
          requestNo +
          "';"
      );
    }
    return rows[0];
  } catch (err) {
    console.log(err);
  }
};

const getAllRequestWithSSS = async () => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query("SELECT * FROM Request INNER JOIN StudentSupportStaff ON Request.sss_ID=StudentSupportStaff.sss_ID");
    return rows;
  } catch (err) {
    console.log(err);
  }
}

const getAllStudentRequestForAcademicStaff = async (academicStaffID) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT *, DATE_FORMAT(r_duedate, '%d/%m/%Y') AS r_duedate FROM Request INNER JOIN Student ON Request.s_id=Student.s_id INNER JOIN Sam ON Request.sam_id=Sam.sam_id WHERE as_ID = '" + academicStaffID + "' AND r_status = 'Assigned Request'" 
    );
    return rows;
  } catch (err) {
    console.log(err);
  }
};

const getAllSSSRequestForAcademicStaff = async (academicStaffID) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT *, DATE_FORMAT(r_duedate, '%d/%m/%Y') AS r_duedate FROM Request INNER JOIN StudentSupportStaff sss ON Request.sss_id=sss.sss_id INNER JOIN Sam ON Request.sam_id=Sam.sam_id WHERE as_ID = '" + academicStaffID + "' AND r_status = 'Assigned Request'" 
    );
    return rows;
  } catch (err) {
    console.log(err);
  }
};

const getAllAssignedRequest = async () => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    var [rows, fields] = await con.query(
      "SELECT * FROM Request INNER JOIN AcademicStaff ON request.as_id = academicstaff.as_id INNER join sam ON request.sam_id=sam.sam_id where r_status = 'Assigned Request'"
    );
    return rows;
  } catch (err) {
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

// insert 
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

// update database

const setRequestStatus = async (requestNo, requestStatus) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    await con.query(
      "Update Request SET r_status = " + mysql.escape(requestStatus) + " WHERE r_NO = " + mysql.escape(requestNo) + ";");
  } catch (err) {
    console.log(err);
  }
} 

const setAcademicStaffOnRequest = async (requestNo, academicStaffID) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    await con.query(
      "Update Request SET as_ID = " + mysql.escape(academicStaffID) + " WHERE r_NO = " + mysql.escape(requestNo) + ";");
  } catch (err) {
    console.log(err);
  }
}

const setSamIDOnRequest = async (requestNo, samID) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    await con.query(
      "Update Request SET sam_ID = " + mysql.escape(samID) + " WHERE r_NO = " + mysql.escape(requestNo) + ";");
  } catch (err) {
    console.log(err);
  }
}

const setRequestDueDate = async (requestNo, duedate) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    await con.query( "Update Request SET r_duedate = " + mysql.escape(duedate) + " WHERE r_NO = " + mysql.escape(requestNo) + ";");
  } catch (err) {
    console.log(err);
  }
}

const setRequestComments = async (requestNo, comments) => {
  try {
    var con = await mysql.createConnection(databaseInfo);

    await con.query( "Update Request SET r_comments = " + mysql.escape(comments) + " WHERE r_NO = " + mysql.escape(requestNo) + ";");
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
  findSAM,
  findAcademicStaff,
  findRequest,
  getRequestWithRequestNo,
  getAllSAM,
  getAllRequestWithStudent,
  getAllStudentRequestForAcademicStaff,
  getAllSSSRequestForAcademicStaff,
  getAllRequestWithSSS,
  getAllAcademicStaff,
  getAllAssignedRequest,
  insertStudentSupportStaffRequest,
  insertStudentRequest,
  setRequestStatus,
  setAcademicStaffOnRequest,
  setSamIDOnRequest,
  setRequestDueDate,
  setRequestComments,
};

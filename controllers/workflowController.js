const databaseController = require("../controllers/databaseController");
const mailController = require("../controllers/mailController");

const newStudentRequestToDatabase = async (data, file) => {
  // returns request number
  return await databaseController.insertStudentRequest(
    data.StudentID,
    data.requestType,
    data.comment,
    "/upload/" + file.filename,
    new Date().toISOString().split("T")[0],
    "New Request",
    ""
  ); // change last to data.otherType
};

const newSSSRequestToDatabase = async (data, file) => {
  // returns request number
  return await databaseController.insertStudentSupportStaffRequest(
    data.StudentSupportStaffID,
    data.requestType,
    data.comment,
    "/upload/" + file.filename,
    new Date().toISOString().split("T")[0],
    "New Request",
    ""
  ); //
};

const newRequestEmailToSAM = async (requestorID, requestorType, requestType, requestNo) => {
  var requestor;
  var requestorName;
  if (requestorType == "Student") {
    requestor = await databaseController.findStudent(requestorID);
    requestorName = requestor.s_fname + " " + requestor.s_lname;
  }
  if (requestorType == "SSS") {
    requestor = await databaseController.findStudentSupportStaff(requestorID);
    requestorName = requestor.sss_fname + " " + requestor.sss_lname;
  }
  var SAMList = await databaseController.getAllSAM();


  // email to each SAM
  SAMList.forEach((SAM) => {
    var content = 
    `<p>Greetings ${SAM.sam_fname + " " + SAM.sam_lname},</p>
    <br>
    <p>You have a new request that needs your attention that is submitted by ${requestorID}, ${requestorName} regarding ${requestType}.</p>
    <br>
    <p>Click on this link to view your request.</p>
    <a href="#">link</a>
    <br>
    <p>Regards,<p>
    <p>System Auto-Generated Message<p>`;
    mailController.sendEmail("New Request " + requestNo, SAM.sam_email, content);
  })
};

const rejectRequest = async (requestNo, requestType, studentName, studentID) => {
  await databaseController.setRequestStatus(requestNo, "Rejected Request");
  var subject = "The request " + requestNo + " has been rejected.";
  var student = await databaseController.findStudent(studentID);
  console.log(student);
  var content = `<p>Greetings ${studentName}, ${studentID} </p>
    <br>
    <p>The request that you have submitted ${requestNo}, ${requestType} has been rejected.</p>
    <br>
    <p>Regards,<p>
    <p>System Auto-Generated Message<p>`;
  mailController.sendEmail(subject, student.s_email, content);
}

const assignNewRequest = (requestNo, selectedAcademicStaff, duedate, comment) => {

}

const requestMoreInfo = (requestNo, comment) => {

}

module.exports = {
  newStudentRequestToDatabase,
  newSSSRequestToDatabase,
  newRequestEmailToSAM,
  assignNewRequest,
  rejectRequest,
  requestMoreInfo,
};

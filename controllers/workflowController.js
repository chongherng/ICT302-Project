const { request } = require("express");
const databaseController = require("../controllers/databaseController");
const mailController = require("../controllers/mailController");

const newStudentRequestToDatabase = async (data, file) => {
  // returns request number
  var otherOption;
  if(data.requestType == 'Others') {
    otherOption = data.otherOption;
  } else {
    otherOption = '';
  }
  return await databaseController.insertStudentRequest(
    data.StudentID,
    data.requestType,
    data.comment,
    "/upload/" + file.filename,
    new Date().toISOString().split("T")[0],
    "New Request",
    otherOption
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
    <a href="http://localhost:3000/sam/${SAM.sam_ID}/request/new/${requestNo}">link</a>
    <br>
    <p>Regards,<p>
    <p>System Auto-Generated Message<p>`;
    mailController.sendEmail("New Request " + requestNo, SAM.sam_email, content);
  })
};

const rejectRequest = async (data) => {
  try {
    await databaseController.setRequestStatus(data.requestNo, "Rejected Request");
    await databaseController.setRequestComments(data.requestNo, data.comment);
    var subject = "The request " + data.requestNo + " has been rejected";
    var student = await databaseController.findStudent(data.requestorID);
    var sss = await databaseController.findStudentSupportStaff(data.requestorID);
    var receiverEmail = student != null ? student.s_email : sss.sss_email;
    var content = `<p>Greetings ${data.requestorName}, ${data.requestorID} </p>
      <br>
      <p>The request that you have submitted ${data.requestNo}, ${data.requestType} has been rejected.</p>
      <br>
      <p>Regards,<p>
      <p>System Auto-Generated Message<p>`;
    mailController.sendEmail(subject, receiverEmail , content);
  } catch(err) {
    console.log(err);
  }
}

const finalApprovalRequest = async (data) => {
  try {
    await databaseController.setRequestStatus(data.requestNo, "Approved Request");
    var subject = "The request " + data.requestNo + " has been approved";
    var student = await databaseController.findStudent(data.requestorID);
    var sss = await databaseController.findStudentSupportStaff(data.requestorID);
    var receiverEmail = student != null ? student.s_email : sss.sss_email;
    var content = `<p>Greetings ${data.requestorName}, ${data.requestorID} </p>
      <br>
      <p>The request that you have submitted ${data.requestNo}, ${data.requestType} has been approved.</p>
      <br>
      <p>Regards,<p>
      <p>System Auto-Generated Message<p>`;
    mailController.sendEmail(subject, receiverEmail, content);
  } catch(err) {
    console.log(err);
  }
}

const getTotalNewRequest = async (studentRequestList, sssRequestList) => {
  var totalNewRequest = 0;
  if(studentRequestList != null) {
    studentRequestList.forEach((request) => {
      if(request.r_status == "New Request") {
        totalNewRequest++;
      }
    })
  }
  if(sssRequestList != null) {
    sssRequestList.forEach((request) => {
      if(request.r_status == "New Request") {
        totalNewRequest++;
      }
    })
  }

  return totalNewRequest;
}

const getTotalPartialRequest = async (studentRequestList, sssRequestList) => {
  var totalPartialRequest = 0;
  if(studentRequestList != null) {
    studentRequestList.forEach((request) => {
      if(request.r_status == "Partial Request") {
        totalPartialRequest++;
      }
    })
  }
  if(sssRequestList != null) {
    sssRequestList.forEach((request) => {
      if(request.r_status == "Partial Request") {
        totalPartialRequest++;
      }
    })
  }

  return totalPartialRequest;
}

const assignNewRequest = async (data, SAM) => {
  try {
    await databaseController.setRequestStatus(data.requestNo, "Assigned Request");
    await databaseController.setSamIDOnRequest(data.requestNo, SAM.sam_ID);
    await databaseController.setAcademicStaffOnRequest(data.requestNo, data.selectedAcademicStaff);
    await databaseController.setRequestDueDate(data.requestNo, data.duedate);
    await databaseController.setRequestComments(data.requestNo, data.comment);
    var academicStaff = await databaseController.findAcademicStaff(data.selectedAcademicStaff);
    var subject = "Request " + data.requestNo + " has been assigned to you";
    var content = `<p>Greetings ${academicStaff.as_fname + " " + academicStaff.as_lname },</p>
      <br>
      <p>A request has been assigned to you regarding ${data.requestType}. Please note that this request is due by ${data.duedate}</p>
      <br>
      <p>Click on this link to view the request.</p>
      <a href="http://localhost:3000/academic-staff/${academicStaff.as_ID}/request/assigned/${data.requestNo}">link</a>
      <br>
      <p>Regards,<p>
      <p>System Auto-Generated Message<p>`;
    mailController.sendEmail(subject, academicStaff.as_email, content);
  } catch(err) {
    console.log(err);
  }
}

const requestMoreInfo = async (data) => {
  try {
    await databaseController.setRequestStatus(data.requestNo, "Rejected Request");
    var subject = "More information required for  " + data.requestNo + "";
    var student = await databaseController.findStudent(data.requestorID);
    var sss = await databaseController.findStudentSupportStaff(data.requestorID);
    var receiverEmail = student != null ? student.s_email : sss.sss_email;
    var content = `<p>Greetings ${data.requestorName}, ${data.requestorID} </p>
      <br>
      <p>The request that you have submitted ${data.requestNo}, ${data.requestType} contains insufficient information.</p>
      <p>Please resubmit the request form with the following additional information: </p>
      <p>${data.comment}</p>
      <br>
      <p>Regards,<p>
      <p>System Auto-Generated Message<p>`;
    mailController.sendEmail(subject, receiverEmail, content);
  } catch(err) {
    console.log(err);
  }
}

const approveAssignedRequest = async (data, academicStaff) => {
try {
    await databaseController.setRequestStatus(data.requestNo, "Partial Request");
    var request = await databaseController.findRequest(data.requestNo);
    var SAM = await databaseController.findSAM(request.sam_ID)
    var subject = "Pending actions for Partial Request " + data.requestNo + "";
    var content = `<p>Greetings ${SAM.sam_fname + " " + SAM.sam_lname },</p>
      <br>
      <p>You have pending actions for a request. The request has been approved by ${academicStaff.as_fname + " " + academicStaff.as_lname }</p>
      <br>
      <p>Click on this link to view the request.</p>
      <a href="http://localhost:3000/sam/${SAM.sam_ID}/request/partial/${data.requestNo}">link</a>
      <br>
      <p>Regards,<p>
      <p>System Auto-Generated Message<p>`;
    mailController.sendEmail(subject, SAM.sam_email, content);
  } catch(err) {
    console.log(err);
  }
}

const rejectedRequestReapproval = async (data) => {
  try {
    await databaseController.setRequestStatus(data.requestNo, "Approved Request");
    var subject = "The request " + data.requestNo + " has been reapproved";
    var student = await databaseController.findStudent(data.requestorID);
    var sss = await databaseController.findStudentSupportStaff(data.requestorID);
    var receiverEmail = student != null ? student.s_email : sss.sss_email;
    var content = `<p>Greetings ${data.requestorName}, ${data.requestorID} </p>
      <br>
      <p>After consideration, the request that you have submitted ${data.requestNo}, ${data.requestType} has been reapproved.</p>
      <br>
      <p>Regards,<p>
      <p>System Auto-Generated Message<p>`;
    mailController.sendEmail(subject, receiverEmail, content);
  } catch(err) {
    console.log(err);
  }
}

const approvedRequestRejection = async (data) => {
  try {
    await databaseController.setRequestStatus(data.requestNo, "Rejected Request");
    var subject = "The approved request " + data.requestNo + " has been rejected";
    var student = await databaseController.findStudent(data.requestorID);
    var sss = await databaseController.findStudentSupportStaff(data.requestorID);
    var receiverEmail = student != null ? student.s_email : sss.sss_email;
    var content = `<p>Greetings ${data.requestorName}, ${data.requestorID} </p>
      <br>
      <p>After consideration, the approved request that you have submitted ${data.requestNo}, ${data.requestType} has been rejected.</p>
      <br>
      <p>Regards,<p>
      <p>System Auto-Generated Message<p>`;
    mailController.sendEmail(subject, receiverEmail, content);
  } catch(err) {
    console.log(err);
  }
}

const notify48hrs = async () => {
  var requestList = await databaseController.getAllAssignedRequest();
  if(requestList != null) {
    requestList.forEach((request) => {
      if((request.r_duedate - Date.now()) / 86400000 > 1 && (request.r_duedate - Date.now()) / 86400000 <= 2){
        academicStaffName = request.as_fname + " " + request.as_lname;
        var subject = "Reminder: 48 Hrs Left ";
        var content = `<p>Greetings ${academicStaffName}</p>
          <br>
          <p>You have a request waiting for your approval that is due in 48 hrs</p>
          <br>
          <p>Click on this link to view the request.</p>
          <a href="http://localhost:3000/academic-staff/${request.as_ID}/request/assigned/${request.r_NO}">link</a>
          <br>
          <p>Regards,<p>
          <p>System Auto-Generated Message<p>`;
        mailController.sendEmail(subject, request.as_email, content);
      }
    })
  }
}

const notify24hrs = async () => {
var requestList = await databaseController.getAllAssignedRequest();
  if(requestList != null) {
    requestList.forEach((request) => {
      if((request.r_duedate - Date.now()) / 86400000 > 0 && (request.r_duedate - Date.now()) / 86400000 <= 1){
        academicStaffName = request.as_fname + " " + request.as_lname;
        var subject = "Reminder: 24 Hrs Left ";
        var content = `<p>Greetings ${academicStaffName}</p>
          <br>
          <p>You have a request waiting for your approval that is due in 24 hrs</p>
          <br>
          <p>Click on this link to view the request.</p>
          <a href="http://localhost:3000/academic-staff/${request.as_ID}/request/assigned/${request.r_NO}">link</a>
          <br>
          <p>Regards,<p>
          <p>System Auto-Generated Message<p>`;
        mailController.sendEmail(subject, request.as_email, content);
      }
    })
  }
}

module.exports = {
  newStudentRequestToDatabase,
  newSSSRequestToDatabase,
  newRequestEmailToSAM,
  assignNewRequest,
  rejectRequest,
  requestMoreInfo,
  approveAssignedRequest,
  finalApprovalRequest,
  rejectedRequestReapproval,
  approvedRequestRejection,
  notify48hrs,
  notify24hrs,
  getTotalNewRequest,
  getTotalPartialRequest,
};

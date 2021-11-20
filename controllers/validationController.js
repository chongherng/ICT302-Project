const databaseController = require("../controllers/databaseController");
const fs = require('fs');

const validateStudentForm = async (data, file) => {
  var student = await databaseController.findStudent(data.StudentID);
  var fileExt = file.originalname.split(".").pop();
  if(data.requestType == 'Others' && data.otherOption == null) {
    throw "Empty other type entered";
  }
  if (student == null || file == null || data.requestType == null) {
    // delete file if validation fail
    if (file != null) {
        fs.unlink('./uploads/' + file.filename, (err) => {
            if (err) throw err;
        })
    }
    throw "Missing entry";
  } 
  if(fileExt != "docx" && fileExt != "doc" && fileExt != "pdf") {
    throw "Invalid file type";
  } 
    return true;
};

const validateSSSForm = async (data, file) => {
  var studentSupportStaff = await databaseController.findStudentSupportStaff(data.StudentSupportStaffID);
  var fileExt = file.originalname.split(".").pop();
  if (file == null || studentSupportStaff == null || data.requestType == null) {
    // delete file if validation fail
    if(file != null) {
        fs.unlink("./uploads/" + file.filename, (err) => {
          if (err) throw err;
        });
    }
    throw "Missing entry";
  }
  if (fileExt != "docx" && fileExt != "doc" && fileExt != "pdf") {
    throw "Invalid file type";
  }
  return true;
};

const validateRequestFormLink = async (requestNo, requestStatus) => {
  var request = await databaseController.findRequest(requestNo);
  return request.r_status == requestStatus ? true : false;
}

const validateNewRequestForm = async (data) => {
  // validate request number
  if(await databaseController.getRequestWithRequestNo(data.requestNo) == null){
    return false;
  }
  // validate request form data
  if(data.action == "Assign") {
    var academicStaff = await databaseController.findAcademicStaff(data.selectedAcademicStaff);
    if(academicStaff == null || data.duedate == "" || (new Date(data.duedate) <= Date.now())) {
      return false;
    }
    return true;
  }
  if(data.action == "Reject") {
    return true;
  }
  if(data.action == "Request More Info"){
    if(data.comment == "" || data.comment == null){
      return false;
    }
    return true;
  }
  
}

const validateAssignedRequestForm = async (data) => {
  // validate request number
  if(await databaseController.findRequest(data.requestNo) == null){
    return false;
  }
  return true;
}

const validatePartialRequestForm = async (data) => {
  // validate request number
  if(await databaseController.findRequest(data.requestNo) == null){
    return false;
  }
  return true;
}

module.exports = {
  validateStudentForm,
  validateSSSForm,
  validateNewRequestForm,
  validateAssignedRequestForm,
  validateRequestFormLink,
  validatePartialRequestForm,
};

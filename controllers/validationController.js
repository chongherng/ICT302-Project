const databaseController = require("../controllers/databaseController");
const fs = require('fs');

const validateStudentForm = async (data, file) => {
  var student = await databaseController.findStudent(data.StudentID);
  if (student == null || file == null || data.requestType == null) {
    // delete file if validation fail
    if (file != null) {
        fs.unlink('./uploads/' + file.filename, (err) => {
            if (err) throw err;
        })
    }
    return false;
  } else {
    return true;
  }
};

const validateSSSForm = async (data, file) => {
  var studentSupportStaff = await databaseController.findStudentSupportStaff(data.StudentSupportStaffID);
  if (file == null || studentSupportStaff == null || data.requestType == null) {
    // delete file if validation fail
    if(file != null) {
        fs.unlink("./uploads/" + file.filename, (err) => {
          if (err) throw err;
        });
    }
    return false;
  }
  return true;
};

const validateNewRequestForm = async (data) => {
  // validate request number
  if(await databaseController.getRequest(data.requestNo) == null){
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

module.exports = {
  validateStudentForm,
  validateSSSForm,
  validateNewRequestForm,
};

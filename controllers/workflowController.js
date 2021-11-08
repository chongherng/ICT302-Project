const databaseController = require('../controllers/databaseController');

const newStudentRequestToDatabase = async (data, file) => {
    await databaseController.insertStudentRequest(data.StudentID, data.requestType, data.comment, '/upload/' + file.filename, new Date().toISOString().split('T')[0], 'New Request', ''); // change last to data.otherType
}

const newSSSRequestToDatabase = async (data, file) => {
    await databaseController.insertStudentSupportStaffRequest(
      data.StudentSupportStaffID,
      data.requestType,
      data.comment,
      "/upload/" + file.filename,
      new Date().toISOString().split("T")[0],
      "New Request",
      ""
    ); //
};

const newRequestEmailToSAM = () => {

}

module.exports = {
  newStudentRequestToDatabase,
  newSSSRequestToDatabase,
  newRequestEmailToSAM,
};
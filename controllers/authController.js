const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

async function authUser(req, res) {
  try {
    var user = await findUser(req.body.staffID);
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.send("User found");
    } else {
      return res.status(401).send("Wrong password");
    }
  } catch {
    return res.status(404).send('Cannot find user');
  }
}

const findUser = async (username) => {
  try {
    var con = await mysql.createConnection({
      // IMPORTANT: Please update the user and password accordingly
      host: "localhost",
      user: "root",
      password: "password",
      database: "ICT302",
    });

    const [rows,fields] = await con.query("SELECT * FROM SAM WHERE sam_ID = " + mysql.escape(username));
    if(rows[0] == null) {
      const [rows,fields] = await con.query("SELECT * FROM AcademicStaff WHERE as_ID = " + mysql.escape(username));
    }
    return rows[0];
  } catch {}
};

module.exports = authUser;

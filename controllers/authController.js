const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const LocalStrategy = require("passport-local").Strategy;

async function authUser(staffID, password, done) {
  try {
    var user = await getUserByStaffID(staffID);
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  } catch (e) {
    return done(e);
  }
}

const getUserByStaffID = async (username) => {
  try {
    var con = await mysql.createConnection({
      // IMPORTANT: Please update the user and password accordingly
      host: "localhost",
      user: "root",
      password: "password",
      database: "ICT302",
    });

    const [rows, fields] = await con.query(
      "SELECT * FROM SAM WHERE sam_ID = " + mysql.escape(username)
    );
    if (rows[0] == null) {
      const [rows, fields] = await con.query(
        "SELECT * FROM AcademicStaff WHERE as_ID = " + mysql.escape(username)
      );
    }
    return rows[0];
  } catch {}
};

const initialize = (passport) => {
  passport.use(new LocalStrategy({ usernameField: "staffID" }, authUser));
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

module.exports = initialize;

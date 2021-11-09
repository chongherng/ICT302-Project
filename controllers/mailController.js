const nodemailer = require("nodemailer");

async function sendEmail(subject, receiver, content) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "FT01.WorkFlow@gmail.com", 
      pass: "abc_12345", 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Request Notification" <FT01.WorkFlow@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: subject, // Subject line
    text: "", // plain text body
    html: content, // html body
  });
}


module.exports = {
  sendEmail,
}
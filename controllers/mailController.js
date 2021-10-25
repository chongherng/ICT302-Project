const nodemailer = require("nodemailer");

async function sendEmail() {
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
    to: "chong_herng@hotmail.com", // list of receivers
    subject: "Request Notification", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Email sent from FT01.WorkFlow</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}


module.exports = sendEmail;
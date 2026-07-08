import Mailgen from "mailgen";
import { link } from "node:fs";
import nodemailer from "nodemailer";
 

//for sending the email
const sendEmail=async(options)=>{
   const mailGenerator=new Mailgen(
        {
            theme: "default",
            product: {
                name:"Docode",
                link:"https://docode.com"
            }
        }
    )
   const emailTextual=mailGenerator.generatePlaintext(options.mailgenContent)
   const emailHtml=mailGenerator.generate(options.mailgenContent)


  const transporter=nodemailer.createTransport(
    {
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:
        {
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        },
    }
   )
   try {
  await transporter.verify();
  console.log("SMTP verified successfully");
} catch (err) {
  console.error(err);
}

   const mail={
    from:"dheerajpatel6472@gmail.com",
    to:options.email,
    subject:options.subject,
    html: emailHtml
   }
   try {
    await transporter.sendMail(mail);
   } catch (error) {
     console.error("Email service failed silently ,this might failed due to the credential .maske sure you have provided the credentail to  the .env file");
     console.error(error);
   }
}

const emailverificationmailgencontent = (username, verificationurl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Do code",
      action: {
        instructions: "click here for the mail verification",
        button: {
          color: "#22BC66",
          text: "confirm your account",
          link: verificationurl,
        },
      },
      outro: "Reply to this id if need help",
    },
  };
};

const forgotpasswordnmailgencontent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Do code",
      action: {
        instructions: "click here to reset the Password",
        button: {
          color: '#22BC66',
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro: "reply ot this id need help",
    },
  };
};


export {emailverificationmailgencontent,forgotpasswordnmailgencontent,sendEmail}
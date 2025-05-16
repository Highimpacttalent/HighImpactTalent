import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendRecruiterQuery = async (req, res, next) => {
  const { name, email, role, pay, additionalInfo, sendText, date, time } =
    req.body;

  if (!name || !email || !date || !time) {
    return next("Name, Email, Date, and Time are required");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerhighimpact@gmail.com", // Use environment variable for security
        pass: "lpyu zhks kpne qrsc", // Use app password
      },
    });

    const mailOptions = {
      from: "developerhighimpact@gmail.com",
      to: "recruitersupport@highimpacttalent.com",
      subject: "New Recruiter Query",
      text: `
        A new recruiter query has been scheduled.

        **Schedule Details**:
        Date: ${date}
        Time: ${time}

        **Recruiter Details**:
        Name: ${name}
        Email: ${email}
        Role: ${role}
        Pay: ${pay}
        Additional Info: ${additionalInfo}
        Contact Number: ${sendText}

        Please follow up accordingly.
      `,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      details: error.message,
    });
  }
};

export const sendRecruiterQueryEmail = async (req, res, next) => {
  const { email, companyName, password, recruiterName, mobileNumber } =
    req.body;

  if (!email || !companyName || !password) {
    return next("Email, Company Name, and Password are required");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerhighimpact@gmail.com", // Use environment variables
        pass: "lpyu zhks kpne qrsc", // Use app password stored securely
      },
    });

    const mailOptions = {
      from: "developerhighimpact@gmail.com",
      to: "recruitersupport@highimpacttalent.com",
      subject: "New Recruiter Registration",
      text: `
        A new recruiter has signed up.

        **Recruiter Details**:
        Name: ${recruiterName}
        Contact Number: ${mobileNumber}
        Email: ${email}
        Company Name: ${companyName}
        Password: ${password} 
        
        Please follow up accordingly.
      `,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      details: error.message,
    });
  }
};

export const sendContactQuery = async (req, res, next) => {
  const { name, email, message, subject } = req.body;

  if (!name || !email || !message) {
    return next("Name, Email, and Message are required");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerhighimpact@gmail.com", // Use environment variables for security
        pass: "lpyu zhks kpne qrsc", // Use app password
      },
    });

    const mailOptions = {
      from: "developerhighimpact@gmail.com",
      to: "recruitersupport@highimpacttalent.com",
      subject: subject || "Contact Us Query Raised",
      text: ` 
        A new contact query has been submitted.

        **User Details**:
        Name: ${name}
        Email: ${email}

        **Message**:
        ${message}

        Please respond accordingly.
      `,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      details: error.message,
    });
  }
};

export const sendPasswordResetOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || otp === undefined) {
    return next("Email and OTP are required");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerhighimpact@gmail.com",
        pass: "lpyu zhks kpne qrsc",
      },
    });

    const mailOptions = {
      from: "developerhighimpact@gmail.com",
      to: email,
      subject: "Change Password Request",
      text: `
        Hello,

As part of your recent request at High Impact Talent, please use the one-time code below to complete your verification:

OTP: ${otp}

This code is valid for 10 minutes. After that time, it will expire and you’ll need to request a new one.

If you did not initiate this request, no further action is required—simply disregard this message.

At High Impact Talent, we’re dedicated to connecting professionals with their ideal roles—twice as fast.

Kind regards,

Koustubh
Senior Talent Consultant
High Impact Talent
www.highimpacttalent.com
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP email",
      details: error.message,
    });
  }
};

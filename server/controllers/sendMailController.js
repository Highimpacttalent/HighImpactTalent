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
      subject: "OTP Verification",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto;">
      <h2 style="color: #2E86DE; margin-bottom: 0.5em;">Your Verification Code</h2>
      <p>Hello,</p>
      <p>
        As part of your recent request at <strong style="color: #2E86DE;">High Impact Talent</strong>, please use the one-time code below to complete your verification:
      </p>
      <p style="font-size: 1.25em; font-weight: bold; background: #F0F4FF; padding: 0.5em 1em; border-radius: 4px; display: inline-block;">
        ${otp}
      </p>
      <p style="margin-top: 1em;">
        <em>This code is valid for <strong>10 minutes</strong>.</em> After that time, it will expire and you’ll need to request a new one.
      </p>
      <p>If you did not initiate this request, simply disregard this email—no further action is required.</p>
      <hr style="border: none; border-top: 1px solid #EEE; margin: 2em 0;">
      <p style="font-size: 0.9em; color: #555;">
        At <strong>High Impact Talent</strong>, we’re dedicated to connecting professionals with their ideal roles—<strong>twice as fast</strong>.
      </p>
      <p style="margin-top: 2em;">
        Kind regards,<br>
        <strong>Koustubh</strong><br>
         Co-founder & CEO<br>
        <a href="https://www.highimpacttalent.com" style="color: #2E86DE; text-decoration: none;">www.highimpacttalent.com</a>
      </p>
    </div>
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


export const sendStatusUpdateEmail = async (email, status, name = 'Candidate') => {
  if (!email || !status) return;

  const messages = {
    "Applied": {
      subject: "Application Received",
      body: `Thank you for applying! Your application has been successfully received and is currently under review.`
    },
    "Application Viewed": {
      subject: "Your Application Was Viewed",
      body: `A recruiter has viewed your application. We’ll keep you posted as the review process progresses.`
    },
    "Shortlisted": {
      subject: "You're Shortlisted!",
      body: `Congratulations! You’ve been shortlisted for the next stage. We’ll be reaching out with further details soon.`
    },
    "Interviewing": {
      subject: "Interview Stage Started",
      body: `You're now in the interview stage. Be prepared and stay confident! We'll update you on the next steps shortly.`
    },
    "Hired": {
      subject: "You’ve Been Hired!",
      body: `Fantastic news! You've been selected for the role. The company will be in touch to discuss onboarding.`
    },
    "Not Progressing": {
      subject: "Application Update: Not Progressing",
      body: `Thank you for your interest. Unfortunately, your application is not progressing further at this time. We encourage you to apply for other roles in the future.`
    }
  };

  const content = messages[status];

  if (!content) return;

  const mailOptions = {
    from: "developerhighimpact@gmail.com",
    to: email,
    subject: content.subject,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto;">
        <h2 style="color: #2E86DE;">Hi ${name},</h2>
        <p>${content.body}</p>
        <p>
          Visit <a href="https://www.highimpacttalent.com" style="color: #2E86DE;">our website</a> to track your application status.
        </p>
        <hr style="border: none; border-top: 1px solid #EEE; margin: 2em 0;">
        <p style="font-size: 0.9em; color: #555;">
          At <strong>High Impact Talent</strong>, we help you land your ideal role <strong>twice as fast</strong>.
        </p>
        <p style="margin-top: 2em;">
          Kind regards,<br>
          <strong>Koustubh</strong><br>
          Co-founder & CEO<br>
          <a href="https://www.highimpacttalent.com" style="color: #2E86DE; text-decoration: none;">www.highimpacttalent.com</a>
        </p>
      </div>
    `
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerhighimpact@gmail.com",
        pass: "lpyu zhks kpne qrsc",
      },
    });
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} for status: ${status}`);
  } catch (error) {
    console.error(`Failed to send status update email to ${email}:`, error.message);
  }
};
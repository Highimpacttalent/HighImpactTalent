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


export const sendStatusUpdateEmail = async (
  email,
  status,
  name = "Candidate",
  jobTitle = "Position",
  
) => {
  if (!email || !status) return;
  let companyName = "High Impact Talent"

  // Plain, minimal, professional messages supplied by user (and matched tone for other stages)
  const messages = {
    "Applied": {
      subject: "Application Received",
      preheader: "We have received your application.",
      body: `
        <p>Hi ${name},</p>
        <p>Thank you for applying to <strong>${jobTitle}</strong> through ${companyName}. We have received your application and our team will review it shortly.</p>
        <p>We appreciate your interest and will update you when there is a next step.</p>
        <p>Best,<br/>Team ${companyName}</p>
      `
    },

    "Application Viewed": {
      subject: "Your application has been reviewed",
      preheader: "Your application was reviewed by the hiring team.",
      body: `
        <p>Hi ${name},</p>
        <p>Just a quick note to say — the hiring team for <strong>${jobTitle}</strong> has reviewed your application, and you’re now in consideration for the role.</p>
        <p>We’re coordinating the process on their behalf, and we’ll keep you updated on every next step.</p>
        <p>Thanks for applying through ${companyName} — we know putting yourself out there takes effort, and we truly appreciate it.</p>
        <p>Best,<br/>Team ${companyName}</p>
      `
    },

    "Shortlisted": {
      subject: "You’ve made the shortlist 🚀",
      preheader: "Good news — you've been shortlisted.",
      body: `
        <p>Hi ${name},</p>
        <p>Good news — the hiring team for <strong>${jobTitle}</strong> has shortlisted your application.</p>
        <p>This means your profile stands out against the applicant pool, and the hiring team is moving you to the next stage of evaluation.</p>
        <p>We’ll be in touch soon with interview details or next steps. In the meantime, take a moment to pat yourself on the back — it’s well deserved.</p>
        <p>You can count on us to keep you updated at every stage.</p>
        <p>Best,<br/>Team ${companyName}</p>
      `
    },

    "Interviewing": {
      subject: "You’re moving to interviews 🎯",
      preheader: "Your application has moved to the interview stage.",
      body: `
        <p>Hi ${name},</p>
        <p>Exciting update — your application for <strong>${jobTitle}</strong> has been moved to the interview stage.</p>
        <p>We’ll share exact dates, times, and formats soon. In the meantime, here’s what you can expect:</p>
        <ul>
          <li>Who you’ll be speaking with</li>
          <li>What the process will look like</li>
          <li>Any prep material (if applicable)</li>
        </ul>
        <p>We’re rooting for you. Go in confident — you’ve already made a great impression.</p>
        <p>Best,<br/>Team ${companyName}</p>
      `
    },

    "Not Progressing": {
      subject: "Update on your application",
      preheader: "An update regarding your recent application.",
      body: `
        <p>Hi ${name},</p>
        <p>Thank you for applying to <strong>${jobTitle}</strong> through ${companyName}.</p>
        <p>After reviewing your profile, the hiring team has decided not to move forward with your application for this role.</p>
        <p>We know this isn’t the news you were hoping for, but we want you to know that your profile remains part of our curated talent pool. If a role better aligned with your experience opens up, we’ll reach out immediately.</p>
        <p>We’ll always keep you in the loop on relevant opportunities.</p>
        <p>Best wishes,<br/>Team ${companyName}</p>
      `
    },

    "Hired": {
      subject: "Offer: Welcome to the team",
      preheader: "We are pleased to extend an offer.",
      body: `
        <p>Hi ${name},</p>
        <p>We are pleased to let you know that the hiring team has selected you for the <strong>${jobTitle}</strong> role.</p>
        <p>Expect an official offer and onboarding details to arrive shortly. If you have any immediate questions, reply to this email and we will assist you.</p>
        <p>Welcome aboard — we look forward to working with you.</p>
        <p>Best regards,<br/>Team ${companyName}</p>
      `
    }
  };

  const content = messages[status];
  if (!content) return;

  const currentYear = new Date().getFullYear();

  // Minimal, clean HTML template (simple layout consistent with large company emails)
  const htmlTemplate = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${content.subject}</title>
      <style>
        body { margin:0; padding:0; -webkit-font-smoothing:antialiased; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:#ffffff; color:#111827; }
        .container { width:100%; max-width:680px; margin:24px auto; padding:28px; border:1px solid #e5e7eb; border-radius:8px; box-sizing:border-box; }
        .header { text-align:left; padding-bottom:12px; }
        .logo { height:28px; display:block; margin-bottom:8px; }
        h1 { font-size:20px; margin:0 0 12px 0; font-weight:600; color:#111827; }
        p { margin:0 0 12px 0; line-height:1.5; color:#374151; }
        ul { margin:0 0 12px 18px; color:#374151; }
        .cta { display:inline-block; padding:10px 16px; border-radius:6px; text-decoration:none; font-weight:600; border:1px solid #111827; color:#111827; }
        .footer { font-size:12px; color:#6b7280; margin-top:18px; }
        @media (max-width:600px) {
          .container { padding:20px; margin:12px; }
          h1 { font-size:18px; }
        }
      </style>
    </head>
    <body>
      <!-- preheader for clients that show it -->
      <div style="display:none; max-height:0; overflow:hidden;">${content.preheader}</div>

      <div class="container" role="article" aria-roledescription="email">
        <div class="header">
          <!-- small logo (keep minimal). Replace with your hosted logo URL -->
          <img src="https://www.highimpacttalent.com/assets/tlogo-BljjaXz3.png" alt="${companyName}" class="logo" />
        </div>

        <main>
          <h1>${content.subject}</h1>

          ${content.body}

          <p style="margin-top:18px;">
            <a href="https://www.highimpacttalent.com" class="cta">Visit portal</a>
          </p>
        </main>

        <div class="footer">
          <p style="margin:12px 0 0 0;">
            ${companyName} • © ${currentYear} • 📧 <a href="mailto:update@highimpacttalent.com">update@highimpacttalent.com</a>
          </p>
          <p style="margin:8px 0 0 0;">
            You are receiving this because you applied for a role via ${companyName}. <a href="#">Manage preferences</a> • <a href="#">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Generate a simple plain-text fallback by stripping tags
  const plainText = `${content.subject}\n\n${content.body.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ").trim()}\n\nVisit: https://www.highimpacttalent.com\n\nTeam ${companyName}`;

  const mailOptions = {
    from: { 
      name: "High Impact Talent",
      address: "hello@highimpacttalent.com" 
    },
    to: email,
    subject: content.subject,
    html: htmlTemplate,
    text: plainText
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerhighimpact@gmail.com",
        pass: "lpyu zhks kpne qrsc",
      },
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5
    });

    await transporter.sendMail(mailOptions);
    console.log(`Status email "${status}" sent to ${email}`);
  } catch (err) {
    console.error(`Failed to send status email to ${email}:`, err && err.message ? err.message : err);
  }
};


export const sendReminderEmailIfStaleStatus = async (
  email,
  status,
  name = "Candidate",
  jobTitle = "Position",
  companyName = "High Impact Talent",
  recruiterName = "Koustubh"
) => {
  if (!email || !status) return;

  const subject = `Your Application for ${jobTitle} – Quick Update`;
  const preheader = `Thank you for your patience – we're still following up on your application to ${companyName}.`;

const messageBody = `
  <p style="font-size: 16px; line-height: 1.6; color: #374151;">
    Hello ${name},
  </p>

  <p style="font-size: 16px; line-height: 1.6; color: #374151;">
    I wanted to give you an update on your application to the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
  </p>

  <p style="font-size: 16px; line-height: 1.6; color: #374151;">
    Thank you for your continued patience. We’re currently awaiting feedback from the hiring team, and there’s been a slight delay from their side. Please rest assured that we’re actively following up and hope to provide you with an update very soon.
  </p>

  <p style="font-size: 16px; line-height: 1.6; color: #374151;">
    As soon as we hear back, you’ll be the first to know.
  </p>

  <p style="font-size: 16px; line-height: 1.6; color: #374151;">
    If you have any questions or if there have been any updates on your end, feel free to get in touch — we’re here to support you throughout your journey.
  </p>

  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-top: 20px;">
  As one of our early adopters, your support during our beta phase means a lot to us. Your experience helps us shape a more thoughtful and impactful hiring platform. If you have any suggestions for how we can improve your experience or features you'd like to see on our platform, please take a moment to share your thoughts:
  <br />
  <a href="https://forms.gle/uExw8hfUfJBdrj4P6" target="_blank" style="color: #2563eb; text-decoration: underline;">
    Share Feedback &raquo;
  </a>
  </p>


  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-top: 30px;">
    Kind regards,<br>
    ${recruiterName}<br>
    High Impact Talent
  </p>
`;


  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body { margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.05); padding: 40px; }
        .footer { font-size: 12px; color: #9ca3af; text-align: center; padding: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://www.highimpacttalent.com/assets/tlogo-BljjaXz3.png" alt="High Impact Talent" style="max-width: 180px; margin-bottom: 30px;" />
        ${messageBody}
      </div>

      <div class="footer">
        High Impact Talent • www.highimpacttalent.com<br>
        © ${new Date().getFullYear()} High Impact Talent. All rights reserved.
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: {
      name: "High Impact Talent",
      address: "hello@highimpacttalent.com"
    },
    to: email,
    subject,
    html: htmlTemplate,
    text: `
Hello ${name},

I wanted to give you an update on your application to the "${jobTitle}" position at ${companyName}.

Thank you for your patience – we're still following up with the hiring team and are currently experiencing a client-side delay. We hope to get feedback soon.

As soon as there is an update, I’ll make sure to pass it on to you.

Please feel free to reach out if anything about your application changes.

Kind regards,
${recruiterName}
Talent Partner, High Impact Talent
    `
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "developerhighimpact@gmail.com",
        pass: process.env.EMAIL_PASS || "lpyu zhks kpne qrsc"
      },
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5
    });

    await transporter.sendMail(mailOptions);
    console.log(`📬 Premium-style reminder sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send premium reminder: ${error.message}`);
  }
};

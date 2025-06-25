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


export const sendStatusUpdateEmail = async (email, status, name = 'Candidate', jobTitle = 'Position', companyName = 'High Impact Talent') => {
  if (!email || !status) return;

  const messages = {
    "Applied": {
      subject: "Application Received - Next Steps Inside",
      preheader: "Your journey with us begins now...",
      title: "Application Confirmed",
      icon: "✓",
      primaryColor: "#2563eb", // Blue
      secondaryColor: "#eff6ff", // Light blue
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          Thank you for choosing <strong>High Impact Talent</strong> as your career partner. Your application for the <strong>${jobTitle}</strong> role has been successfully received and is now in our talent pipeline.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          Our experienced recruitment team will carefully review your profile within the next <strong>24-48 hours</strong>. We believe in quality over speed, so rest assured your application will receive the attention it deserves.
        </p>
      `,
      highlight: {
        title: "What's Next?",
        content: "Keep your phone handy - great opportunities move fast! We'll notify you as soon as there's an update."
      }
    },

    "Application Viewed": {
      subject: "You're On Our Radar - Profile Under Review",
      preheader: "Our recruiter just reviewed your application...",
      title: "You're On Our Radar",
      icon: "👁️",
      primaryColor: "#1d4ed8", // Darker blue
      secondaryColor: "#dbeafe", // Light blue
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          <em>(Cue spotlight...)</em> Our experienced recruiter just took center stage, reviewing your profile for the <strong>${jobTitle}</strong> position and let out a resounding "Bravo!" Your expertise in <strong>[relevant skills]</strong> truly stole the show.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          We are now transitioning you to your next act—your official "call to the wings" (next steps) will arrive shortly in a follow-up message.
        </p>
      `,
      highlight: {
        title: "Status Update",
        content: "You're in the top 30% of applicants for this role. Outstanding work!"
      }
    },

    "Shortlisted": {
      subject: "Curtain Up! You're Center Stage for the Role",
      preheader: "Welcome to our exclusive shortlist...",
      title: "Welcome to the Shortlist",
      icon: "🎭",
      primaryColor: "#1e40af", // Blue
      secondaryColor: "#dbeafe", // Light blue
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          <em>(Imagine a cheering crowd...)</em> You have just received a standing ovation from our talent scouts for the <strong>${jobTitle}</strong> role—you've been <strong>shortlisted</strong> from hundreds of applicants! Your presentation of skills was truly outstanding.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          Congratulations, you are part of an exclusive cast moving to the next act. Our casting team is excited to learn about your aspirations and discover what makes you shine on stage.
        </p>
      `,
      highlight: {
        title: "Achievement Unlocked",
        content: "You're now in the top 10% of candidates. Watch your inbox for your next steps!"
      }
    },

    "Interviewing": {
      subject: "Your Next Big Scene: Interview Time!",
      preheader: "It's time to showcase your brilliance...",
      title: "Your Interview Awaits",
      icon: "🎬",
      primaryColor: "#1e3a8a", // Darker blue
      secondaryColor: "#dbeafe", // Light blue
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          <em>(Roll out the drumroll...)</em> You've been spotlighted! We're delighted to roll out the red carpet and invite you to an interview for the <strong>${jobTitle}</strong> position.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          This is your moment to shine under the marquee lights and show us why you're the headliner we've been seeking. Our Casting Director (hiring manager) is excited to meet you and discover the magic you'll bring to our production.
        </p>
      `,
      highlight: {
        title: "Interview Preparation Tips",
        content: "Research the company thoroughly • Prepare specific examples • Have questions ready • Test your tech setup"
      }
    },

    "Hired": {
      subject: "Your Final Act: Welcome to the Team!",
      preheader: "Your new career chapter begins now...",
      title: "Congratulations, You're Hired!",
      icon: "🎉",
      primaryColor: "#1e40af", // Blue
      secondaryColor: "#dbeafe", // Light blue
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          <em>(Spotlights on you...)</em> We are absolutely thrilled to offer you the leading role of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>! Your outstanding skills and show-stopping enthusiasm made you our headline attraction.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          Welcome to the High Impact Talent family—where brainstorming sessions are like improv nights, and coffee breaks are perfect for backstage insights. We can't wait to see you shine bright on our stage!
        </p>
      `,
      highlight: {
        title: "What's Next?",
        content: "Check your email for the official offer letter and onboarding details. Your journey starts soon!"
      }
    },

    "Not Progressing": {
      subject: "Bravo! Your Next Act Awaits",
      preheader: "Thank you for your outstanding audition...",
      title: "Thank You for Your Application",
      icon: "🎭",
      primaryColor: "#2563eb", // Blue
      secondaryColor: "#eff6ff", // Light blue
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          <em>(Spotlight fade...)</em> Thank you for auditioning for our <strong>${jobTitle}</strong> role—your performance was impressive! After a highly competitive casting process, we've chosen to move forward with someone whose experience more closely matches our current script requirements.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
          But don't close the curtain just yet: we'd love to keep you as part of our talent troupe for future leading roles. Keep watching—your next big scene might be just around the corner!
        </p>
      `,
      highlight: {
        title: "Stay Connected",
        content: "We'll notify you about relevant positions that match your profile. Your talent deserves the right stage!"
      }
    }
  };

  const content = messages[status];
  if (!content) return;

  const currentYear = new Date().getFullYear();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <title>${content.subject}</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        @media screen and (max-width: 600px) {
          .mobile-padding { padding: 20px !important; }
          .mobile-text { font-size: 14px !important; }
          .mobile-title { font-size: 24px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      
      <!-- Preheader -->
      <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f8fafc;">
        ${content.preheader}
      </div>

      <!-- Email Container -->
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc;">
        <tr>
          <td style="padding: 40px 20px;" class="mobile-padding">
            
            <!-- Main Email Content -->
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.08); overflow: hidden; border: 1px solid #e5e7eb;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, ${content.primaryColor} 0%, ${content.primaryColor}dd 100%); padding: 40px 40px 30px 40px; text-align: center;">
                  <!-- Logo -->
                  <img src="https://www.highimpacttalent.com/assets/tlogo-BljjaXz3.png" alt="High Impact Talent" style="max-width: 160px; height: auto; margin-bottom: 24px; display: block; margin-left: auto; margin-right: auto;" />
                  
                  <!-- Status Icon -->
                  <div style="background: rgba(255, 255, 255, 0.2); width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 24px;">
                    ${content.icon}
                  </div>
                  
                  <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;" class="mobile-title">
                    ${content.title}
                  </h1>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 40px;" class="mobile-padding">
                  
                  <!-- Greeting -->
                  <div style="margin-bottom: 30px;">
                    <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">
                      Hello ${name} 👋
                    </h2>
                    <div style="width: 60px; height: 3px; background: ${content.primaryColor}; border-radius: 2px;"></div>
                  </div>

                  <!-- Main Content -->
                  <div style="margin-bottom: 30px;">
                    ${content.content}
                  </div>

                  <!-- Highlight Box -->
                  <div style="background: ${content.secondaryColor}; border-left: 4px solid ${content.primaryColor}; padding: 20px; border-radius: 8px; margin: 30px 0;">
                    <h3 style="color: ${content.primaryColor}; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">
                      💡 ${content.highlight.title}
                    </h3>
                    <p style="color: #374151; font-size: 14px; line-height: 1.5; margin: 0;">
                      ${content.highlight.content}
                    </p>
                  </div>

                  <!-- Company Info -->
                  <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 24px; border-radius: 8px; margin: 30px 0;">
                    <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 12px 0; font-weight: 600;">
                      Why Choose High Impact Talent?
                    </h3>
                    <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                      <strong style="color: ${content.primaryColor};">✨ 2x Faster Placements</strong> - We accelerate your career journey<br>
                      <strong style="color: ${content.primaryColor};">🎯 Perfect Role Matching</strong> - Find your ideal position<br>
                      <strong style="color: ${content.primaryColor};">🤝 Personal Career Support</strong> - Dedicated guidance throughout
                    </div>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://www.highimpacttalent.com" style="display: inline-block; background: ${content.primaryColor}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                      Visit Our Portal
                    </a>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #1f2937; padding: 30px 40px; text-align: center;" class="mobile-padding">
                  
                  <!-- Signature -->
                  <div style="margin-bottom: 24px;">
                    <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 16px; font-weight: 500;">
                      Encore-worthy regards,
                    </p>
                    <p style="color: #ffffff; margin: 0 0 4px 0; font-size: 18px; font-weight: 700;">
                      Koustubh
                    </p>
                    <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                      Talent Director & Stage Manager<br>High Impact Talent
                    </p>
                  </div>

                  <!-- Company Details -->  
                  <div style="border-top: 1px solid #374151; padding-top: 20px;">
                    <p style="color: #9ca3af; margin: 0; font-size: 12px; line-height: 1.6;">
                      High Impact Talent Private Limited<br>
                      📧 <a href="mailto:highimpacttalentenquiry@gmail.com" style="color: #60a5fa; text-decoration: none;">highimpacttalentenquiry@gmail.com</a><br>
                      🌐 <a href="https://www.highimpacttalent.com" style="color: #60a5fa; text-decoration: none;">www.highimpacttalent.com</a><br>
                      © ${currentYear} High Impact Talent. All rights reserved.
                    </p>
                  </div>

                </td>
              </tr>

            </table>

            <!-- Footer Note -->
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
                You're receiving this email because you applied for a position through High Impact Talent.<br>
                <a href="#" style="color: #2563eb; text-decoration: none;">Update preferences</a> | 
                <a href="#" style="color: #2563eb; text-decoration: none;">Unsubscribe</a>
              </p>
            </div>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const mailOptions = {
    from: {
      name: "High Impact Talent",
      address: "hello@highimpacttalent.com"
    },
    to: email,
    subject: content.subject,
    html: htmlTemplate,
    text: `
      Hello ${name},
      
      ${content.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()}
      
      ${content.highlight.title}: ${content.highlight.content}
      
      Visit https://www.highimpacttalent.com to track your application status.
      
      Encore-worthy regards,
      Koustubh
      Talent Director & Stage Manager
      High Impact Talent
      www.highimpacttalent.com
    `
  };

  try {
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "developerhighimpact@gmail.com",
        pass: process.env.EMAIL_PASS || "lpyu zhks kpne qrsc",
      },
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5
    });

    await transporter.sendMail(mailOptions);
    console.log(`Professional email sent to ${email} for status: ${status}`);
    
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error.message);
  }
};
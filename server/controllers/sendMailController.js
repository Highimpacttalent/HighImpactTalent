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


export const sendStatusUpdateEmail = async (email, status, name = 'Candidate', jobTitle = 'Position', companyName = 'Company') => {
  if (!email || !status) return;

  const messages = {
    "Applied": {
      subject: "Application Received ✓ Next Steps Inside",
      preheader: "Your journey with us begins now...",
      title: "Your Application is Live!",
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Thank you for choosing <strong>High Impact Talent</strong> as your career partner. Your application for the <strong>${jobTitle}</strong> role has been successfully received and is now in our talent pipeline.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Our experienced recruitment team will carefully review your profile within the next <strong>24-48 hours</strong>. We believe in quality over speed, so rest assured your application will get the attention it deserves.
        </p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px; font-weight: 500;">
            💡 <strong>Pro Tip:</strong> Keep your phone handy - great opportunities move fast!
          </p>
        </div>
      `,
      cta: {
        text: "Track Application Status",
        color: "#667eea"
      }
    },

    "Application Viewed": {
      subject: "👀 Your Profile Caught Our Attention",
      preheader: "A recruiter is reviewing your application right now...",
      title: "You're On Our Radar!",
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Exciting news! A senior recruiter has just reviewed your profile for the <strong>${jobTitle}</strong> position, and we're impressed with what we see.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Your experience in <em>[relevant skills will be highlighted here]</em> aligns well with what we're looking for. We're currently assessing the best next steps for your application.
        </p>
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px; font-weight: 500;">
            📈 <strong>Status Update:</strong> You're in the top 30% of applicants for this role
          </p>
        </div>
      `,
      cta: {
        text: "View Application Details",
        color: "#11998e"
      }
    },

    "Shortlisted": {
      subject: "🎉 Congratulations! You've Been Shortlisted",
      preheader: "You're one step closer to your dream role...",
      title: "Welcome to the Shortlist!",
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Fantastic news! After careful evaluation, you've been <strong>shortlisted</strong> for the <strong>${jobTitle}</strong> role. Your profile stood out among hundreds of applications.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          This means you're now in the exclusive group of candidates moving to the next stage. Our hiring team is excited to learn more about your aspirations and how you can contribute to the team.
        </p>
        <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <p style="color: #2d3436; margin: 0; font-size: 14px; font-weight: 500;">
            🏆 <strong>Achievement Unlocked:</strong> You're now in the top 10% of candidates
          </p>
        </div>
      `,
      cta: {
        text: "Prepare for Next Round",
        color: "#e17055"
      }
    },

    "Interviewing": {
      subject: "📅 Interview Invitation - Action Required",
      preheader: "It's time to showcase your brilliance...",
      title: "Your Interview Awaits!",
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          The moment you've been waiting for is here! We're delighted to invite you for an interview for the <strong>${jobTitle}</strong> position.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          This is your opportunity to shine and demonstrate why you're the perfect fit for this role. Our hiring manager is genuinely excited to meet you and discuss your career journey.
        </p>
        <div style="background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%); padding: 20px; border-radius: 12px; margin: 25px 0;">
          <h4 style="color: white; margin: 0 0 10px 0; font-size: 16px;">📋 Interview Preparation Checklist:</h4>
          <ul style="color: white; margin: 0; padding-left: 20px; font-size: 14px;">
            <li>Research the company and role thoroughly</li>
            <li>Prepare specific examples of your achievements</li>
            <li>Have questions ready about the team and culture</li>
            <li>Test your tech setup (if virtual interview)</li>
          </ul>
        </div>
      `,
      cta: {
        text: "Schedule Interview",
        color: "#6c5ce7"
      }
    },

    "Hired": {
      subject: "🎊 Welcome to the Team! Offer Letter Inside",
      preheader: "Your new career chapter begins now...",
      title: "Congratulations, You're Hired!",
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          We're absolutely <strong>thrilled</strong> to extend an offer for the <strong>${jobTitle}</strong> position! Your skills, experience, and passion made you the standout choice.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Welcome to the <strong>High Impact Talent</strong> family! We can't wait to see the incredible contributions you'll make and the success we'll achieve together.
        </p>
        <div style="background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <h3 style="color: white; margin: 0 0 10px 0; font-size: 18px;">🚀 What's Next?</h3>
          <p style="color: white; margin: 0; font-size: 14px; line-height: 1.5;">
            Check your email for the official offer letter and onboarding details.<br>
            Your new journey starts soon!
          </p>
        </div>
      `,
      cta: {
        text: "Access Onboarding Portal",
        color: "#e84393"
      }
    },

    "Not Progressing": {
      subject: "Thank You for Your Interest - Future Opportunities",
      preheader: "Every 'no' brings you closer to the right 'yes'...",
      title: "Thank You for Your Application",
      content: `
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Thank you for your interest in the <strong>${jobTitle}</strong> role and for taking the time to share your impressive background with us.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          After careful consideration, we've decided to move forward with candidates whose experience more closely aligns with our current specific requirements. This decision was not easy, given the high caliber of applicants.
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          However, we were genuinely impressed by your profile and would love to keep you in our talent network for future opportunities that might be a perfect match.
        </p>
        <div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px; font-weight: 500;">
            💼 <strong>Stay Connected:</strong> We'll notify you about relevant positions that match your profile
          </p>
        </div>
      `,
      cta: {
        text: "Join Our Talent Network",
        color: "#0984e3"
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
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9ff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      
      <!-- Preheader -->
      <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f8f9ff;">
        ${content.preheader}
      </div>

      <!-- Email Container -->
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9ff;">
        <tr>
          <td style="padding: 40px 20px;">
            
            <!-- Main Email Content -->
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px 40px; text-align: center;">
                  <!-- Logo Placeholder - Replace with your actual logo -->
                  <img src="https://www.highimpacttalent.com/assets/tlogo-BljjaXz3.png" alt="High Impact Talent" style="max-width: 180px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
                  
                  <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    ${content.title}
                  </h1>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 40px;">
                  
                  <!-- Greeting -->
                  <h2 style="color: #2d3748; font-size: 22px; font-weight: 600; margin: 0 0 25px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px;">
                    Hello ${name} 👋
                  </h2>

                  <!-- Main Content -->
                  ${content.content}

                  <!-- Divider -->
                  <hr style="border: none; height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 40px 0;">

                  <!-- Company Info -->
                  <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 25px; border-radius: 12px; margin: 30px 0;">
                    <h3 style="color: #2d3748; font-size: 18px; margin: 0 0 15px 0; font-weight: 600;">
                      Why Choose High Impact Talent?
                    </h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                      <div style="flex: 1; min-width: 150px;">
                        <div style="color: #4a5568; font-size: 14px; line-height: 1.6;">
                          <strong>2x Faster Placements</strong><br>
                          <strong>Perfect Role Matching</strong><br>
                          <strong>Personal Career Support</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #2d3748; padding: 30px 40px; text-align: center;">
                  
                  <!-- Signature -->
                  <div style="margin-bottom: 25px;">
                    <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;">
                      Best regards,
                    </p>
                    <p style="color: #ffffff; margin: 0 0 5px 0; font-size: 18px; font-weight: 700;">
                      Koustubh
                    </p>
                    <p style="color: #a0aec0; margin: 0; font-size: 14px;">
                      Co-founder & CEO, High Impact Talent
                    </p>
                  </div>

                  <!-- Company Details -->
                  <div style="border-top: 1px solid #4a5568; padding-top: 20px; margin-top: 20px;">
                    <p style="color: #a0aec0; margin: 0; font-size: 12px; line-height: 1.5;">
                      High Impact Talent Private Limited<br>
                      📧 <a href="mailto:highimpacttalentenquiry@gmail.com" style="color: #667eea; text-decoration: none;">highimpacttalentenquiry@gmail.com</a> | 
                      🌐 <a href="https://www.highimpacttalent.com" style="color: #667eea; text-decoration: none;">www.highimpacttalent.com</a><br>
                      © ${currentYear} High Impact Talent. All rights reserved.
                    </p>
                  </div>

                </td>
              </tr>

            </table>

            <!-- Footer Note -->
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #718096; font-size: 12px; margin: 0;">
                You're receiving this email because you applied for a position through High Impact Talent.<br>
                <a href="#" style="color: #667eea; text-decoration: none;">Update preferences</a> | 
                <a href="#" style="color: #667eea; text-decoration: none;">Unsubscribe</a>
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
      address: "hello@highimpacttalent.com" // Use a more professional email
    },
    to: email,
    subject: content.subject,
    html: htmlTemplate,
    // Add text version for better deliverability
    text: `
      Hello ${name},
      
      ${content.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()}
      
      Visit https://www.highimpacttalent.com to track your application status.
      
      Best regards,
      Koustubh
      Co-founder & CEO
      High Impact Talent
      www.highimpacttalent.com
    `
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerhighimpact@gmail.com",
        pass: "lpyu zhks kpne qrsc", // Consider using environment variables
      },
      // Add these for better deliverability
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5
    });

    await transporter.sendMail(mailOptions);
    console.log(`Premium email sent to ${email} for status: ${status}`);
    
    // Optional: Add analytics tracking
    // await trackEmailSent(email, status, 'sent');
    
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error.message);
    // Optional: Add error tracking
    // await trackEmailSent(email, status, 'failed', error.message);
  }
};
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dbConnection from "../dbConfig/dbConnection.js";

// ---------- Adjust these imports to match your project structure ----------
import Application from "../models/ApplicationModel.js";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";
// -----------------------------------------------------------------------

const  PORTAL_LINK = "https://www.highimpacttalent.com/";
const  BATCH_SIZE = "10";


// Build transporter from SMTP_* if provided, otherwise fallback to Gmail via EMAIL_USER/EMAIL_PASS
const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerhighimpact@gmail.com", // Use environment variable for security
        pass: "lpyu zhks kpne qrsc", // Use app password
      },
});

// Simple concurrency runner
async function runWithConcurrency(tasks, concurrency = 10) {
  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  return Promise.allSettled(results);
}

// Compose plain text and HTML message (concise & professional)
function composeMessage({ firstName, lastName, jobTitle, workMode }) {
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Candidate";
  const subject = `Action required: Update your profile — ${jobTitle || "Applied Role"}`;
  const plain = `Hi ${displayName},

We are reviewing applications for "${jobTitle || "the role you applied to"}" (${workMode || "Work Mode not specified"}).
Our records show your profile lists 1 year of experience.

If that is incorrect, please update your profile on the portal so recruiters can assess your application accurately:
${PORTAL_LINK}

If the information is already correct, no action is required.

Regards,
Recruitment Team
High Impact Talent`;

  const html = `
    <p>Hi ${displayName},</p>
    <p>We are reviewing applications for "<strong>${jobTitle || "the role you applied to"}</strong>" (${workMode || "Work Mode not specified"}).</p>
    <p>Our records show your profile lists <strong>1 year</strong> of experience. If that is incorrect, please update your profile on the portal so recruiters can assess your application accurately.</p>
    <p><a href="${PORTAL_LINK}" target="_blank" rel="noopener noreferrer">${PORTAL_LINK}</a></p>
    <p>If your profile is already accurate, no action is required.</p>
    <p>Regards,<br/>Recruitment Team<br/>High Impact Talent</p>
  `;

  return { subject, plain, html };
}

// Main function
async function main() {
  const jobId = "689083f0bf94c58a82620057";
  if (!jobId) {
    console.error("Usage: node sendProfileUpdateEmails.js <JOB_ID>");
    process.exit(1);
  }

  try {
    await dbConnection();

    // Validate job
    const job = await Jobs.findById(jobId).select("jobTitle workMode").lean();
    if (!job) {
      console.error(`❌ Job with id "${jobId}" not found`);
      return;
    }
    console.log(`ℹ Found job: "${job.jobTitle}" (${job.workMode})`);

    // Find applications and populate applicant (firstName,lastName,email,experience)
    const applications = await Application.find({ job: jobId })
      .populate("applicant", "firstName lastName email experience")
      .lean();

    if (!applications || applications.length === 0) {
      console.log("ℹ No applications found for this job");
      return;
    }
    console.log(`ℹ Total applications for job: ${applications.length}`);

    // Filter applicants whose user.experience === 1 (number)
    const targets = applications.filter((app) => {
      const user = app.applicant;
      if (!user) return false;
      if (!user.email) return false;
      // experience is a Number per your model
      return typeof user.experience === "number" && user.experience === 1;
    });

    if (targets.length === 0) {
      console.log("ℹ No applicants with experience === 1 found. Nothing to send.");
      return;
    }

    console.log(`ℹ Applicants to notify (experience === 1): ${targets.length}`);

    // Prepare send tasks with concurrency
    const concurrency = Math.max(1, Number(BATCH_SIZE || 10));
    const tasks = targets.map((app) => {
      return async () => {
        const user = app.applicant;
        const { firstName, lastName, email } = user;
        const { subject, plain, html } = composeMessage({
          firstName,
          lastName,
          jobTitle: job.jobTitle,
          workMode: job.workMode,
        });

        const mailOptions = {
          from:"developerhighimpact@gmail.com",
          to: email,
          subject,
          text: plain,
          html,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`✅ Sent to ${email}`);
          return { email, success: true };
        } catch (err) {
          console.error(`❌ Failed to send to ${email}: ${err.message}`);
          return { email, success: false, error: err.message };
        }
      };
    });

    // execute with concurrency
    const results = await runWithConcurrency(tasks, concurrency);

    const successCount = results.filter((r) => r.status === "fulfilled" && r.value && r.value.success).length;
    const failureCount = results.filter((r) => r.status === "fulfilled" && r.value && !r.value.success).length
                       + results.filter((r) => r.status === "rejected").length;

    console.log(`\nSummary:`);
    console.log(`Total targets: ${targets.length}`);
    console.log(`Successfully sent: ${successCount}`);
    console.log(`Failures: ${failureCount}`);

  } catch (err) {
    console.error("❌ Fatal error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed");
  }
}

// Run
main();

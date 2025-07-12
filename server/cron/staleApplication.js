import cron from 'node-cron';
import Application from '../models/ApplicationModel.js';
import Jobs from '../models/jobsModel.js';
import Companies from '../models/companiesModel.js';
import Users from '../models/userModel.js';
import { sendReminderEmailIfStaleStatus } from '../controllers/sendMailController.js';

const TARGET_JOB_ID = '6864d0e0d336f59dcf22ec56'; // <-- The specific job ID

const runStaleApplicationReminder = async () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  try {
    const applications = await Application.find({
      status: { $ne: 'Hired' },
      job: TARGET_JOB_ID,
    });

    let reminderCount = 0;

    for (const app of applications) {
      const latestStatus = app.statusHistory?.[app.statusHistory.length - 1];
      const lastChangedAt = latestStatus?.changedAt;
      if (!lastChangedAt) continue;

      const lastChangedDate = new Date(lastChangedAt);

      if (lastChangedDate < oneWeekAgo) {
        const applicant = await Users.findById(app.applicant).lean();
        const job = await Jobs.findById(app.job).lean();
        const company = await Companies.findById(app.company).lean();

        const name = applicant?.firstName
          ? `${applicant.firstName} ${applicant.lastName || ''}`
          : 'Candidate';

        const email = applicant?.email;
        const jobTitle = job?.jobTitle || 'Position';
        const companyName = company?.name || 'High Impact Talent';

        if (email) {
          await sendReminderEmailIfStaleStatus(
            email,
            app.status,
            name,
            jobTitle,
            companyName,
            'Koustubh'
          );

          reminderCount++;

          // Optional: prevent duplicate reminders later
          // await Application.findByIdAndUpdate(app._id, { lastReminderSent: new Date() });
        }
      }
    }

    console.log(`✅ Reminders sent for ${reminderCount} stale applications.`);
  } catch (err) {
    console.error('❌ Error in stale application cron:', err.message);
  }
};

// Run at 6:37 PM daily
cron.schedule('23 18 * * *', () => {
  console.log('🕒 Running daily stale application check...');
  runStaleApplicationReminder();
});

export default runStaleApplicationReminder;

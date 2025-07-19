#!/usr/bin/env node
import mongoose from 'mongoose';
import Application from '../models/ApplicationModel.js';
import Jobs from '../models/jobsModel.js';
import dbConnection from '../dbConfig/dbConnection.js';

async function main() {
  await dbConnection();

  const jobId = '6864d0e0d336f59dcf22ec56'; // Replace with your job ID
  const job = await Jobs.findById(jobId);
  if (!job) {
    console.error('❌ Job not found:', jobId);
    process.exit(1);
  }

  const applications = await Application.find({ job: jobId }).sort({ createdAt: 1 });

  console.log(`🔍 Found ${applications.length} applications for job ${jobId}`);

  const seenApplicants = new Set();
  const duplicateIds = [];

  for (const app of applications) {
    const applicantId = app.applicant.toString();
    if (seenApplicants.has(applicantId)) {
      duplicateIds.push(app._id);
    } else {
      seenApplicants.add(applicantId);
    }
  }

  if (duplicateIds.length === 0) {
    console.log('✅ No duplicates found.');
  } else {
    const result = await Application.deleteMany({ _id: { $in: duplicateIds } });
    console.log(`🗑️ Deleted ${result.deletedCount} duplicate applications:`);
    duplicateIds.forEach(id => console.log(` - ${id}`));
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('🚨 Error in script:', err);
  process.exit(1);
});
